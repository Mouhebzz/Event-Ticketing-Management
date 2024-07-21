import React, { useState, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../Providers/UserProvider';
import './RegisterActivity.css';


const RegisterActivity = () => {

    const [eventActivities, setEventActivities] = useState([]);
    const { user } = useContext(UserContext);
    const { eventId } = useParams();
    
    useEffect(() => {
        fetchEventActivities();
        
    }, []);
    
    const fetchEventActivities = async () => {
        try {
        const response = await axios.post(process.env.REACT_APP_BASE_URL+`/events/${eventId}/activities`, {}, { withCredentials: true });
        setEventActivities(response.data.activities);
        } catch (error) {
        console.error('Failed to fetch event activities:', error);
        }
    };
    
    const formatTime = (time) => {
        const options = { hour: 'numeric', minute: 'numeric' };
        return new Date(time).toLocaleString('en-US', options);
    };
    
    const handleRegister = async (activityId) => {
        try {
            const response = await axios.post(process.env.REACT_APP_BASE_URL+`/eventactivity/register/${eventId}/${activityId}`, { userId: user._id }, { withCredentials: true });
            if (response.status === 200) {
                alert('Registered for the activity with ID: ' + activityId);
            } else {
                alert('Failed to register for the activity. Please try again.');
            }
        } catch (error) {
            console.error('Failed to register for the activity:', error);
            alert(error.response.data.error+'. Please try again.');
        }
    };
    
    
    return (
        <div className="activities-container">
            <section className="register-event-activities">
                <h2 className="register-activities-title">Event Activities</h2>
                <div className="register-activity-cards">
                    {eventActivities.map((activity) => (
                        <div className="register-activity-card" key={activity._id}>
                            <h3>{activity.name}</h3>
                            <p>{activity.description}</p>
                            <p>Time: {formatTime(activity.time)}</p>
                            <p>Location: {activity.location}</p>
                            <button className="register-button" onClick={() => handleRegister(activity._id)}>Register</button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default RegisterActivity;
