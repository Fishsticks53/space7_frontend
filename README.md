# Space7 Frontend Report

## 1. Project Context
- Scope covered: `space7_frontend` only.

## 2. Technical Stack (Confirmed)
- Frontend framework: Expo + React Native
- Expo SDK version: `~55.0.4`
- React Native version: `0.83.2`
- React version: `19.2.0`
- Routing/navigation: `expo-router` (`~55.0.5`) with Stack and Tabs layout
- React Navigation packages present: `@react-navigation/native` `^7.1.28`, `@react-navigation/native-stack` `^7.10.1`
- State management: React Context API (`AuthContext` in `context/authContext.jsx`)
- Styling: React Native `StyleSheet` (custom styles)
- API communication: native `fetch` (custom wrapper in `services/api.js`)
- Realtime communication: `socket.io-client` (`^4.8.3`)

## 3. Architecture Details
### Folder Structure (`space7_frontend`)
- `app/`: route files for Expo Router (including `(tabs)/`)
- `pages/`: page-level UI implementations
- `components/`: reusable UI wrappers/components
- `context/`: auth context/provider
- `services/`: API layer
- `assets/`: icons/splash/images
- Root configs: `package.json`, `app.json`, `eas.json`, `babel.config.js`

### API Communication
- Uses a centralized `request()` wrapper over `fetch` in `services/api.js`
- Base URL resolution:
  - `process.env.EXPO_PUBLIC_API_URL` when provided
  - fallback: Android emulator `http://10.0.2.2:5000/api`, others `http://localhost:5000/api`
- Uses JSON requests for most endpoints and `FormData` for media upload endpoints

### Socket Implementation
- Client library: `socket.io-client`
- Connection setup in chat page (`pages/ChatPage.jsx`)
- Transport config: `websocket` + `polling`
- Auth sent in socket handshake: token from `expo-secure-store`
- Events used: `join_space`, `leave_space`, `receive_message`, `message_deleted`, `message_liked`
- Reconnection/fallback behavior:
  - Handles `connect_error`
  - If socket is unavailable, chat triggers periodic message polling every 15s

## 4. Security and Auth
- Token type: Bearer token usage is implemented (stored as `jwt_token`; backend-issued token format is treated as JWT in code naming)
- Token storage: `expo-secure-store` (`jwt_token`, `user_data`)
- Auth flows implemented:
  - Signup
  - OTP verification
  - Login
  - Signout (clears secure storage)
- OTP service provider details are not defined in frontend code

## 5. Media Handling
- Image/video selection: `expo-image-picker`
- Upload method: `multipart/form-data` via `FormData`
  - Chat media field: `media`
  - Profile picture field: `avatar`
- Media type metadata sent (`media_type`, mime type, filename)
- Final storage provider is not defined in frontend code

## 6. Performance and Optimization
- Implemented in frontend:
  - Debounced message refresh in chat (`MESSAGE_REFRESH_DEBOUNCE_MS = 4000`)
  - Socket-offline polling fallback (`SOCKET_POLL_INTERVAL_MS = 15000`)
  - Duplicate message protection by message id/signature before append
- No explicit lazy loading or caching layer found in frontend code
- No explicit pagination logic found in frontend code

## 7. Testing
- No unit/integration test setup found in `space7_frontend` (no test files or test scripts present)
- Current evidence indicates manual testing workflow

## 8. Deployment
- APK/build configuration present via EAS (`eas.json`)
  - `preview` profile builds Android `apk`
  - `development` profile uses development client/internal distribution
  - `production` profile with auto-increment enabled

## 9. Challenges Faced (Inferred from Implementation)
- Maintaining chat usability when websocket connection is unstable/unavailable
  - Mitigation implemented: fallback polling + error-tolerant socket handling
- Preventing duplicate chat messages from mixed realtime + API refresh sources
  - Mitigation implemented: id/signature-based deduplication
- Handling media upload across varied picker output formats
  - Mitigation implemented: normalized file metadata and multipart upload path

## 10. Future Enhancements
- No explicit future roadmap documented in frontend code
