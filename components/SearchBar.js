import { useState } from "react";
import { TextInput, View } from "react-native";
export default function SearchBar() {
	const [query, setQuery] = useState("");
	return (
		<View>
			<TextInput
				value={query}
				onChangeText={setQuery}
				placeholder="Search..."
			></TextInput>
		</View>
	);
}
