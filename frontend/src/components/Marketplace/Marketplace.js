import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Marketplace.css";
import { Link } from 'react-router-dom';
import EventCard from '../EventCard/EventCard';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get(process.env.REACT_APP_BASE_URL+"/events")
      .then(response => {
        setEvents(response.data.events);
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
    // Add more criteria if needed, such as date or category
  );

  return (
    <div>
      <div className="events-page">
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search Events"
          className="search-input"
        />
      </div>
      </div>

      {filteredEvents.length !== 0 ? (
        <div className="events-container">
          {filteredEvents.map(event => (
            <Link style={{ textDecoration: "none" }} key={event._id} to={`/${event._id}`}>
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
        <p style={{ textAlign: "center", color: "grey" }}>No events match the search criteria.</p>
      )}
    </div>
  );
}

export default EventsPage;
