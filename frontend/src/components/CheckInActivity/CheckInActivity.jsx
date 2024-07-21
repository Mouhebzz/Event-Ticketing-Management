import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../Providers/UserProvider';
import './CheckInActivity.css';
import Html5QrcodePlugin from '../QRScannerPlugin/Html5QrcodePlugin';
import { Html5QrcodeScanner } from 'html5-qrcode';

const CheckInActivity = () => {
  const [data, setData] = useState('No result');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const { user } = useContext(UserContext);
  const userId = user._id;
  const { eventId, activityId } = useParams();

  const handleResult = async (decodedText, decodedResult) => {
    html5QrcodeScannerRef.current.pause();
    if (decodedText) { // Perform check-in only if not already checked in
      
      setData(decodedText);

      try {
        // Send POST request to backend using Axios
        const response = await axios.post(
          process.env.REACT_APP_BASE_URL+`/eventactivity/checkin/${eventId}/${activityId}`,
          {
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
        <h2 className="checkin-title">Check-In</h2>
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
    </div>
  );
};

export default CheckInActivity;
