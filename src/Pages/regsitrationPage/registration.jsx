import React, { Component } from "react";
import { withApollo } from "react-apollo";
import { Grid, Typography, Button, TextField } from "@material-ui/core";
import PersonIcon from "@mui/icons-material/Person";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import EmailIcon from "@mui/icons-material/Email";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { withStyles } from "@material-ui/core";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const styles = (theme) => ({
  reportHeader: {
    color: "#1FC59F",
    fontSize: "100",
  },
  cardStyle: {
    minWidth: 225,
    height: 100,
    cursor: "pointer",
    color: {
      backgroundColor: "#1FC59F",
    },
    "&:hover": {
      boxShadow: "0px 0px 10px 5px #1FC59F",
    },
  },
});

class Registration extends Component {
  render() {
    const { classes,client } = this.props;
    return (
      <Grid
        container
        spacing={3}
        // style={{ backgroundColor: "yellow" }}
      >
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={4}>
              <Grid container justifyContent="flex-start">
                <Grid item xs={2}>
                  <ArrowBackIcon fontSize="large" />
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="h4" className={classes.reportHeader}>
                    Client Registration
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid
              item
              style={{
                padding: "20px 0px 0px 50px",
              }}
            >
              <TextField
                // style={{ width: "40vh" }}
                id="outlined-basic"
                label="Username"
                type="username"
                variant="outlined"
                onChange={(e) => this.inputChangeField(e, "password")}
                InputProps={{
                  startAdornment: (
                    <PersonIcon
                      style={{
                        fill: "#1FC59F",
                        marginRight: "10px",
                      }}
                    />
                  ),
                }}
              />
            </Grid>
            <Grid
              item
              style={{
                padding: "20px 0px 0px 50px",
              }}
            >
              <TextField
                // style={{ width: "40vh" }}
                id="outlined-basic"
                label="Mobile Number"
                type="mobileNumber"
                variant="outlined"
                onChange={(e) => this.inputChangeField(e, "password")}
                InputProps={{
                  startAdornment: (
                    <SmartphoneIcon
                      style={{
                        fill: "#1FC59F",
                        marginRight: "10px",
                      }}
                    />
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid
              item
              style={{
                padding: "20px 0px 0px 50px",
              }}
            >
              <TextField
                // style={{ width: "40vh" }}
                id="outlined-basic"
                label="Email Id"
                type="emailId"
                variant="outlined"
                onChange={(e) => this.inputChangeField(e, "password")}
                InputProps={{
                  startAdornment: (
                    <EmailIcon
                      style={{
                        fill: "#1FC59F",
                        marginRight: "10px",
                      }}
                    />
                  ),
                }}
              />
            </Grid>
            <Grid
              item
              style={{
                padding: "20px 0px 0px 50px",
              }}
            >
              <TextField
                // style={{ width: "40vh" }}
                id="outlined-basic"
                label="Hospital Name"
                type="hospitalName"
                variant="outlined"
                onChange={(e) => this.inputChangeField(e, "password")}
                InputProps={{
                  startAdornment: (
                    <AddBusinessIcon
                      style={{
                        fill: "#1FC59F",
                        marginRight: "10px",
                      }}
                    />
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            {/* NOTE: Need to remove the close button currently disabled with comment */}
            {/* <Grid item>
              <Button
                style={{ width: "30vh" }}
                color="primary"
                variant="contained"
                onClick={() => {}}
              >
                Close
              </Button>
            </Grid> */}
            <Grid
              item
              style={{
                padding: "0px 0px 0px 50px",
              }}
            >
              <Button
                style={{ width: "30vh" }}
                color="primary"
                variant="contained"
                onClick={() => {}}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(withApollo(Registration));
