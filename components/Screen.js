import { StyleSheet, View } from "react-native";

export default function Screen({ children, style }) {
	return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
