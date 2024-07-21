import React from "react";
import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../../Providers/UserProvider';

const Login = () => {
  const [submissionResults, setSubmissionResults] = useState("Login to continue");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext(UserContext);

  function handleClick() {
    axios.post(process.env.REACT_APP_BASE_URL+'/user/validate-email', { email: formData.email })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (!loading) {
      navigate('/events');
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post(process.env.REACT_APP_BASE_URL+'/user/login',
      formData,
      { withCredentials: true }
    )
      .then(async function(response) {
        setSubmissionResults("Login Successful");
        console.log(response);
        console.log("hiiii");
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('user', JSON.stringify(response.data));
        setLoading(false);
        setUser(response.data);
        navigate('/');
      })
      .catch(function(error) {
        setSubmissionResults(error.response.data.error);
        console.log(error.response.data.error);
        console.log(error);
      });
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        {/* <img src={EveMarkBanner} alt="Logo" /> */}
      </div>
      <div className="login-form-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Sign In</h1>
          <div className="credentials">
            <input
              type="email"
              name="email"
              placeholder="youremail@mail.com"
              value={formData.email}
              onChange={handleChange}
            ></input>
            <input
              type="password"
              name="password"
              placeholder="Your Password"
              value={formData.password}
              onChange={handleChange}
            ></input>
          </div>
          <div className="submission">
            <button className="login-btn" type="submit">
              Sign In
            </button>
            {/* <h5>{submissionResults}</h5> */}
          </div>
        </form>
      </div>
      <div className="other-options">
        <a href="/create-account">Don't have an account?</a>
        {submissionResults === "Verify your Account." ? (
          <button onClick={handleClick}>Resend email verification</button>
        ) : null}
      </div>
    </div>
  );
};

export default Login;
