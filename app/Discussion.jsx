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
                <Text style={styles.cardTitle} numberOfLines={1}>{space?.title || "Untitled Space"}</Text>
                <Text style={styles.cardDesc} numberOfLines={3} ellipsizeMode="tail">
                  {space?.description || "No description available."}
                </Text>

                <View style={styles.byRow}>
                  <MaterialCommunityIcons name="face-man-profile" size={22} color="#111" />
                  <Text style={styles.byText}>By @{space?.creator?.username || "you"}</Text>
                  <View style={styles.countWrap}>
                    <Feather name="user" size={18} color="#111" />
                    <Text style={styles.countText}>{count}</Text>
                  </View>
                </View>

                <ScrollView
                  horizontal
                  nestedScrollEnabled
                  directionalLockEnabled
                  scrollEnabled={tags.length > 1}
                  showsHorizontalScrollIndicator={false}
                  style={styles.tagScroll}
                  contentContainerStyle={[styles.tagRow, styles.tagRowHorizontal]}
                  onStartShouldSetResponder={() => true}
                >
                  {tags.length === 0 ? (
                    <Text style={[styles.tag, styles.tagBlue]}>#general</Text>
                  ) : (
                    tags.map((tag, idx) => (
                      <Text
                        key={`${space?.space_id || "space"}-wrap-${tag?.tag_id || idx}`}
                        style={[styles.tag, idx % 2 === 0 ? styles.tagBlue : styles.tagGreen]}
                      >
                        #{String(tag?.tag_name || "").replace(/^#/, "")}
                      </Text>
                    ))
                  )}
                </ScrollView>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyStateWrap}>
          <Image source={require('../assets/Discussion.png')} style={styles.image} resizeMode="contain" />
        </View>
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
  emptyStateWrap: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  image: {
    flex: 1,
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
    borderRadius: 0,
    borderColor: "#111",
    borderWidth: 4,
    padding: 16,
    minHeight: 180,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: "Outfit_700Bold",
    color: "#111",
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 16,
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
    paddingBottom: 4,
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
    gap: 8,
  },
  tagRowHorizontal: {
    flexWrap: "nowrap",
    alignItems: "center",
    minHeight: 40,
    paddingRight: 10,
  },
  tagScroll: { minHeight: 44, alignSelf: "stretch" },
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
