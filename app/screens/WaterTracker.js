import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, View, TouchableOpacity, Modal, Animated, TextInput } from "react-native";
import { useState, useRef, useEffect } from "react";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import Svg, { Circle } from "react-native-svg";

export default function WaterTracker() {
    const [water, setWater] = useState(0);
    const [goal, setGoal] = useState(2000);
    const [goalInput, setGoalInput] = useState("");
    const [goalModalVisible, setGoalModalVisible] = useState(false);
    const [waterModalVisible, setWaterModalVisible] = useState(false);

    const animatedProgress = useRef(new Animated.Value(0)).current;

    const radius = 130;
    const strokeWidth = 15;
    const circumference = 2 * Math.PI * radius;

    const progress = water / goal;

    // Animate circle when water OR goal changes
    useEffect(() => {
        Animated.timing(animatedProgress, {
            toValue: progress,
            duration: 600,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const strokeDashoffset = animatedProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });

    const AnimatedCircle = Animated.createAnimatedComponent(Circle);

    const [fontsLoaded] = useFonts({ Audiowide_400Regular });
    if (!fontsLoaded) return null;

    function addWater(amount) {
        setWater(prev => Math.min(prev + amount, goal));
        setWaterModalVisible(false);
    }

    function saveGoal() {
        const newGoal = parseInt(goalInput);
        if (!isNaN(newGoal) && newGoal > 0) {
            setGoal(newGoal);
            setWater(0); // optional: reset progress
        }
        setGoalInput("");
        setGoalModalVisible(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={[styles.heading, { fontFamily: "Audiowide_400Regular" }]}>
                WATER TRACKER
            </Text>

            {/* Circle */}
            <View style={styles.circleContainer}>
                <Svg width={300} height={300}>
                    <Circle
                        stroke="#ffffff50"
                        cx="150"
                        cy="150"
                        r={radius}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />

                    <AnimatedCircle
                        stroke="#0a627bff"
                        cx="150"
                        cy="150"
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="none"
                    />
                </Svg>

                <Text style={[styles.waterText, { fontFamily: "Audiowide_400Regular" }]}>
                    {(water / 1000).toFixed(2)} L / {(goal / 1000).toFixed(1)} L
                </Text>
            </View>

            {/* Buttons */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setWaterModalVisible(true)}
            >
                <Text style={[styles.addButtonText, { fontFamily: "Audiowide_400Regular" }]}>
                    Add Water
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setGoalModalVisible(true)}
            >
                <Text style={[styles.addButtonText, { fontFamily: "Audiowide_400Regular" }]}>
                    Set Daily Goal
                </Text>
            </TouchableOpacity>

            {/* Water Modal */}
            <Modal visible={waterModalVisible} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={[styles.modalTitle, { fontFamily: "Audiowide_400Regular" }]}>
                            Add Water
                        </Text>

                        <View style={styles.amountButtons}>
                            {[
                                { label: "+250 ml", value: 250 },
                                { label: "+500 ml", value: 500 },
                                { label: "+1 L", value: 1000 },
                            ].map(item => (
                                <TouchableOpacity
                                    key={item.label}
                                    style={styles.amountBtn}
                                    onPress={() => addWater(item.value)}
                                >
                                    <Text style={[styles.amountText, { fontFamily: "Audiowide_400Regular" }]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity onPress={() => setWaterModalVisible(false)}>
                            <Text style={[styles.closeModal, { fontFamily: "Audiowide_400Regular" }]}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Goal Modal */}
            <Modal visible={goalModalVisible} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={[styles.modalTitle, { fontFamily: "Audiowide_400Regular" }]}>
                            Set Daily Goal (ml)
                        </Text>

                        <TextInput
                            style={[styles.input, { fontFamily: "Audiowide_400Regular" }]}
                            keyboardType="numeric"
                            value={goalInput}
                            onChangeText={setGoalInput}
                            placeholder="Enter amount in ml"
                            placeholderTextColor="#00030474"
                        />

                        <TouchableOpacity style={styles.saveBtn} onPress={saveGoal}>
                            <Text style={[styles.saveText, { fontFamily: "Audiowide_400Regular" }]}>
                                Save Goal
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setGoalModalVisible(false)}>
                            <Text style={[styles.closeModal, { fontFamily: "Audiowide_400Regular" }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    //main
    container: {
        flex: 1,
        backgroundColor: "#b0e5ef71",
        alignItems: "center",
    },
    heading: {
        fontSize: 34,
        color: "#0a627bff",
        marginTop: 20,
        marginBottom: 10,
    },
    //circle
    circleContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
    },
    waterText: {
        position: "absolute",
        fontSize: 26,
        fontWeight: "bold",
        color: "#043745b8",
        textAlign: "center",
    },
    //add buttons
    addButton: {
        marginTop: 20,
        paddingVertical: 15,
        paddingHorizontal: 40,
        backgroundColor: "#0a627bff",
        borderRadius: 30,
    },
    addButtonText: {
        fontSize: 20,
        color: "white",
        fontWeight: "600",
    },
    //modal
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 22,
        marginBottom: 20,
        color: "#0a627bff",
    },
    amountButtons: {
        flexDirection: "column",
        gap: 10,
        marginBottom: 20,
    },
    amountBtn: {
        backgroundColor: "#0a627bff",
        padding: 10,
        borderRadius: 10,
        width: 140,
        alignItems: "center",
    },
    amountText: {
        color: "white",
        fontSize: 18,
    },
    closeModal: {
        marginTop: 10,
        fontSize: 16,
        color: "#555",
    },
    //day goal input
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        width: "100%",
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
        fontSize: 18,
        textAlign: "center",
    },
    saveBtn: {
        backgroundColor: "#0a627bff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
    },
    saveText: {
        color: "white",
        fontSize: 18,
    },
});
