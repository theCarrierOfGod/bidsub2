import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import SubmitButton from '../constants/SubmitButton'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import axios from 'axios'
import { useIsFocused } from '@react-navigation/native';
import query from '../constants/query';
import * as ImagePicker from "expo-image-picker";
import { storage } from '../constants/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';


const PRofile = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [dp, setDp] = useState('');
    const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
    const fetchNow = async (user) => {
        try {
            const response = await axios.get(`${query.baseUrl}user/${user}`);
            if (response.data) {
                setUsername(response.data[0].username);
                setDp(response.data[0].display_picture);
                setName(response.data[0].fullname);
                setEmail(response.data[0].email)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const isOnline = async () => {
        try {
            await AsyncStorage.getItem('UserName')
                .then(value => {
                    if (value != null) {
                        fetchNow(value);
                    } else {
                        navigation.replace('SignIn')
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        isOnline();
    }, [isFocused]);

    const pickImage = async () => {
        const onUploadProgress = (event) => {
            const percentage = Math.round((100 * event.loaded) / event.total);
            console.log(percentage);
        };
        const { status } = await ImagePicker.
            requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                `Sorry, we need camera roll permission to upload images.`
            );
        } else {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            // console.log(result);

            // if (!result.canceled) {
            //     setDp(result.assets[0].uri);

            //     console.log(result);
            // }
            // const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) {
                setIsLoading(true);
                setDp(result.assets[0].uri);
                console.log(result.assets);

                // Clear any previous errors 
                setError(null);

                let formData = new FormData();
                formData.append('image', {
                    name: result.fileName,
                    type: result.type,
                    uri:
                        Platform.OS === 'android' ? result.assets[0].uri : result.assets[0].uri.replace('file://', ''),
                });
                // formData.append("image", result.assets[0].uri);

                axios.post(`${query.baseUrl}save`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress,
                });
                // const imageRef = ref(storage, `images/bidsub${v4() + v4()}`);

                // uploadBytes(imageRef, result.assets[0].uri).then(() => {
                //     console.log(getDownloadURL(imageRef))
                //     getDownloadURL(imageRef).then((url) => {
                //         uploadImage(url);
                //         console.log(url)
                //     })
                // })
            }
        }
    };

    const uploadImage = async (url) => {
        const data = {
            username: username,
            display_picture: url
        }
        try {
            const response = await axios.post(`${query.baseUrl}update/display_picture`, data);
            if (response.data.success) {
                setError(null);
            } else {
                console.log(response.data.error.source);
                setError(response.data.error.message);
            }
        } catch (error) {
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ScrollView>
            <View style={[styles.aCenter, styles.row]}>
                <Image
                    style={styles.image}
                    source={dp}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={1000}
                />
                <View>
                    <Text style={[styles.row, styles.dets]}>
                        {name}
                    </Text>
                    <Text style={[styles.row, styles.dets]}>
                        {email}
                    </Text>
                </View>
            </View>

            <Text style={[styles.row, styles.dets]}>
                {error}
            </Text>

            <Pressable style={[styles.row, styles.listHover]}
                hoverStyle={[styles.listHover]}
                activeStyle={[styles.listHover]}
                onPress={() => {
                    navigation.navigate('EditInfo');
                }}
            >
                <View style={styles.icon}>
                    <AntDesign name="user" size={40} color="#004aad" />
                </View>
                <View style={[styles.jCenter, styles.growOne]}>
                    <Text style={styles.infoText}>
                        Personal Information
                    </Text>
                    <Text style={styles.justText}>
                        Edit your personal information
                    </Text>
                </View>
                <View style={[styles.jCenter]}>
                    <AntDesign name="right" size={24} style={styles.m5} color="#004aad" />
                </View>
            </Pressable>

            <Pressable style={[styles.row, styles.listHover]}
                hoverStyle={[styles.listHover]}
                activeStyle={[styles.listHover]}
                onPress={() => {
                    navigation.navigate('Settings');
                }}
            >
                <View style={styles.icon}>
                    <AntDesign name="setting" size={40} color="#004aad" />
                </View>
                <View style={[styles.jCenter, styles.growOne]}>
                    <Text style={styles.infoText}>
                        Settings
                    </Text>
                    <Text style={styles.justText}>
                        Account, notifications
                    </Text>
                </View>
                <View style={[styles.jCenter]}>
                    <AntDesign name="right" size={24} style={styles.m5} color="#004aad" />
                </View>
            </Pressable>

            <Pressable style={[styles.row, styles.listHover]}
                hoverStyle={[styles.listHover]}
                activeStyle={[styles.listHover]}
                onPress={() => {
                    navigation.navigate('Help');
                }}
            >
                <View style={styles.icon}>
                    <Ionicons name="help-circle-outline" size={40} color="#004aad" />
                </View>
                <View style={[styles.jCenter, styles.growOne]}>
                    <Text style={styles.infoText}>
                        Help & Support
                    </Text>
                    <Text style={styles.justText}>
                        Help or contact Bidsub
                    </Text>
                </View>
                <View style={[styles.jCenter]}>
                    <AntDesign name="right" size={24} style={styles.m5} color="#004aad" />
                </View>
            </Pressable>

            <Pressable style={[styles.aCenter, styles.row, styles.listHover]}
                hoverStyle={[styles.listHover]}
                activeStyle={[styles.listHover]}
                onPress={() => {
                    AsyncStorage.removeItem('UserName');
                    AsyncStorage.removeItem('isLoggedIn');
                    AsyncStorage.setItem('existing', username);
                    navigation.replace('Welcome');
                }}
            >
                <View style={styles.icon}>
                    <FontAwesome name="sign-out" size={40} color="#004aad" />
                </View>
                <View style={[styles.jCenter]}>
                    <Text style={styles.infoText}>
                        Sign Out
                    </Text>
                    <Text style={styles.justText}>
                        Sign out of your account
                    </Text>

                </View>
            </Pressable>
        </ScrollView>
    )
}

export default PRofile

const styles = StyleSheet.create({
    jCenter: {
        justifyContent: 'center'
    },
    aCenter: {
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row'
    },
    growOne: {
        flexGrow: 1
    },
    m5: {
        margin: 5
    },
    image: {
        width: 70,
        height: 70,
        borderWidth: 5,
        margin: 10,
        marginRight: 0,
        borderRadius: 100,
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 2,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
        marginLeft: 20
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    justText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
    },
    infoText: {
        color: "#007AFF",
        fontSize: 17,
        fontWeight: "800",
    },
    icon: {
        width: 65,
        height: 65,
        borderRadius: 100,
        margin: 15,
        backgroundColor: '#8cabd5',
        alignItems: 'center',
        justifyContent: 'center'
    },
    listHover: {
        backgroundColor: 'white',
        marginTop: 8
    },
    dets: {
        fontSize: 14,
        fontWeight: 900,
        color: '#004AAD',
        marginHorizontal: 25,
        marginVertical: 5
    }
})