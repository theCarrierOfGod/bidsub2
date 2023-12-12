import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useHook } from "./Hook";
import axios from "axios";
import swal from "sweetalert";
import Swal from "sweetalert2";

const AuthContext = createContext(null);

export const Auth = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const id = window.localStorage.getItem('id');
    const hook = useHook();
    const email = window.localStorage.getItem('email');
    const token = window.localStorage.getItem('token');
    const [role, setRole] = useState(window.localStorage.getItem('role'))
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [userDetails, setUserDetails] = useState([]);

    const checkIfLoggedIn = () => {
        if (window.localStorage.getItem('email')) {
            setIsLoggedIn(true);
            setRole(window.localStorage.getItem('role'));
            updateDetails();
            setUserDetails(JSON.parse(window.localStorage.getItem('details')));
        } else {
            setIsLoggedIn(false);
        }
    }

    const storeActiveToken = (email, token, details, role, id) => {
        window.localStorage.setItem('token', token);
        window.localStorage.setItem('email', email);
        window.localStorage.setItem('role', role);
        window.localStorage.setItem('id', id);
        window.localStorage.setItem('details', JSON.stringify(details));
        setRole(role)
        setUserDetails(details);
        checkIfLoggedIn();
    }

    const logOut = async () => {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${hook.api}api/logout`,
            data: {
                "email": email,
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        };

        try {
            let response = await axios(config)
                .then((response) => {
                    window.localStorage.clear();
                    Swal({
                        title: 'Session',
                        text: 'Ended'
                    })
                })
        } catch (error) {
            console.log(error)
        } finally {
            setTimeout(() => {
                navigate('/auth/login')
            }, 1000);
        }
    }

    const updateDetails = async () => {
        try {
            let response = await axios.get(`${hook.api}api/profile/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((response) => {
                    window.localStorage.setItem('details', JSON.stringify(response.data.user));
                    setUserDetails(response.data.user)
                    if(response.data.role.length === 0) {
                        setRole('Role Not Defined');
                        window.localStorage.setItem('role', 'Role Not Defined');
                    } else {
                        setRole(response.data.role[0]);
                        window.localStorage.setItem('role', response.data.role[0]);
                        console.log(response.data.role[0])
                    }
                })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        checkIfLoggedIn();
    }, [location]);

    return (
        <AuthContext.Provider value={{ id, email, token, isLoggedIn, role, storeActiveToken, logOut, userDetails, updateDetails,  }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}