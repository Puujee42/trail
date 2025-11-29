// app/sso-callback/page.tsx
"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

const SSOCallbackPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <AuthenticateWithRedirectCallback
        afterSignInUrl="/"
      />
      <p className="text-white">Completing authentication...</p>
    </div>
  );
};

export default SSOCallbackPage;