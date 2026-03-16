import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Screen from "../components/Screen";
import { useRouter } from "expo-router";
import { searchSpaces } from "../services/api";

const isPublic = (space) => String(space?.visibility || "public").toLowerCase() !== "private";

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
        <Text style={styles.title}>Search</Text>
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
            style={styles.card}
            onPress={() => {
              const id = space?.space_id || space?.id;
              if (!id) return;
              router.push({ pathname: "/chat", params: { spaceId: id } });
            }}
          >
            <Text style={styles.cardTitle}>{space?.title || "Untitled"}</Text>
            <Text style={styles.cardDesc}>{space?.description || "No description available."}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { paddingTop: 40, paddingHorizontal: 16, paddingBottom: 10, backgroundColor: "#27a6fd", flexDirection: "row", alignItems: "center", gap: 8 },
  backBtn: { backgroundColor: "#feda00", borderWidth: 2, borderColor: "#111", borderRadius: 8, padding: 6 },
  title: { fontSize: 28, fontWeight: "900", color: "#111" },
  row: { flexDirection: "row", gap: 8, padding: 12, backgroundColor: "#efefef" },
  input: { flex: 1, borderWidth: 2, borderColor: "#111", borderRadius: 10, backgroundColor: "#fff", paddingHorizontal: 10, paddingVertical: 8 },
  searchBtn: { backgroundColor: "#feda00", borderWidth: 2, borderColor: "#111", borderRadius: 10, justifyContent: "center", paddingHorizontal: 12 },
  searchBtnText: { fontWeight: "900", color: "#111" },
  listPad: { padding: 12, gap: 10 },
  card: { borderWidth: 3, borderColor: "#111", borderRadius: 14, padding: 12, backgroundColor: "#8ad8f5" },
  cardTitle: { fontSize: 18, fontWeight: "900", color: "#111" },
  cardDesc: { fontSize: 14, color: "#111", marginTop: 4 },
});
