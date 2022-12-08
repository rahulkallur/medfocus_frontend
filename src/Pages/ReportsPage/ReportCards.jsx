import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import AddTaskIcon from "@mui/icons-material/AddTask";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FaceRetouchingOffIcon from "@mui/icons-material/FaceRetouchingOff";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import VerifiedIcon from "@mui/icons-material/Verified";
import HailIcon from '@mui/icons-material/Hail';
import AlaramOnIcon from '@mui/icons-material/AlarmOn';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import ReplayIcon from '@mui/icons-material/Replay';
import BlockIcon from "@mui/icons-material/Block";
import { withStyles } from "@material-ui/core";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";
import { withRouter } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const GET_CLAIM_LIST = gql`
  query {
    getClaimStatus {
      name
      key
      iconName
      createdAt
      updatedAt
    }
  }
`;

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
class ReportCards extends Component {
  state = {
    reportCardClicked: false,
    selectedReportName: "",
    claimList: [],
    isLoading: false,
  };

  handleReportClick = (reportName, reportKey) => {
    let trimmedReportName = reportName.replace(/\s/g, "").toLowerCase();
    this.setState({
      reportCardClicked: true,
      selectedReportName: reportName,
      selectedReportKey: reportKey,
    });
  };

  getAllReportList = async () => {
    this.setState({ isLoading: true });
    let getClaimList = await this.props.client.query({
      query: GET_CLAIM_LIST,
      fetchPolicy: "network-only",
    });

    if (getClaimList && getClaimList.data && getClaimList.data.getClaimStatus) {
      let allClaimList = getClaimList.data.getClaimStatus;
      this.setState({ claimList: allClaimList, isLoading: false });
    }
  };

  backButtonHandler = () => {
    this.props.history.push("/home");
  };

  componentDidMount() {
    this.getAllReportList();
  }

  render() {
    const { classes } = this.props;
    const { isLoading } = this.state;
    if (this.state.reportCardClicked) {
      return (
        <Redirect
          to={{
            pathname: "/home/reports/viewer1",
            state: {
              ...this.state,
            },
          }}
        />
      );
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={2}>
              <Grid container justifyContent="flex-start">
                <Grid item xs={3}>
                  <ArrowBackIcon
                    fontSize="large"
                    onClick={this.backButtonHandler}
                    style={{ cursor: "pointer" }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h4" className={classes.reportHeader}>
                    Reports
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {isLoading ? (
            <Grid container justifyContent="center">
              <CircularProgress
                size="80px"
                sx={{
                  color: "#1FC59F",
                }}
              />
            </Grid>
          ) : (
            <Grid
              container
              justifyContent="space-around"
              alignItems="center"
              spacing={3}
            >
              {this.state.claimList.map((eachCard) => {
                return (
                  <Grid item key={eachCard.key}>
                    <Card
                      elevation={6}
                      // style={{backgroundColor:''}}
                      className={classes.cardStyle}
                      onClick={() => {
                        this.handleReportClick(eachCard.name, eachCard.key);
                      }}
                    >
                      <Grid
                        container
                        justifyContent="space-evenly"
                        alignItems="center"
                        direction="row"
                        style={{ padding: "25px 0px 22px 0px" }}
                      >
                        <Grid item>
                          {eachCard.iconName == "AddTaskIcon" ? (
                            <AddTaskIcon
                              sx={{ fontSize: 40, color: "#1FC59F" }}
                            />
                          ) : eachCard.iconName == "AccountCircleIcon" ? (
                            <AccountCircleIcon
                              sx={{ fontSize: 40, color: "#1FC59F" }}
                            />
                          ) : eachCard.iconName == "FaceRetouchingOffIcon" ? (
                            <FaceRetouchingOffIcon
                              sx={{ fontSize: 40, color: "#1FC59F" }}
                            />
                          ) : eachCard.iconName == "BeenhereIcon" ? (
                            <BeenhereIcon
                              sx={{ fontSize: 40, color: "#1FC59F" }}
                            />
                          ) : eachCard.iconName == "BlockIcon" ? (
                            <BlockIcon
                              sx={{ fontSize: 40, color: "#1FC59F" }}
                            />
                          ) : eachCard.iconName == "RotateRightIcon" ? (
                            <RotateRightIcon
                              sx={{ fontSize: 40, color: "#1FC59F" }}
                            />
                          ) : eachCard.iconName == "FindReplaceIcon" ? (
                            <FindReplaceIcon
                              sx={{ fontSize: 40, color: "#1FC59F" }}
                            />
                          ) : eachCard.iconName == "CreditScoreIcon" ? (
                            <CreditScoreIcon
                              sx={{ fontSize: 40, color: "#1FC59F" }}
                            />
                          ) : eachCard.iconName == "FactCheckIcon" ? (
                            <FactCheckIcon
                              sx={{ fontSize: 40, color: "#1FC59F" }}
                            />
                          ) : eachCard.iconName == "VerifiedIcon" ? (
                            <VerifiedIcon
                              sx={{ fontSize: 40, color: "#1FC59F" }}
                            />
                          ) : eachCard.iconName == "HailIcon" ? (
                            <HailIcon
                              sx={{ fontSize: 40, color: "#1FC59F" }}
                            />
                          ) :  eachCard.iconName == "AlaramOnIcon" ? (
                            <AlaramOnIcon
                              sx={{ fontSize: 40, color: "#1FC59F" }}
                            />
                          ) :  eachCard.iconName == "AttachEmailIcon" ? (
                            <AttachEmailIcon
                              sx={{ fontSize: 40, color: "#1FC59F" }}
                            />
                          ) :  eachCard.iconName == "ReplayIcon" ? (
                            <ReplayIcon
                              sx={{ fontSize: 40, color: "#1FC59F" }}
                            />
                          ) : 
                          
                          
                          null}
                        </Grid>
                        <Grid item>
                          <Typography variant="h6">{eachCard.name}</Typography>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="center">
            <Grid item>
              <Typography variant="h6">
                Please select to view the Report
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(withStyles(styles)(withApollo(ReportCards)));
