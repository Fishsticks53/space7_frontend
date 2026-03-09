import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import Screen from "../components/Screen";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";

const trendingCards = [
  {
    id: 1,
    emoji: "⚡",
    title: "AI in Future",
    description: "How will AI change the world by 2030?",
    by: "arjun",
    count: 324,
    tags: ["#AI", "#Future"],
    color: "#feda03",
  },
  {
    id: 2,
    emoji: "🗺️",
    title: "Startup",
    description: "Share your journey, ideas and startups!",
    by: "meera",
    count: 211,
    tags: ["#Startup"],
    color: "#5dd76c",
  },
  {
    id: 3,
    emoji: "🗺️",
    title: "Startup",
    description: "Share your journey, ideas and startups!",
    by: "meera",
    count: 211,
    tags: ["#Startup"],
    color: "#fc55aa",
  },
];

const recommendedCards = [
  {
    id: 1,
    emoji: "🧬",
    title: "Mindfulness & Life",
    description: "Let's talk about mental wellness",
    by: "kavi",
    count: 189,
    tags: ["#Heath", "#Wellbeing"],
    color: "#fc56aa",
  },
  {
    id: 2,
    emoji: "🌐",
    title: "Web3 Basics",
    description: "Beginner's guide to Web3 & Crypto.",
    by: "rahul",
    count: 456,
    tags: ["#Web3", "#Crypto"],
    color: "#8ad8f5",
  },
];

export default function HomePage() {
  return (
    <Screen>
      <View style={styles.page}>
        <View style={styles.headerArea}>
          <View style={styles.topRow}>
            <Text style={styles.logo}>space7</Text>
            <View style={styles.iconRow}>
              <View style={styles.bellWrap}>
                <Ionicons name="notifications-outline" size={32} color="#111" />
              </View>
              <View style={styles.menuWrap}>
                <Entypo name="menu" size={28} color="#111" />
              </View>
            </View>
          </View>

          <View style={styles.searchBar}>
            <FontAwesome
              name="search"
              size={30}
              color="#111"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search topics or users..."
              placeholderTextColor="#333"
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.searchArrow} activeOpacity={1}>
              <AntDesign name="arrow-right" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentPad}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionPill, styles.trendingPill]}>
              Trending Topics
            </Text>
            <TouchableOpacity
              style={[styles.seeAllPill, styles.green]}
              activeOpacity={1}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
          >
            {trendingCards.map((card) => (
              <TouchableOpacity
                key={card.id}
                activeOpacity={1}
                style={[styles.topicCard, { backgroundColor: card.color }]}
              >
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardTitle}>
                    {card.emoji} {card.title}
                  </Text>
                </View>
                <Text style={styles.cardDesc}>{card.description}</Text>

                <View style={styles.byRow}>
                  <MaterialCommunityIcons
                    name="face-man-profile"
                    size={24}
                    color="#111"
                  />
                  <Text style={styles.byText}>By @{card.by}</Text>
                  <View style={styles.countWrap}>
                    <Feather name="user" size={25} color="#111" />
                    <Text style={styles.countText}>{card.count}</Text>
                  </View>
                </View>

                <View style={styles.tagRow}>
                  {card.tags.map((tag, idx) => (
                    <Text
                      key={tag}
                      style={[
                        styles.tag,
                        idx % 2 === 0 ? styles.tagBlue : styles.tagGreen,
                      ]}
                    >
                      {tag}
                    </Text>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionPill, styles.recPill]}>
              Recommended
            </Text>
            <TouchableOpacity
              style={[styles.seeAllPill, styles.blue]}
              activeOpacity={1}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {recommendedCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              activeOpacity={1}
              style={[styles.recCard, { backgroundColor: card.color }]}
            >
              <Text style={styles.recTitle}>
                {card.emoji} {card.title}
              </Text>
              <Text style={styles.recDesc}>{card.description}</Text>

              <View style={styles.byRow}>
                <FontAwesome5 name="user-circle" size={24} color="#111" />
                <Text style={styles.byText}>By @{card.by}</Text>
                <View style={styles.countWrap}>
                  <Feather name="user" size={25} color="#111" />
                  <Text style={styles.countText}>{card.count}</Text>
                </View>
              </View>

              <View style={styles.tagRow}>
                {card.tags.map((tag, idx) => (
                  <Text
                    key={tag}
                    style={[
                      styles.tag,
                      idx % 2 === 0 ? styles.tagPurple : styles.tagGreen,
                    ]}
                  >
                    {tag}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#e9e9eb",
  },
  headerArea: {
    backgroundColor: "#27a6fd",
    paddingTop: 30,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    fontSize: 40,
    fontWeight: "900",
    color: "#111",
    marginRight: "auto",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  bellWrap: {
    padding: 6,
    borderRadius: 12,
    position: "relative",
    backgroundColor: "#feda00",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "black",
  },
  menuWrap: {
    backgroundColor: "#fc3099",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#111",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  searchBar: {
    marginTop: 14,
    backgroundColor: "#ececec",
    borderWidth: 4,
    borderColor: "#111",
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 8,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 2,
    shadowOffset: { width: 4, height: 6 },
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 20,
    color: "#111",
    paddingVertical: 12,
  },
  searchArrow: {
    backgroundColor: "#feda03",
    borderWidth: 3,
    borderColor: "#111",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  content: {
    flex: 1,
  },
  contentPad: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  sectionHeader: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionPill: {
    borderWidth: 3,
    borderColor: "#111",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 8,
    fontSize: 24,
    fontWeight: "900",
    color: "#111",
  },
  trendingPill: {
    backgroundColor: "#fc56aa",
  },
  recPill: {
    backgroundColor: "#5dd76d",
  },
  seeAllPill: {
    borderWidth: 3,
    borderColor: "#111",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  green: {
    backgroundColor: "#5dd76c",
  },
  blue: {
    backgroundColor: "#41b4fb",
  },
  seeAllText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
  },
  hList: {
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  topicCard: {
    width: 250,
    height: 220,
    borderRadius: 24,
    borderColor: "#111",
    borderWidth: 4,
    padding: 12,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#111",
  },
  cardDesc: {
    fontSize: 14,
    color: "#111",
    marginBottom: 8,
    minHeight: 44,
  },
  byRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  byText: {
    fontSize: 14,
    color: "#111",
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
    fontWeight: "900",
    color: "#111",
  },
  tagRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
    flexWrap: "wrap",
  },
  tag: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#111",
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 16,
    color: "#111",
    overflow: "hidden",
    maxHeight: 40,
  },
  tagBlue: {
    backgroundColor: "#41b4fb",
  },
  tagGreen: {
    backgroundColor: "#4de36a",
  },
  tagPurple: {
    backgroundColor: "#6f65ff",
  },
  recCard: {
    marginTop: 12,
    borderRadius: 24,
    borderColor: "#111",
    borderWidth: 4,
    padding: 16,
  },
  recTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111",
    marginBottom: 8,
  },
  recDesc: {
    fontSize: 16,
    color: "#111",
    marginBottom: 10,
  },
});
