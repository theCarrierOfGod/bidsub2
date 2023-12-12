import React from 'react'
import Spinner from 'react-native-loading-spinner-overlay'

const Loader = (
    {
        spinning,
    }
) => {
    return (
        <Spinner
            visible={spinning}
            animation='fade'
            size={'large'}
            color="#004aad"
        />
    )
}

export default Loader