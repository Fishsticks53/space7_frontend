import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth } from "../../context/authContext";

export default function TabsLayout() {
	const router = useRouter();
	const { loading, isAuthenticated } = useAuth();

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.replace("/Login");
		}
	}, [isAuthenticated, loading, router]);

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: styles.tab,
				tabBarShowLabel: true,
				tabBarActiveTintColor: "#111",
				tabBarInactiveTintColor: "#5f5f5f",
				tabBarHideOnKeyboard: true,
				tabBarItemStyle: styles.tabItem,
				tabBarLabelStyle: styles.tabLabel,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, focused }) => (
						<View style={styles.iconWrap}>
							<Ionicons
								name={focused ? "home" : "home-outline"}
								size={26}
								color={color}
							/>
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="new-space"
				listeners={{
					tabPress: (e) => {
						e.preventDefault();
						router.push("/NewSpace");
					},
				}}
				options={{
					title: "New Space",
					tabBarIcon: ({ color, focused }) => (
						<View style={styles.iconWrap}>
							<Ionicons
								name={focused ? "add-circle" : "add-circle-outline"}
								size={26}
								color={color}
							/>
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="discussion"
				listeners={{
					tabPress: (e) => {
						e.preventDefault();
						router.push("/Discussion");
					},
				}}
				options={{
					title: "Discussion",
					tabBarIcon: ({ color, focused }) => (
						<View style={styles.iconWrap}>
							<Ionicons
								name={focused ? "chatbubbles" : "chatbubbles-outline"}
								size={26}
								color={color}
							/>
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, focused }) => (
						<View style={styles.iconWrap}>
							<Ionicons
								name={focused ? "person-circle" : "person-circle-outline"}
								size={26}
								color={color}
							/>
						</View>
					),
				}}
			/>
		</Tabs>
	);
}

const styles = StyleSheet.create({
	tab: {
		position: "absolute",
		bottom: 16,
		height: 72,
		width: "92%",
		backgroundColor: "#f5f5f5",
		borderWidth: 3,
		borderTopWidth: 3,
		borderTopColor: "#111",
		borderColor: "#111",
		borderRadius: 24,
		paddingHorizontal: 10,
		paddingTop: 10,
		paddingBottom: 10,
		alignSelf: "center",
		marginHorizontal: 14,
		shadowColor: "#000",
		shadowOpacity: 0.18,
		shadowOffset: { width: 0, height: 8 },
		shadowRadius: 12,
		elevation: 10,
		zIndex: 100,
		overflow: "visible",
	},
	tabItem: {
		marginHorizontal: 2,
	},
	tabLabel: {
		fontSize: 11,
		marginBottom: 4,
		fontWeight: "700",
	},
	iconWrap: {
		width: 44,
		height: 32,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "transparent",
	},
});
