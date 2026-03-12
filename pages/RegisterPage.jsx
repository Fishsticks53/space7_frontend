import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import Screen from "../components/Screen";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuth } from "../context/authContext";

const OTP_LENGTH = 6;

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, verifyEmail } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));

  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);

  const otpInputRefs = useRef([]);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Validation", "Please fill all details");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation", "Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      await signUp(username.trim(), email.trim(), password);
      setOtpVisible(true);
      Alert.alert("OTP Sent", "Please enter the 6-digit OTP sent to your email.");
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const sanitized = value.replace(/[^0-9]/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = sanitized;
    setOtp(nextOtp);

    if (sanitized && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== OTP_LENGTH) {
      Alert.alert("Validation", "Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setVerifying(true);
      await verifyEmail(email.trim(), otpCode);
      setOtpVisible(false);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Verification Failed", error.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.logo}>space7</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrapper}>
              <AntDesign
                name="user"
                size={24}
                color="#111"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Choose a username"
                placeholderTextColor="#999"
                style={styles.input}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <AntDesign
                name="mail"
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
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <AntDesign
                name="lock"
                size={24}
                color="#111"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Create a password"
                placeholderTextColor="#999"
                style={styles.input}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <AntDesign
                name="lock"
                size={24}
                color="#111"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                style={styles.input}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </View>

          <Pressable
            style={styles.loginButton}
            activeOpacity={0.8}
            onPress={handleRegister}
            disabled={submitting}
          >
            <Text style={styles.loginButtonText}>
              {submitting ? "Please wait..." : "Create Account"}
            </Text>
          </Pressable>

          {otpVisible ? (
            <View style={styles.inlineOtpCard}>
              <Text style={styles.modalTitle}>Verify OTP</Text>
              <Text style={styles.modalSubtitle}>
                Enter the 6-digit OTP sent to {email || "your email"}
              </Text>

              <View style={styles.otpRow}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={`otp-${index}`}
                    ref={(el) => {
                      otpInputRefs.current[index] = el;
                    }}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(event) => handleOtpKeyPress(event, index)}
                    style={styles.otpInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                  />
                ))}
              </View>

              <Pressable
                style={styles.verifyButton}
                onPress={handleVerifyOtp}
                disabled={verifying}
              >
                <Text style={styles.verifyButtonText}>
                  {verifying ? "Verifying..." : "Verify OTP"}
                </Text>
              </Pressable>

              <TouchableOpacity onPress={() => setOtpVisible(false)}>
                <Text style={styles.resendText}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.signupButton}
            activeOpacity={0.8}
            onPress={() => router.push("/Login")}
          >
            <AntDesign name="login" size={24} color="#111" />
            <Text style={styles.signupButtonText}>Back To Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#feda00",
    paddingHorizontal: 20,
    paddingVertical: 60,
    justifyContent: "center",
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
  inlineOtpCard: {
    marginTop: 18,
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 4,
    borderColor: "#111",
    padding: 22,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111",
  },
  modalSubtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    textAlign: "center",
  },
  otpRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  otpInput: {
    width: 46,
    height: 56,
    borderWidth: 3,
    borderColor: "#111",
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "900",
    color: "#111",
    backgroundColor: "#f5f5f5",
  },
  verifyButton: {
    width: "100%",
    backgroundColor: "#27a6fd",
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#111",
    paddingVertical: 14,
    alignItems: "center",
  },
  verifyButtonText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111",
  },
  resendText: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: "800",
    color: "#27a6fd",
    textDecorationLine: "underline",
  },
});
