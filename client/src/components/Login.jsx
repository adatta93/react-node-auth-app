import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

export default function Login({ setLoggedIn, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || {
    from: { pathname: "/profile" },
  };

  useEffect(() => {
    axios
      .get("http://localhost:4000/auth/login/success", {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
      .then((response) => {
        if (response.status === 200) return response.data;
        throw new Error("authentication failed");
      })
      .then((res) => {
        setLoggedIn(true);
        setUser(res.user.email);
        history.push("/profile");
      })
      .catch((err) => {
        setLoggedIn(false);
      });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:4000/auth/local/login",
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
        setLoggedIn(true);
        setUser(res.user.email);
        history.replace(from);
      })
      .catch((err) => {
        setLoggedIn(false);
      });
  };

  return (
    <>
      <div>Login Page</div>
      <form onSubmit={handleLogin}>
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
        <button>Login</button>
      </form>
      <a href="http://localhost:4000/auth/google">Google Login</a>
      <div>
        Don't have an account yet? <Link to="/register">Register</Link>
      </div>
    </>
  );
}
