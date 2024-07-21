import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';
import { UserContext } from '../../Providers/UserProvider';
import './CheckIn.css';
import { Html5QrcodeScanner } from 'html5-qrcode';

const CheckIn = () => {
  const [data, setData] = useState('No result');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [eventActivities, setEventActivities] = useState([]);
  const [qrScannerKey, setQrScannerKey] = useState(Date.now());
  const [event, setEvent] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);
  const userId = user._id;
  const { eventId } = useParams();



  const fetchEvent = async () => {
    await axios
      .get(process.env.REACT_APP_BASE_URL+`/events/${eventId}`)
      .then((res) => {
        setEvent(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }
  useEffect(() => {
    fetchEvent();
  }, []);

  useEffect(() => {
    fetchEventActivities();
  }, []);

  const fetchEventActivities = async () => {
    setQrScannerKey(Date.now());
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

  const handleResult = async (decodedText, decodedResult) => {
    html5QrcodeScannerRef.current.pause();
    if (decodedText) {
      setData(decodedText);

      try {
        // Send POST request to backend using Axios
        const response = await axios.post(
          process.env.REACT_APP_BASE_URL+'/todos/checkin',
          {
            userId: userId,
            eventId: eventId,
            participantId: decodedText,
          },
          { withCredentials: true }
        );

        console.log('Check-in success:', response.data);
        setPopupMessage('Check-in successful!');
        setShowPopup(true);
      } catch (error) {
        console.error('Check-in error:', error);
        setPopupMessage(error.response.data.error + '. Please try again.');
        setShowPopup(true);
      }
    }
  };


  const html5QrcodeScannerRef = useRef(null);

  useEffect(() => {
    html5QrcodeScannerRef.current = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 }
    );

    html5QrcodeScannerRef.current.render(handleResult);

    return () => {
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.clear();
      }
    };
  }, []);


  const handlePopupClose = () => {
    setShowPopup(false);
    setData('No result');
    html5QrcodeScannerRef.current.resume();
  };

  

  return (
    <div className="checkin-container">
      <section className="qr-section">
        <h2 className="checkin-title">Check-In to {event.name}</h2>
        {/* <h2>Event Attendees: {Object.keys(event.attendees).length}</h2> */}
        <div className="qr-reader-container">
          <div style={{ width: "500px" }} id="reader"></div>
        </div>
        <p>{data}</p>
        {showPopup && (
          <div className="response-popup" onClick={handlePopupClose}>
            <div className="response-popup-content">
              <p>{popupMessage}</p>
              <button>Scan Again</button>
            </div>
          </div>
        )}
      </section>
      <section className="event-statistics">
        <Link to={`/event-statistics/${eventId}`} className="event-statistics-button">View Event Statistics</Link>
      </section>
      <section className="event-activities">
        <h2 className="activities-title">Event Activities</h2>
        <div className="activity-cards">
          {eventActivities.map((activity) => (
            <Link to={`/checkin/${eventId}/${activity._id}`} key={activity._id} className="activity-card">
              <h3>{activity.name}</h3>
              <p>{activity.description}</p>
              <p>Time: {formatTime(activity.time)}</p>
              <p>Location: {activity.location}</p>
            </Link>
          ))}
          <Link to={`/created-events/${eventId}/add-activity`} className="add-activity-card">
            <h3>Add Activity</h3>
            <span className="plus-icon">+</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CheckIn;
