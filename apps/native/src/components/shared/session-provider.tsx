import { authClient } from "@/lib/auth-client";
import { User } from "better-auth";
import { createContext, useContext } from "react";

export const SessionContext = createContext<{ user: User | undefined }>({
  user: undefined,
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  return (
    <SessionContext.Provider value={{ user: session?.user }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  return useContext(SessionContext);
};
