import {
  Grid,
  Typography,
  AppBar,
  Tooltip,
  Box,
  Menu,
  MenuItem,
  Modal,
  Popover,
  Button,
  Badge,
} from "@material-ui/core";
import React, { Component } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import medLogo from "../../Assets/images/medfocus.png";
import MenuIcon from "@mui/icons-material/Menu";
import AppDrawer from "../appDrawer/appDrawer";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import auth from "../../packages/common/apollo/auth";
import { withRouter } from "react-router-dom";

class Navbar extends Component {
  state = {
    roleType: "",
    openDrawer: false,
    anchorEl: null,
    userName: "",
    notificationCount: 0,
    notificationAnchorEl: null,
    notificationArray: [],
  };

  componentDidMount = () => {
    let localRoles = localStorage.getItem("roles");

    this.setState({
      userName: localStorage.getItem("username"),
      roleType: localStorage.getItem("roles"),
    });
  };

  componentDidUpdate(prevProps, prevState) {
    console.log("prevProps =====", prevProps);
    if (
      prevProps.notificationData.hospitalName !=
        this.props.notificationData.hospitalName ||
      prevProps.notificationData.patientName !=
        this.props.notificationData.patientName
    ) {
      console.log("something prop has changed.");
      this.setState(
        { notificationCount: this.state.notificationCount + 1 },
        () =>
          console.log(
            "this.state.notificationCount =====",
            this.state.notificationCount
          )
      );
      this.state.notificationArray.push(
        `${this.state.notificationCount + 1}. Hospital ${
          this.props.notificationData.hospitalName
        } has registered ${this.props.notificationData.patientName}`
      );
    }
  }

  logoutHandler = async () => {
    console.log("Inside the logout handler");
    const unAuthResponse = await auth.performUnauthentication();
    if (unAuthResponse) {
      this.props.history.push("/");
      window.location.reload();
    }
  };

  handleClosePopover = () => {
    this.setState({ anchorEl: null });
  };

  slideHandler = () => {
    this.setState({ openDrawer: false });
  };

  handleBellIconClick = (event) => {
    console.log("getting called hcdhg", event);
    this.setState({ notificationAnchorEl: event.currentTarget });
  };

  handleBellIconMenuClose = () => {
    this.setState({ notificationAnchorEl: null });
  };

  handleNotificationClear = () => {
    this.setState({
      notificationArray: [],
      notificationCount: 0,
      notificationAnchorEl: null,
    });
  };

  render() {
    const { notificationData } = this.props;
    console.log("notificationData test place ===", this.props.notificationData);

    const {
      roleType,
      openDrawer,
      notificationCount,
      notificationAnchorEl,
      notificationArray,
    } = this.state;

    return (
      <Grid container>
        <Grid item xs={12}>
          <AppBar style={{ zIndex: "1500" }}>
            <Grid
              container
              alignContent="center"
              spacing={5}
              style={{ height: "100px" }}
            >
              <Grid item xs={1}>
                <MenuIcon
                  style={{ fill: "white" }}
                  fontSize="large"
                  onClick={() => {
                    this.setState({ openDrawer: !openDrawer });
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <img
                      src={medLogo}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={9}>
                <Grid container justifyContent="flex-end" alignContent="center">
                  {roleType != "CLIENT" ? (
                    <Grid
                      item
                      xs={1}
                      style={{
                        paddingTop: notificationCount > 0 ? "10px" : "5px",
                      }}
                    >
                      <Badge
                        badgeContent={notificationCount}
                        color="secondary"
                        invisible={notificationCount == 0}
                      >
                        <NotificationsIcon
                          style={{ fontSize: 30, fill: "white" }}
                          onClick={(event) => this.handleBellIconClick(event)}
                          aria-describedby="simple-popover"
                          fontSize="large"
                        />
                      </Badge>
                      {notificationAnchorEl && (
                        <Popover
                          id=""
                          style={{
                            position: "absolute"
                          }}
                          open={true}
                          onClose={() => this.handleBellIconMenuClose()}
                          anchorEl={
                            notificationAnchorEl && notificationAnchorEl
                          }
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                        >
                          <Box
                            style={{
                              width: "70vh",
                              minHeight: "10vh",
                              height: "auto",
                              backgroundColor: "#EAF7F2",
                            }}
                          >
                            {notificationArray.length ? (
                              <Grid
                                container
                                style={{
                                  height: "15vh",
                                  margin: "20px 0px 0px 10px",
                                }}
                              >
                                {notificationArray.map((eachItem) => {
                                  return (
                                    <Grid item xs={12}>
                                      <Typography>{eachItem}</Typography>
                                    </Grid>
                                  );
                                })}

                                <Grid item xs={12}>
                                  <Button
                                    onClick={() =>
                                      this.handleNotificationClear()
                                    }
                                    variant="contained"
                                    color="primary"
                                  >
                                    Clear All
                                  </Button>
                                </Grid>
                              </Grid>
                            ) : (
                              <Grid
                                item
                                xs={12}
                                style={{ padding: "20px 0px 10px 10px" }}
                              >
                                <Typography>
                                  No Notifications to show
                                </Typography>
                              </Grid>
                            )}
                          </Box>
                        </Popover>
                      )}
                    </Grid>
                  ) : null}

                  <Grid item xs={1}>
                    <Tooltip title="Logout">
                      <AccountCircleIcon
                        onClick={(e) => {
                          this.setState({ anchorEl: e.currentTarget });
                        }}
                        style={{ fill: "white" }}
                        aria-describedby="simple-popover"
                        fontSize="large"
                      />
                    </Tooltip>
                    {this.state.anchorEl && (
                      <Popover
                        id=""
                        style={{
                          position: "absolute",
                        }}
                        open={true}
                        onClose={this.handleClosePopover}
                        anchorEl={this.state.anchorEl && this.state.anchorEl}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <Box
                          style={{
                            width: "40vh",
                            height: "auto",
                            backgroundColor: "#EAF7F2",
                          }}
                        >
                          <Grid
                            container
                            justifyContent="space-around"
                            alignItems="center"
                            style={{ height: "15vh" }}
                          >
                            <Grid item xs={6}>
                              <Grid
                                container
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Grid item xs={12}>
                                  <Typography
                                    style={{
                                      fontWeight: 700,
                                      color: "#1FC59F",
                                    }}
                                  >
                                    UserName:
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography>{this.state.userName}</Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={4}>
                              <Button
                                onClick={this.logoutHandler}
                                variant="contained"
                                color="primary"
                              >
                                LOGOUT
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </Popover>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AppBar>
        </Grid>
        <Grid>
          {openDrawer && (
            <AppDrawer
              openDrawer={this.state.openDrawer}
              slideHandler={this.slideHandler}
            />
          )}
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(Navbar);
