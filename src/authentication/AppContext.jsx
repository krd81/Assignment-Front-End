import { createContext, useState, useEffect } from 'react';
import decoder from './decoder';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentListing, setCurrentListing] = useState(null);
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch('https://assignment-back-end.onrender.com/users/', {
        // const userRes = await fetch('http://localhost:8002/users/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        const usersData = await userRes.json();
        setUsers(usersData);

        const listingsRes = await fetch('https://assignment-back-end.onrender.com/listings/', {
        // const listingsRes = await fetch('http://localhost:8002/listings/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        const listingsData = await listingsRes.json();
        setListings(listingsData);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const setUser = setTimeout(() => {
      const token = sessionStorage.getItem('token');
      const decodedToken = decoder(token);
      const user = users.find(user => user._id === decodedToken._id);

      setCurrentUser(user);
    }, 500);

    return () => clearTimeout(setUser);
  }, [users]);

  return (
    <AppContext.Provider
      value={{
        allUsers: [users, setUsers],
        allListings: [listings, setListings],
        loggedInUser: [currentUser, setCurrentUser],
        listing: [currentListing, setCurrentListing],
        profile: [profileUser, setProfileUser],
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
