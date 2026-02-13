"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";

const SignUpPage = () => {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || `/${language}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-50 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case shadow-lg shadow-blue-500/30',
              card: 'shadow-2xl border border-slate-100 rounded-[2rem] bg-white/80 backdrop-blur-xl',
              headerTitle: 'font-black text-2xl text-slate-900 font-[var(--font-montserrat)]',
              headerSubtitle: 'text-slate-500 font-medium font-[var(--font-inter)]',
              socialButtonsBlockButton: 'border-slate-200 hover:bg-slate-50 font-bold text-slate-600',
              formFieldLabel: 'font-bold text-slate-700',
              formFieldInput: 'rounded-xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 transition-all',
               footerActionLink: 'text-blue-600 hover:text-blue-700 font-bold',
               footer: 'hidden'
            },
            variables: {
              colorPrimary: '#2563eb',
              fontFamily: 'var(--font-inter)',
              borderRadius: '12px',
            }
          }}
          afterSignUpUrl={`/${language}/dashboard`}
          afterSignInUrl={`/${language}/dashboard`}
          forceRedirectUrl={redirectUrl}
          signInUrl={`/${language}/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`}
        />
      </div>
    </div>
  );
};

export default SignUpPage;
