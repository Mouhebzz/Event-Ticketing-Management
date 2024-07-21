import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateEvent.css";
import axios from 'axios';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    description: "",
    bannerURL: "",
    location: "",
    start_date: "",
    end_date: "",
    category: "",
    price: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post(process.env.REACT_APP_BASE_URL+'/todos/create-event', 
        formData,
        { withCredentials: true }
      )
      .then(function (response) {
        console.log(response);
        navigate('/');
      })
      .catch(function (error) {
        console.log(error.response.data.error);
        console.log(error);
      });
      
  };

  return (
    <section className="create">
      <h2>Create Your Event</h2>
      <div className="create__container">
        <div className="create__guide">
          <h3>Your journey to event management starts here!</h3>
        </div>
        <form className="create__form" onSubmit={handleSubmit}>
          <div className="step first__step" >
            <input
              onChange={handleChange}
              type="text"
              name="name"
              placeholder="Your Event Name"
              value={formData.name}
            />
            <textarea
              onChange={handleChange}
              maxLength="200"
              name="short_description"
              placeholder="A short description for your event (max 200 characters)"
              value={formData.short_description}
            />
            <textarea
              onChange={handleChange}
              name="description"
              placeholder="Describe your event in details"
              value={formData.description}
            />
            <input
              onChange={handleChange}
              type="text"
              name="bannerURL"
              placeholder="Banner URL"
              value={formData.bannerURL}
            />
            <input
              onChange={handleChange}
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
            />
            <input
              onChange={handleChange}
              type="datetime-local"
              name="start_date"
              placeholder="Start Date"
              value={formData.start_date}
            />
            <input
              onChange={handleChange}
              type="datetime-local"
              name="end_date"
              placeholder="End Date"
              value={formData.end_date}
            />
            <select
              onChange={handleChange}
              name="category"
              value={formData.category}
            >
              <option value="">-- Select a Category --</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Arts & Theater">Arts & Theater</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Others">Others</option>
            </select>
            <input
              onChange={handleChange}
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Event
          </button>
        </form>
      </div>
    </section>
  )
};

export default CreateEvent;
