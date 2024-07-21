import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PieChart from '../PieChart/PieChart';
import './EventStats.css';

const EventStatsPage = () => {
  const [event, setEvent] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { eventId } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/events/${eventId}`);
        setEvent(response.data.event);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch event:', error);
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const exportAttendeesCsv = () => {
    const csvRows = [
      ['Name', 'Surname', 'Email'],
      ...event.attendees.map((attendee) => [attendee.name, attendee.surname, attendee.email])
    ];

    const csvData = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'attendees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="event-stats-container">
      <h1 className="event-stats-title">{event.name} Statistics</h1>
      <div className="event-stats-cards">
        <div className="event-stats-card">
          <h2 className="event-stats-subtitle">Attendees</h2>
          <p className="event-stats-info">Total: {Object.keys(event.attendees).length}</p>
        </div>
        <div className="event-stats-card">
          <h2 className="event-stats-subtitle">Checked-in Attendees</h2>
          <p className="event-stats-info">Total: {Object.keys(event.checked_in_attendees).length}</p>
        </div>
      </div>
      <div className="pie-chart-container">
        <PieChart attendees={Object.keys(event.attendees).length} checkedInAttendees={Object.keys(event.checked_in_attendees).length} />
      </div>
      <button className='export-csv-btn' onClick={exportAttendeesCsv}>Export Attendees CSV</button>
    </div>
  );
};

export default EventStatsPage;
