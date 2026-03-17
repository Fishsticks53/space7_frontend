import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { io } from "socket.io-client";
import { Image } from "expo-image";
import { VideoView, useVideoPlayer } from "expo-video";
import Screen from "../components/Screen";
import { deleteMessage, getMessages, joinSpace, likeMessage, sendMessage, spaceDetails } from "../services/api";
import { useAuth } from "../context/authContext";
import {
  useFonts,
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";

const DEFAULT_API_BASE =
  Platform.OS === "android" ? "http://10.0.2.2:5000/api" : "http://localhost:5000/api";
const API_BASE = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_BASE;
const SOCKET_URL = API_BASE.replace(/\/api\/?$/, "");

const getId = (message) => message?.message_id || message?.id;
const normalizeMessage = (payload) => {
  if (!payload || typeof payload !== "object") return payload;
  if (payload?.message_id || payload?.id) return payload;
  if (payload?.message && (payload.message?.message_id || payload.message?.id)) return payload.message;
  if (payload?.data && (payload.data?.message_id || payload.data?.id)) return payload.data;
  return payload;
};
const getMessageSignature = (message) =>
  [
    getId(message) || "",
    message?.sender_id || message?.sender?.user_id || message?.sender?.id || "",
    message?.content || message?.text || "",
    message?.created_at || "",
  ].join("|");

const isMembershipError = (error) => {
  const status = error?.status;
  const message = String(error?.message || "").toLowerCase();
  return (
    status === 401 ||
    status === 403 ||
    message.includes("not part") ||
    message.includes("not member") ||
    message.includes("join") ||
    message.includes("participant")
  );
};

const shouldJoinBeforeSend = (spaceInfo) => {
  if (!spaceInfo || typeof spaceInfo !== "object") return false;
  if (spaceInfo?.is_member === false) return true;
  if (spaceInfo?.is_participant === false) return true;
  if (spaceInfo?.is_joined === false) return true;
  if (spaceInfo?.joined === false) return true;
  if (spaceInfo?.membership_status === "not_member") return true;
  if (spaceInfo?.membership?.is_member === false) return true;
  return false;
};

function InlinePlayer({ uri, isAudio = false }) {
  const player = useVideoPlayer(uri, (instance) => {
    instance.loop = false;
  });

  return (
    <View style={isAudio ? styles.audioWrap : styles.videoWrap}>
      <VideoView
        player={player}
        style={isAudio ? styles.audioPlayer : styles.videoPlayer}
        nativeControls
      />
    </View>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const spaceId = params?.spaceId || params?.spaceid;
  const [draft, setDraft] = useState("");
  const [spaceInfo, setSpaceInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [pickedMedia, setPickedMedia] = useState(null);
  const [expandedImageUri, setExpandedImageUri] = useState(null);
  const scrollRef = useRef(null);
  const socketRef = useRef(null);
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  const normalizeMessages = (messageData) => {
    const list = Array.isArray(messageData) ? messageData : messageData?.messages || [];
    const chronological = [...list].reverse();
    const seen = new Set();
    return chronological.filter((message) => {
      const id = getId(message);
      if (!id) return true;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!spaceId) return;
      try {
        const [spaceData, messageData] = await Promise.all([
          spaceDetails(spaceId),
          getMessages(spaceId),
        ]);
        if (!mounted) return;
        setSpaceInfo(spaceData || null);
        setMessages(normalizeMessages(messageData));
      } catch (error) {
        if (!mounted) return;
        Alert.alert("Load failed", error?.message || "Something went wrong.");
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [spaceId]);

  useEffect(() => {
    let mounted = true;
    const setupSocket = async () => {
      if (!spaceId) return;
      const token = await SecureStore.getItemAsync("jwt_token");
      if (!token || !mounted) return;

      const socket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        auth: { token },
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("join_space", spaceId);
      });

      socket.on("receive_message", (incoming) => {
        const normalizedIncoming = normalizeMessage(incoming);
        setMessages((prev) => {
          const incomingId = getId(normalizedIncoming);
          if (incomingId && prev.some((m) => getId(m) === incomingId)) return prev;
          const incomingSignature = getMessageSignature(normalizedIncoming);
          if (!incomingId && prev.some((m) => getMessageSignature(m) === incomingSignature)) {
            return prev;
          }
          return [...prev, normalizedIncoming];
        });
      });

      socket.on("message_deleted", (payload) => {
        const deletedId = payload?.message_id || payload?.id;
        if (!deletedId) return;
        setMessages((prev) => prev.filter((msg) => getId(msg) !== deletedId));
      });

      socket.on("message_liked", (payload) => {
        const likedId = payload?.message_id || payload?.id;
        if (!likedId) return;
        setMessages((prev) =>
          prev.map((msg) => (getId(msg) === likedId ? { ...msg, ...payload } : msg))
        );
      });

      socket.on("connect_error", () => {
        // Keep UI usable while backend websocket is unavailable.
      });
    };

    setupSocket();
    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.emit("leave_space", spaceId);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [spaceId]);

  const onPickMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Allow media library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.images, ImagePicker.MediaType.videos],
      allowsMultipleSelection: false,
      quality: 0.9,
    });

    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];
    const mediaType = asset.type === "video" ? "video" : "image";

    setPickedMedia({
      uri: asset.uri,
      fileName: asset.fileName || `media-${Date.now()}`,
      mimeType: asset.mimeType || (mediaType === "video" ? "video/mp4" : "image/jpeg"),
      mediaType,
    });
  };

  const onSend = async () => {
    const text = draft.trim();
    if (!text && !pickedMedia) return;

    try {
      if (shouldJoinBeforeSend(spaceInfo)) {
        await joinSpace(spaceId);
      }

      const created = normalizeMessage(await sendMessage(spaceId, text, undefined, pickedMedia));
      setMessages((prev) => {
        const createdId = getId(created);
        if (createdId && prev.some((m) => getId(m) === createdId)) return prev;
        return [...prev, created];
      });
      setDraft("");
      setPickedMedia(null);
    } catch (error) {
      if (isMembershipError(error)) {
        try {
          await joinSpace(spaceId);
          const created = normalizeMessage(await sendMessage(spaceId, text, undefined, pickedMedia));
          setMessages((prev) => {
            const createdId = getId(created);
            if (createdId && prev.some((m) => getId(m) === createdId)) return prev;
            return [...prev, created];
          });
          setDraft("");
          setPickedMedia(null);
          return;
        } catch (retryError) {
          Alert.alert("Send failed", retryError?.message || "Something went wrong.");
          return;
        }
      }
      Alert.alert("Send failed", error?.message || "Something went wrong.");
    }
  };

  const currentUserId = user?.id || user?.user_id;
  const isOwnMessage = (message) => {
    const senderId = message?.sender?.id || message?.sender?.user_id || message?.sender_id;
    return !!currentUserId && String(senderId) === String(currentUserId);
  };

  const getLikeCount = (message) =>
    message?.appreciation_count ??
    message?.like_count ??
    message?.likes_count ??
    (Array.isArray(message?.likes) ? message.likes.length : 0);

  const onDeleteMessage = async (message) => {
    const messageId = getId(message);
    if (!messageId) return;
    try {
      await deleteMessage(spaceId, messageId);
      setMessages((prev) => prev.filter((msg) => getId(msg) !== messageId));
      if (socketRef.current) {
        socketRef.current.emit("delete_message", { spaceId, messageId });
      }
    } catch (error) {
      Alert.alert("Delete failed", error?.message || "Unable to delete message.");
    }
  };

  const onLikeMessage = async (message) => {
    const messageId = getId(message);
    if (!messageId) return;
    try {
      const updated = await likeMessage(spaceId, messageId);
      setMessages((prev) =>
        prev.map((msg) => {
          if (getId(msg) !== messageId) return msg;
          if (typeof updated?.appreciated === "boolean") {
            const nextCount = Math.max(
              0,
              getLikeCount(msg) + (updated.appreciated ? 1 : -1)
            );
            return { ...msg, ...updated, appreciation_count: nextCount };
          }
          return { ...msg, ...updated };
        })
      );
      if (socketRef.current) {
        socketRef.current.emit("like_message", { spaceId, messageId });
      }
    } catch (error) {
      Alert.alert("Like failed", error?.message || "Unable to like message.");
    }
  };

  if (!fontsLoaded) {
    return (
      <Screen>
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>Loading chat...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.top}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/(tabs)")}>
          <Ionicons name="arrow-back" size={28} color="#111" />
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {spaceInfo?.title || "Chat"}
          </Text>
        </View>
      </View>

      <View style={styles.topic}>
        <Text style={styles.topicText}>Conversation</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message, index) => (
          <View key={`${getId(message) || "msg"}-${index}`} style={styles.messageRow}>
            <View style={styles.bubble}>
              <Text style={styles.senderName}>@{message?.sender?.username || "user"}</Text>

              {message?.media_url && message?.media_type === "image" ? (
                <View style={styles.imageWrap}>
                  <TouchableOpacity onPress={() => setExpandedImageUri(message.media_url)}>
                    <Image source={{ uri: message.media_url }} style={styles.mediaImage} contentFit="cover" />
                  </TouchableOpacity>
                  {(message?.content || message?.text) ? (
                    <Text style={styles.captionText}>{message?.content || message?.text}</Text>
                  ) : null}
                </View>
              ) : (
                <Text style={styles.messageText}>{message?.content || message?.text || ""}</Text>
              )}

              {message?.media_url && message?.media_type === "video" ? (
                <InlinePlayer uri={message.media_url} />
              ) : null}
              {message?.media_url && message?.media_type === "audio" ? (
                <InlinePlayer uri={message.media_url} isAudio />
              ) : null}

              <View style={styles.messageActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => onLikeMessage(message)}>
                  <Ionicons name="heart-outline" size={16} color="#111" />
                  <Text style={styles.actionText}>{getLikeCount(message)}</Text>
                </TouchableOpacity>
                {isOwnMessage(message) ? (
                  <TouchableOpacity style={styles.actionButton} onPress={() => onDeleteMessage(message)}>
                    <Ionicons name="trash-outline" size={16} color="#9c1028" />
                    <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {pickedMedia ? (
        <View style={styles.previewWrap}>
          <Text style={styles.previewTitle}>Attachment ready</Text>
          {pickedMedia.mediaType === "image" ? (
            <Image source={{ uri: pickedMedia.uri }} style={styles.previewImage} contentFit="cover" />
          ) : (
            <Text style={styles.previewText}>{pickedMedia.fileName}</Text>
          )}
          <TouchableOpacity onPress={() => setPickedMedia(null)}>
            <Text style={styles.previewRemove}>Remove</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.inputWrap}>
        <TouchableOpacity style={styles.attachButton} onPress={onPickMedia}>
          <Feather name="paperclip" size={20} color="#111" />
        </TouchableOpacity>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#444"
        />
        <TouchableOpacity style={styles.sendButton} onPress={onSend}>
          <Ionicons name="send" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      <Modal visible={!!expandedImageUri} transparent animationType="fade" onRequestClose={() => setExpandedImageUri(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setExpandedImageUri(null)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            {expandedImageUri ? (
              <Image source={{ uri: expandedImageUri }} style={styles.expandedImage} contentFit="contain" />
            ) : null}
            <TouchableOpacity style={styles.closeButtonModal} onPress={() => setExpandedImageUri(null)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  loadingText: { fontSize: 18, color: "#111", fontWeight: "700" },
  top: { backgroundColor: "#27a6fd", flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingBottom: 10, gap: 10, paddingTop: 34, borderBottomWidth: 3, borderColor: "#111", minHeight: 92 },
  backButton: { backgroundColor: "#feda00", borderWidth: 3, borderColor: "#111", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 8, marginRight: 10 },
  titleWrap: { flex: 1, justifyContent: "center", paddingRight: 6 },
  titleLabel: { fontSize: 12, color: "#111", fontFamily: "Outfit_600SemiBold", opacity: 0.85, marginBottom: 2 },
  title: { fontSize: 22, lineHeight: 26, color: "#111", fontFamily: "Outfit_700Bold", flexShrink: 1, paddingRight: 8 },
  topic: { backgroundColor: "#feda00", borderWidth: 3, borderTopWidth: 0, borderColor: "#111", paddingVertical: 12 },
  topicText: { fontSize: 28, color: "#111", marginLeft: 14, fontFamily: "Outfit_700Bold" },
  chatArea: { flex: 1, backgroundColor: "white" },
  chatContent: { padding: 14, gap: 10 },
  messageRow: { width: "100%", marginBottom: 8, alignItems: "flex-start" },
  bubble: { maxWidth: "90%", borderWidth: 3, borderColor: "#111", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#dedede" },
  senderName: { fontSize: 13, color: "#111", fontFamily: "Outfit_600SemiBold", marginBottom: 2 },
  messageText: { fontSize: 16, lineHeight: 22, color: "#111", fontFamily: "Outfit_400Regular", flexWrap: "wrap", flexShrink: 1 },
  messageActions: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 12 },
  actionButton: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 2 },
  actionText: { fontSize: 13, color: "#111", fontFamily: "Outfit_600SemiBold" },
  deleteText: { color: "#9c1028" },
  imageWrap: { width: 270, alignSelf: "flex-start" },
  mediaImage: { width: 270, height: 210, borderRadius: 12, marginTop: 6, borderWidth: 2, borderColor: "#111" },
  captionText: { marginTop: 8, fontSize: 15, lineHeight: 20, color: "#111", fontFamily: "Outfit_400Regular", flexWrap: "wrap", flexShrink: 1 },
  videoWrap: { marginTop: 8, width: 270, borderWidth: 2, borderColor: "#111", borderRadius: 12, overflow: "hidden", backgroundColor: "#000" },
  videoPlayer: { width: "100%", height: 220 },
  audioWrap: { marginTop: 8, width: 270, borderWidth: 2, borderColor: "#111", borderRadius: 12, overflow: "hidden", backgroundColor: "#fff" },
  audioPlayer: { width: "100%", height: 64 },
  previewWrap: { backgroundColor: "#fff9d6", borderTopWidth: 2, borderColor: "#111", paddingHorizontal: 12, paddingVertical: 8, gap: 6 },
  previewTitle: { fontSize: 13, color: "#333", fontFamily: "Outfit_600SemiBold" },
  previewImage: { width: 120, height: 80, borderRadius: 8, borderWidth: 2, borderColor: "#111" },
  previewText: { fontSize: 13, color: "#111", fontFamily: "Outfit_400Regular" },
  previewRemove: { fontSize: 13, color: "#9c1028", fontFamily: "Outfit_700Bold" },
  inputWrap: { backgroundColor: "#fc56aa", borderTopWidth: 3, borderColor: "#111", flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10, gap: 10 },
  attachButton: { backgroundColor: "#feda00", borderWidth: 3, borderColor: "#111", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 10, justifyContent: "center", alignItems: "center" },
  input: { flex: 1, backgroundColor: "#fff", borderWidth: 3, borderColor: "#111", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, fontFamily: "Outfit_400Regular", color: "#111" },
  sendButton: { backgroundColor: "#feda00", borderWidth: 3, borderColor: "#111", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, justifyContent: "center", alignItems: "center" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "center", alignItems: "center", padding: 16 },
  modalContent: { width: "100%", maxWidth: 420, backgroundColor: "#111", borderRadius: 12, borderWidth: 2, borderColor: "#fff", padding: 10, alignItems: "center", gap: 10 },
  expandedImage: { width: "100%", height: 420, borderRadius: 10, backgroundColor: "#000" },
  closeButtonModal: { borderWidth: 2, borderColor: "#111", borderRadius: 8, backgroundColor: "#feda00", paddingHorizontal: 12, paddingVertical: 6 },
  closeButtonText: { color: "#111", fontFamily: "Outfit_700Bold" },
});
