import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import SubmitButton from '../constants/SubmitButton'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import query from '../constants/query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SuccessBox from '../components/SuccessBox';

const Forget = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const resetPassword = async () => {
        setError(null);
        setUsernameError(false);
        setLoading(true);
        setSuccess(null);
        if (username.length === 0) {
            setUsernameError(true)
            setError('Username is required');
            setLoading(false);
            return;
        }

        let data = {
            username: username,
        }

        try {
            const response = await axios.post(`${query.baseUrl}password/reset`, data);

            if (response.data.success) {
                setSuccess(response.data.success.message);
                setUsername('');
                setTimeout(() => {
                    navigation.goBack();
                }, 2500);
            } else {
                if (response.data.error.source === 'general') {
                    setPasswordError(true);
                    setError(response.data.error.message);
                } else {
                    setError(response.data.error.message);
                }
            }
        } catch (error) {
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
                    marginTop: '55%',
                    backgroundColor: '#ffffff',
                    flex: 1,
                    borderTopEndRadius: 30,
                    borderTopStartRadius: 30,
                    padding: 0
                }}
            >
                <View
                    style={{
                        flex: 1
                    }}
                >
                    <Text
                        style={{
                            fontSize: 30,
                            fontWeight: 'bold',
                            padding: 20
                        }}
                    >
                        Reset Password
                    </Text>
                    <Text
                        style={{
                            color: 'rgba(0,0,0,0.3)',
                            fontSize: 16,
                            paddingHorizontal: 20
                        }}
                    >
                        Enter your username then check the email linked to your account for your new password
                    </Text>

                    {error !== null ? (
                        <Text
                            style={{
                                color: 'red',
                                fontSize: 12,
                                paddingHorizontal: 20,
                                marginTop: 10,
                                textAlign: 'center'
                            }}
                        >
                            {error}
                        </Text>
                    ) : null}

                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 20, flex: 0, height: 50 }}>
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
                                (text) => {
                                    setUsername(text)
                                    setError(null);
                                    setUsernameError(false);
                                    setSuccess(null);
                                }
                            }
                            inputMode='text'
                            blurOnSubmit={true}
                            secureTextEntry={false}
                            placeholder='Username'
                            autoCapitalize="none"
                        />
                        {usernameError ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
                    </View>

                    <SubmitButton title={'Reset Password'} handleSubmit={resetPassword} disabled={loading} loading={loading} />

                    {success === null ? null : (
                        <SuccessBox message={success} />
                    )}
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default Forget

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