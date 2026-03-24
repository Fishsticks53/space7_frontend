import * as SecureStore from "expo-secure-store";
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	createSpace,
	loginUser,
	myspaces,
	profiledetails as fetchProfileDetails,
	signup,
	verifyOTP,
} from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [token, setToken] = useState(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const persistUser = useCallback(async (nextUser) => {
		if (!nextUser) return;
		await SecureStore.setItemAsync("user_data", JSON.stringify(nextUser));
		setUser(nextUser);
	}, []);

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

			if (savedToken) {
				try {
					const freshProfile = await fetchProfileDetails(savedToken);
					if (freshProfile) {
						await SecureStore.setItemAsync(
							"user_data",
							JSON.stringify(freshProfile),
						);
						setUser(freshProfile);
					}
				} catch {
					// Keep app usable with locally cached user data.
				}
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

	const normalizeAuthError = useCallback(
		async (error) => {
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
		},
		[clearStoredAuth],
	);

	const refreshProfile = useCallback(async () => {
		try {
			const data = await fetchProfileDetails(token);
			await persistUser(data);
			return data;
		} catch (error) {
			return normalizeAuthError(error);
		}
	}, [normalizeAuthError, persistUser, token]);

	const profileDetails = refreshProfile;

	const createSpaces = useCallback(
		async (title, description, visibility, hashtags) => {
			try {
				const data = await createSpace(
					title,
					description,
					visibility,
					hashtags,
					token,
				);
				return data;
			} catch (error) {
				return normalizeAuthError(error);
			}
		},
		[normalizeAuthError, token],
	);

	const verifyEmail = useCallback(async (email, otp) => {
		const data = await verifyOTP(email, otp);

		await SecureStore.setItemAsync("jwt_token", data.token);

		setToken(data.token);
		await persistUser(data.user);
		try {
			await fetchProfileDetails(data.token).then(persistUser);
		} catch {
			// Fallback to auth payload if profile fetch is unavailable.
		}

		return data;
	}, [persistUser]);

	const signIn = useCallback(async (email, password) => {
		const data = await loginUser(email, password);

		await SecureStore.setItemAsync("jwt_token", data.token);

		setToken(data.token);
		await persistUser(data.user);
		try {
			await fetchProfileDetails(data.token).then(persistUser);
		} catch {
			// Fallback to auth payload if profile fetch is unavailable.
		}
		return data;
	}, [persistUser]);

	const signOut = useCallback(async () => {
		await clearStoredAuth();
	}, [clearStoredAuth]);

	const mySpaces = useCallback(
		async (visibility = "") => {
			try {
				const data = await myspaces(token, visibility);
				return data;
			} catch (error) {
				return normalizeAuthError(error);
			}
		},
		[normalizeAuthError, token],
	);

	const value = useMemo(
		() => ({
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
			refreshProfile,
			isAuthenticated: !!token,
		}),
		[
			createSpaces,
			loading,
			mySpaces,
			refreshProfile,
			profileDetails,
			signIn,
			signOut,
			signUp,
			token,
			user,
			verifyEmail,
		],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	return useContext(AuthContext);
}
