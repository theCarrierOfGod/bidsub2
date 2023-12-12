import React from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from "react-native"

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9)

const CarouselCardItem = ({ item, index }) => {
    return (
        <View style={styles.container} key={index}>
            <Image
                source={{ uri: item.imgUrl }}
                style={styles.image}
            />
            <Text
                style={styles.header}
            >
                {item.title}
            </Text>
            <Text
                style={styles.text}
            >
                {item.body}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        borderRadius: 8,
        width: ITEM_WIDTH,
        shadowOpacity: 0.04,
        shadowRadius: 2,
        borderRadius: 20,
    },
    image: {
        width: ITEM_WIDTH,
        height: '65%',
        borderRadius: 20,
        marginBottom: 20,
        padding: 10,
        marginTop: 50,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    text: {
        fontSize: 15,
        fontWeight: 'normal',
        textAlign: 'center',
        marginBottom: 15,
        lineHeight: 20,
        color: 'rgba(0, 0, 0, 0.3)'
    }
})

export default CarouselCardItem