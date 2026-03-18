import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Screen from "../components/Screen";
import { useAuth } from "../context/authContext";

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

	const loadProfile = useCallback(
		async (isActiveRef) => {
			try {
				const [profileData, spacesData] = await Promise.all([
					profileDetails(),
					mySpaces(""),
				]);
				if (!isActiveRef.current) return;
				setUser(profileData || {});
				setSpaces(
					Array.isArray(spacesData) ? spacesData : spacesData?.spaces || [],
				);
			} catch (error) {
				if (!isActiveRef.current) return;
				setUser({});
				setSpaces([]);
			}
		},
		[mySpaces, profileDetails],
	);

	useFocusEffect(
		useCallback(() => {
			const isActiveRef = { current: true };
			loadProfile(isActiveRef);
			return () => {
				isActiveRef.current = false;
			};
		}, [loadProfile]),
	);

	const currentUserId = user?.user_id || user?.id;
	const isCreatedByMe = (space) => {
		const creatorId =
			space?.creator_id || space?.creator?.user_id || space?.creator?.id;
		return !!currentUserId && String(creatorId) === String(currentUserId);
	};

	const createdSpacesCount = spaces.filter(isCreatedByMe).length;
	const participatedSpacesCount = spaces.filter(
		(space) => !isCreatedByMe(space),
	).length;
	const createdSpaces = spaces.filter(isCreatedByMe);

	const createdParticipants = spaces
		.filter(isCreatedByMe)
		.reduce((sum, space) => {
			const count =
				space?.participant_count ??
				space?.member_count ??
				space?.members_count ??
				(Array.isArray(space?.members) ? space.members.length : 0);
			return sum + (Number(count) || 0);
		}, 0);

	const participatedParticipants = spaces
		.filter((space) => !isCreatedByMe(space))
		.reduce((sum, space) => {
			const count =
				space?.participant_count ??
				space?.member_count ??
				space?.members_count ??
				(Array.isArray(space?.members) ? space.members.length : 0);
			return sum + (Number(count) || 0);
		}, 0);

	const resolvedBio = String(user?.bio ?? user?.description ?? "").trim();
	const resolvedProfilePicture = String(
		user?.profile_picture ||
			user?.profilePicture ||
			user?.avatar_url ||
			user?.avatar ||
			"",
	).trim();
	const userInitial = String(user?.username || "U").trim().charAt(0).toUpperCase();

	const details = {
		username: user?.username || "User",
		description: resolvedBio || "No bio added yet.",
		createdSpaces: createdSpacesCount,
		participatedSpaces: participatedSpacesCount,
		activeUsersSpace: createdParticipants,
		activeUserSpace2: participatedParticipants,
	};

	return (
		<Screen>
			<ScrollView
				contentContainerStyle={styles.pageContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.topbar}>
					<View style={styles.icons}>
						<TouchableOpacity onPress={() => router.push("/(tabs)")}>
							<Feather name="arrow-left" size={30} color="black" />
						</TouchableOpacity>
						<Text style={styles.userName}>@ {details.username}</Text>
						<TouchableOpacity
							style={styles.logoutButton}
							onPress={handleLogout}
						>
							<Text style={styles.logoutButtonText}>Logout</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.bottom}>
					<View style={styles.profileWrap}>
						<View style={styles.profileImage}>
							{resolvedProfilePicture ? (
								<Image
									source={{ uri: resolvedProfilePicture }}
									style={styles.profileImageAsset}
									contentFit="cover"
								/>
							) : (
								<Text style={styles.profileImageFallback}>{userInitial}</Text>
							)}
						</View>
					</View>

					<View style={styles.userMetaWrap}>
						<Text style={styles.userTag}>@{details.username}</Text>
						<View style={styles.description}>
							<Text style={styles.descriptionText} numberOfLines={2}>
								{details.description}
							</Text>
						</View>
						<TouchableOpacity
							style={styles.editProfileButton}
							onPress={() => router.push("/edit-profile")}
						>
							<Text style={styles.editProfileButtonText}>Edit Profile</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.statsWrap}>
						<View style={styles.spaceIcon}>
							<Text style={styles.bigText}>{details.createdSpaces}</Text>
							<Text style={styles.mediumText}>Created</Text>
							<View style={styles.separatorLine} />
							<View style={styles.statRow}>
								<View style={styles.statInner}>
									<MaterialCommunityIcons
										name="face-man-profile"
										size={24}
										color="black"
									/>
									<Text>{details.username}</Text>
								</View>
								<View style={styles.statInner}>
									<Feather name="user" size={24} color="black" />
									<Text>{details.activeUsersSpace}</Text>
								</View>
							</View>
						</View>

						<View style={styles.spaceIcon2}>
							<Text style={styles.bigText}>{details.participatedSpaces}</Text>
							<Text style={styles.mediumText}>Participated</Text>
							<View style={styles.separatorLine} />
							<View style={styles.statRow}>
								<View style={styles.statInner}>
									<MaterialCommunityIcons
										name="face-man-profile"
										size={24}
										color="black"
									/>
									<Text>
										{details.participatedSpaces === 0
											? "No spaces"
											: details.username}
									</Text>
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
						{createdSpaces.map((space, index) => {
							const participantCount =
								space?.participant_count ??
								space?.member_count ??
								space?.members_count ??
								(Array.isArray(space?.members) ? space.members.length : 0);

							const tags = Array.isArray(space?.tags) ? space.tags : [];
							const creator = space?.creator?.username || details.username;

							return (
								<TouchableOpacity
									key={
										space?.space_id || space?.id || `${space?.title}-${index}`
									}
									activeOpacity={0.7}
									onPress={() => {
										const id = space?.space_id || space?.id;
										if (!id) return;
										router.push({ pathname: "/chat", params: { spaceId: id } });
									}}
								>
									<View
										style={[
											styles.spaceCard,
											{ backgroundColor: colors[index % colors.length] },
										]}
									>
										<Text style={styles.spaceTitle} numberOfLines={1}>
											{space?.title || "Untitled Space"}
										</Text>

										<Text
											style={styles.spaceDescriptionText}
											numberOfLines={3}
											ellipsizeMode="tail"
										>
											{space?.description || "No description available."}
										</Text>

										<View style={styles.spaceMetaRow}>
											<MaterialCommunityIcons
												name="face-man-profile"
												size={24}
												color="black"
											/>
											<Text style={styles.spaceMetaText}>By @{creator}</Text>
											<View style={styles.spaceCountRow}>
												<Feather name="user" size={20} color="black" />
												<Text style={styles.spaceCountText}>
													{participantCount}
												</Text>
											</View>
										</View>

										<ScrollView
											horizontal
											nestedScrollEnabled
											directionalLockEnabled
											scrollEnabled={tags.length > 1}
											showsHorizontalScrollIndicator={false}
											style={styles.spaceTagScroll}
											contentContainerStyle={[
												styles.spaceTagsRow,
												styles.spaceTagsRowHorizontal,
											]}
											onStartShouldSetResponder={() => true}
										>
											{tags.map((tag, tagIndex) => {
												const cardColorIndex = index % colors.length;
												const availableColors = colors.filter(
													(_, i) => i !== cardColorIndex,
												);
												const tagColor =
													availableColors[tagIndex % availableColors.length];
												return (
													<View
														key={`${space?.space_id || index}-${tag?.tag_id || tagIndex}`}
														style={[
															styles.spaceTag,
															{ backgroundColor: tagColor },
														]}
													>
														<Text>
															#{String(tag?.tag_name || "").replace(/^#/, "")}
														</Text>
													</View>
												);
											})}
										</ScrollView>
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
		paddingBottom: 90,
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
		alignSelf: "stretch",
		marginTop: -26,
		borderRadius: 21,
		backgroundColor: "white",
		paddingTop: 6,
		paddingBottom: 18,
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
		overflow: "hidden",
		alignItems: "center",
		justifyContent: "center",
	},
	profileImageAsset: {
		width: "100%",
		height: "100%",
	},
	profileImageFallback: {
		fontSize: 42,
		fontWeight: "900",
		color: "#111",
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
		backgroundColor: "#5dd76d",
		borderColor: "black",
		borderWidth: 3,
		padding: 7,
		marginTop: 10,
		borderRadius: 15,
		alignSelf: "stretch",
		marginHorizontal: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	descriptionText: {
		fontSize: 14,
		fontWeight: "700",
		color: "#111",
		textAlign: "center",
	},
	editProfileButton: {
		marginTop: 10,
		backgroundColor: "#27a6fd",
		borderWidth: 3,
		borderColor: "#111",
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
	editProfileButtonText: {
		color: "#111",
		fontSize: 14,
		fontWeight: "900",
	},
	statsWrap: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 10,
		marginTop: 10,
		paddingHorizontal: 10,
	},
	spaceIcon: {
		backgroundColor: "#27a6fd",
		padding: 12,
		borderRadius: 15,
		borderWidth: 3,
		borderColor: "black",
		flex: 1,
		maxWidth: 190,
	},
	spaceIcon2: {
		backgroundColor: "#feda00",
		padding: 12,
		borderRadius: 15,
		borderWidth: 3,
		borderColor: "black",
		flex: 1,
		maxWidth: 190,
	},
	bigText: {
		fontSize: 32,
		fontWeight: "bold",
	},
	mediumText: {
		fontSize: 16,
		fontWeight: "bold",
	},
	separatorLine: {
		marginTop: 8,
		marginBottom: 8,
		borderBottomWidth: 2,
		borderBottomColor: "#111",
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
		borderWidth: 4,
		borderColor: "black",
		borderRadius: 0,
		paddingHorizontal: 16,
		paddingVertical: 16,
		minHeight: 180,
		marginLeft: 8,
		marginRight: 8,
		marginBottom: 15,
	},
	spaceCardTopRow: {
		display: "none",
	},
	spaceTitle: {
		fontSize: 22,
		fontWeight: "900",
		color: "#111",
		marginBottom: 8,
	},
	spaceCountRow: {
		marginLeft: "auto",
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
		borderBottomWidth: 2,
		borderBottomColor: "#111",
		paddingBottom: 4,
	},
	spaceCountText: {
		fontSize: 16,
		fontWeight: "900",
		color: "#111",
	},
	spaceDescriptionText: {
		fontSize: 16,
		marginTop: 4,
		marginBottom: 10,
		color: "#111",
	},
	spaceMetaRow: {
		marginTop: 2,
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	spaceMetaLeft: {
		display: "none",
	},
	spaceOwnerRow: {
		display: "none",
	},
	spaceMetaText: {
		fontSize: 14,
		color: "#111",
	},
	spaceTagsRow: {
		marginTop: 8,
		flexDirection: "row",
		gap: 6,
	},
	spaceTagsRowHorizontal: {
		flexWrap: "nowrap",
		alignItems: "center",
		minHeight: 40,
		paddingRight: 10,
	},
	spaceTagScroll: { minHeight: 44, alignSelf: "stretch" },
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
