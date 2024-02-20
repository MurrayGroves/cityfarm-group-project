import React, { useState } from "react";
import MicrosoftLogin from "react-microsoft-login";
import { useNavigate } from "react-router-dom";

import "./anims.css";

export default (props) => {
  const authHandler = (err, data) => {
    console.log(err, data);
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