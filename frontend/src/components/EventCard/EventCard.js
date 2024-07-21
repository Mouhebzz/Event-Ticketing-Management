export default function EventCard(props) {
    return (
      <div className="event-card">
      <div className="event-banner">
        <img src={props.banner} alt="Event Banner" />
      </div>
      <div className="event-info">
        <h3 className="event-name">{props.title}</h3>
        <p className="event-description">{props.short_description}</p>
        <div className="event-meta">
          <span className="event-category">{props.category}</span>
          <span className="event-location">{props.location}</span>
          <span className="event-price">{props.price.$numberDecimal}</span>
        </div>
      </div>
    </div>
    );
  }