import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.gentongmas.po",
  appName: "Purchase Order Gentong Mas",
  webDir: "dist/public",
  server: {
    url: "https://gentongmaspurchasingorder.up.railway.app",
    androidScheme: "https",
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
