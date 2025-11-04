import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <StatusBar barStyle="default" />
            <Stack screenOptions={{ headerShown: false, animation: "fade", }} />
        </SafeAreaProvider>
    );
}
