import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Screen from "../components/Screen";
import {
	getNotifications,
	markAllNotificationsRead,
	markNotificationRead,
} from "../services/api";

export default function NotificationPage() {
	const router = useRouter();
	const [items, setItems] = useState([]);

	const load = async () => {
		try {
			const data = await getNotifications(undefined, 1, 50);
			const list = Array.isArray(data) ? data : data?.notifications || [];
			setItems(list);
		} catch (error) {
			Alert.alert(
				"Load failed",
				error?.message || "Unable to fetch notifications.",
			);
			setItems([]);
		}
	};

	useEffect(() => {
		load();
	}, []);

	return (
		<Screen>
			<View style={styles.top}>
				<TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
					<Ionicons name="arrow-back" size={20} color="#111" />
				</TouchableOpacity>
				<Text style={styles.title}>Notifications</Text>
				<TouchableOpacity
					style={styles.readAllBtn}
					onPress={async () => {
						try {
							await markAllNotificationsRead();
							setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
						} catch (error) {
							Alert.alert(
								"Update failed",
								error?.message || "Unable to mark all as read.",
							);
						}
					}}
				>
					<Text style={styles.readAllText}>Read all</Text>
				</TouchableOpacity>
			</View>

			<ScrollView
				contentContainerStyle={styles.listPad}
				showsVerticalScrollIndicator={false}
			>
				{items.map((item, index) => (
					<TouchableOpacity
						key={item?.notification_id || `${index}`}
						style={[
							styles.card,
							item?.is_read ? styles.readCard : styles.unreadCard,
						]}
						onPress={async () => {
							try {
								await markNotificationRead(item?.notification_id);
								setItems((prev) =>
									prev.map((n) =>
										n.notification_id === item.notification_id
											? { ...n, is_read: true }
											: n,
									),
								);
							} catch (error) {
								Alert.alert(
									"Update failed",
									error?.message || "Unable to mark as read.",
								);
							}
						}}
					>
						<Text style={styles.msg}>{item?.message || "Notification"}</Text>
					</TouchableOpacity>
				))}
				{items.length === 0 ? (
					<View style={styles.emptyWrap}>
						<Text style={styles.emptyText}>No notifications yet.</Text>
					</View>
				) : null}
			</ScrollView>
		</Screen>
	);
}

const styles = StyleSheet.create({
	top: {
		paddingTop: 40,
		paddingHorizontal: 16,
		paddingBottom: 10,
		backgroundColor: "#27a6fd",
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	backBtn: {
		backgroundColor: "#feda00",
		borderWidth: 2,
		borderColor: "#111",
		borderRadius: 8,
		padding: 6,
	},
	title: { fontSize: 28, fontWeight: "900", color: "#111" },
	readAllBtn: {
		marginLeft: "auto",
		backgroundColor: "#5dd76d",
		borderWidth: 2,
		borderColor: "#111",
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 6,
	},
	readAllText: { fontWeight: "900", color: "#111" },
	listPad: { padding: 12, gap: 10, paddingBottom: 24, flexGrow: 1 },
	card: { borderWidth: 3, borderColor: "#111", borderRadius: 14, padding: 12 },
	unreadCard: { backgroundColor: "#feda00" },
	readCard: { backgroundColor: "#e4e4e4" },
	msg: { color: "#111", fontWeight: "700" },
	emptyWrap: {
		flex: 1,
		minHeight: 220,
		alignItems: "center",
		justifyContent: "center",
	},
	emptyText: { fontSize: 16, color: "#333", fontWeight: "700" },
});
