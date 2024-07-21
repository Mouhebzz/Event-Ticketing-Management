import { Link } from 'react-router-dom';
import LogoutButton from '../Logout/Logout';
import { useEffect, useState } from 'react';
import "./Navbar.css";
import image from "../../logo.png";




export default function Navbar(props) {
  console.log(image);
    const [loggedIn, setLoggedIn]= useState(props.isLoggedIn);
    useEffect(() => {
        const interval = setInterval(() => {
          const isLoggedInNow = props.isLoggedIn();
          if (isLoggedInNow !== loggedIn) {
            setLoggedIn(isLoggedInNow);
          }
        }, 1000);
        return () => clearInterval(interval);
      }, [loggedIn]);

  return (
    <nav className="navbar">
    <Link to="/" className="navbar__logo">
      <img src={image} alt="Logo" className="navbar__logo-img" />
    </Link>
    <div className='navbar__center'>
    <Link style={{border:"none"}} className='navbar__btn' to="/created-events">Created Events</Link>
    <Link style={{border:"none"}} className='navbar__btn' to="/mytickets">My Tickets</Link>
    </div>
    <div className="navbar__right">
      {loggedIn ? (
        <LogoutButton className="logout_btn" />
      ) : (
        <Link to="/login" className="navbar__btn">
          Sign In
        </Link>
      )}
    </div>
  </nav>
  );
}
