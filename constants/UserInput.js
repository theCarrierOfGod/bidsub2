import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const UserInput = ({
    title,
    iconname = "",
    value,
    setValue,
    inputMode = 'text',
    secureTextEntry = false,
    error = "",
    readOnly = false
}) => {

    return (
        <View style={{ width: '90%', alignSelf: 'center', marginVertical: 15 }}>
            <Ionicons name={iconname} size={20} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
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
                value={value}
                onChangeText={
                    (text) => setValue(text)
                }
                autoCorrect={false}
                inputMode={inputMode}
                secureTextEntry={secureTextEntry}
                placeholder={title}
                autoCapitalize={inputMode === 'email' ? 'none' : 'words'}
                readOnly={readOnly}
            />
            {secureTextEntry ? <Ionicons name="eye" size={20} style={styles.iconRight} color="rgba(0,0,0,0.3)" /> : null}
            {error.length != 0 ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
        </View>
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

export default UserInput