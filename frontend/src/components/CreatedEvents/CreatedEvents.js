import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./CreatedEvents.css";
import { useContext } from 'react';
import { UserContext } from '../../Providers/UserProvider';
import { Link } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EventCard from '../EventCard/EventCard';




function AddEventCard() {
  return (
    <div className="card">
      <Link style={{textDecoration:"none"}} to="/create-event">
        <div className="card-body text-center">
        <FontAwesomeIcon style={{fontSize:90}} icon={faPlus} />
        </div>
      </Link>
    </div>
  );
}



function CreatedEventsPage() {
  const [events, setEvents] = useState([]);
  const { user, setUser } = useContext(UserContext);


  useEffect(() => {
    axios.post(process.env.REACT_APP_BASE_URL+"/todos/created-events", {email:user.email}, { withCredentials: true })
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div className="events-container">
        {events.map(event => (
         <Link style={{textDecoration:"none"}} key={event._id} to={`checkin/${event._id}`}><EventCard key={event._id} title={event.name} short_description={event.short_description} banner={event.bannerURL} category={event.category} location={event.location} price={event.price}  /> </Link>
        ))}
        <AddEventCard/>
    </div>
  );
}

export default CreatedEventsPage;
