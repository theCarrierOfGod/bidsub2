import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, Pressable, View, KeyboardAvoidingView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import query from '../constants/query';
import SubmitButton from '../constants/SubmitButton';

const SignIn = ({ navigation }) => {
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setErrors] = useState('');
    const [seePin, setSeePin] = useState(false);

    const fetchNow = async (user) => {
        try {
            const response = await axios.get(`${query.baseUrl}user/${user}`);
            if (response.data) {
                await AsyncStorage.setItem('userDetails', JSON.stringify(response.data[0]));
            }
        } catch (error) {
            console.log(error)
        } finally {
            navigation.replace('Home');
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
                navigation.replace('Home')
            } else {
                console.log(response.data.error.source);
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
        <ScrollView
            style={{
                flex: 1,
            }}
        >
            <KeyboardAvoidingView
                style={{
                    marginTop: '50%',
                    backgroundColor: '#ffffff',
                    flex: 1,
                    justifyContent: 'center',
                    borderTopEndRadius: 30,
                    borderTopStartRadius: 30,
                }}
            >
                <View
                    style={{
                        marginBottom: 80,
                        marginTop: 20,
                        // backgroundColor: '#ffffff',
                        // flex: 1,
                        // justifyContent: 'center',
                        // borderTopEndRadius: 20,
                        // borderTopStartRadius: 20,
                    }}
                >

                    <Text
                        style={{
                            fontSize: 32,
                            fontWeight: 'bold',
                            padding: 20
                        }}
                    >
                        Sign In
                    </Text>
                    <Text
                        style={{
                            color: 'rgba(0,0,0,0.3)',
                            fontSize: 18,
                            paddingHorizontal: 20
                        }}
                    >
                        Log in to your account to continue
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
                        <Ionicons name={'person-outline'} size={20} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
                        <TextInput
                            style={{
                                borderWidth: 0,
                                height: 48,
                                backgroundColor: 'rgba(0,0,0, 0.03)',
                                padding: 5,
                                paddingLeft: 35,
                                borderRadius: 8,
                                fontWeight: '700',
                                fontSize: 16,
                                color: "rgba(0,0,0,0.3)",
                            }}
                            value={username}
                            onChangeText={
                                (text) => setUsername(text)
                            }
                            inputMode='text'
                            blurOnSubmit={true}
                            secureTextEntry={false}
                            placeholder='Username'
                            autoCapitalize="none"
                        />
                        {usernameError ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
                    </View>

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
                                fontSize: 16,
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

                    <Pressable
                        onPress={() => navigation.navigate('ForgetPassword')}
                    >
                        <Text
                            style={{
                                textAlign: 'right',
                                marginRight: 25,
                                color: '#004aad',
                                fontWeight: 800
                            }}
                        >
                            Forget Password
                        </Text>
                    </Pressable>

                    <SubmitButton title={'Continue'} handleSubmit={handleLogin} disabled={loading} loading={loading} />
                    <Text
                        style={{
                            color: 'rgba(0,0,0,0.3)',
                            fontSize: 18,
                            paddingHorizontal: 20,
                            textAlign: 'center',
                            marginTop: 20
                        }}
                    >
                        Don't have an account?
                        <Pressable
                            onPress={() => navigation.navigate('SignUp')}
                        >
                            <Text style={{ color: '#004aad', fontWeight: 'bold' }}> Sign up Here</Text>
                        </Pressable>
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
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

export default SignIn