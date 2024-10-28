"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();
import ky from "ky";

//TODO read from env config
const API_URL = "http://localhost:8080";
const api = ky.create({ prefixUrl: `${API_URL}/api/auth` });

interface AuthContextData {
  isLoggedIn: boolean;
  loginEffect: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({
  isLoggedIn: false,
  loginEffect: () => {},
  logout: () => {},
});

function AuthProvider({ children }: { children: ReactNode }) {
  const userToken = cookies.get("user_token");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!userToken);

  const logout = () => {
    cookies.remove("user_token");
    cookies.remove("user_refresh_token");

    setIsLoggedIn(false);
  };

  const loginEffect = () => {
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        logout,
        loginEffect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext is used outside of AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
