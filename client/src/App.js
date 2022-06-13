import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");

  return (
    <>
      <div id="main">
        <h1>
          Auth App {loggedIn ? "true" : "False"} - {user}
        </h1>
      </div>
      <Router>
        <Switch>
          <Route path="/login">
            <Login setLoggedIn={setLoggedIn} setUser={setUser} />
          </Route>
          <Route path="/register">
            <Register setLoggedIn={setLoggedIn} setUser={setUser} />
          </Route>
          <Route
            path="/profile"
            render={({ location }) =>
              loggedIn ? (
                <Profile />
              ) : (
                <Redirect
                  to={{
                    pathname: "/login",
                    state: { from: location },
                  }}
                />
              )
            }
          />
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

function NoMatch() {
  return <h3>404 Page Not Found</h3>;
}

export default App;
