import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Login from "./Pages/loginPage/login";
import Mainpage from "./Pages/mainPage/mainpage";
import Home from "./Pages/homePage/home";
import ReportCardsPage from "./Pages/ReportsPage/ReportCards";
import ReportsViewer from "./Pages/ReportsPage/ReportsViewer";
import ReportsViewer1 from "./Pages/ReportsPage/ReportsViewer1";
import Registration from "./Pages/regsitrationPage/registerPatient";
import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import AddUser from "./Pages/addUser";
import AllClients from "./Pages/regsitrationPage/allClients";
import { Grid } from "@material-ui/core";

function App() {
  const [isAuth, setAuth] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [socketData, setSocketData] = useState({});
  const [notificationData, setNotificationData] = useState({});

  const fetchTokenDetails = () => {
    setLoading(true);
    let currentDate = Math.floor(Date.now() / 1000);
    let expiryDate = localStorage.getItem("exp");
    if (expiryDate && currentDate < expiryDate) {
      setAuth(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTokenDetails();
  });

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_IO);
    console.log("socket details====", socket);

    setSocketData(socket);

    let localRoles = localStorage.getItem("roles");
    console.log("useeffect data roles====", localRoles);

    let localLoginId = localStorage.getItem("loginId");

    console.log("localLoginId ====", localLoginId);

    console.log("socketData ======", socketData);

    if (localRoles == "SUPERADMIN") {
      socket.emit("adminUser", localLoginId);
    }

    socket.on("getNotification", (data) => {
      console.log("data ====", data);
      setNotificationData(data);
    });
  }, []);

  return (
    <>
      {!isAuth ? (
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => <Login {...props} />}
          ></Route>
          <Route
            exact
            path="*"
            render={(props) => <Login {...props} />}
          ></Route>
        </Switch>
      ) : (
        <div className="App">
          <Mainpage notificationData={notificationData} />
          <Switch>
            {/* <Redirect exact from="/" to="home" /> */}
            <Route exact path="/home">
              <Home />
            </Route>
            <Route
              exact
              path="/"
              render={() => {
                return isAuth && <Redirect exact to="/home" />;
              }}
            />
            <Route exact path="/home/reports">
              <ReportCardsPage />
            </Route>
            <Route
              exact
              path="/home/reports/viewer"
              render={(props) => <ReportsViewer {...props} />}
            />
            <Route
              exact
              path="/home/reports/viewer1"
              render={(props) => <ReportsViewer1 {...props} />}
            />
            <Route
              exact
              path="/home/registerPatient"
              render={(props) => (
                <Registration {...props} socketData={socketData} />
              )}
            />
            <Route
              exact
              path="/home/adduser"
              render={(props) => <AddUser {...props} />}
            />
            <Route
              exact
              path="/home/clients"
              render={(props) => <AllClients {...props} />}
            />
          </Switch>
        </div>
      )}
    </>
  );
}

export default App;
