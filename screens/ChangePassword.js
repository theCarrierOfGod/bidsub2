import { StyleSheet, Text, ScrollView, View, Pressable, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import SubmitButton from '../constants/SubmitButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import query from '../constants/query';

const ChangePassword = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [username, setUsername] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [seeOldPassword, setseeOldPassword] = useState(false);
    const [oldPasswordError, setOldPasswordError] = useState(null);

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(null)
    const [seePd, setSeePd] = useState(false)

    const [cpassword, setCPassword] = useState('');
    const [passwordCError, setPasswordCError] = useState(null)
    const [seeCPd, setSeeCPd] = useState(false)

    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('')

    const [loading, setLoading] = useState(false);

    const handleSub = async () => {
        setLoading(true)
        setOldPasswordError(null)
        setPasswordCError(null);
        setPasswordError(null);
        if (oldPassword.length === 0) {
            setOldPasswordError('Old password is required');
            setLoading(false)
            return;
        }
        if (password.length === 0) {
            setPasswordError('New password is required');
            setLoading(false)
            return;
        }
        if (cpassword.length === 0) {
            setPasswordCError('Confirm new password is required');
            setLoading(false)
            return;
        }

        if(password !== cpassword) {
            setPasswordError('Password mismatch');
            setPasswordCError('Password mismatch');
            setLoading(false)
            return;
        }
        const data = {
            op: oldPassword,
            username: username,
            np: password,
            cnp: cpassword,
        }
        try {
            const response = await axios.post(`${query.baseUrl}profile/password/update`, data);
            if (response.data.success) {
                setShowAlert(true)
                setAlertMsg(response.data.success)
            } else {
                setOldPasswordError(response.data.error);
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
                <Text style={styles.headerText}>Change your Password</Text>
                <View>
                    <Text style={styles.text}>
                        Old Password
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
                            value={oldPassword}
                            onChangeText={
                                (text) => {
                                    setOldPassword(text)
                                    setOldPasswordError(null)
                                }
                            }
                            autoCorrect={false}
                            secureTextEntry={!seeOldPassword}
                            placeholder={'Old Password'}
                            inputMode='text'
                            autoComplete='off'
                            autoCapitalize="none"
                        />
                        <Pressable
                            style={styles.iconRight}
                            onPress={() => {
                                if (seeOldPassword)
                                    setseeOldPassword(false)
                                else
                                    setseeOldPassword(true)
                            }}
                        >
                            <Ionicons name={seeOldPassword ? 'ios-eye-off-outline' : 'ios-eye-outline'} size={20} color="rgba(0,0,0,0.3)" />
                        </Pressable>
                        {oldPasswordError !== null ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
                    </View>
                    {oldPasswordError !== null ? (
                        <>
                            <Text style={{ color: 'red', fontSize: 12, marginTop: 10, marginLeft: 25 }} >{oldPasswordError}</Text>
                        </>
                    ) : null}


                    <Text style={styles.text}>
                        New Password
                    </Text>
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
                                    setPasswordError(null)
                                }
                            }
                            autoCorrect={false}
                            secureTextEntry={!seePd}
                            placeholder={'New Password'}
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


                    <Text style={styles.text}>
                        Confirm New Password
                    </Text>
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
                            value={cpassword}
                            onChangeText={
                                (text) => {
                                    setCPassword(text);
                                    setPasswordCError(null)
                                }
                            }
                            autoCorrect={false}
                            secureTextEntry={!seeCPd}
                            placeholder={'Confirm New Password'}
                            autoCapitalize="none"
                            autoComplete='off'
                        />
                        <Pressable
                            style={styles.iconRight}
                            onPress={() => {
                                if (seeCPd)
                                    setSeeCPd(false)
                                else
                                    setSeeCPd(true)
                            }}
                        >
                            <Ionicons name={seeCPd ? 'ios-eye-off-outline' : 'ios-eye-outline'} size={20} color="rgba(0,0,0,0.3)" />
                        </Pressable>
                        {passwordError ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
                    </View>

                    {passwordCError !== null ? (
                        <>
                            <Text style={{ color: 'red', fontSize: 12, marginTop: 10, marginLeft: 25 }} >{passwordCError}</Text>
                        </>
                    ) : null}
                </View>
                <SubmitButton loading={loading} disabled={loading} handleSubmit={handleSub} title={'Set Password'} />
            </View>
        </ScrollView>
    )
}

export default ChangePassword

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
    soldPasswordnerTextStyle: {
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