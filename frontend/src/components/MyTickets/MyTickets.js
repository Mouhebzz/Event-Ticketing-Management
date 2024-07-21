import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import "./MyTickets.css";
import { Link } from 'react-router-dom';
import EventCard from '../EventCard/EventCard';
import { UserContext } from '../../Providers/UserProvider';

function MyTickets() {
  const [events, setEvents] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    axios.post(process.env.REACT_APP_BASE_URL+"/todos/mytickets", { email: user.email }, { withCredentials: true })
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      {events.length !== 0 ? (
        <div className="events-container">
          {events.map(event => (
            <Link
              key={event._id}
              to={`/ticket/${event._id}`}
              style={{ textDecoration: "none" }}
            >
              <EventCard
                key={event._id}
                title={event.name}
                short_description={event.short_description}
                banner={event.bannerURL}
                category={event.category}
                location={event.location}
                price={event.price}
              />
            </Link>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "grey" }}>
          You haven't purchased any events yet.
        </p>
      )}
    </div>
  );
}

export default MyTickets;
