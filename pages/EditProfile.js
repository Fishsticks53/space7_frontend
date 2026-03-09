import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import Screen from "../components/Screen";
export default function EditProfile() {
  const router = useRouter();
  return (
    <Screen>
      <Text>Edit Profile Page</Text>
      <Button
        title="Go Back to Profile"
        onPress={() => router.push("/(tabs)/profile")}
      />
    </Screen>
  );
}
