import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { loginUser, signup, verifyOTP, profiledetails, createSpace,myspaces } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
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
  };

  const signUp = async (username, email, password) => {
    const data = await signup(username, email, password);
    return data;
  };

  const profileDetails = async ()=>{
    const data = await profiledetails();
    return data;
  }

  const createSpaces = async (title, description, visibility, hashtags) => {
    const data = await createSpace(title, description, visibility, hashtags, token);
    return data;
  };

  const verifyEmail = async (email, otp) => {
    const data = await verifyOTP(email, otp);

    await SecureStore.setItemAsync("jwt_token", data.token);
    await SecureStore.setItemAsync("user_data", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const signIn = async (email, password) => {
    const data = await loginUser(email, password);

    await SecureStore.setItemAsync("jwt_token", data.token);
    await SecureStore.setItemAsync("user_data", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("jwt_token");
    await SecureStore.deleteItemAsync("user_data");

    setToken(null);
    setUser(null);
  };

  const mySpaces = async (visibility = "") => {
    const data = await myspaces(token, visibility);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
