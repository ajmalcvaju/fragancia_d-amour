"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./config";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [mockUser, setMockUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Check local storage demo login state
      const isDemoLoggedIn = localStorage.getItem("fragancia_admin_auth") === "true";
      setMockUser(isDemoLoggedIn);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    if (!isFirebaseConfigured) {
      // Demo authentication mode
      if (email && pass) {
        setMockUser(true);
        localStorage.setItem("fragancia_admin_auth", "true");
        return;
      }
      throw new Error("Invalid credentials");
    }

    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    if (!isFirebaseConfigured) {
      setMockUser(false);
      localStorage.removeItem("fragancia_admin_auth");
      return;
    }

    await firebaseSignOut(auth);
  };

  const isAdmin = Boolean(user || mockUser);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
