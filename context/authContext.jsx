import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { loginUser, signup, verifyOTP, profiledetails, createSpace,myspaces } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearStoredAuth = useCallback(async () => {
    await SecureStore.deleteItemAsync("jwt_token");
    await SecureStore.deleteItemAsync("user_data");
    setToken(null);
    setUser(null);
  }, []);

  const loadStoredAuth = useCallback(async () => {
    try {
      const savedToken = await SecureStore.getItemAsync("jwt_token");
      const savedUser = await SecureStore.getItemAsync("user_data");

      if (savedToken) {
        setToken(savedToken);
      }

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log("Error loading auth:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const signUp = useCallback(async (username, email, password) => {
    const data = await signup(username, email, password);
    return data;
  }, []);

  const normalizeAuthError = useCallback(async (error) => {
    const message = String(error?.message || "").toLowerCase();
    const isAuthError =
      error?.status === 401 ||
      error?.status === 403 ||
      message.includes("missing auth token") ||
      message.includes("unauthorized") ||
      message.includes("token");

    if (isAuthError) {
      await clearStoredAuth();
    }
    throw error;
  }, [clearStoredAuth]);

  const profileDetails = useCallback(async ()=>{
    try {
      const data = await profiledetails(token);
      return data;
    } catch (error) {
      return normalizeAuthError(error);
    }
  }, [normalizeAuthError, token]);

  const createSpaces = useCallback(async (title, description, visibility, hashtags) => {
    try {
      const data = await createSpace(title, description, visibility, hashtags, token);
      return data;
    } catch (error) {
      return normalizeAuthError(error);
    }
  }, [normalizeAuthError, token]);

  const verifyEmail = useCallback(async (email, otp) => {
    const data = await verifyOTP(email, otp);

    await SecureStore.setItemAsync("jwt_token", data.token);
    await SecureStore.setItemAsync("user_data", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data;
  }, []);

  const signIn = useCallback(async (email, password) => {
    const data = await loginUser(email, password);

    await SecureStore.setItemAsync("jwt_token", data.token);
    await SecureStore.setItemAsync("user_data", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const signOut = useCallback(async () => {
    await clearStoredAuth();
  }, [clearStoredAuth]);

  const mySpaces = useCallback(async (visibility = "") => {
    try {
      const data = await myspaces(token, visibility);
      return data;
    } catch (error) {
      return normalizeAuthError(error);
    }
  }, [normalizeAuthError, token]);

  const value = useMemo(() => ({
    token,
    user,
    loading,
    signUp,
    verifyEmail,
    signIn,
    signOut,
    profileDetails,
    createSpaces,
    mySpaces,
    isAuthenticated: !!token,
  }), [
    createSpaces,
    loading,
    mySpaces,
    profileDetails,
    signIn,
    signOut,
    signUp,
    token,
    user,
    verifyEmail,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
