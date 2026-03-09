import { View, Text, TextInput } from "react-native";
import { react, useState } from "react";
export default function SearchBar() {
  const { query, setQuery } = useState("");
  return (
    <View>
      <TextInput
        value={query}
        onChange={setQuery}
        placeholder="Search..."
      ></TextInput>
    </View>
  );
}
