import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Screen from "../components/Screen";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAuth } from "../context/authContext";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const colors = ["#fc55aa", "#27a6fd", "#feda00", "#5dd76d"];
  const { signOut, profileDetails, mySpaces } = useAuth();
  const [user, setUser] = useState({});
  const [spaces, setSpaces] = useState([]);

  const handleLogout = async () => {
    await signOut();
    router.replace("/Login");
  };

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const [profileData, spacesData] = await Promise.all([
          profileDetails(),
          mySpaces(""),
        ]);
        if (!isMounted) return;
        setUser(profileData || {});
        setSpaces(Array.isArray(spacesData) ? spacesData : spacesData?.spaces || []);
      } catch (error) {
        if (!isMounted) return;
        setUser({});
        setSpaces([]);
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [mySpaces, profileDetails]);

  const totalParticipants = spaces.reduce((sum, space) => {
    const count =
      space?.participant_count ??
      space?.member_count ??
      space?.members_count ??
      (Array.isArray(space?.members) ? space.members.length : 0);
    return sum + (Number(count) || 0);
  }, 0);

  const details = {
    username: user?.username || "User",
    description: "Startup Enthusiast Book Lover",
    spaces: spaces.length,
    activeUsersSpace: totalParticipants,
    activeUserSpace2: totalParticipants,
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topbar}>
          <View style={styles.icons}>
            <TouchableOpacity onPress={() => router.push("/(tabs)")}>
              <Feather name="arrow-left" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.userName}>@ {details.username}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottom}>
          <View style={styles.profileWrap}>
            <View style={styles.profileImage}></View>
          </View>

          <View style={styles.userMetaWrap}>
            <Text style={styles.userTag}>@{details.username}</Text>
            <View style={styles.description}>
              <Text>{details.description}</Text>
            </View>
          </View>

          <View style={styles.statsWrap}>
            <View style={styles.spaceIcon}>
              <Text style={styles.bigText}> {details.spaces}</Text>
              <Text style={styles.mediumText}>Spaces</Text>
              <Text style={styles.separator}>{"-".repeat(22)}</Text>
              <View style={styles.statRow}>
                <View style={styles.statInner}>
                  <MaterialCommunityIcons name="face-man-profile" size={24} color="black" />
                  <Text>{details.username}</Text>
                </View>
                <View style={styles.statInner}>
                  <Feather name="user" size={24} color="black" />
                  <Text>{details.activeUsersSpace}</Text>
                </View>
              </View>
            </View>

            <View style={styles.spaceIcon2}>
              <Text style={styles.bigText}> {details.spaces}</Text>
              <Text style={styles.mediumText}>Participated</Text>
              <Text style={styles.separator}>{"-".repeat(20)}</Text>
              <View style={styles.statRow}>
                <View style={styles.statInner}>
                  <MaterialCommunityIcons name="face-man-profile" size={24} color="black" />
                  <Text>{details.username}</Text>
                </View>
                <View style={styles.statInner}>
                  <Feather name="user" size={24} color="black" />
                  <Text>{details.activeUserSpace2}</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.createdTitle}>Created Spaces</Text>

          <View style={styles.createdSpacesWrap}>
            {spaces.map((space, index) => {
              const participantCount =
                space?.participant_count ??
                space?.member_count ??
                space?.members_count ??
                (Array.isArray(space?.members) ? space.members.length : 0);

              const daysAgo = space?.created_at
                ? Math.max(
                    0,
                    Math.floor((Date.now() - new Date(space.created_at).getTime()) / (1000 * 60 * 60 * 24))
                  )
                : 0;

              const tags = Array.isArray(space?.tags) ? space.tags : [];

              return (
                <TouchableOpacity
                  key={space?.space_id || space?.id || `${space?.title}-${index}`}
                  activeOpacity={0.7}
                  onPress={() => {
                    const id = space?.space_id || space?.id;
                    if (!id) return;
                    router.push({ pathname: "/chat", params: { spaceId: id } });
                  }}
                >
                  <View style={[styles.spaceCard, { backgroundColor: colors[index % colors.length] }]}>
                    <View style={styles.spaceCardTopRow}>
                      <Text style={styles.spaceTitle}>{space?.title || "Untitled Space"}</Text>
                      <View style={styles.spaceCountRow}>
                        <Feather name="user" size={14} color="black" />
                        <Text style={styles.spaceCountText}>{participantCount}</Text>
                      </View>
                    </View>

                    <Text style={styles.spaceDescriptionText}>{space?.description || "No description available."}</Text>

                    <View style={styles.spaceMetaRow}>
                      <View style={styles.spaceMetaLeft}>
                        <View style={styles.spaceOwnerRow}>
                          <MaterialCommunityIcons name="face-man-profile" size={18} color="black" />
                          <Text style={styles.spaceMetaText}>@{details.username}</Text>
                        </View>
                        <Text style={styles.spaceMetaText}>{daysAgo} days ago</Text>
                      </View>

                      <View style={styles.spaceCountRow}>
                        <Feather name="user" size={14} color="black" />
                        <Text style={styles.spaceCountText}>{participantCount}</Text>
                      </View>
                    </View>

                    <View style={styles.spaceTagsRow}>
                      {tags.map((tag, tagIndex) => {
                        const cardColorIndex = index % colors.length;
                        const availableColors = colors.filter((_, i) => i !== cardColorIndex);
                        const tagColor = availableColors[tagIndex % availableColors.length];
                        return (
                          <View key={`${space?.space_id || index}-${tag?.tag_id || tagIndex}`} style={[styles.spaceTag, { backgroundColor: tagColor }]}>
                            <Text>#{String(tag?.tag_name || "").replace(/^#/, "")}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
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
    paddingTop: 40,
    paddingHorizontal: 18,
    backgroundColor: "#27a6fd",
    paddingBottom: 70,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    marginRight: "auto",
    marginLeft: 8,
    fontSize: 18,
    marginTop: 2,
    fontWeight: "bold",
  },
  
  bottom: {
    width: "100%",
    marginTop: -26,
    borderRadius: 21,
    backgroundColor: "white",
    paddingTop: 6,
    height: "100%",
  },
  profileWrap: {
    justifyContent: "center",
    flexDirection: "row",
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
  userMetaWrap: {
    alignItems: "center",
    marginTop: 50,
  },
  userTag: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
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
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  statsWrap: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
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
  bigText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  mediumText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  separator: {
    fontSize: 25,
  },
  statRow: {
    flexDirection: "row",
    gap: 20,
  },
  statInner: {
    flexDirection: "row",
    gap: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  createdTitle: {
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
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 15,
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
  spaceTagsRow: {
    marginTop: 8,
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
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
    padding: 6,
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
