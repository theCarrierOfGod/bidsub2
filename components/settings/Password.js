import { StyleSheet, Switch, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Password = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => {
        if (isEnabled) {
            setIsEnabled(false);
            AsyncStorage.removeItem('RememberPassword');
        } else {
            setIsEnabled(true);
            AsyncStorage.setItem('RememberPassword', 'yes');
        }
        console.log()
    };

    const getUsername = async () => {
        try {
            await AsyncStorage.getItem('RememberPassword')
                .then(value => {
                    if (value != null) {
                        setIsEnabled(true)
                    }
                })
        } catch (error) {
            console.error();
        }
    }

    useEffect(() => {
        getUsername();
    }, [])
    return (
        <View
            style={styles.inline}
        >
            <Text>
                Enter password whenever you open the app
            </Text>
            <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isEnabled ? '#004aad' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
        </View>
    )
}

export default Password

const styles = StyleSheet.create({
    inline: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})