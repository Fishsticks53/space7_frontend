import { Button, Text, View, StyleSheet, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Screen from "../components/Screen";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {useAuth} from "../context/authContext";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();

  const colors=['#fc55aa','#27a6fd','#feda00','#5dd76d'];
  const {signOut, profileDetails} = useAuth();
  const [user, setUser] = useState({});
  const handleLogout = async () => {
    await signOut();
    router.replace("/Login");
  };

  useEffect( ()=>{
      const getProfile = async ()=>{
      const data = await profileDetails();
      setUser(data);
    };
    getProfile();
  },[])

  const details = {
    username: user?.username || "User",
    image: "😇",
    description: "Startup Enthusiast 🚀 Book Lover 📖",
    spaces: 7,
    activeUsersSpace: 132,
    participated: 31,
    lastActive: 2,
    activeUserSpace2: 198,
  };

const spaces = [
  {
    id: 1,
    title: "Startup Storytelling🚀",
    count: 198,
    description: "Share your journey startups!",
    days: 2,
    status: "public",
    tags: ["startup", "HealthTech"],
  },
  {
    id: 2,
    title: "Productivity Hacks",
    count: 269,
    description: "Tips for boosting your productivity",
    days: 2,
    status: "private",
    tags: ["startup", "HealthTech"],
  },
  {
    id: 3,
    title: "AI Builders Hub",
    count: 154,
    description: "Discuss building AI tools and startups",
    days: 5,
    status: "public",
    tags: ["AI", "MachineLearning"],
  },
  {
    id: 4,
    title: "Indie Dev Community",
    count: 87,
    description: "For solo developers building products",
    days: 1,
    status: "public",
    tags: ["IndieDev", "Startups"],
  },
  {
    id: 5,
    title: "Tech Career Growth",
    count: 312,
    description: "Advice on tech jobs, interviews and growth",
    days: 3,
    status: "private",
    tags: ["Career", "Tech"],
  },
];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topbar}>
          <View style={styles.icons}>
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)");
              }}
            >
              <Feather name="arrow-left" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.topbar.user}>@ {details.username}</Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/edit-profile");
              }}
            >
              <Entypo name="dots-three-horizontal" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sparkle}>
            <Ionicons name="sparkles-sharp" size={32} color="black" />
            <Ionicons name="sparkles-sharp" size={32} color="black" />
            <Ionicons name="sparkles-sharp" size={32} color="black" />
            <Ionicons name="sparkles-sharp" size={32} color="black" />
            <Ionicons name="sparkles-sharp" size={32} color="black" />
            <Ionicons name="sparkles-sharp" size={32} color="black" />
          </View>
        </View>
        <View style={styles.bottom}>
          <View
            style={{
              position: "realtive",
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <View style={styles.profileImage}></View>
          </View>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "col",
              marginTop: 50,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 5 }}>
              @{details.username}
            </Text>
            <View style={styles.description}>
              <Text>{details.description}</Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
              marginTop: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <View style={styles.spaceIcon}>
                <View>
                  <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                    🚀 {details.spaces}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    Spaces
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 25,
                      flex: 1,
                      width: "auto",
                      paddingHorizontal: 0,
                    }}
                  >
                    {"-".repeat(22)}
                  </Text>
                </View>
                <View
                  style={{ display: "flex", flexDirection: "row", gap: 20 }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 3,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="face-man-profile"
                      size={24}
                      color="black"
                    />
                    <Text>{details.username}</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 3,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Feather name="user" size={24} color="black" />
                    <Text>{details.activeUsersSpace}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <View style={styles.spaceIcon2}>
                <View>
                  <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                    💬 {details.spaces}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    Participated
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 25, flex: 1 }}>
                    {"-".repeat(20)}
                  </Text>
                </View>
                <View
                  style={{ display: "flex", flexDirection: "row", gap: 20 }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 3,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="face-man-profile"
                      size={24}
                      color="black"
                    />
                    <Text>{details.username}</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 3,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Feather name="user" size={24} color="black" />
                    <Text>{details.activeUserSpace2}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <Text
            style={{
              backgroundColor: "#5dd76d",
              alignSelf: "flex-start",
              fontSize: 18,
              borderColor: "black",
              borderWidth: 3,
              borderRadius: 8,
              marginTop: 20,
              marginLeft: 20,
              padding: 5,
              fontWeight: "bold",
            }}
          >
            Created Spaces
          </Text>
          <View style={styles.createdSpacesWrap}>
            {spaces.map((space) => (
              <TouchableOpacity key={space.id}>
                  <View style={[styles.spaceCard, { backgroundColor: colors[space.id % colors.length] }]}>
                  <View style={styles.spaceCardTopRow}>
                    <Text style={styles.spaceTitle}>{space.title}</Text>
                    <View style={styles.spaceCountRow}>
                      <Feather name="user" size={14} color="black" />
                      <Text style={styles.spaceCountText}>{space.count}</Text>
                    </View>
                  </View>

                  <Text style={styles.spaceDescriptionText}>{space.description}</Text>

                  <View style={styles.spaceMetaRow}>
                    <View style={styles.spaceMetaLeft}>
                      <View style={styles.spaceOwnerRow}>
                        <MaterialCommunityIcons
                          name="face-man-profile"
                          size={18}
                          color="black"
                        />
                        <Text style={styles.spaceMetaText}>@{details.username}</Text>
                      </View>
                      <Text style={styles.spaceMetaText}>{space.days} days ago</Text>
                    </View>

                    <Text style={styles.spaceStatusBadge}>#{space.status}</Text>

                    <View style={styles.spaceCountRow}>
                      <Feather name="user" size={14} color="black" />
                      <Text style={styles.spaceCountText}>{space.count}</Text>
                    </View>
                  </View>

                  <View style={styles.spaceTagsRow}>
                    {space.tags.map((tag, tagIndex) => {
                      const cardColorIndex = space.id % colors.length;
                      const availableColors = colors.filter((_, index) => index !== cardColorIndex);
                      const tagColor = availableColors[tagIndex % availableColors.length];
                      return (
                        <View key={`${space.id}-${tag}`} style={[styles.spaceTag, {backgroundColor: tagColor}]}>
                          <Text>#{tag}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    paddingBottom: 24,
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    paddingTop: 40,
    paddingHorizontal: 18,
    backgroundColor: "#27a6fd",
    justifyContent: "center",
    paddingBottom: 50,
    user: {
      marginRight: "auto",
      marginLeft: 8,
      fontSize: 18,
      marginTop: 2,
      fontWeight: "bold",
    },
  },
  icons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    justifyContent:"center",
    alignItems:"center"
  },
  sparkle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 10,
    gap: 12,
  },
  bottom: {
    width: "100%",
    marginTop: -26,
    borderRadius: 21,
    backgroundColor: "white",
    paddingTop: 6,
    height:'100%'
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    position: "absolute",
    top: -70,
    borderWidth: 3,
    borderColor: "black",
    backgroundColor: "white",
  },
  description: {
    fontSize: 35,
    backgroundColor: "#5dd76d",
    borderColor: "black",
    borderWidth: 3,
    padding: 7,
    marginTop: 10,
    borderRadius: 15,
    width: 370,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  spaceIcon: {
    backgroundColor: "#27a6fd",
    padding: 10,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "black",
    width: 180,
  },
  spaceIcon2: {
    backgroundColor: "#feda00",
    padding: 10,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "black",
    width: 180,
  },
  createdSpacesWrap: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 20,
    gap: 12,
  },
  spaceCard: {
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginLeft:8,
    marginRight:8,
    marginBottom:15,
  },
  spaceCardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  spaceTitle: {
    fontSize: 23,
    fontWeight: "bold",
    flex: 1,
  },
  spaceCountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  spaceCountText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  spaceDescriptionText: {
    fontSize: 20,
    marginTop: 4,
  },
  spaceMetaRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  spaceMetaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  spaceOwnerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  spaceMetaText: {
    fontSize: 17,
    fontWeight: "600",
  },
  spaceStatusBadge: {
    backgroundColor: "#feda00",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 1,
    fontWeight: "bold",
    fontSize: 15,
  },
  spaceTagsRow: {
    marginTop: 8,
    flexDirection: "row",
    gap: 6,
  },
  spaceTag: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 1,
    fontWeight: "bold",
    fontSize: 15,
  },
  logoutButton: {
    backgroundColor: "#fc55aa",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 12,
    padding:6,
    alignSelf: "center",
    marginLeft: 20,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
});
