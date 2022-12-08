import {
  Grid,
  List,
  Drawer,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
  Divider,
} from "@material-ui/core";
import { Component } from "react";
import HomeIcon from "@mui/icons-material/Home";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { useHistory, Link, Redirect } from "react-router-dom";

class AppDrawer extends Component {
  state = {
    pathSetter: "",
    menuItems: [],
    // drawerState:true
  };

  reportPageHandler = (e) => {
    console.log("Inside the reportPageHandler", e);
    switch (e) {
      case "Reports":
        this.setState({ pathSetter: "/reports" });
        break;
      case "Home":
        this.setState({ pathSetter: "/" });
        break;
      case "Registration":
        this.setState({ pathSetter: "/registerPatient" });
        break;
      case "Add User":
        this.setState({ pathSetter: "/addUser" });
        break;
      case "Clients":
        this.setState({ pathSetter: "/clients" });
      default:
        break;
    }
  };

  componentDidMount() {
    let rolesName = localStorage.getItem("roles");

    if (rolesName == "CLIENT") {
      this.setState({
        menuItems: ["Home", "Reports", "Registration"],
      });
    } else {
      this.setState({
        menuItems: ["Home", "Reports", "Registration", "Add User", "Clients"],
      });
    }
  }

  render() {
    const { openDrawer } = this.props;
    if (this.state.pathSetter) {
      this.props.slideHandler();
      return <Redirect to={`/home${this.state.pathSetter}`} />;
    }

    const { menuItems } = this.state;

    return (
      <Drawer
        PaperProps={{ style: { width: "30vh" } }}
        variant="temporary"
        open={openDrawer}
        onBackdropClick={this.props.slideHandler}
      >
        <List style={{ marginTop: "70px" }}>
          {menuItems.map((text, index) => (
            <Grid
              container
              justifyContent="center"
              alignContent="center"
              spacing={5}
            >
              <Grid item xs={12}>
                <Grid container justifyContent="center" spacing={1}>
                  <Grid item xs={11}>
                    <Grid container spacing={2}>
                      <Grid item>
                        {text == "Home" && (
                          <HomeIcon style={{ fill: "#1FC59F" }} />
                        )}
                        {text == "Reports" && (
                          <AssessmentIcon style={{ fill: "#1FC59F" }} />
                        )}
                        {text == "Registration" && (
                          <AppRegistrationIcon style={{ fill: "#1FC59F" }} />
                        )}
                        {text == "Add User" && (
                          <GroupAddIcon style={{ fill: "#1FC59F" }} />
                        )}
                        {text == "Clients" && (
                          <PendingActionsIcon style={{ fill: "#1FC59F" }} />
                        )}
                      </Grid>
                      <Grid item>
                        <Typography
                          style={{ cursor: "pointer" }}
                          onClick={() => this.reportPageHandler(text)}
                          variant="h5"
                          to={this.state.pathSetter}
                        >
                          {text}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </List>
      </Drawer>
    );
  }
}

export default AppDrawer;
