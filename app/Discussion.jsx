import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, Alert, ScrollView, TouchableOpacity } from "react-native";
import Screen from "../components/Screen";
import { useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  useFonts,
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold
} from "@expo-google-fonts/outfit";
import { useAuth } from "../context/authContext";

export default function MyDiscussion() {
  const [found, setFound] = useState(true);
  const [list, setList] = useState([]);
  const [visibility] = useState("");
  const { mySpaces } = useAuth();
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold
  });

  const cardColors=["#fc55aa","#59d46d","#a8bdca","#fcd733","#6553fd"]

  useEffect(() => {
    const getMySpace = async () => {
      try {
        const data = await mySpaces(visibility);
        const spaces = Array.isArray(data) ? data : data?.spaces || [];
        setList(spaces);
        setFound(spaces.length > 0);
      } catch (error) {
        const message = String(error?.message || "").toLowerCase();
        const isAuthError =
          error?.status === 401 ||
          error?.status === 403 ||
          message.includes("missing auth token") ||
          message.includes("unauthorized");
        if (!isAuthError) {
          Alert.alert("Load failed", error?.message || "Something went wrong");
        }
        setList([]);
        setFound(false);
      }
    };

    getMySpace();
  }, [mySpaces, visibility]);

  if (!fontsLoaded) {
    return null;
  }

  const router = useRouter();

  return (
    <Screen>
      <View style={styles.top}>
        <Text style={styles.title}>Space7</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.closeButton}
          onPress={() => {
            router.push("/(tabs)");
          }}
        >
          <Ionicons name="close" size={40} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.topic}>
        <Text style={styles.topicText}>My Discussion</Text>
      </View>

      {found ? (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentPad}
          showsVerticalScrollIndicator={false}
        >
          {list.map((space, index) => {
            const iconName =
              index % 5 === 0
                ? "lightning-bolt"
                : index % 5 === 1
                ? "dna"
                : index % 5 === 2
                ? "earth"
                : index % 5 === 3
                ? "rocket-launch-outline"
                : "map-marker-radius-outline";

            const tags = Array.isArray(space?.tags) ? space.tags : [];
            const count =
              space?.participant_count ??
              space?.member_count ??
              space?.members_count ??
              (Array.isArray(space?.members) ? space.members.length : 0);

            return (
              <TouchableOpacity
                key={space?.space_id || space?.id || `${space?.title}-${index}`}
                activeOpacity={0.7}
                onPress={() => {
                  const id = space?.space_id || space?.id;
                  if (!id) return;
                  router.push({ pathname: "/chat", params: { spaceId: id } });
                }}
                style={[styles.card,{backgroundColor:cardColors[index%5]}]}
              >
                <View style={styles.cardTitleRow}>
                  <MaterialCommunityIcons name={iconName} size={24} color="#111" />
                  <Text style={styles.cardTitle}>{space?.title || "Untitled Space"}</Text>
                </View>

                <Text style={styles.cardDesc}>{space?.description || "No description available."}</Text>

                <View style={styles.byRow}>
                  <MaterialCommunityIcons name="face-man-profile" size={22} color="#111" />
                  <Text style={styles.byText}>By @{space?.creator?.username || "you"}</Text>
                  <View style={styles.countWrap}>
                    <Feather name="user" size={18} color="#111" />
                    <Text style={styles.countText}>{count}</Text>
                  </View>
                </View>

                <View style={styles.tagRow}>
                  {tags.length === 0 ? (
                    <Text style={[styles.tag, styles.tagBlue]}>#general</Text>
                  ) : (
                    tags.map((tag, idx) => (
                      <View key={`${space?.space_id || "space"}-wrap-${tag?.tag_id || idx}`}>
                        <Text
                          style={[styles.tag, idx % 2 === 0 ? styles.tagBlue : styles.tagGreen]}
                        >
                          #{String(tag?.tag_name || "").replace(/^#/, "")}
                        </Text>
                      </View>
                    ))
                  )}
                  
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <Image source={require('../assets/Discussion.png')} style={styles.image} resizeMode="contain" />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    backgroundColor: "#27a6fd",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  closeButton: {
    backgroundColor: "#fc2e99",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 8,
  },
  topic: {
    backgroundColor: "#feda00",
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 15,
  },
  title: {
    fontSize: 40,
    fontFamily: "Outfit_700Bold",
  },
  topicText: {
    fontSize: 32,
    fontFamily: "Outfit_700Bold",
    marginLeft: 14,
  },
  image: {
    width: "100%",
    height: "70%",
  },
  content: {
    flex: 1,
  },
  contentPad: {
    padding: 14,
    paddingBottom: 28,
    gap: 12,
  },
  card: {
    borderRadius: 24,
    borderColor: "#111",
    borderWidth: 4,
    padding: 14,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: "Outfit_700Bold",
    color: "#111",
    flex: 1,
    flexShrink: 1,
  },
  cardDesc: {
    fontSize: 14,
    color: "#111",
    marginBottom: 10,
    fontFamily: "Outfit_400Regular",
  },
  byRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  byText: {
    fontSize: 14,
    color: "#111",
    fontFamily: "Outfit_400Regular",
  },
  countWrap: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#111",
    paddingBottom: 2,
    gap: 5,
  },
  countText: {
    fontSize: 16,
    fontFamily: "Outfit_700Bold",
    color: "#111",
  },
  tagRow: {
    flexDirection: "row",
    marginTop: 12,
    flexWrap: "wrap",
  },
  tag: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#111",
    paddingHorizontal: 10,
    paddingVertical: 2,
    fontSize: 14,
    color: "#111",
    overflow: "hidden",
    fontFamily: "Outfit_600SemiBold",
    marginRight: 8,
    marginBottom: 8,
    flexShrink: 1,
  },
  tagBlue: {
    backgroundColor: "#41b4fb",
  },
  tagGreen: {
    backgroundColor: "#4de36a",
  },
});
