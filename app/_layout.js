import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Audiowide_400Regular,
    });

    if (!fontsLoaded) return null;

    // Custom theme with googlefont globally applied
    const theme = {
        ...MD3LightTheme,
        fonts: {
            ...MD3LightTheme.fonts,
            labelLarge: { fontFamily: "Audiowide_400Regular" },
            bodyLarge: { fontFamily: "Audiowide_400Regular" },
            bodyMedium: { fontFamily: "Audiowide_400Regular" },
            bodySmall: { fontFamily: "Audiowide_400Regular" },
            titleLarge: { fontFamily: "Audiowide_400Regular" },
        },
    };

    return (
        <SafeAreaProvider>
            <StatusBar barStyle="default" />
            <PaperProvider theme={theme}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        animation: "fade",
                    }}
                />
            </PaperProvider>
        </SafeAreaProvider>
    );
}
