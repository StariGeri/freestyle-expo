import { ThemeProvider } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';

import { theme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

const NavThemeLight = {
  dark: false,
  colors: {
    primary: theme.colors.accent,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.textPrimary,
    border: theme.colors.border,
    notification: theme.colors.error,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '900' as const },
  },
};

const NavThemeDark = {
  dark: true,
  colors: {
    primary: theme.colors.accent,
    background: theme.colors.textPrimary,
    card: '#1A1A1A',
    text: theme.colors.textInverse,
    border: '#333333',
    notification: theme.colors.error,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '900' as const },
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsReady, setFontsReady] = useState(false);

  // Explicitly load icon fonts before any screen mounts. `useFonts({...Icon.font})`
  // is documented but on Android + Expo SDK 54 + the new architecture it can
  // race: `<Ionicons>` renders before the font is registered and the glyphs
  // come out as tofu. `Font.loadAsync` awaits the actual font-registration
  // promise, which is reliable.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await Font.loadAsync({
          SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
          ...Ionicons.font,
          ...MaterialIcons.font,
          ...MaterialCommunityIcons.font,
          ...FontAwesome.font,
          ...Feather.font,
        });
      } finally {
        if (!cancelled) setFontsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!fontsReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? NavThemeDark : NavThemeLight}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
