import * as SecureStore from "expo-secure-store";
const BASE_URL = "http://192.168.1.14:5000/api";

export async function signup(username, email, password) {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Signup failed");
  }

  return data;
}

export async function profiledetails(){
    const token = await SecureStore.getItemAsync("jwt_token");
    
    const response = await fetch(`${BASE_URL}/profile/me`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${token}`
        }
    })

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile");
    }
    return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function verifyOTP(email, otp) {
  const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "OTP verification failed");
  }

  return data;
}

export async function createSpace(title, description, visibility, hashtags, authToken){
  const token = authToken || (await SecureStore.getItemAsync("jwt_token"));
  if (!token) {
    throw new Error("Missing auth token. Please sign in again.");
  }

  const response = await fetch(`${BASE_URL}/spaces`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${token}`
    },
    body:JSON.stringify({ title, description, visibility, hashtags })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to create Space");
  }

  return data;
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

  const response = await fetch(URL,{
    method:"GET",
    headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to load Spaces");
  }

  return data;
}
