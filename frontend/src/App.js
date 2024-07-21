import React from "react";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import { BrowserRouter as Router, Routes, Route, Link, Switch } from "react-router-dom";
import ValidateEmail from "./components/ValidateEmail/ValidateEmail";
import CreateEvent from "./components/CreateEvent/CreateEvent";
import { UserProvider } from "./Providers/UserProvider";
import ProtectedRoute from "./Routers/ProtectedRoutes";
import EventsPage from "./components/Marketplace/Marketplace";
import LogoutButton from "./components/Logout/Logout";
import Navbar from "./components/Navbar/Navbar";
import isLoggedIn from "./components/auth";
import CreatedEventsPage from "./components/CreatedEvents/CreatedEvents";
import EventPage from "./components/EventPage/EventPage";
import MyTickets from "./components/MyTickets/MyTickets";
import Ticket from "./components/Ticket/Ticket";
import CheckIn from "./components/CheckIn/CheckIn";
import CreateEventActivity from "./components/CreateEventActivity/CreateEventActivity";
import RegisterActivity from "./components/RegisterActivity/RegisterActivity";
import RegisteredActivitiesPage from "./components/RegisteredActivities/RegisteredActivities";
import CheckInActivity from "./components/CheckInActivity/CheckInActivity";
import EventStatsPage from "./components/EventStats/EventStats";





const App = () => {
  return (
                

    
    <Router>
      <Navbar isLoggedIn={isLoggedIn} />
      <UserProvider>
      <Routes>
        <Route exact path="/" element={<EventsPage />}></Route>
        <Route path="/:eventId" element={<EventPage />} />
        <Route exact path= "/login" element={<Login />}></Route>
        <Route exact path="/create-account" element={<Signup />}></Route>
        <Route exact path="/validate-email" element={<ValidateEmail/>}></Route>
        <Route element={<ProtectedRoute/>}>
        <Route  path="/create-event" element={<CreateEvent />}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
        <Route  path="/created-events" element={<CreatedEventsPage />}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
        <Route  path="/mytickets" element={<MyTickets />}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
        <Route  path="/ticket/:eventId" element={<Ticket />}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
        <Route  path="created-events/checkin/:eventId" element={< CheckIn/>}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
        <Route  path="created-events/:eventId/add-activity" element={< CreateEventActivity/>}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
        <Route  path='/events/:eventId/registration' element={< RegisterActivity/>}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
        <Route  path='/events/:eventId/registered-activities' element={< RegisteredActivitiesPage/>}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
        <Route  path='/checkin/:eventId/:activityId' element={< CheckInActivity/>}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
        <Route  path='/event-statistics/:eventId' element={< EventStatsPage/>}/>
        </Route>

      </Routes>
      </UserProvider>
    </Router>

  );
};

export default App;