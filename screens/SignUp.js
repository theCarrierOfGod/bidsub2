import React, { useState } from 'react'
import UserInput from '../constants/UserInput';
import SubmitButton from '../constants/SubmitButton';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, ScrollView, Text, Pressable, View, StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';
import query from '../constants/query';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const SignUp = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [fullname, setFullname] = useState('');
    const [fullnameError, setFullnameError] = useState('');
    const [emailError, setEmailError] = useState('')
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('')
    const [phoneError, setPhoneError] = useState('')
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [cpasswordError, setCPasswordError] = useState('');
    const [seePd, setSeePd] = useState(false)
    const [seeCPd, setSeeCPd] = useState(false)
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');


    const handleSubmit = async () => {
        setLoading(true)
        setUsernameError('');
        setFullnameError('');
        setEmailError('');
        setPhoneError('');
        setPasswordError('');
        setCPasswordError('');

        if (username.length === 0 || username.length < 5) {
            setUsernameError('Username length must be grater than 5');
            setLoading(false)
            return
        }

        if (fullname.length === 0 || fullname.length < 5) {
            setFullnameError('Full name length must be grater than 5');
            setLoading(false)
            return
        }

        if (email.length === 0 || email.length < 5) {
            setEmailError('Invalid email');
            setLoading(false)
            return
        }

        if (phone.length === 0 || phone.length < 11) {
            setPhoneError('Invalid phone number');
            setLoading(false)
            return
        }

        if (password.length === 0 || password.length < 8) {
            setPasswordError('Minimum password length is 8');
            setLoading(false)
            return
        }

        if (cpassword.length === 0 || cpassword.length !== password.length) {
            setPasswordError('Password mismatch');
            setLoading(false)
            return
        }

        let data = {
            username: username,
            fullname: fullname,
            email: email,
            phone: phone,
            password: password,
            cpassword: cpassword,
        }

        try {
            const response = await axios.post(`${query.baseUrl}sign/up`, data);
            if (response.data.success) {
                setAlertMsg(response.data.message);
                setShowAlert(true)
                AsyncStorage.setItem('veryName', username);
            } else {
                if (response.data.error.source === 'username') {
                    setUsernameError(response.data.error.message);
                }
                if (response.data.error.source === 'fullname') {
                    setFullnameError(response.data.error.message);
                }
                if (response.data.error.source === 'email') {
                    setEmailError(response.data.error.message);
                }
                if (response.data.error.source === 'phone') {
                    setPhoneError(response.data.error.message);
                }
                if (response.data.error.source === 'password') {
                    setPasswordError(response.data.error.message);
                }
                if (response.data.error.source === 'cpassword') {
                    setCPasswordError(response.data.error.message);
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }
    return (
        <ScrollView>
            <KeyboardAvoidingView>
                <View
                    style={{
                        marginTop: 120,
                        backgroundColor: '#ffffff',
                        flex: 1,
                        justifyContent: 'center',
                        paddingBottom: 50,
                        borderTopEndRadius: 30,
                        borderTopStartRadius: 30,
                    }}
                >
                    <AwesomeAlert
                        show={showAlert}
                        showProgress={false}
                        title="Registration"
                        message={alertMsg}
                        closeOnTouchOutside={true}
                        closeOnHardwareBackPress={false}
                        showCancelButton={false}
                        showConfirmButton={false}
                        confirmText="Proceed"
                        onDismiss={() => {
                            navigation.navigate('SignIn')
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 32,
                            fontWeight: 'bold',
                            padding: 20
                        }}
                    >
                        Get started
                    </Text>
                    <Text
                        style={{
                            color: 'rgba(0,0,0,0.3)',
                            fontSize: 18,
                            paddingHorizontal: 20
                        }}
                    >
                        Create an account so you can pay your bills and purchasetop-ups faster
                    </Text>
                    <View
                        style={{
                            marginTop: 70,
                            backgroundColor: '#ffffff',
                            flex: 1
                        }}
                    >
                        <UserInput
                            title='Username'
                            value={username}
                            setValue={setUsername}
                            iconname="person-outline"
                            error={usernameError}
                        />
                        {usernameError.length > 0 ? (
                            <>
                                <Text style={{ color: 'red', fontSize: 12, marginTop: 0, marginLeft: 25 }} >{usernameError}</Text>
                            </>
                        ) : null}

                        <UserInput
                            title='Full Name'
                            value={fullname}
                            setValue={setFullname}
                            iconname="person-outline"
                            error={fullnameError}
                        />
                        {fullnameError.length > 0 ? (
                            <>
                                <Text style={{ color: 'red', fontSize: 12, marginTop: 0, marginLeft: 25 }} >{fullnameError}</Text>
                            </>
                        ) : null}

                        <UserInput
                            title='Email'
                            inputMode="email"
                            value={email}
                            setValue={setEmail}
                            iconname="mail-outline"
                            error={emailError}
                        />
                        {emailError.length > 0 ? (
                            <>
                                <Text style={{ color: 'red', fontSize: 12, marginTop: 0, marginLeft: 25 }} >{emailError}</Text>
                            </>
                        ) : null}

                        <UserInput
                            title='Phone Number'
                            value={phone}
                            inputMode="numeric"
                            setValue={setPhone}
                            iconname='call-outline'
                            error={phoneError}
                        />
                        {phoneError.length > 0 ? (
                            <>
                                <Text style={{ color: 'red', fontSize: 12, marginTop: 0, marginLeft: 25 }} >{phoneError}</Text>
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
                                    (text) => setPassword(text)
                                }
                                autoCorrect={false}
                                secureTextEntry={!seePd}
                                placeholder={'Password'}
                                autoCapitalize="none"
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

                        {passwordError.length > 0 ? (
                            <>
                                <Text style={{ color: 'red', fontSize: 12, marginTop: 0, marginLeft: 25 }} >{passwordError}</Text>
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
                                value={cpassword}
                                onChangeText={
                                    (text) => {
                                        setCPassword(text)
                                        setCPasswordError('')
                                    }
                                }
                                autoCorrect={false}
                                secureTextEntry={!seeCPd}
                                placeholder={'Confirm Password'}
                                autoCapitalize="none"
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
                            {cpasswordError ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
                        </View>
                        {cpasswordError.length > 0 ? (
                            <>
                                <Text style={{ color: 'red', fontSize: 12, marginTop: 0, marginLeft: 25 }} >{cpasswordError}</Text>
                            </>
                        ) : null}

                        <SubmitButton title={'Continue'} loading={loading} disabled={loading} handleSubmit={handleSubmit} />

                        <Text
                            style={{
                                color: 'rgba(0,0,0,0.3)',
                                fontSize: 18,
                                paddingHorizontal: 20,
                                textAlign: 'center',
                                marginTop: 20,
                            }}
                        >
                            Already have an account?
                            <Pressable
                                onPress={() => navigation.replace('SignIn')}
                            >
                                <Text style={{ color: '#004aad', fontWeight: 'bold' }}> Sign in</Text>
                            </Pressable>
                        </Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default SignUp

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
