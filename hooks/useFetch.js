// https://www.api.rhymarworld.org.ng/category/specific/?category=Ladies%20fashion%20slippers&limit=30&offset=0

import { useState, useEffect } from "react";
import axios from "axios";
import { useHook } from "./Hook";
import { useAuth } from "./Auth";

const useFetch = (endpoint, query) => {
    const hook = useHook();
    const auth = useAuth()
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const options = {
        method: "GET",
        url: `${hook.api}api/${endpoint}`,
        headers: {
            "Token": auth.token,
        },
        params: { ...query },
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.request(options);
            setData(response.data);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => {
        setIsLoading(true);
        setError('');
        fetchData();
    };

    return { data, isLoading, error, refetch };
};

export default useFetch;