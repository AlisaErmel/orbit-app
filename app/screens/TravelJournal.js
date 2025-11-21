import { useState, useEffect, useRef } from 'react';
import { useFonts, Audiowide_400Regular } from "@expo-google-fonts/audiowide";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Image, View, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Animated } from "react-native";
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../firebaseConfig';
import { ref, push, onValue } from 'firebase/database';

const MARKER_ICON = require('../../assets/icons/location.png');

export default function TravelJournal() {

    useFonts({ Audiowide_400Regular });

    const navigation = useNavigation();
    const mapRef = useRef(null);

    const [mapRegion, setMapRegion] = useState({
        latitude: 48.8566,
        longitude: 2.3522,
        latitudeDelta: 10,
        longitudeDelta: 10,
    });

    const [searchText, setSearchText] = useState('');
    const [markers, setMarkers] = useState([]);

    const keyboardOffset = useState(new Animated.Value(0))[0];

    // Keyboard animation
    useEffect(() => {
        const show = Keyboard.addListener("keyboardWillShow", (e) => {
            Animated.timing(keyboardOffset, {
                toValue: e.endCoordinates.height,
                duration: 250,
                useNativeDriver: false,
            }).start();
        });

        const hide = Keyboard.addListener("keyboardWillHide", () => {
            Animated.timing(keyboardOffset, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }).start();
        });

        return () => { show.remove(); hide.remove(); };
    }, []);

    // Load markers
    useEffect(() => {
        const markersRef = ref(db, 'traveljournal/');
        onValue(markersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loaded = Object.values(data).map(m => ({
                    city: m.city,
                    country: m.country,
                    coordinate: { latitude: m.latitude, longitude: m.longitude },
                    image: MARKER_ICON,
                }));
                setMarkers(loaded);
            }
        });
    }, []);

    const zoomToMarker = (coord) => {
        mapRef.current?.animateToRegion({
            ...coord,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
        }, 800);
    };

    //Add new city
    const handleAddCity = async () => {
        if (!searchText) return;

        try {
            const geocode = await Location.geocodeAsync(searchText);
            if (!geocode.length) return;

            const { latitude, longitude } = geocode[0];
            const [info] = await Location.reverseGeocodeAsync({ latitude, longitude });

            const country = info?.country || 'Unknown';

            const newMarker = { city: searchText, country, latitude, longitude };

            push(ref(db, 'traveljournal/'), newMarker);

            setMarkers(prev => [
                ...prev,
                {
                    city: searchText,
                    country,
                    coordinate: { latitude, longitude },
                    image: MARKER_ICON
                }
            ]);

            setMapRegion(r => ({ ...r, latitude, longitude }));

            setSearchText('');
            Keyboard.dismiss();

        } catch (err) {
            console.log("Error:", err);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={[]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>

                    {/* MAP */}
                    <MapView
                        ref={mapRef}
                        style={{ flex: 1 }}
                        region={mapRegion}
                    >
                        {markers.map((marker, i) => (
                            <Marker
                                key={i}
                                coordinate={marker.coordinate}
                                onPress={() => zoomToMarker(marker.coordinate)}
                            >
                                <Image
                                    source={MARKER_ICON}
                                    style={{ width: 40, height: 40 }}
                                    resizeMode="contain"
                                />
                                <Callout tooltip>
                                    <View style={styles.markerCallout}>
                                        <Text style={styles.calloutCity}>{marker.city},</Text>
                                        <Text style={styles.calloutCountry}>{marker.country}</Text>
                                    </View>
                                </Callout>
                            </Marker>
                        ))}
                    </MapView>

                    {/* BACK BUTTON */}
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={28} color="black" />
                    </TouchableOpacity>

                    {/* ADD CITY INPUT */}
                    <Animated.View style={[styles.inputCard, { bottom: Animated.add(65, keyboardOffset) }]}>
                        <Card style={[styles.greenCard, { elevation: 5, padding: 10 }]}>
                            <TextInput
                                label="Enter city"
                                value={searchText}
                                onChangeText={setSearchText}
                                style={{ backgroundColor: 'transparent' }}
                                theme={{
                                    colors: {
                                        text: "#05540d",
                                        primary: "#05540d",
                                        placeholder: "#05540d9a"
                                    }
                                }}
                            />
                            <Button
                                mode="contained"
                                onPress={handleAddCity}
                                style={[styles.greenButton, { marginTop: 8 }]}
                                labelStyle={{ color: 'white' }}
                            >
                                Add City
                            </Button>
                        </Card>
                    </Animated.View>

                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    //Inpu Card for new city
    inputCard: {
        position: 'absolute',
        bottom: 65,
        left: 20,
        right: 20,
        padding: 10,
    },
    greenCard: {
        backgroundColor: '#f6f6f6',
        borderRadius: 10,
    },
    greenButton: {
        backgroundColor: "#05540d9a",
    },
    //Arrow back button
    backButton: {
        position: 'absolute',
        top: 45,
        left: 20,
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    //Marker
    markerCallout: {
        padding: 8,
        minWidth: 150,
        maxWidth: 250,
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
    },
    calloutCity: {
        fontWeight: 'bold',
        fontFamily: "Audiowide_400Regular",
        fontSize: 16,
    },
    calloutCountry: {
        fontSize: 14,
        color: '#555',
    },
});
