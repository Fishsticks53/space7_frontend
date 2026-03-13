import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import Screen from "../components/Screen";
import AntDesign from "@expo/vector-icons/AntDesign";
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
    <Screen>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.headerSection}>
            <Text style={styles.logo}>space7</Text>
          </View>
          <View style={styles.formContainer}>
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
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  style={styles.input}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
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
              <AntDesign name="plus" size={24} color="#111" />
              <Text style={styles.signupButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{" "}
              <Text
                style={styles.footerLink}
                onPress={() => router.push("/Register")}
              >
                Sign up here
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#feda00",
    paddingHorizontal: 20,
    paddingVertical: 60,
    justifyContent: "space-between",
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
  footer: {
    alignItems: "center",
    marginTop: 30,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  footerLink: {
    fontWeight: "900",
    color: "#27a6fd",
    textDecorationLine: "underline",
  },
});
