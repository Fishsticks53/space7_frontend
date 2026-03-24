import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
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
import { forgotPassword, resetPassword } from "../services/api";

const OTP_LENGTH = 6;

export default function ForgotPasswordPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [otpSent, setOtpSent] = useState(false);
	const [submittingRequest, setSubmittingRequest] = useState(false);
	const [submittingReset, setSubmittingReset] = useState(false);

	const isValidOtp = useMemo(
		() => String(otp || "").replace(/\D/g, "").length === OTP_LENGTH,
		[otp],
	);

	const onSendOtp = async () => {
		const normalizedEmail = email.trim().toLowerCase();
		if (!normalizedEmail) {
			Alert.alert("Validation", "Please enter your email.");
			return;
		}

		try {
			setSubmittingRequest(true);
			await forgotPassword(normalizedEmail);
			setOtpSent(true);
			Alert.alert("OTP Sent", "Check your email for the password reset OTP.");
		} catch (error) {
			Alert.alert(
				"Request Failed",
				error?.message || "Unable to send reset OTP.",
			);
		} finally {
			setSubmittingRequest(false);
		}
	};

	const onResetPassword = async () => {
		const normalizedEmail = email.trim().toLowerCase();
		const normalizedOtp = String(otp || "").replace(/\D/g, "");

		if (!normalizedEmail) {
			Alert.alert("Validation", "Please enter your email.");
			return;
		}
		if (!isValidOtp) {
			Alert.alert("Validation", "Please enter a valid 6-digit OTP.");
			return;
		}
		if (!newPassword || newPassword.length < 6) {
			Alert.alert("Validation", "New password must be at least 6 characters.");
			return;
		}
		if (newPassword !== confirmPassword) {
			Alert.alert("Validation", "Passwords do not match.");
			return;
		}

		try {
			setSubmittingReset(true);
			await resetPassword(normalizedEmail, normalizedOtp, newPassword);
			Alert.alert("Success", "Password reset successful. Please login.");
			router.replace("/Login");
		} catch (error) {
			Alert.alert(
				"Reset Failed",
				error?.message || "Unable to reset password.",
			);
		} finally {
			setSubmittingReset(false);
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
						<Text style={styles.subtitle}>Reset your password</Text>
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
									value={email}
									onChangeText={setEmail}
									autoCapitalize="none"
									keyboardType="email-address"
								/>
							</View>
						</View>

						<Pressable
							style={styles.primaryButton}
							onPress={onSendOtp}
							disabled={submittingRequest}
						>
							<Text style={styles.primaryButtonText}>
								{submittingRequest ? "Sending..." : "Send OTP"}
							</Text>
						</Pressable>

						{otpSent ? (
							<View style={styles.resetCard}>
								<View style={styles.inputGroup}>
									<Text style={styles.label}>OTP</Text>
									<View style={styles.inputWrapper}>
										<Ionicons
											name="key-outline"
											size={24}
											color="#111"
											style={styles.inputIcon}
										/>
										<TextInput
											placeholder="6-digit OTP"
											placeholderTextColor="#999"
											style={styles.input}
											value={otp}
											onChangeText={setOtp}
											keyboardType="number-pad"
											maxLength={6}
										/>
									</View>
								</View>

								<View style={styles.inputGroup}>
									<Text style={styles.label}>New Password</Text>
									<View style={styles.inputWrapper}>
										<Ionicons
											name="lock-closed-outline"
											size={24}
											color="#111"
											style={styles.inputIcon}
										/>
										<TextInput
											placeholder="Enter new password"
											placeholderTextColor="#999"
											style={styles.input}
											value={newPassword}
											onChangeText={setNewPassword}
											secureTextEntry
										/>
									</View>
								</View>

								<View style={styles.inputGroup}>
									<Text style={styles.label}>Confirm Password</Text>
									<View style={styles.inputWrapper}>
										<Ionicons
											name="lock-closed-outline"
											size={24}
											color="#111"
											style={styles.inputIcon}
										/>
										<TextInput
											placeholder="Confirm new password"
											placeholderTextColor="#999"
											style={styles.input}
											value={confirmPassword}
											onChangeText={setConfirmPassword}
											secureTextEntry
										/>
									</View>
								</View>

								<Pressable
									style={styles.loginButton}
									onPress={onResetPassword}
									disabled={submittingReset}
								>
									<Text style={styles.loginButtonText}>
										{submittingReset ? "Resetting..." : "Reset Password"}
									</Text>
								</Pressable>
							</View>
						) : null}

						<TouchableOpacity
							style={styles.backRow}
							onPress={() => router.replace("/Login")}
						>
							<Ionicons name="arrow-back" size={18} color="#111" />
							<Text style={styles.backText}>Back to Login</Text>
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
		marginBottom: 26,
	},
	logo: {
		fontSize: 48,
		fontWeight: "900",
		color: "#111",
	},
	subtitle: {
		marginTop: 6,
		fontSize: 18,
		fontWeight: "700",
		color: "#111",
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
		marginBottom: 16,
	},
	label: {
		fontSize: 18,
		fontWeight: "900",
		color: "#111",
		marginBottom: 8,
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
	primaryButton: {
		backgroundColor: "#5dd76c",
		borderRadius: 18,
		borderWidth: 4,
		borderColor: "#111",
		paddingVertical: 14,
		alignItems: "center",
		marginTop: 2,
		marginBottom: 12,
	},
	primaryButtonText: {
		fontSize: 20,
		fontWeight: "900",
		color: "#111",
	},
	resetCard: {
		marginTop: 8,
		paddingTop: 12,
		borderTopWidth: 3,
		borderTopColor: "#111",
	},
	loginButton: {
		backgroundColor: "#27a6fd",
		borderRadius: 18,
		borderWidth: 4,
		borderColor: "#111",
		paddingVertical: 16,
		alignItems: "center",
		marginTop: 6,
	},
	loginButtonText: {
		fontSize: 22,
		fontWeight: "900",
		color: "#111",
	},
	backRow: {
		marginTop: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 6,
	},
	backText: {
		fontSize: 16,
		fontWeight: "800",
		color: "#111",
		textDecorationLine: "underline",
	},
});
