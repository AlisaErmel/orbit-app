import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, View, TouchableOpacity, Modal, Animated } from "react-native";
import { useState, useRef, useEffect } from "react";
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import Svg, { Circle } from "react-native-svg";

export default function WaterTracker() {
    const [water, setWater] = useState(0);
    const goal = 2000;
    const [modalVisible, setModalVisible] = useState(false);

    const animatedProgress = useRef(new Animated.Value(0)).current;

    const radius = 120;
    const strokeWidth = 15;
    const circumference = 2 * Math.PI * radius;

    const progress = water / goal;

    // Animate circle when water changes
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

    const [fontsLoaded] = useFonts({ Audiowide_400Regular });
    if (!fontsLoaded) return null;

    function addWater(amount) {
        setWater(prev => Math.min(prev + amount, goal));
        setModalVisible(false);
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
                        stroke="#0a7d6b"
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
                    {(water / 1000).toFixed(2)} L
                </Text>
            </View>

            {/* Add button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={[styles.addButtonText, { fontFamily: "Audiowide_400Regular" }]}>Add Water</Text>
            </TouchableOpacity>

            {/* Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={[styles.modalTitle, { fontFamily: "Audiowide_400Regular" }]}>Add Water</Text>

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
                                    <Text style={[styles.amountText, { fontFamily: "Audiowide_400Regular" }]}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={[styles.closeModal, { fontFamily: "Audiowide_400Regular" }]}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#b0e5ef71",
        alignItems: "center",
    },
    heading: {
        fontSize: 34,
        color: "#044536b8",
        marginTop: 20,
        marginBottom: 10,
        textAlign: "center",
    },
    circleContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
    },
    waterText: {
        position: "absolute",
        fontSize: 32,
        fontWeight: "bold",
        color: "#044536",
    },
    addButton: {
        marginTop: 40,
        paddingVertical: 15,
        paddingHorizontal: 40,
        backgroundColor: "#088c71",
        borderRadius: 30,
    },
    addButtonText: {
        fontSize: 20,
        color: "white",
        fontWeight: "600",
    },
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
    },
    amountButtons: {
        flexDirection: "column",
        gap: 10,
        marginBottom: 20,
    },
    amountBtn: {
        backgroundColor: "#0a7d6b",
        padding: 10,
        borderRadius: 10,
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
});
