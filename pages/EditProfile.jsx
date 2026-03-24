import * as ImagePicker from "expo-image-picker";
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
import { useAuth } from "../context/authContext";
import {
	deleteMyAccount,
	profiledetails,
	updateBio,
	updatePassword,
	updateProfilePicture,
	updateUsername,
} from "../services/api";

export default function EditProfile() {
	const router = useRouter();
	const { signOut } = useAuth();
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [pickedImage, setPickedImage] = useState(null);
	const [savingUsername, setSavingUsername] = useState(false);
	const [savingBio, setSavingBio] = useState(false);
	const [savingPassword, setSavingPassword] = useState(false);
	const [savingPicture, setSavingPicture] = useState(false);
	const [deletingAccount, setDeletingAccount] = useState(false);
	const [expanded, setExpanded] = useState("username");
	const [original, setOriginal] = useState({ username: "", bio: "" });

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			try {
				const profile = await profiledetails();
				if (!mounted) return;
				const nextUsername = profile?.username || "";
				const nextBio = profile?.bio || "";
				setUsername(nextUsername);
				setBio(nextBio);
				setOriginal({ username: nextUsername, bio: nextBio });
			} catch (error) {
				if (!mounted) return;
				Alert.alert("Load failed", error?.message || "Unable to load profile.");
			}
		};
		load();
		return () => {
			mounted = false;
		};
	}, []);

	const onSaveUsername = async () => {
		if (!username.trim()) {
			Alert.alert("Validation", "Username cannot be empty.");
			return;
		}
		try {
			setSavingUsername(true);
			await updateUsername(username);
			setOriginal((prev) => ({ ...prev, username: username.trim() }));
			Alert.alert("Saved", "Username updated.");
		} catch (error) {
			Alert.alert(
				"Save failed",
				error?.message || "Unable to update username.",
			);
		} finally {
			setSavingUsername(false);
		}
	};

	const onSaveBio = async () => {
		try {
			setSavingBio(true);
			await updateBio(bio);
			setOriginal((prev) => ({ ...prev, bio: bio.trim() }));
			Alert.alert("Saved", "Bio updated.");
		} catch (error) {
			Alert.alert("Save failed", error?.message || "Unable to update bio.");
		} finally {
			setSavingBio(false);
		}
	};

	const onChangePassword = async () => {
		if (!currentPassword || !newPassword) {
			Alert.alert("Validation", "Please fill current and new password.");
			return;
		}
		try {
			setSavingPassword(true);
			await updatePassword(currentPassword, newPassword);
			setCurrentPassword("");
			setNewPassword("");
			Alert.alert("Saved", "Password updated.");
		} catch (error) {
			Alert.alert(
				"Save failed",
				error?.message || "Unable to update password.",
			);
		} finally {
			setSavingPassword(false);
		}
	};

	const onPickImage = async () => {
		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!permission.granted) {
			Alert.alert(
				"Permission required",
				"Allow gallery access to update profile picture.",
			);
			return;
		}
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsMultipleSelection: false,
			quality: 0.9,
		});
		if (result.canceled || !result.assets?.length) return;
		setPickedImage(result.assets[0]);
	};

	const onSavePicture = async () => {
		if (!pickedImage?.uri) {
			Alert.alert("Validation", "Pick an image first.");
			return;
		}
		try {
			setSavingPicture(true);
			await updateProfilePicture(pickedImage);
			Alert.alert("Saved", "Profile picture updated.");
			setPickedImage(null);
		} catch (error) {
			Alert.alert(
				"Save failed",
				error?.message || "Unable to update profile picture.",
			);
		} finally {
			setSavingPicture(false);
		}
	};

	const onDeleteAccount = async () => {
		Alert.alert("Delete account", "This action is permanent. Continue?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					try {
						setDeletingAccount(true);
						await deleteMyAccount();
						await signOut();
						router.replace("/Login");
					} catch (error) {
						Alert.alert(
							"Delete failed",
							error?.message || "Unable to delete account.",
						);
					} finally {
						setDeletingAccount(false);
					}
				},
			},
		]);
	};

	const isExpanded = (key) => expanded === key;
	const toggle = (key) => setExpanded((prev) => (prev === key ? "" : key));

	const changedUsername = username.trim() !== original.username.trim();
	const changedBio = bio.trim() !== original.bio.trim();

	return (
		<Screen>
			<ScrollView
				contentContainerStyle={styles.page}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.card}>
					<Text style={styles.title}>Edit Profile</Text>
					<Text style={styles.subtitle}>
						Manage your account settings in one place
					</Text>

					<TouchableOpacity
						style={styles.sectionHeader}
						onPress={() => toggle("username")}
					>
						<Text style={styles.sectionTitle}>Change Username</Text>
						<Text style={styles.sectionArrow}>
							{isExpanded("username") ? "-" : "+"}
						</Text>
					</TouchableOpacity>
					{isExpanded("username") ? (
						<View style={styles.sectionBody}>
							<TextInput
								value={username}
								onChangeText={setUsername}
								style={styles.input}
								autoCapitalize="none"
								placeholder="Username"
								placeholderTextColor="#666"
							/>
							<TouchableOpacity
								style={[
									styles.saveButton,
									(!changedUsername || savingUsername) &&
										styles.saveButtonDisabled,
								]}
								onPress={onSaveUsername}
								disabled={!changedUsername || savingUsername}
							>
								<Text style={styles.saveButtonText}>
									{savingUsername ? "Saving..." : "Update Username"}
								</Text>
							</TouchableOpacity>
						</View>
					) : null}

					<TouchableOpacity
						style={styles.sectionHeader}
						onPress={() => toggle("bio")}
					>
						<Text style={styles.sectionTitle}>Change Bio</Text>
						<Text style={styles.sectionArrow}>
							{isExpanded("bio") ? "-" : "+"}
						</Text>
					</TouchableOpacity>
					{isExpanded("bio") ? (
						<View style={styles.sectionBody}>
							<TextInput
								value={bio}
								onChangeText={setBio}
								style={[styles.input, styles.bioInput]}
								multiline
								textAlignVertical="top"
								placeholder="Write something about yourself"
								placeholderTextColor="#666"
							/>
							<TouchableOpacity
								style={[
									styles.saveButton,
									(!changedBio || savingBio) && styles.saveButtonDisabled,
								]}
								onPress={onSaveBio}
								disabled={!changedBio || savingBio}
							>
								<Text style={styles.saveButtonText}>
									{savingBio ? "Saving..." : "Update Bio"}
								</Text>
							</TouchableOpacity>
						</View>
					) : null}

					<TouchableOpacity
						style={styles.sectionHeader}
						onPress={() => toggle("password")}
					>
						<Text style={styles.sectionTitle}>Change Password</Text>
						<Text style={styles.sectionArrow}>
							{isExpanded("password") ? "-" : "+"}
						</Text>
					</TouchableOpacity>
					{isExpanded("password") ? (
						<View style={styles.sectionBody}>
							<TextInput
								value={currentPassword}
								onChangeText={setCurrentPassword}
								style={styles.input}
								secureTextEntry
								placeholder="Current password"
								placeholderTextColor="#666"
							/>
							<TextInput
								value={newPassword}
								onChangeText={setNewPassword}
								style={styles.input}
								secureTextEntry
								placeholder="New password"
								placeholderTextColor="#666"
							/>
							<TouchableOpacity
								style={[
									styles.saveButton,
									savingPassword && styles.saveButtonDisabled,
								]}
								onPress={onChangePassword}
								disabled={savingPassword}
							>
								<Text style={styles.saveButtonText}>
									{savingPassword ? "Saving..." : "Update Password"}
								</Text>
							</TouchableOpacity>
						</View>
					) : null}

					<TouchableOpacity
						style={styles.sectionHeader}
						onPress={() => toggle("picture")}
					>
						<Text style={styles.sectionTitle}>Change Profile Picture</Text>
						<Text style={styles.sectionArrow}>
							{isExpanded("picture") ? "-" : "+"}
						</Text>
					</TouchableOpacity>
					{isExpanded("picture") ? (
						<View style={styles.sectionBody}>
							<TouchableOpacity
								style={styles.secondaryButton}
								onPress={onPickImage}
							>
								<Text style={styles.secondaryButtonText}>Choose Image</Text>
							</TouchableOpacity>
							<Text style={styles.helperText}>
								{pickedImage?.fileName ||
									(pickedImage?.uri ? "Image selected" : "No image selected")}
							</Text>
							<TouchableOpacity
								style={[
									styles.saveButton,
									(!pickedImage || savingPicture) && styles.saveButtonDisabled,
								]}
								onPress={onSavePicture}
								disabled={!pickedImage || savingPicture}
							>
								<Text style={styles.saveButtonText}>
									{savingPicture ? "Saving..." : "Update Picture"}
								</Text>
							</TouchableOpacity>
						</View>
					) : null}

					<TouchableOpacity
						style={styles.sectionHeader}
						onPress={() => toggle("delete")}
					>
						<Text style={[styles.sectionTitle, styles.dangerTitle]}>
							Delete Account
						</Text>
						<Text style={styles.sectionArrow}>
							{isExpanded("delete") ? "-" : "+"}
						</Text>
					</TouchableOpacity>
					{isExpanded("delete") ? (
						<View style={styles.sectionBody}>
							<Text style={styles.dangerText}>
								Deleting your account is permanent and cannot be undone.
							</Text>
							<TouchableOpacity
								style={[
									styles.deleteButton,
									deletingAccount && styles.saveButtonDisabled,
								]}
								onPress={onDeleteAccount}
								disabled={deletingAccount}
							>
								<Text style={styles.deleteButtonText}>
									{deletingAccount ? "Deleting..." : "Delete Account"}
								</Text>
							</TouchableOpacity>
						</View>
					) : null}

					<TouchableOpacity
						style={styles.backButton}
						onPress={() => router.replace("/(tabs)/profile")}
					>
						<Text style={styles.backButtonText}>Back To Profile</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</Screen>
	);
}

