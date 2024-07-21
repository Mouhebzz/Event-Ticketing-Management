import React, { useContext, useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { useParams, Link } from "react-router-dom";
import { UserContext } from "../../Providers/UserProvider";
import axios from "axios";
import { PDFViewer, PDFDownloadLink, pdf, Document, Page, Text, Image, View, StyleSheet } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import './Ticket.css';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 40,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
    textShadowColor: "#ddd",
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    color: "#555",
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
    color: "#777",
  },
  qrCodeContainer: {
    marginTop: 30,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  qrCode: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  footer: {
    fontSize: 12,
    color: "#777",
  },
});

const Ticket = () => {
  const { user } = useContext(UserContext);
  const { eventId } = useParams();
  const [event, setEvent] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleDownload = async () => {
    const MyDocument = (
      <Document>
        <Page style={styles.page}>
          {/* <View style={styles.logoContainer}>
            <Image style={styles.logo} src="/path/to/logo.png" />
          </View> */}
          <Text style={styles.title}>Event Ticket</Text>
          <Text style={styles.subtitle}>Admission Ticket</Text>
          <Text style={styles.info}>
            Name: {user.name} {user.surname}
          </Text>
          <Text style={styles.info}>Event Name: {event.name}</Text>
          <Text style={styles.info}>Location: {event.location}</Text>
          <Text style={styles.info}>
            Date: {event.start_date} - {event.end_date}
          </Text>
          <View style={styles.qrCodeContainer}>
            <Image src={document.getElementById('qr-code').toDataURL()} style={styles.qrCode} />
          </View>
          <View style={styles.footerContainer}>
            <Text style={styles.footer}>Powered by EventHub</Text>
          </View>
        </Page>
      </Document>
    );

    const pdfBlob = await pdf(MyDocument).toBlob();
    saveAs(pdfBlob, "ticket.pdf");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="ticket-container">
      <h2 className="ticket-title">Ticket</h2>
      <div className="ticket-info">
        <p className="ticket-info-line">
          <span className="ticket-info-label">Name:</span>{" "}
          {user.name} {user.surname}
        </p>
        <p className="ticket-info-line">
          <span className="ticket-info-label">Event Name:</span> {event.name}
        </p>
        <p className="ticket-info-line">
          <span className="ticket-info-label">Location:</span> {event.location}
        </p>
        <p className="ticket-info-line">
          <span className="ticket-info-label">Date:</span>{" "}
          {event.start_date} - {event.end_date}
        </p>
      </div>
      <div className="ticket-qrcode">
        <QRCode id="qr-code" value={user._id} />
      </div>
      <button className="ticket-download-btn" onClick={handleDownload}>
        Download PDF
      </button>
      <Link to={`/events/${eventId}/registration`} className="ticket-action-btn">
        Register for Activities
      </Link>
      <Link to={`/events/${eventId}/registered-activities`} className="ticket-action-btn">
        View Registered Activities
      </Link>
    </div>
  );
};

export default Ticket;
