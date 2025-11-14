import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FilmTracker_List() {
    return (
        <SafeAreaView style={styles.container} edges={[]}>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e5884571",
        alignItems: "center",
        justifyContent: "flex-start",
    },
})