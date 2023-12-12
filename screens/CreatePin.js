import { StyleSheet, Text, ScrollView, View, Pressable, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import SubmitButton from '../constants/SubmitButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import query from '../constants/query';

const CreatePin = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const [seePin, setSeePin] = useState(false);
    const [pinError, setPinError] = useState(null);

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(null)
    const [seePd, setSeePd] = useState(false)

    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('')

    const [loading, setLoading] = useState(false);
    const handleSub = async () => {
        setLoading(true);
        setPasswordError(null);
        setPinError(null)
        if (pin.length !== 4) {
            setPinError('Invalid pin format');
            setLoading(false)
            return;
        }
        if (password.length === 0) {
            setPasswordError('Password is required');
            setLoading(false)
            return;
        }
        const data = {
            tpin: pin,
            username: username,
            password: password,
        }
        try {
            const response = await axios.post(`${query.baseUrl}tpin/set`, data);
            if (response.data.success) {
                setShowAlert(true)
                setAlertMsg(response.data.success)
            } else {
                if (response.data.error.source === 'pin') {
                    setPinError(response.data.error.message);
                } else {
                    setPasswordError(response.data.error);
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getUsername = async () => {
        try {
            await AsyncStorage.getItem('UserName')
                .then(value => {
                    if (value != null) {
                        setUsername(value)
                    }
                })
        } catch (error) {
            console.error();
        }
    }

    useEffect(() => {
        getUsername();
    }, [isFocused])
    return (
        <ScrollView style={styles.container}>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    marginTop: 100
                }}
            >
                <AwesomeAlert
                    show={showAlert}
                    showProgress={false}
                    title="SUCCESS"
                    message={alertMsg}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={false}
                    onDismiss={() => {
                        navigation.replace('Home')
                    }}
                />
                <Text style={styles.headerText}>Create a new transaction pin</Text>
                <View>
                    <Text style={styles.text}>
                        Transaction Pin
                    </Text>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 15, flex: 0, height: 50 }}>
                        <MaterialCommunityIcons name="form-textbox-password" size={20} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
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
                            value={pin}
                            onChangeText={
                                (text) => {
                                    setPin(text)
                                    setPinError(null)
                                }
                            }
                            autoCorrect={false}
                            secureTextEntry={!seePin}
                            placeholder={'Transaction Pin'}
                            maxLength={4}
                            inputMode='numeric'
                            autoComplete='off'
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
                        {pinError !== null ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
                    </View>
                    {pinError !== null ? (
                        <>
                            <Text style={{ color: 'red', fontSize: 12, marginTop: 10, marginLeft: 25 }} >{pinError}</Text>
                        </>
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
                                fontSize: 16,
                                color: "rgba(0,0,0,0.3)"
                            }}
                            value={password}
                            onChangeText={
                                (text) => {
                                    setPassword(text);
                                    setPasswordError('')
                                }
                            }
                            autoCorrect={false}
                            secureTextEntry={!seePd}
                            placeholder={'Password'}
                            autoCapitalize="none"
                            autoComplete='off'
                        />
                        <Pressable
                            style={styles.iconRight}
                            onPress={() => {
                                if (seePd)
                                    setSeePd(false)
                                else
                                    setSeePd(true)
                            }}
                        >
                            <Ionicons name={seePd ? 'ios-eye-off-outline' : 'ios-eye-outline'} size={20} color="rgba(0,0,0,0.3)" />
                        </Pressable>
                        {passwordError ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
                    </View>

                    {passwordError !== null ? (
                        <>
                            <Text style={{ color: 'red', fontSize: 12, marginTop: 10, marginLeft: 25 }} >{passwordError}</Text>
                        </>
                    ) : null}
                </View>
                <SubmitButton loading={loading} disabled={loading} handleSubmit={handleSub} title={'Set Pin'} />
            </View>
        </ScrollView>
    )
}

export default CreatePin

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    headerText: {
        fontSize: 25,
        fontFamily: 'Rubik-Regular',
        fontWeight: 'bold',
        marginVertical: 20,
        lineHeight: 35,
        color: '#000000',
        textAlign: 'center'
    },
    icon: {
        marginBottom: 20
    },
    eachText: {
        color: '#004AAD',
        fontWeight: '900',
        fontSize: 18
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 15,
        marginHorizontal: 18,
        lineHeight: 32,
        color: '#004AAD',
    },
    eachService: {
        flex: 0,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        borderWidth: 3,
        borderColor: '#004AAD',
        minHeight: 130,
        minWidth: 130,
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 25,
        marginHorizontal: 30,
        shadowColor: '#004aad',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 15,
        shadowColor: '#004aad',
    },
    spinnerTextStyle: {
        color: '#004AAD'
    },
    iconLeft: {
        position: 'absolute',
        left: 8,
        top: 12
    },
    iconRight: {
        position: 'absolute',
        right: 12,
        top: 7,
        padding: 5
    }
})