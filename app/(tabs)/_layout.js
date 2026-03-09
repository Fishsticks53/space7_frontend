import { Tabs, useRouter } from "expo-router";
import { Ionicons, Feather, Entypo } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import { View, StyleSheet } from "react-native";

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: styles.tab }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new-space"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/NewSpace");
          },
        }}
        options={{
          title: "New Space",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="new-message" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="discussion"
        listeners={{
          tabPress:(e)=>{
            e.preventDefault();
            router.push("/Discussion");
          },
          }}
        options={{
          title: "Discussion",
          tabBarIcon: ({ color, size }) => (
            <Octicons name="comment-discussion" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tab: {
    borderWidth: 3.5,
    borderTopWidth: 3.5,
    borderColor: "black",
    borderRadius: 15,
    paddingBottom: 10,
    alignSelf: "center",
    marginBottom:25,
    width:'94%',
    marginHorizontal:110,
  },
});
