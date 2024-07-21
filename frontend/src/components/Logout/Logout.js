import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Logout.css'

function LogoutButton() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.get(process.env.REACT_APP_BASE_URL+'/user/logout', {withCredentials:true}); // send a logout request to your backend
      localStorage.removeItem('user'); // remove the user data from local storage
      // update your application state to reflect that the user is no longer logged in
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className='navbar__btn' onClick={handleLogout} disabled={loading}>
      Logout
    </button>
  );
}

export default LogoutButton;
