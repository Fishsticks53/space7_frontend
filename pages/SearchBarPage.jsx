import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Screen from "../components/Screen";
import { useRouter } from "expo-router";
import { searchSpaces } from "../services/api";

const isPublic = (space) => String(space?.visibility || "public").toLowerCase() !== "private";
const spaceColors = ["#fc56aa", "#8ad8f5", "#5dd76d", "#feda03"];

export default function SearchBarPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);

  const onSearch = async () => {
    try {
      const data = await searchSpaces(query, 30);
      const spaces = Array.isArray(data) ? data : data?.spaces || [];
      setList(spaces.filter(isPublic));
    } catch (error) {
      Alert.alert("Search failed", error?.message || "Unable to search.");
      setList([]);
    }
  };

  return (
    <Screen>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#111" />
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Search Spaces</Text>
        </View>
      </View>

      <View style={styles.row}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={onSearch}
          style={styles.input}
          placeholder="Search spaces..."
        />
        <TouchableOpacity onPress={onSearch} style={styles.searchBtn}>
          <Text style={styles.searchBtnText}>Go</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listPad}>
        {list.map((space, index) => (
          <TouchableOpacity
            key={space?.space_id || space?.id || `${index}`}
            style={[styles.card, { backgroundColor: spaceColors[index % spaceColors.length] }]}
            onPress={() => {
              const id = space?.space_id || space?.id;
              if (!id) return;
              router.push({ pathname: "/chat", params: { spaceId: id } });
            }}
          >
            <Text style={styles.cardTitle} numberOfLines={1}>
              {space?.title || "Untitled"}
            </Text>
            <Text style={styles.cardDesc} numberOfLines={3} ellipsizeMode="tail">
              {space?.description || "No description available."}
            </Text>
            <View style={styles.byRow}>
              <MaterialCommunityIcons
                name="face-man-profile"
                size={24}
                color="#111"
              />
              <Text style={styles.byText}>By @{space?.creator?.username || "space7"}</Text>
              <View style={styles.countWrap}>
                <Feather
                  name="user"
                  size={20}
                  color="#111"
                />
                <Text style={styles.countText}>
                  {space?.participant_count ??
                    space?.member_count ??
                    space?.members_count ??
                    (Array.isArray(space?.members) ? space.members.length : 0)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    paddingTop: 36,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#27a6fd",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 3,
    borderBottomColor: "#111",
  },
  backBtn: { backgroundColor: "#feda00", borderWidth: 2, borderColor: "#111", borderRadius: 10, padding: 8 },
  titleWrap: { flex: 1 },
  title: { fontSize: 26, fontWeight: "900", color: "#111" },
  row: { flexDirection: "row", gap: 8, padding: 12, backgroundColor: "#efefef", borderBottomWidth: 2, borderBottomColor: "#111" },
  input: { flex: 1, borderWidth: 2, borderColor: "#111", borderRadius: 10, backgroundColor: "#fff", paddingHorizontal: 10, paddingVertical: 8 },
  searchBtn: { backgroundColor: "#feda00", borderWidth: 2, borderColor: "#111", borderRadius: 10, justifyContent: "center", paddingHorizontal: 12 },
  searchBtnText: { fontWeight: "900", color: "#111" },
  listPad: { padding: 12, gap: 10, paddingBottom: 24 },
  card: { borderWidth: 4, borderColor: "#111", borderRadius: 0, padding: 16, backgroundColor: "#8ad8f5", minHeight: 180 },
  cardTitle: { fontSize: 22, fontWeight: "900", color: "#111" },
  cardDesc: { fontSize: 16, color: "#111", marginTop: 4, marginBottom: 10 },
  byRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 },
  byText: { fontSize: 14, color: "#111" },
  countWrap: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#111",
    paddingBottom: 4,
    gap: 5,
  },
  countText: { fontSize: 16, fontWeight: "900", color: "#111" },
});
