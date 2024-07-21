import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ValidateEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const value = location.state;
    function handleClick() {
        console.log(value);
        axios.post(process.env.REACT_APP_BASE_URL+'/user/validate-email', value)
        .then(function(response){
            console.log(response);
        })
        .catch(function(error){
            console.log(error);
        })
        // Add your function code here
      }
    return(
        <div>
            <h1>Please validate your email to continue.</h1>
            <h2>Did not receive a validation email? Click <button onClick={handleClick}>here.</button></h2>
            <button onClick={()=>navigate('/')}>Go back to Login Page</button>
        </div>
    )
}

export default ValidateEmail;