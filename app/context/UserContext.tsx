"use client";

import { createContext, useContext, ReactNode } from "react";
import { useUser, useClerk } from "@clerk/nextjs";

interface UserContextType {
  user: any | null;
  isSignedIn: boolean;
  isLoaded: boolean;
  signOut: () => Promise<void>;
  openUserProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();

  const value = {
    user,
    isSignedIn: !!isSignedIn,
    isLoaded,
    signOut: async () => {
      await signOut();
    },
    openUserProfile: () => openUserProfile(),
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useCurrentUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useCurrentUser must be used within a UserProvider");
  }
  return context;
}
