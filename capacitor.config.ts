import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Android app wrapper. The app is the same static site (out/) packaged inside a native shell,
 * which adds AdMob ads and Google Play subscriptions.
 * appId is permanent once the app is published on Google Play.
 */
const config: CapacitorConfig = {
  appId: "com.combatgym.app",
  appName: "Combat Gym",
  webDir: "out",
  android: {
    // YouTube embeds need a real https origin for the player to work inside the app.
    allowMixedContent: false,
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
