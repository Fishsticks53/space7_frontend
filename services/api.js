import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const DEFAULT_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:5000/api" : "http://localhost:5000/api";
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data;
}

async function request(path, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, options);
    return await parseResponse(response);
  } catch (error) {
    if (error?.message?.toLowerCase().includes("network request failed")) {
      throw new Error(
        `Cannot reach backend at ${BASE_URL}. Set EXPO_PUBLIC_API_BASE_URL to your running API URL.`
      );
    }
    throw error;
  }
}

export async function signup(username, email, password) {
  return request("/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });
}

export async function profiledetails(authToken){
  const token = authToken || (await SecureStore.getItemAsync("jwt_token"));
  if (!token) {
    throw new Error("Missing auth token. Please sign in again.");
  }

  return request("/profile/me",{
    method:"GET",
    headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${token}`
    }
  });
}

export async function loginUser(email, password) {
  return request("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

export async function verifyOTP(email, otp) {
  return request("/auth/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });
}

export async function createSpace(title, description, visibility, hashtags, authToken){
  const token = authToken || (await SecureStore.getItemAsync("jwt_token"));
  if (!token) {
    throw new Error("Missing auth token. Please sign in again.");
  }

  return request("/spaces",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${token}`
    },
    body:JSON.stringify({ title, description, visibility, hashtags })
  });
}

export async function myspaces(authToken, visibility = ""){
  let URL;
  const token = authToken || (await SecureStore.getItemAsync("jwt_token"));
  if (!token) {
    throw new Error("Missing auth token. Please sign in again.");
  }

  const normalizedVisibility = (visibility || "").toLowerCase().trim();
  if(normalizedVisibility==="public" || normalizedVisibility==="private"){
    URL=`${BASE_URL}/spaces/my?visibility=${normalizedVisibility}`;
  } else {
    URL = `${BASE_URL}/spaces/my`;
  }

  return request(URL.replace(BASE_URL, ""),{
    method:"GET",
    headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${token}`
    }
  });
}

export async function trendingSpaces(limit = 10) {
  return request(`/spaces/trending?limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function searchSpaces(query, limit = 20) {
  const q = encodeURIComponent(query || "");
  return request(`/spaces/search?q=${q}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function recommendedSpaces(authToken, limit = 10) {
  const token = authToken || (await SecureStore.getItemAsync("jwt_token"));
  if (!token) {
    throw new Error("Missing auth token. Please sign in again.");
  }

  return request(`/spaces/recommended?limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
}

export async function getNotifications(authToken, page = 1, limit = 30) {
  const token = authToken || (await SecureStore.getItemAsync("jwt_token"));
  if (!token) {
    throw new Error("Missing auth token. Please sign in again.");
  }

  return request(`/notifications?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
}

export async function markNotificationRead(notificationId, authToken) {
  if (!notificationId) {
    throw new Error("Missing notification id.");
  }

  const token = authToken || (await SecureStore.getItemAsync("jwt_token"));
  if (!token) {
    throw new Error("Missing auth token. Please sign in again.");
  }

  return request(`/notifications/${notificationId}/read`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
}

export async function markAllNotificationsRead(authToken) {
  const token = authToken || (await SecureStore.getItemAsync("jwt_token"));
  if (!token) {
    throw new Error("Missing auth token. Please sign in again.");
  }

  return request("/notifications/read-all", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
}

export async function spaceDetails(spaceId, authToken) {
  if (!spaceId) {
    throw new Error("Missing space id.");
  }

  const token = authToken || (await SecureStore.getItemAsync("jwt_token"));
  if (!token) {
    throw new Error("Missing auth token. Please sign in again.");
  }

  return request(`/spaces/${spaceId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
}

export async function getMessages(spaceId, authToken) {
  if (!spaceId) {
    throw new Error("Missing space id.");
  }

  const token = authToken || (await SecureStore.getItemAsync("jwt_token"));
  if (!token) {
    throw new Error("Missing auth token. Please sign in again.");
  }

  return request(`/messages/${spaceId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
}

export async function sendMessage(spaceId, content, authToken, media) {
  if (!spaceId) {
    throw new Error("No spaceId provided");
  }
  const hasText = !!content?.trim();
  const hasMedia = !!media?.uri;
  if (!hasText && !hasMedia) {
    throw new Error("Message cannot be empty.");
  }

  const token = authToken || (await SecureStore.getItemAsync("jwt_token"));
  if (!token) {
    throw new Error("Missing auth token. Please sign in again.");
  }

  if (hasMedia) {
    const formData = new FormData();
    if (hasText) {
      formData.append("content", content.trim());
    }
    if (media.mediaType) {
      formData.append("media_type", media.mediaType);
    }

    formData.append("media", {
      uri: media.uri,
      name: media.fileName || `upload-${Date.now()}`,
      type: media.mimeType || "application/octet-stream",
    });

    return request(`/messages/${spaceId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });
  }

  return request(`/messages/${spaceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ content: content.trim() }),
  });
}

export async function joinSpace(spaceId, inviteCode, authToken) {
  if (!spaceId) {
    throw new Error("Missing space id.");
  }

  const token = authToken || (await SecureStore.getItemAsync("jwt_token"));
  if (!token) {
    throw new Error("Missing auth token. Please sign in again.");
  }

  const payload = inviteCode ? { invite_code: inviteCode } : {};

  return request(`/spaces/${spaceId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

// Backward-compatible alias in case older imports still use the typo.
export const sendMessge = sendMessage;