const styles = StyleSheet.create({
	page: {
		flexGrow: 1,
		backgroundColor: "#feda00",
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	card: {
		alignSelf: "stretch",
		maxWidth: 440,
		backgroundColor: "#fff",
		borderWidth: 4,
		borderColor: "#111",
		borderRadius: 20,
		padding: 16,
		alignItems: "stretch",
		gap: 10,
	},
	title: {
		fontSize: 28,
		fontWeight: "900",
		color: "#111",
	},
	subtitle: {
		fontSize: 14,
		color: "#333",
		marginBottom: 4,
	},
	sectionHeader: {
		borderWidth: 3,
		borderColor: "#111",
		backgroundColor: "#eaf6ff",
		borderRadius: 10,
		paddingHorizontal: 10,
		paddingVertical: 10,
		flexDirection: "row",
		alignItems: "center",
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "900",
		color: "#111",
	},
	sectionArrow: {
		marginLeft: "auto",
		fontSize: 22,
		fontWeight: "900",
		color: "#111",
		lineHeight: 22,
	},
	sectionBody: {
		borderWidth: 2,
		borderColor: "#111",
		borderRadius: 10,
		backgroundColor: "#fff",
		padding: 10,
		gap: 8,
	},
	input: {
		borderWidth: 3,
		borderColor: "#111",
		borderRadius: 10,
		backgroundColor: "#fff",
		paddingHorizontal: 10,
		paddingVertical: 8,
		color: "#111",
		fontSize: 16,
	},
	bioInput: {
		minHeight: 92,
	},
	saveButton: {
		backgroundColor: "#5dd76d",
		borderWidth: 3,
		borderColor: "#111",
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 10,
		alignItems: "center",
	},
	saveButtonDisabled: {
		opacity: 0.55,
	},
	saveButtonText: {
		color: "#111",
		fontWeight: "900",
		fontSize: 15,
	},
	secondaryButton: {
		backgroundColor: "#27a6fd",
		borderWidth: 3,
		borderColor: "#111",
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 10,
		alignItems: "center",
	},
	secondaryButtonText: {
		color: "#111",
		fontWeight: "900",
		fontSize: 15,
	},
	helperText: {
		color: "#333",
		fontSize: 13,
	},
	dangerTitle: {
		color: "#9c1028",
	},
	dangerText: {
		color: "#9c1028",
		fontSize: 13,
		fontWeight: "700",
	},
	deleteButton: {
		backgroundColor: "#ffb4be",
		borderWidth: 3,
		borderColor: "#9c1028",
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 10,
		alignItems: "center",
	},
	deleteButtonText: {
		color: "#9c1028",
		fontWeight: "900",
		fontSize: 15,
	},
	backButton: {
		marginTop: 6,
		backgroundColor: "#27a6fd",
		borderWidth: 3,
		borderColor: "#111",
		borderRadius: 12,
		paddingHorizontal: 14,
		paddingVertical: 10,
		alignItems: "center",
	},
	backButtonText: {
		color: "#111",
		fontWeight: "900",
		fontSize: 16,
	},
});
