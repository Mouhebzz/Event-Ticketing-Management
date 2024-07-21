import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import "./CreateEventActivity.css";

const CreateEventActivity = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    time: "",
    location: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post(process.env.REACT_APP_BASE_URL+`/events/${eventId}/create-activity`, 
        formData,
        { withCredentials: true }
      )
      .then(function (response) {
        console.log(response);
        navigate(`/created-events/checkin/${eventId}`);
      })
      .catch(function (error) {
        console.log(error.response.data.error);
        console.log(error);
      });
  };

  return (
    <section className="create-event-activity">
      <h2>Create Event Activity</h2>
      <div className="create-event-activity__container">
        <div className="create-event-activity__guide">
          <h3>Add an activity to your event</h3>
        </div>
        <form className="create-event-activity__form" onSubmit={handleSubmit}>
          <div className="create-event-activity__form-fields">
            <input
              onChange={handleChange}
              type="text"
              name="name"
              placeholder="Activity Name"
              value={formData.name}
            />
            <textarea
              onChange={handleChange}
              name="description"
              placeholder="Activity Description"
              value={formData.description}
            />
            <input
              onChange={handleChange}
              type="datetime-local"
              name="time"
              placeholder="Activity Time"
              value={formData.time}
            />
            <input
              onChange={handleChange}
              type="text"
              name="location"
              placeholder="Activity Location"
              value={formData.location}
            />
          </div>
          <button type="submit" className="create-event-activity__btn">
            Create Activity
          </button>
        </form>
      </div>
    </section>
  )
};

export default CreateEventActivity;
