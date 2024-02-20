import React, { useState } from "react";
import MicrosoftLogin from "react-microsoft-login";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";

import "./anims.css";
import { set } from "date-fns";

export default (props) => {
  const [isLoginFailed, setIsLoginFailed] = useState(false);

  const authHandler = (err, data, msal) => {
    console.log(err, data);

    if (err) {
      console.error(err);
      return;
    }

    if (!data.account.username.endsWith("bristol.ac.uk") && !data.account.username.endsWith("windmillhillcityfarm.org.uk")) {
      msal.logout();
      setIsLoginFailed(true);
      return;
    }

    setIsLoginFailed(false);
    setWelcome(data.account.name)
    setTimeout(() => {
      navigate('/')
    }, 2000)
  };

  let navigate = useNavigate();

  const [welcome, setWelcome] = useState("");

  return (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        top: "20%",
        flexDirection: 'column'
        }}>
          {
            isLoginFailed ? 
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                flexDirection: 'column'
              }}>
                <Alert severity="error">Login failed. Please use your city farm email address.</Alert>
              </div>
              :
              

            welcome === "" ? 
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                flexDirection: 'column'
              }}>
                <h1>Login</h1>
                <MicrosoftLogin clientId={"5668872b-7957-4c09-a995-56cd915cb4a9"} authCallback={authHandler} />
              </div>
            :
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                flexDirection: 'column'
              }}>
                <h1>Welcome, {welcome}!</h1>
                <h1>{"Let's get farming :)"}</h1>
                <img src="/pigface.png" width={"15%"} height={"15%"} style={{
                  animation: `spin 2s linear infinite`
                }}/>
              </div>
          }
    </div>
  );
};