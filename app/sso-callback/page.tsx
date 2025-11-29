"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

const SSOCallbackPage = () => {
  const searchParams = useSearchParams();
  
  // Try to get the redirect URL from parameters, otherwise default to "/"
  const redirectUrl = searchParams.get("redirect_url") || "/";

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <AuthenticateWithRedirectCallback
        afterSignInUrl={redirectUrl}
        afterSignUpUrl={redirectUrl}
      />
      <p className="text-white animate-pulse">Completing authentication...</p>
    </div>
  );
};

export default SSOCallbackPage;