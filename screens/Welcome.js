import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, Pressable, View, Image, TextInput } from 'react-native';
import SubmitButton from '../constants/SubmitButton';
import axios from 'axios';
import query from '../constants/query';

const Welcome = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [error, setErrors] = useState('');
    const [seePin, setSeePin] = useState(false);
    const [loading, setLoading] = useState(false);
    const isOnline = async () => {
        try {
            await AsyncStorage.getItem('existing')
                .then(value => {
                    if (value != null) {
                        setUsername(value)
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

    const fetchNow = async (user) => {
        try {
            const response = await axios.get(`${query.baseUrl}user/${user}`);
            if (response.data) {
                await AsyncStorage.setItem('userDetails', JSON.stringify(response.data[0]));
            }
        } catch (error) {
            console.log(error)
        } finally {
            navigation.navigate('Home');
        }
    }

    const handleLogin = async () => {
        setLoading(true);
        setUsernameError(false);
        setErrors('')
        setPasswordError(false);

        if (username.length === 0) {
            setUsernameError(true);
            setErrors('Username is required');
            setLoading(false);
            return
        }

        if (password.length === 0) {
            setPasswordError(true);
            setErrors('Password is required');
            setLoading(false);
            return
        }

        let data = {
            username: username,
            password: password
        }

        try {
            const response = await axios.post(`${query.baseUrl}sign/in`, data);
            if (response.data.success) {
                await AsyncStorage.setItem('UserName', response.data.username);
                AsyncStorage.setItem('isLoggedIn', "true");
                AsyncStorage.setItem('existing', response.data.username);
                fetchNow(response.data.username);
                navigation.navigate('Home')
            } else {
                if (response.data.error.source === 'username') {
                    setUsernameError(true);
                    setErrors(response.data.error.message);
                }
                if (response.data.error.source === 'password') {
                    setPasswordError(true);
                    setErrors(response.data.error.message);
                }
            }
        } catch (error) {
            alert("Error!");
            console.log(error)
        } finally {
            setLoading(false);
        }
    }
    return (
        <View
            style={{
                flex: 1,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
            }}
        >
            <Image
                source={require('../assets/images/logo.jpg')}
                style={{
                    width: 150,
                    height: 150,
                    marginVertical: 20,
                    borderRadius: 100
                }}
            />
            <Text
                style={{
                    fontSize: 26,
                    fontWeight: 'bold'
                }}
            >
                Welcome back, {username}
            </Text>
            <Text
                style={{
                    textAlign: 'center',
                    color: 'rgba(0,0,0,0.3)',
                    marginVertical: 20,
                    fontWeight: 600
                }}
            >
                Enter your password to continue
            </Text>

            {error.length !== 0 ? (
                <Text
                    style={{
                        color: 'red',
                        fontSize: 12,
                        paddingHorizontal: 20,
                        marginTop: 10
                    }}
                >
                    {error}
                </Text>
            ) : null}

            <View style={{ width: '90%', alignSelf: 'center', marginVertical: 15, flex: 0, height: 50 }}>
                <Ionicons name={'key-outline'} size={20} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
                <TextInput
                    style={{
                        borderWidth: 0,
                        height: 48,
                        backgroundColor: 'rgba(0,0,0, 0.03)',
                        padding: 5,
                        paddingLeft: 35,
                        borderRadius: 8,
                        fontWeight: '700',
                        fontSize: 24,
                        color: "rgba(0,0,0,0.3)"
                    }}
                    value={password}
                    onChangeText={
                        (text) => setPassword(text)
                    }
                    autoCorrect={false}
                    secureTextEntry={!seePin}
                    placeholder={'Password'}
                    autoCapitalize="none"
                />
                <Pressable
                    style={styles.iconRight}
                    onPress={() => {
                        if (seePin)
                            setSeePin(false)
                        else
                            setSeePin(true)
                    }}
                >
                    <Ionicons name={seePin ? 'ios-eye-off-outline' : 'ios-eye-outline'} size={20} color="rgba(0,0,0,0.3)" />
                </Pressable>
                {passwordError ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
            </View>

            <View
                style={{
                    flex: 0,
                    width: '100%'
                }}
            >
                <SubmitButton title={'Sign In'} handleSubmit={handleLogin} disabled={loading} loading={loading} />

                <Pressable
                    onPress={() => {
                        AsyncStorage.clear();
                        navigation.replace('SignIn')
                    }}
                >
                    <Text
                    style={{
                        fontSize: 20,
                        textAlign: 'center',
                        marginVertical: 25,
                    }}
                    >
                        Not you? Sign In
                    </Text>
                </Pressable>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#004aad',
        borderWidth: 2,
        borderRadius: 10,
        color: '#004aad',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        marginTop: 0
    },
    upbutton: {
        width: '100%',
        height: 50,
        backgroundColor: '#004aad',
        borderRadius: 10,
        color: 'white',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        marginTop: 10
    },
    stress: {
        color: '#004aad',
        fontWeight: 'bold'
    },
    iconLeft: {
        position: 'absolute',
        left: 8,
        top: 12
    },
    iconRight: {
        position: 'absolute',
        right: 8,
        top: 12
    }
})

export default Welcome

