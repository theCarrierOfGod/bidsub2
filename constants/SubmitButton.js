import React from 'react'
import { Pressable, View, Text, ActivityIndicator } from 'react-native'

const SubmitButton = ({ title, handleSubmit, loading, disabled }) => {
    return (
        <View style={{ alignItems: 'center', flex: 0 }}>
            <Pressable
                style={{
                    width: '90%',
                    height: 50,
                    backgroundColor: '#004aad',
                    borderRadius: 10,
                    color: 'white',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 0,
                    marginTop: 50
                }}
                onPress={handleSubmit}
                disabled={disabled}
            >
                <Text bold medium center
                    style={{
                        color: "#fff",
                        fontFamily: 'Rubik-Bold',
                        fontSize: 20,
                    }} >
                    {loading ? <ActivityIndicator size='small' color="white" /> : title}
                </Text>
            </Pressable>
        </View>
    )
}

export default SubmitButton