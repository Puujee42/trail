"use client";
import { useState, useEffect } from "react";
import { useSignIn, useUser } from "@clerk/nextjs"; // Updated: Use useSignIn instead of useSignUp
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGoogle, FaFacebookF, FaPlane, FaArrowRight } from "react-icons/fa";

const SignInPage = () => {
  const { isLoaded, signIn, setActive } = useSignIn(); // Updated: Use useSignIn
  const { user, isLoaded: userLoaded } = useUser(); // Added: For checking if already signed in
  const router = useRouter();

  // State for form inputs, errors, and loading status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Added: Redirect if already signed in (best practice to prevent access to sign-in page)
  useEffect(() => {
    if (userLoaded && user) {
      router.push("/"); // Redirect to home or dashboard
    }
  }, [userLoaded, user, router]);

  // --- 1. Handle Form Submission for Email/Password ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");
    try {
      // Start the sign-in process (Updated: Use signIn.create instead of signUp)
      const result = await signIn.create({
        identifier: email,
        password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/"); // Redirect to your desired page after sign-in
      } else {
        // Handle other states if necessary
        console.log(JSON.stringify(result, null, 2));
      }
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.longMessage || "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Handle Social Logins (OAuth) --- (Updated: Use signIn instead of signUp)
  const handleSocialSignIn = async (strategy: "oauth_google" | "oauth_facebook") => {
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback", // Must be an allowed callback URL in your Clerk dashboard
        redirectUrlComplete: "/", // Where to go after successful sign-in
      });
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.longMessage ||
        "An unexpected error occurred during social sign-in.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Main Sign-In Form (Removed pendingVerification as it's not needed for sign-in)
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-slate-900 overflow-hidden">
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover filter brightness-50">
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>
      {/* Main Content Layout */}
      <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
            <span className="text-2xl font-black tracking-tight">
              Euro trails
            </span>
          </Link>
          <h1 className="text-5xl font-black leading-tight mb-4">
            Шинэ аялалд нэгдээрэй.
          </h1>
          <p className="text-slate-300 text-lg">
            Нэвтэрснээр та манай бүх боломжуудыг ашиглах боломжтой болно.
          </p>
        </motion.div>
        {/* Right Column: Sign-In Form (Updated texts for sign-in) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-2">Нэвтрэх</h2>
            <p className="text-slate-400 mb-8">
              Бүртгэлтэй хаягаараа нэвтрэх
            </p>
            {/* Social Logins */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <SocialButton
                icon={FaGoogle}
                text="Google-р нэвтрэх"
                onClick={() => handleSocialSignIn("oauth_google")}
                disabled={isLoading}
              />
              <SocialButton
                icon={FaFacebookF}
                text="Facebook-р нэвтрэх"
                onClick={() => handleSocialSignIn("oauth_facebook")}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center gap-4 mb-8">
              <hr className="flex-1 border-slate-700" />
              <span className="text-slate-500 text-xs font-bold">ЭСВЭЛ</span>
              <hr className="flex-1 border-slate-700" />
            </div>
            {/* Sign-In Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                type="email"
                placeholder="И-мэйл хаяг"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormInput
                type="password"
                placeholder="Нууц үг"
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
                {isLoading ? "Нэвтэрч байна..." : "Нэвтрэх"}
                {!isLoading && (
                  <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                )}
              </motion.button>
            </form>
            <p className="text-center text-sm text-slate-400 mt-8">
              Бүртгэлгүй юу?{" "}
              <Link href="/sign-up" className="font-bold text-sky-400 hover:underline">
                Бүртгүүлэх
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Helper Components (Unchanged) ─── */
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

export default SignInPage;