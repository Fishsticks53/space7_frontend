import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Screen from "../components/Screen";
import { getMessages, joinSpace, sendMessage, spaceDetails } from "../services/api";
import {
  useFonts,
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";

export default function ChatPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const spaceId = params?.spaceId || params?.spaceid;
  const [draft, setDraft] = useState("");
  const [spaceInfo, setSpaceInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [autoJoinAttempted, setAutoJoinAttempted] = useState(false);
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  const sendmessage = async () => {
    const text = draft.trim();
    if (!text) {
      return;
    }

    try {
      const created = await sendMessage(spaceId, text);
      setMessages((prev) => [...prev,created]);
      setDraft("");
    }
    catch (error) {
      if (error?.status === 403 && !autoJoinAttempted) {
        setAutoJoinAttempted(true);
        try {
          await joinSpace(spaceId);
          const created = await sendMessage(spaceId, text);
          setMessages((prev) => [...prev, created]);
          setDraft("");
          return;
        } catch (joinOrRetryError) {
          setAutoJoinAttempted(false);
          Alert.alert("Send failed", joinOrRetryError?.message || "Something went wrong.");
          return;
        }
      }

      Alert.alert("Send failed", error?.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    setAutoJoinAttempted(false);

    const loadChatData = async () => {
      if (!spaceId) {
        return;
      }

      try {
        const [spaceData, messageData] = await Promise.all([
          spaceDetails(spaceId),
          getMessages(spaceId),
        ]);

        setSpaceInfo(spaceData || null);
        const list = Array.isArray(messageData)
          ? messageData
          : messageData?.messages || [];
        setMessages(list);
      } catch (error) {
        Alert.alert("Load failed", error?.message || "Something went wrong.");
        setSpaceInfo(null);
        setMessages([]);
      }
    };

    loadChatData();
  }, [spaceId]);

  if (!fontsLoaded) return null;

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <View style={styles.top}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.backButton}
            onPress={() => router.push("/(tabs)")}
          >
            <Ionicons name="arrow-back" size={28} color="#111" />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {spaceInfo?.title || "Chat"}
          </Text>
        </View>

        <View style={styles.topic}>
          <Text style={styles.topicText}>Conversation</Text>
        </View>

        <ScrollView
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message, index) => (
            <View key={message?.message_id || message?.id || String(index)} style={styles.messageRow}>
              <View style={styles.bubble}>
                <Text style={styles.senderName}>
                  @{message?.sender?.username || message?.name || "user"}
                </Text>
                <Text style={styles.messageText}>
                  {message?.content || message?.text || ""}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputWrap}>
          <TextInput
            placeholder="Type a message..."
            placeholderTextColor="#444"
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
          />
          <TouchableOpacity activeOpacity={0.7} style={styles.sendButton}
            onPress={sendmessage}
          >
            <Ionicons name="send" size={22} color="#111" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
  top: {
    backgroundColor: "#27a6fd",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    paddingBottom: 20,
    gap: 10,
    paddingTop:40,
  },
  backButton: {
    backgroundColor: "#feda00",
    borderWidth: 3,
    borderColor: "#111",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginRight:10,
  },
  title: {
    fontSize: 34,
    color: "#111",
    fontFamily: "Outfit_700Bold",
    flex: 1,
    flexShrink: 1,
    lineHeight: 38,
  },
  topic: {
    backgroundColor: "#feda00",
    borderWidth: 3,
    borderColor: "#111",
    paddingVertical: 12,
  },
  topicText: {
    fontSize: 28,
    color: "#111",
    marginLeft: 14,
    fontFamily: "Outfit_700Bold",
  },
  chatArea: {
    flex: 1,
    backgroundColor: "white",
  },
  chatContent: {
    padding: 14,
    gap: 10,
  },
  messageRow: {
    width: "100%",
    marginBottom: 8,
  },
  bubble: {
    width: "100%",
    borderWidth: 3,
    borderColor: "#111",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#dedede",
  },
  senderName: {
    fontSize: 13,
    color: "#111",
    fontFamily: "Outfit_600SemiBold",
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
    color: "#111",
    fontFamily: "Outfit_400Regular",
  },
  inputWrap: {
    backgroundColor: "#fc56aa",
    borderTopWidth: 3,
    borderColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#111",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Outfit_400Regular",
    color: "#111",
  },
  sendButton: {
    backgroundColor: "#feda00",
    borderWidth: 3,
    borderColor: "#111",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
