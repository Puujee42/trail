"use client";
import { useState, useEffect } from "react";
import { useSignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGoogle, FaFacebookF, FaPlane, FaArrowRight } from "react-icons/fa";
// 👇 1. Import Hook
import { useLanguage } from "../context/LanguageContext";

const SignUpPage = () => {
  // 👇 2. Get Language
  const { language } = useLanguage();

  const { isLoaded, signUp, setActive } = useSignUp();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 👇 3. Define Translations
  const content = {
    mn: {
      brand: "Euro trails",
      heroTitle: "Шинэ аялалд нэгдээрэй.",
      heroDesc: "Бүртгүүлснээр та манай бүх боломжуудыг ашиглах боломжтой болно.",
      
      // Form View
      formTitle: "Бүртгүүлэх",
      formDesc: "Шинэ бүртгэл үүсгэх",
      socialGoogle: "Google-р бүртгүүлэх",
      socialFacebook: "Facebook-р бүртгүүлэх",
      divider: "ЭСВЭЛ",
      emailPlaceholder: "И-мэйл хаяг",
      passwordPlaceholder: "Нууц үг",
      btnLoading: "Бүртгүүлж байна...",
      btnDefault: "Бүртгүүлэх",
      hasAccount: "Бүртгэлтэй юу?",
      signIn: "Нэвтрэх",
      
      // Verification View
      verifyTitle: "Баталгаажуулах код",
      verifyDesc: "Таны и-мэйл хаяг руу илгээсэн 6 оронтой кодыг оруулна уу.",
      codePlaceholder: "Кодыг оруулна уу",
      btnVerifyLoading: "Баталгаажуулж байна...",
      btnVerify: "Баталгаажуулах",
      
      errorGeneric: "Алдаа гарлаа."
    },
    en: {
      brand: "Euro trails",
      heroTitle: "Join the new journey.",
      heroDesc: "Sign up to unlock all features and start planning your trips.",
      
      // Form View
      formTitle: "Sign Up",
      formDesc: "Create a new account",
      socialGoogle: "Sign up with Google",
      socialFacebook: "Sign up with Facebook",
      divider: "OR",
      emailPlaceholder: "Email address",
      passwordPlaceholder: "Password",
      btnLoading: "Signing up...",
      btnDefault: "Sign Up",
      hasAccount: "Already have an account?",
      signIn: "Sign In",
      
      // Verification View
      verifyTitle: "Verification Code",
      verifyDesc: "Please enter the 6-digit code sent to your email.",
      codePlaceholder: "Enter code",
      btnVerifyLoading: "Verifying...",
      btnVerify: "Verify",
      
      errorGeneric: "An unexpected error occurred."
    },
    ko: {
      brand: "Euro trails",
      heroTitle: "새로운 여정에 참여하세요.",
      heroDesc: "가입하여 모든 기능을 잠금 해제하고 여행 계획을 시작하세요.",
      
      // Form View
      formTitle: "가입하기",
      formDesc: "새 계정 만들기",
      socialGoogle: "Google로 가입하기",
      socialFacebook: "Facebook로 가입하기",
      divider: "또는",
      emailPlaceholder: "이메일 주소",
      passwordPlaceholder: "비밀번호",
      btnLoading: "가입 중...",
      btnDefault: "가입하기",
      hasAccount: "이미 계정이 있으신가요?",
      signIn: "로그인",
      
      // Verification View
      verifyTitle: "인증 코드",
      verifyDesc: "이메일로 전송된 6자리 코드를 입력하세요.",
      codePlaceholder: "코드 입력",
      btnVerifyLoading: "확인 중...",
      btnVerify: "확인",
      
      errorGeneric: "예기치 않은 오류가 발생했습니다."
    }
  };

  const t = content[language];

  useEffect(() => {
    if (userLoaded && user) {
      router.push("/");
    }
  }, [userLoaded, user, router]);

  // --- 1. Handle Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");
    try {
      await signUp.create({
        emailAddress: email,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.longMessage || t.errorGeneric;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Handle Verification ---
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      } else {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.longMessage || t.errorGeneric;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3. Handle Social ---
  const handleSocialSignUp = async (strategy: "oauth_google" | "oauth_facebook") => {
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");
    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.longMessage || t.errorGeneric;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ──────────────── Render: Verification Form ────────────────
  if (pendingVerification) {
    return (
      <section className="relative min-h-screen w-full flex items-center justify-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover filter brightness-50">
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 container mx-auto px-4 max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-2">{t.verifyTitle}</h2>
            <p className="text-slate-400 mb-8">{t.verifyDesc}</p>
            <form onSubmit={handleVerification} className="space-y-6">
              <FormInput
                type="text"
                placeholder={t.codePlaceholder}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg shadow-lg"
              >
                {isLoading ? t.btnVerifyLoading : t.btnVerify}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </section>
    );
  }

  // ──────────────── Render: Main Sign-Up Form ────────────────
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-slate-900 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover filter brightness-50">
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white text-center lg:text-left hidden lg:block"
        >
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="bg-sky-500 text-white p-2 rounded-lg">
              <FaPlane size={20} />
            </div>
            <span className="text-2xl font-black tracking-tight">{t.brand}</span>
          </Link>
          <h1 className="text-5xl font-black leading-tight mb-4">{t.heroTitle}</h1>
          <p className="text-slate-300 text-lg">{t.heroDesc}</p>
        </motion.div>

        {/* Right Column: Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-2">{t.formTitle}</h2>
            <p className="text-slate-400 mb-8">{t.formDesc}</p>
            
            {/* Social Logins */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <SocialButton
                icon={FaGoogle}
                text={t.socialGoogle}
                onClick={() => handleSocialSignUp("oauth_google")}
                disabled={isLoading}
              />
              <SocialButton
                icon={FaFacebookF}
                text={t.socialFacebook}
                onClick={() => handleSocialSignUp("oauth_facebook")}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <hr className="flex-1 border-slate-700" />
              <span className="text-slate-500 text-xs font-bold">{t.divider}</span>
              <hr className="flex-1 border-slate-700" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormInput
                type="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg flex items-center justify-center group"
              >
                {isLoading ? t.btnLoading : t.btnDefault}
                {!isLoading && (
                  <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                )}
              </motion.button>
            </form>
            
            <p className="text-center text-sm text-slate-400 mt-8">
              {t.hasAccount}{" "}
              <Link href="/sign-in" className="font-bold text-sky-400 hover:underline">
                {t.signIn}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Helper Components ─── */
const FormInput = ({ type, placeholder, value, onChange }: { type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="relative">
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="peer w-full bg-slate-800/50 border-2 border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-all"
    />
    <div className="absolute inset-0 rounded-lg border-2 border-transparent peer-focus:border-sky-500 pointer-events-none -z-10 blur group-focus:opacity-100 opacity-0 transition-opacity duration-300"
      style={{ background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.2), transparent 80%)' }} />
  </div>
);

const SocialButton = ({ icon: Icon, text, onClick, disabled }: { icon: any; text: string; onClick: () => void; disabled: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="flex-1 flex items-center justify-center gap-3 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-white hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Icon />
    {text}
  </button>
);

export default SignUpPage;