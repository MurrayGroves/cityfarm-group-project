import React, { useState } from "react";
import MicrosoftLogin from "react-microsoft-login";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";

import "./anims.css";

export default ({msal, setMsal}) => {
  const [isLoginFailed, setIsLoginFailed] = useState(false);

  const authHandler = (err, data, msal) => {
    console.log(err, data);
    console.log(setMsal);

    if (err) {
      console.error(err);
      return;
    }

    if (!data.account.username.endsWith("bristol.ac.uk") && !data.account.username.endsWith("windmillhillcityfarm.org.uk")) {
      msal.logoutRedirect({
        account: data.account
      });
      setIsLoginFailed(true);
    } else {
      setIsLoginFailed(false);
      setMsal(msal);
      setWelcome(data.account.name)
      setTimeout(() => {
        navigate('/')
      }, 2000)
    }
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
                flexDirection: 'column',
                paddingTop: "1%"
              }}>
                <Alert severity="error">Login failed. Please use your city farm email address.</Alert>
              </div>
            :
              <div></div>
            }{
            welcome === "" ? 
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                flexDirection: 'column'
              }}>
                <h1>Cityfarm Login</h1>
                <MicrosoftLogin clientId={"5668872b-7957-4c09-a995-56cd915cb4a9"} authCallback={authHandler} useLocalStorageCache={true}/>
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
                <img src="/pigface.png" width={"15%"} height={"15%"} alt="" style={{
                  animation: `spin 2s linear infinite`
                }}/>
              </div>
          }
    </div>
  );
};