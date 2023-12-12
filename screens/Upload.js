import React, { useState } from "react";
import {
    View, Text, TouchableOpacity,
    StyleSheet, Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from 'expo-image';

export default function Upload() {

    // Stores the selected image URI 
    const [file, setFile] = useState(null);
    const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
    // Stores any error message 
    const [error, setError] = useState(null);

    // Function to pick an image from 
    //the device's media library 
    const pickImage = async () => {
        const { status } = await ImagePicker.
            requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {

            // If permission is denied, show an alert 
            Alert.alert(
                "Permission Denied",
                `Sorry, we need camera 
				roll permission to upload images.`
            );
        } else {

            // Launch the image library and get 
            // the selected image 
            const result =
                await ImagePicker.launchImageLibraryAsync();


            if (!result.cancelled) {
                console.log(result)
                // If an image is selected (not cancelled), 
                // update the file state variable 
                setFile(result.assets[0].uri);

                // Clear any previous errors 
                setError(null);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                Add Image:
            </Text>

            {/* Button to choose an image */}
            <TouchableOpacity style={styles.button}
                onPress={pickImage}>
                <Text style={styles.buttonText}>
                    Choose Image
                </Text>
            </TouchableOpacity>

            {/* Conditionally render the image 
			or error message */}

            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: file }}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={1000}
                    style={styles.image} />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    header: {
        fontSize: 20,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    imageContainer: {
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 8,
    },
    errorText: {
        color: "red",
        marginTop: 16,
    },
});
