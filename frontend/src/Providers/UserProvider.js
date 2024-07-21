/* This code is creating a React context called `UserContext` and a provider component called
`UserProvider`. The `UserProvider` component sets up state using the `useState` hook to keep track
of the current user and whether the component is still loading. It also uses the `useEffect` hook to
check if there is a stored user in local storage and load the current user if there isn't. The
`loadCurrentUser` function makes an API call to get the current user and sets the user state
accordingly. The `checkCookie` function checks if a cookie with a given name exists. The
`UserContext.Provider` component provides the `user` and `setUser` values to any child components
that need them. Finally, the `UserProvider` component is exported along with the `UserContext`. */


import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext({
  user: null,
  setUser: () => {},
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function checkCookie(cookieName) {
    const cookies = document.cookie.split(';');
    if (cookies.length === 0) return false;
    
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${cookieName}=`)) {
        return true;
      }
      
    }
    
    return false;
  }


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      setUser(storedUser);
      setLoading(false);
    } else {
      loadCurrentUser();
    }
  }, []);

  const loadCurrentUser = async () => {
    try {
      if(checkCookie("access-token")){
        const response = await axios.get(process.env.REACT_APP_BASE_URL+"/user/current-user", {
          withCredentials: true,
        });
        
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {loading ? <div>Loading...</div> : children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
