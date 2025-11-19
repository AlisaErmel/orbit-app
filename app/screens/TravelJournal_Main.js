import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet } from "react-native";

export default function TravelJournal_Main() {
    return (
        <SafeAreaView>
            <Text>This is the main screen of the TravelJournal</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 34,
        color: "#13b3239a",
        fontStyle: "bold",
        marginTop: 50, //IF I USE EDGES
        marginBottom: 5,
    },
})