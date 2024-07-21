import React from "react";
import "./Signup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Signup = () => {
  const [submissionResults, setSubmissionResults] = useState("Sign up to continue");
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post(process.env.REACT_APP_BASE_URL+'/user/signup', formData)
      .then(function (response) {
        setSubmissionResults("Signup Successful. Please Verify Your Email");
        console.log(response.data.email);
        return axios.post(process.env.REACT_APP_BASE_URL+'/user/validate-email', {email: formData.email});
      }).then(function(response){
        navigate('/validate-email', {state: {email: formData.email}});
      }).catch(function(error){
        setSubmissionResults(error.response.data.error);
        console.log(error.response.data.error);
      });
  };

  return (
    <div className="signup-container">
      {/* <div className="logo-container">
        <img src={EveMarkBanner} alt="Logo" />
      </div> */}
      <div className="signup-form-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          <div className="credentials">
            <div className="fullname">
              <input
                type="text"
                name="name"
                placeholder="John"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="surname"
                placeholder="Cena"
                value={formData.surname}
                onChange={handleChange}
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="youremail@mail.com"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Your Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="submission-results"><h5>{submissionResults}</h5> </div>
          <div className="submission">
            <button className="btn btn-primary" type="submit">
              Sign Up
            </button>
            
          </div>
        </form>
      </div>
      <div className="other-options">
        <a href="/login">Already have an account?</a>
      </div>
    </div>
  );
};

export default Signup;
