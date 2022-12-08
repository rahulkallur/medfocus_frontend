import { Grid, Typography } from "@material-ui/core";
import React, { Component } from "react";
import Navbar from "../navBar";
import ReportCardsPage from "../ReportsPage/ReportCards";

class Main extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Grid container>
        <Grid item xs={12}>
          {/* NOTE:  We have fixed height which has been set due to navbar*/}
          <Grid container style={{ height: "80px" }}>
            <Grid item xs={12}>
              <Navbar notificationData={this.props.notificationData} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default Main;
