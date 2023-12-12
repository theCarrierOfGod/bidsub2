import { KeyboardAvoidingView, Pressable, ScrollViScrollView, ew, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import SubmitButton from '../constants/SubmitButton';
import axios from 'axios';
import query from '../constants/query';
import { useIsFocused } from '@react-navigation/native';
import SuccessBox from '../components/SuccessBox';
import UserInput from '../constants/UserInput';
import Loader from '../constants/Loader';


const EditInfo = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('')

    const [fullnameError, setFullnameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [pinError, setPinError] = useState(null);
    const [seePin, setSeePin] = useState(false);

    const [loading, setLoading] = useState(true);
    const [spinning, setSpinning] = useState(false)

    const [error, setError] = useState(null);

    const fetchNow = async (user) => {
        try {
            const response = await axios.get(`${query.baseUrl}user/${user}`);
            if (response.data) {
                setUsername(response.data[0].username);
                setPhone(response.data[0].phonenumber);
                setEmail(response.data[0].email);
                setFullname(response.data[0].fullname)
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
                        fetchNow(value)
                    }
                })
        } catch (error) {
            console.error();
        }
    }

    useEffect(() => {
        getUsername();
    }, [isFocused]);

    const updateInfo = async () => {
        setSpinning(true);
        setError(null);

        if (fullname.length === 0 || fullname.length < 5) {
            setFullnameError('Full name length must be grater than 5');
            setSpinning(false)
            return
        }

        if (phone.length === 0 || phone.length < 11) {
            setPhoneError('Invalid phone number');
            setSpinning(false)
            return
        }

        if (pin.length < 4) {
            setPinError('Invalid transaction pin');
            setSpinning(false);
            return
        }

        let data = {
            username: username,
            fullname: fullname,
            phonenumber: phone,
            pin: pin,
        }

        try {
            const response = await axios.post(`${query.baseUrl}profile/personal/update`, data);
            if (response.data.success) {
                setError('Information Updated');

                setTimeout(() => {
                    setError(false);
                    navigation.goBack();
                }, 3000);
            } else {
                setError(response.data.error.message);
            }
        } catch (error) {
            console.log(error)
            setError("connection error");
        } finally {
            setSpinning(false);
        }
    }

    if (loading) {
        return <Loader />
    }

    return (
        <ScrollView style={styles.container}>
            <KeyboardAvoidingView>
                <View
                    style={{
                        flex: 0,
                        width: '95%',
                        marginHorizontal: '2.5%',
                    }}
                >
                    <UserInput
                        title='Full Name'
                        value={username}
                        iconname="person-outline"
                        readOnly={true}
                    />

                    <UserInput
                        title='Email'
                        inputMode="email"
                        value={email}
                        iconname="mail-outline"
                        readOnly={true}
                    />

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

                    {error !== null ? (
                        <SuccessBox message={error} />
                    ) : null}
                    <SubmitButton
                        loading={spinning}
                        disabled={spinning}
                        title={'Update Info'}
                        handleSubmit={
                            () => {
                                updateInfo();
                            }
                        }
                    />
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}


export default EditInfo


const styles = StyleSheet.create({
    container: {
        flex: 0,
        height: "100%",
        marginTop: 12,
    },
    headerText: {
        fontSize: 32,
        fontFamily: 'Rubik-Regular',
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 20,
        marginHorizontal: 10,
        lineHeight: 35,
        color: '#000000'
    },
    icon: {
        marginBottom: 20
    },
    eachNetwork: {
        position: 'relative',
        width: 70,
        height: 70,
    },
    networkBox: {
        flex: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    networkIcon: {
        width: 70,
        height: 70,
        borderRadius: 10,
        borderWidth: 0,
    },
    selectedNetwork: {
        position: 'absolute',
        backgroundColor: '#fff',
        top: 5,
        right: 5,
        borderRadius: 50,
        fontWeight: 'bold'
    },
    text: {
        fontSize: 20,
        fontFamily: 'Rubik-Bold',
        fontWeight: 'normal',
        marginBottom: 2,
        marginHorizontal: 10,
        marginTop: 15,
        lineHeight: 32,
        color: '#000000',
    },
    amountChoose: {
        flex: 0,
        backgroundColor: '#004aad',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#004aad',
        width: 80,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
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

