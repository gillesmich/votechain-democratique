import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.votechain.democratique',
  appName: 'votechain-democratique',
  webDir: 'dist',
  server: {
    url: 'https://0353b76a-6918-4722-9780-c2858f640412.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: false
    }
  }
};

export default config;