import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
  plugins: [
    expoClient({
      storagePrefix: "pagalo",
      storage: SecureStore,
      scheme: "exp://s9pku04-ducen29-8081.exp.direct",
    }),
  ],
});

