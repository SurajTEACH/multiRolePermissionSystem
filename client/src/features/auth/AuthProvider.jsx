import { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { isLoggedIn, clearToken } from "../../lib/auth.js";
import { meApi } from "./authApi.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: meApi,
    enabled: isLoggedIn(),
    retry: false
  });

  const user = meQuery.data?.user;

  const value = useMemo(
    () => ({
      user,
      isLoading: meQuery.isLoading,
      isError: meQuery.isError,
      logout: () => {
        clearToken();
        window.location.href = "/login";
      }
    }),
    [user, meQuery.isLoading, meQuery.isError]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
