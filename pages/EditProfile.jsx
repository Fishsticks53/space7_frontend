import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import Screen from "../components/Screen";

export default function EditProfile() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.page}>
        <View style={styles.card}>
          <Text style={styles.title}>Edit Profile</Text>
          <Text style={styles.subtitle}>Profile editing UI will be added here.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Text style={styles.backButtonText}>Back To Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#feda00",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "#111",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111",
  },
  subtitle: {
    fontSize: 15,
    color: "#222",
    textAlign: "center",
  },
  backButton: {
    marginTop: 8,
    backgroundColor: "#27a6fd",
    borderWidth: 3,
    borderColor: "#111",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  backButtonText: {
    color: "#111",
    fontWeight: "900",
    fontSize: 16,
  },
});
