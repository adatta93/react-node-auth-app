import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function Register({ setLoggedIn, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let history = useHistory();

  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:4000/auth/local/register",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) return response.data;
        throw new Error("authentication failed");
      })
      .then((res) => {
        setLoggedIn(false);
        setUser(res.user.email);
        history.push("/profile");
      })
      .catch((err) => {
        setLoggedIn(false);
      });
  };
  return (
    <>
      <div>Register Page</div>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Register</button>
      </form>
    </>
  );
}
