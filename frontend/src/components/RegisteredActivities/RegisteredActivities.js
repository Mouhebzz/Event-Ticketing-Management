// RegisteredActivitiesPage.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../Providers/UserProvider';
import { useParams } from 'react-router-dom';
import './RegisteredActivities.css';

const RegisteredActivitiesPage = () => {
  const [registeredActivities, setRegisteredActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const { eventId } = useParams();

  useEffect(() => {
    fetchRegisteredActivities();
  }, []);

  const fetchRegisteredActivities = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL+`/eventactivity/${eventId}/registered-activities?userId=${user._id}`,
        {},
        { withCredentials: true }
      );
      setRegisteredActivities(response.data.activities);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch registered activities:', error);
      setError('Failed to fetch registered activities');
      setIsLoading(false);
    }
  };

  const handleUnregister = async (activityId) => {
    try {
        const response = await axios.post(process.env.REACT_APP_BASE_URL+`/eventactivity/unregister/${eventId}/${activityId}`, { userId: user._id }, { withCredentials: true });
        if (response.status === 200) {
            alert('Unregistered for the activity with ID: ' + activityId);
        } else {
            alert('Failed to unregister for the activity. Please try again.');
        }
    } catch (error) {
        console.error('Failed to unregister for the activity:', error);
        alert(error.response.data.error+'. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Registered Activities</h2>
      {registeredActivities.length === 0 ? (
        <p>No activities registered.</p>
      ) : (
        <div className="registered-activity-cards">
          {registeredActivities.map((activity) => (
            <div className="registered-activity-card" key={activity._id}>
              <h3>{activity.name}</h3>
              <p>{activity.description}</p>
              <p>Time: {activity.time}</p>
              <p>Location: {activity.location}</p>
              <button
                className="unregister-button"
                onClick={() => handleUnregister(activity._id)}
              >
                Unregister
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegisteredActivitiesPage;
