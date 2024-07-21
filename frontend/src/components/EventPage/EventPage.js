import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./EventPage.css";
import { UserContext } from "../../Providers/UserProvider";
import isLoggedIn from "../auth";

const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user}=useContext(UserContext);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BASE_URL+`/events/${eventId}`)
      .then((res) => {
        setEvent(res.data.event);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setError(err.message);
      });
  }, [eventId]);

  const handleBuyTicketClick = () => {
    if(isLoggedIn()){
    const userId = user._id; 
    axios
      .post(
        process.env.REACT_APP_BASE_URL+"/todos/buy",
        { eventId:eventId, userId:userId },
        { withCredentials: true }
      )
      .then((res) => {
        // handle successful payment
        alert("Payment successful!");
      })
      .catch((err) => {
        // handle failed payment
        alert("Payment failed! "+ err.response.data.error);
        console.log(err);
      });
      
    }
    else{
      alert("Please login to buy tickets")
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="event-page-container">
      <div className="event-banner-container">
        <img src={event.bannerURL} alt={event.name} className="event-banner" />
      </div>
      <h2 className="event-title">{event.name}</h2>
      <div className="event-details-container">
        <div className="event-details">
          <p className="event-detail-label">Location:</p>
          <p className="event-detail">{event.location}</p>
        </div>
        <div className="event-details">
          <p className="event-detail-label">Start Date:</p>
          <p className="event-detail">{event.start_date}</p>
        </div>
        <div className="event-details">
          <p className="event-detail-label">End Date:</p>
          <p className="event-detail">{event.end_date}</p>
        </div>
        <div className="event-details">
          <p className="event-detail-label">Price:</p>
          <p className="event-detail">${event.price.$numberDecimal}</p>
        </div>
      </div>
      <button className="buy-ticket-button" onClick={handleBuyTicketClick}>Buy Ticket</button>
    </div>
  );
};

export default EventPage;
