import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Screen from "../components/Screen";
import { useAuth } from "../context/authContext";

export default function LoginPage() {
	const router = useRouter();

	const { signIn } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert("Validation", "Please enter email and password");
			return;
		}

		try {
			setSubmitting(true);
			await signIn(email, password);
			router.replace("/(tabs)");
		} catch (error) {
			Alert.alert("Login Failed", error.message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Screen style={styles.screen}>
			<KeyboardAvoidingView
				style={styles.keyboardAvoiding}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
			>
				<ScrollView
					style={styles.scroll}
					contentContainerStyle={styles.container}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					bounces={false}
					overScrollMode="never"
				>
					<View style={styles.headerSection}>
						<Text style={styles.logo}>space7</Text>
					</View>
					<View style={styles.formContainer}>
						<View style={styles.inputGroup}>
							<Text style={styles.label}>Email</Text>
							<View style={styles.inputWrapper}>
								<Ionicons
									name="mail-outline"
									size={24}
									color="#111"
									style={styles.inputIcon}
								/>
								<TextInput
									placeholder="Enter your email"
									placeholderTextColor="#999"
									style={styles.input}
									onChangeText={setEmail}
									keyboardType="email-address"
								/>
							</View>
						</View>
						<View style={styles.inputGroup}>
							<Text style={styles.label}>Password</Text>
							<View style={styles.inputWrapper}>
								<Ionicons
									name="lock-closed-outline"
									size={24}
									color="#111"
									style={styles.inputIcon}
								/>
								<TextInput
									placeholder="Enter your password"
									placeholderTextColor="#999"
									style={styles.input}
									onChangeText={setPassword}
									secureTextEntry
								/>
							</View>
							<TouchableOpacity
								style={styles.forgotWrap}
								onPress={() => router.push("/ForgotPassword")}
							>
								<Text style={styles.forgotText}>Forgot Password?</Text>
							</TouchableOpacity>
						</View>
						<Pressable
							style={styles.loginButton}
							activeOpacity={0.8}
							onPress={handleLogin}
							disabled={submitting}
						>
							<Text style={styles.loginButtonText}>Login</Text>
						</Pressable>
						<View style={styles.divider}>
							<View style={styles.dividerLine} />
							<Text style={styles.dividerText}>or</Text>
							<View style={styles.dividerLine} />
						</View>

						<TouchableOpacity
							style={styles.signupButton}
							activeOpacity={0.8}
							onPress={() => router.push("/Register")}
						>
							<Ionicons name="person-add-outline" size={24} color="#111" />
							<Text style={styles.signupButtonText}>Create Account</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</Screen>
	);
}

const styles = StyleSheet.create({
	screen: {
		backgroundColor: "#feda00",
	},
	keyboardAvoiding: {
		flex: 1,
		backgroundColor: "#feda00",
	},
	scroll: {
		flex: 1,
		backgroundColor: "#feda00",
	},
	container: {
		flexGrow: 1,
		backgroundColor: "#feda00",
		paddingHorizontal: 20,
		paddingTop: 60,
		paddingBottom: 40,
		justifyContent: "flex-start",
	},
	headerSection: {
		alignItems: "center",
		marginBottom: 40,
	},
	logo: {
		fontSize: 48,
		fontWeight: "900",
		color: "#111",
		marginBottom: 12,
	},

	formContainer: {
		backgroundColor: "#fff",
		width: "100%",
		maxWidth: 460,
		alignSelf: "center",
		borderRadius: 24,
		borderWidth: 4,
		borderColor: "#111",
		padding: 24,
		shadowColor: "#000",
		shadowOpacity: 0.18,
		shadowRadius: 4,
		shadowOffset: { width: 4, height: 6 },
		elevation: 5,
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 18,
		fontWeight: "900",
		color: "#111",
		marginBottom: 8,
	},
	forgotWrap: {
		marginTop: 10,
		alignSelf: "flex-end",
	},
	forgotText: {
		fontSize: 14,
		fontWeight: "800",
		color: "#27a6fd",
		textDecorationLine: "underline",
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
		borderRadius: 16,
		borderWidth: 3,
		borderColor: "#111",
		paddingHorizontal: 16,
		paddingVertical: 14,
	},
	inputIcon: {
		marginRight: 12,
	},
	input: {
		flex: 1,
		fontSize: 18,
		color: "#111",
		fontWeight: "600",
	},
	loginButton: {
		backgroundColor: "#27a6fd",
		borderRadius: 18,
		borderWidth: 4,
		borderColor: "#111",
		paddingVertical: 16,
		alignItems: "center",
		marginTop: 10,
		marginBottom: 20,
	},
	loginButtonText: {
		fontSize: 22,
		fontWeight: "900",
		color: "#111",
	},
	divider: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 20,
	},
	dividerLine: {
		flex: 1,
		height: 3,
		backgroundColor: "#111",
	},
	dividerText: {
		marginHorizontal: 12,
		fontSize: 16,
		fontWeight: "900",
		color: "#111",
	},
	signupButton: {
		backgroundColor: "#5dd76c",
		borderRadius: 18,
		borderWidth: 4,
		borderColor: "#111",
		paddingVertical: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
	},
	signupButtonText: {
		fontSize: 22,
		fontWeight: "900",
		color: "#111",
	},
});
