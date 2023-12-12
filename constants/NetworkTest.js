import React from 'react'

export const NetworkTest = (gsmNumber, returnTitle = true, gsmLength = 11) => {
    //gsm prefixes
    const prefixes = {
        "01": ["0803", "0703", "0903", "0806", "0706", "0813", "0810", "0814", "0816", "0906", "0913", "0916", "07025", "07026", "0704"],
        "02": ["0805", "0705", "0905", "0807", "0815", "0811", "0915"],
        "03": ["0809", "0909", "0817", "0818", "0908"],
        "04": ["0802", "0902", "0701", "0808", "0708", "0812", "0901", "0904", "0907", "0912"],
    };

    const prefixesTitle = {
        "01": "MTN",
        "02": "GLO",
        "03": "9MOBILE",
        "04": "AIRTEL",
    };

    // Remove + sign if present
    const number = gsmNumber.replace("+", "");

    // Remove country code if present
    if (number.slice(0, 3) === "234") {
        number = number.slice(3);
    }

    // Check if the number is the correct length
    if (number.length !== gsmLength) {
        return "";
    }

    // Get the signature of the number
    const signature = number.slice(0, 4);

    // Loop through the prefixes and check if the number matches any of them
    for (const [gsmCode, prefix] of Object.entries(prefixes)) {
        if (prefix.includes(signature)) {
            // Found a match
            if (returnTitle) {
                return prefixesTitle[gsmCode];
            } else {
                return gsmCode;
            }
        }
    }

    return "";
}
