// AuthContext allows access based on a valid token being present
// The login/logout functions are used to set and remove the token from sessionStorage
// It can also return the token to the caller
import { createContext, useState, useEffect } from 'react';
export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    // Occurs when the component mounts
    useEffect(() => {
        const token = sessionStorage.getItem('token')
        if (token) {
            setToken(token)
        }
    }, [])

    // eslint-disable-next-line no-unused-vars
    const login = (newToken) => {
        sessionStorage.setItem('token', newToken)
        setToken(newToken)


      }

    // eslint-disable-next-line no-unused-vars
    const logout = () => {
        sessionStorage.removeItem('token')
        setToken(null)
    }


    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}