import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Screen from "../components/Screen";
import { recommendedSpaces, trendingSpaces } from "../services/api";

const trendingColors = ["#feda03", "#5dd76c", "#fc55aa", "#41b4fb"];
const recommendedColors = ["#fc56aa", "#8ad8f5", "#5dd76d", "#feda03"];

const fallbackCreator = "space7";
const isPublicSpace = (space) =>
	String(space?.visibility || "public").toLowerCase() !== "private";

export default function HomePage() {
	const router = useRouter();
	const [trendingCards, setTrendingCards] = useState([]);
	const [recommendedCards, setRecommendedCards] = useState([]);

	useEffect(() => {
		const loadHomeData = async () => {
			const [trendingResult, recommendedResult] = await Promise.allSettled([
				trendingSpaces(10),
				recommendedSpaces(undefined, 10),
			]);

			if (trendingResult.status === "fulfilled") {
				const trendingData = trendingResult.value;
				const trendingList = Array.isArray(trendingData)
					? trendingData
					: trendingData?.spaces || [];
				setTrendingCards(trendingList.filter(isPublicSpace));
			} else {
				Alert.alert(
					"Load failed",
					trendingResult.reason?.message || "Unable to fetch trending topics",
				);
				setTrendingCards([]);
			}

			if (recommendedResult.status === "fulfilled") {
				const recommendedData = recommendedResult.value;
				const recommendedList = Array.isArray(recommendedData)
					? recommendedData
					: recommendedData?.recommended ||
						recommendedData?.recomended ||
						recommendedData?.spaces ||
						[];
				setRecommendedCards(recommendedList.filter(isPublicSpace));
			} else {
				const error = recommendedResult.reason;
				const message = String(error?.message || "").toLowerCase();
				const isAuthError =
					error?.status === 401 ||
					error?.status === 403 ||
					message.includes("missing auth token") ||
					message.includes("unauthorized");
				if (!isAuthError) {
					Alert.alert(
						"Load failed",
						error?.message || "Unable to fetch recommendations",
					);
				}
				setRecommendedCards([]);
			}
		};

		loadHomeData();
	}, []);

	return (
		<Screen>
			<View style={styles.page}>
				<View style={styles.headerArea}>
					<View style={styles.topRow}>
						<Text style={styles.logo}>space7</Text>
						<TouchableOpacity
							activeOpacity={0.7}
							style={styles.bellWrap}
							onPress={() => router.push("/Notification")}
						>
							<Ionicons name="notifications-outline" size={30} color="#111" />
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						style={styles.searchBar}
						activeOpacity={0.9}
						onPress={() => router.push("/SearchBar")}
					>
						<Ionicons name="search" size={24} color="#111" />
						<TextInput
							editable={false}
							placeholder="Search topics or users..."
							placeholderTextColor="#333"
							style={styles.searchInput}
						/>
					</TouchableOpacity>
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
					</View>

					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.hList}
					>
						{trendingCards.map((card, index) => {
							const tags = Array.isArray(card?.tags) ? card.tags : [];
							const creator = card?.creator?.username ?? fallbackCreator;
							const count =
								card?.participant_count ??
								card?.member_count ??
								card?.members_count ??
								(Array.isArray(card?.members) ? card.members.length : 0);

							return (
								<TouchableOpacity
									key={card?.space_id || card?.id || `${card?.title}-${index}`}
									activeOpacity={0.7}
									delayPressIn={180}
									style={[
										styles.topicCard,
										{
											backgroundColor:
												trendingColors[index % trendingColors.length],
										},
									]}
									onPress={() => {
										const id = card?.space_id || card?.id;
										if (!id) return;
										router.push({ pathname: "/chat", params: { spaceId: id } });
									}}
								>
									<View style={styles.cardTitleRow}>
										<Text
											style={styles.cardTitle}
											numberOfLines={1}
											ellipsizeMode="tail"
										>
											{card?.title || "Untitled"}
										</Text>
									</View>
									<Text
										style={styles.cardDesc}
										numberOfLines={3}
										ellipsizeMode="tail"
									>
										{card?.description || "No description available."}
									</Text>

									<View style={styles.byRow}>
										<MaterialCommunityIcons
											name="face-man-profile"
											size={24}
											color="#111"
										/>
										<Text style={styles.byText}>By @{creator}</Text>
										<View style={styles.countWrap}>
											<Feather name="user" size={25} color="#111" />
											<Text style={styles.countText}>{count}</Text>
										</View>
									</View>

									<ScrollView
										horizontal
										nestedScrollEnabled
										directionalLockEnabled
										scrollEnabled={tags.length > 1}
										showsHorizontalScrollIndicator={false}
										contentContainerStyle={[
											styles.tagRow,
											styles.tagRowHorizontal,
											styles.tagRowTrending,
										]}
										style={styles.tagScroll}
										onStartShouldSetResponder={() => true}
									>
										{tags.length === 0 ? (
											<Text style={[styles.tag, styles.tagBlue]}>#general</Text>
										) : (
											tags.slice(0, 4).map((tag, idx) => (
												<Text
													key={`${card?.space_id || index}-${tag?.tag_id || idx}`}
													style={[
														styles.tag,
														idx % 2 === 0 ? styles.tagBlue : styles.tagGreen,
													]}
													numberOfLines={1}
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

					<View style={styles.sectionHeader}>
						<Text style={[styles.sectionPill, styles.recPill]}>
							Recommended
						</Text>
					</View>

					{recommendedCards.map((card, index) => {
						const tags = Array.isArray(card?.tags) ? card.tags : [];
						const creator = card?.creator?.username || fallbackCreator;
						const count =
							card?.participant_count ??
							card?.member_count ??
							card?.members_count ??
							(Array.isArray(card?.members) ? card.members.length : 0);

						return (
							<TouchableOpacity
								key={card?.space_id || card?.id || `${card?.title}-${index}`}
								activeOpacity={0.7}
								delayPressIn={180}
								style={[
									styles.recCard,
									{
										backgroundColor:
											recommendedColors[index % recommendedColors.length],
									},
								]}
								onPress={() => {
									const id = card?.space_id || card?.id;
									if (!id) return;
									router.push({ pathname: "/chat", params: { spaceId: id } });
								}}
							>
								<Text style={styles.recTitle}>{card?.title || "Untitled"}</Text>
								<Text
									style={styles.recDesc}
									numberOfLines={3}
									ellipsizeMode="tail"
								>
									{card?.description || "No description available."}
								</Text>

								<View style={styles.byRow}>
									<FontAwesome5 name="user-circle" size={24} color="#111" />
									<Text style={styles.byText}>By @{creator}</Text>
									<View style={styles.countWrap}>
										<Feather name="user" size={25} color="#111" />
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
									contentContainerStyle={[
										styles.tagRow,
										styles.tagRowHorizontal,
										styles.tagRowRecommended,
									]}
									onStartShouldSetResponder={() => true}
								>
									{tags.length === 0 ? (
										<Text style={[styles.tag, styles.tagPurple]}>#general</Text>
									) : (
										tags.map((tag, idx) => (
											<Text
												key={`${card?.space_id || index}-${tag?.tag_id || idx}`}
												style={[
													styles.tag,
													idx % 2 === 0 ? styles.tagPurple : styles.tagGreen,
												]}
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
	bellWrap: {
		borderWidth: 3,
		borderColor: "#111",
		borderRadius: 12,
		backgroundColor: "#feda03",
		paddingHorizontal: 8,
		paddingVertical: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	searchBar: {
		marginTop: 14,
		backgroundColor: "#ececec",
		borderWidth: 4,
		borderColor: "#111",
		borderRadius: 20,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 12,
		gap: 8,
	},
	searchInput: {
		flex: 1,
		fontSize: 18,
		color: "#111",
		paddingVertical: 10,
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
		flex: 1,
		minWidth: 280,
		maxWidth: 340,
		minHeight: 180,
		borderRadius: 0,
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
		flexShrink: 1,
	},
	cardDesc: {
		fontSize: 14,
		color: "#111",
		marginBottom: 8,
		minHeight: 56,
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
	},
	tagRowHorizontal: {
		flexWrap: "nowrap",
		paddingRight: 10,
		flexGrow: 1,
	},
	tagRowTrending: {
		minHeight: 40,
		alignItems: "center",
	},
	tagRowRecommended: {
		alignItems: "center",
		minHeight: 40,
		paddingBottom: 2,
	},
	tagScroll: { marginTop: 12, minHeight: 44, alignSelf: "stretch" },
	tag: {
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "#111",
		paddingHorizontal: 10,
		paddingVertical: 4,
		fontSize: 16,
		color: "#111",
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
		borderRadius: 0,
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
