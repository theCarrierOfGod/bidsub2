import { useState, useEffect } from "react";
import axios from "axios";

const getUser = () => {
    const [user, setData] = useState([]);
    const [gettingUser, setIsLoading] = useState(false);
    const [userError, setError] = useState(null);

    const getNow = async (username) => {
        const options = {
            method: method,
            url: `https://bidsub.com.ng/api/user${username}`,
        };
        try {
            const response = await axios.request(options);

            setData(response.data);
            setIsLoading(false);
        } catch (error) {
            setError(error);
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    const fetchData = async () => {
        setIsLoading(true);
        try {
            await AsyncStorage.getItem('UserName')
                .then(value => {
                    if (value != null) {
                        let username = JSON.parse(value);
                        getNow(username);
                    }
                });
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refetchUser = () => {
        setIsLoading(true);
        fetchData();
    };

    return { user, gettingUser, userError, refetchUser };
};

export default getUser;