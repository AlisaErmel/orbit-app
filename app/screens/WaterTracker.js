import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, View, TouchableOpacity, Modal, Animated, TextInput, ActivityIndicator } from "react-native";
import { useState, useRef, useEffect } from "react";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import Svg, { Circle } from "react-native-svg";
import { db } from "../../firebaseConfig";
import { ref, onValue, set } from "firebase/database";
import { MaterialIcons } from '@expo/vector-icons';

export default function WaterTracker() {
    const [water, setWater] = useState(0);
    const [goal, setGoal] = useState(2000);
    const [goalInput, setGoalInput] = useState("");
    const [goalModalVisible, setGoalModalVisible] = useState(false);
    const [waterModalVisible, setWaterModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    //congratulations
    const [congratsVisible, setCongratsVisible] = useState(false);

    useEffect(() => {
        if (water >= goal) {
            setCongratsVisible(true);
        }
    }, [water, goal]);


    const animatedProgress = useRef(new Animated.Value(0)).current;

    const radius = 130;
    const strokeWidth = 15;
    const circumference = 2 * Math.PI * radius;
    const progress = water / goal;

    const AnimatedCircle = Animated.createAnimatedComponent(Circle);

    const [fontsLoaded] = useFonts({ Audiowide_400Regular });
    const isLoading = loading || !fontsLoaded;

    // --- Animate circle ---
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

    // --- Get today's date ---
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // --- Firebase: load today's water tracker ---
    useEffect(() => {
        const waterRef = ref(db, `/watertracker/${today}`);

        const unsubscribe = onValue(waterRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setWater(data.water);
                setGoal(data.goal);
            } else {
                setWater(0);
                setGoal(2000);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [today]);

    // --- Update water in Firebase ---
    function addWater(amount) {
        setWater((prevWater) => {
            const newWater = Math.min(prevWater + amount, goal);
            const waterRef = ref(db, `/watertracker/${today}`);
            console.log("Saving to Firebase:", { date: today, water: newWater, goal });

            set(waterRef, { date: today, water: newWater, goal })
                .then(() => console.log("Saved successfully!"))
                .catch(err => console.log("Firebase error:", err));

            return newWater;
        });

        setWaterModalVisible(false);
    }

    // --- Update goal in Firebase ---
    function saveGoal() {
        const newGoal = parseInt(goalInput); // get new goal from input
        if (!isNaN(newGoal) && newGoal > 0) {
            setGoal(newGoal); // update goal locally

            // Save to Firebase, keep water the same
            const waterRef = ref(db, `/watertracker/${today}`);
            set(waterRef, { date: today, water: water, goal: newGoal })
                .then(() => console.log("Goal updated, water unchanged!"))
                .catch(err => console.log("Firebase error:", err));
        }

        setGoalInput("");
        setGoalModalVisible(false);
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#0a627bff" />
            </SafeAreaView>
        );
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
                <MaterialIcons name="local-drink" size={24} color="white" style={{ marginRight: 8 }} />
                <Text style={[styles.addButtonText, { fontFamily: "Audiowide_400Regular" }]}>
                    Add Water
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setGoalModalVisible(true)}
            >
                <MaterialIcons name="flag" size={24} color="white" style={{ marginRight: 8 }} />
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
                            ].map((item) => (
                                <TouchableOpacity
                                    key={item.label}
                                    style={styles.amountBtn}
                                    onPress={() => addWater(item.value)}
                                >
                                    <Text
                                        style={[styles.amountText, { fontFamily: "Audiowide_400Regular" }]}
                                    >
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


            {/* Congratulations Modal */}
            <Modal visible={congratsVisible} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.congratsContainer}>
                        <Text style={[styles.congratsTitle, { fontFamily: "Audiowide_400Regular" }]}>
                            🎉 Congratulations!
                        </Text>
                        <Text style={[styles.congratsText, { fontFamily: "Audiowide_400Regular" }]}>
                            You reached your daily water goal!
                        </Text>

                        {/* Awards icons */}
                        <View style={styles.awardsContainer}>
                            <MaterialIcons name="emoji-events" size={40} color="#FFD700" />
                            <MaterialIcons name="local-drink" size={40} color="#0a627bff" />
                            <MaterialIcons name="star" size={40} color="#FF6347" />
                        </View>

                        <TouchableOpacity
                            style={styles.closeCongratsBtn}
                            onPress={() => setCongratsVisible(false)}
                        >
                            <Text style={[styles.closeCongratsText, { fontFamily: "Audiowide_400Regular" }]}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView >
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
        marginTop: 50,
        marginBottom: 50,
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
        paddingHorizontal: 20,
        backgroundColor: "#0a627bff",
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",  // center icon and text vertically
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
    //congratulations
    congratsContainer: {
        width: "80%",
        backgroundColor: "white",
        padding: 25,
        borderRadius: 20,
        alignItems: "center",
    },
    congratsTitle: {
        fontSize: 26,
        color: "#0a627bff",
        marginBottom: 10,
        textAlign: "center",
    },
    congratsText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
    },
    awardsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 20,
    },
    closeCongratsBtn: {
        backgroundColor: "#0a627bff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    closeCongratsText: {
        color: "white",
        fontSize: 18,
    },
});
