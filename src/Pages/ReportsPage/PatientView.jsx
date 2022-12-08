import { Grid, Paper, Typography } from "@mui/material";
import { Component } from "react";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";
import { withApollo } from "react-apollo";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import moment from "moment";

import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import { toHaveAccessibleDescription } from "@testing-library/jest-dom/dist/matchers";

const GET_PATIENT_TIMELINE = gql`
  query getAllPatientClaimsStatus($userId: String!) {
    getAllPatientClaimsStatus(userId: $userId) {
      claimStatus
      createdAt
    }
  }
`;

class PatientView extends Component {
  state = {
    dataForTimeline: [],
  };

  getPatientTimeline = async (e) => {
    let patientTimeline = await this.props.client.mutate({
      mutation: GET_PATIENT_TIMELINE,
      variables: {
        userId: e,
      },
    });
    if (
      patientTimeline &&
      patientTimeline.data &&
      patientTimeline.data.getAllPatientClaimsStatus.length
    ) {
      this.setState(
        { dataForTimeline: patientTimeline.data.getAllPatientClaimsStatus });
    }
  };

  componentDidMount = () => {
    console.log("this.props.patientViewData", this.props.patientViewData);
    this.setState({ patientDetails: this.props.patientViewData });
    this.getPatientTimeline(this.props.patientViewData.userId);
  };

  render() {
    const { patientViewData } = this.props;
    const { patientDetails, dataForTimeline } = this.state;
    console.log("patientViewData", patientViewData);
    return (
      <Grid container justifyContent="space-evenly">
        <Grid item xs={9}>
          <Paper elevation={12}>
            <Grid container justifyContent="space-around">
              <Grid
                item
                xs={12}
                style={{
                  marginTop: "40px",
                  marginBottom: "40px",
                  backgroundColor: "#1FC59F",
                }}
              >
                <Grid container justifyContent="space-around">
                  <Grid item xs={10}>
                    <Typography
                      variant="h4"
                      style={{ color: "white", fontWeight: "bold" }}
                    >
                      Patient Viewer
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={10} style={{ marginBottom: "10px" }}>
                <Grid container>
                  <Grid item xs={12}>
                    {patientDetails &&
                      Object.keys(patientDetails).map((e) => {
                        let keyValue = e.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
                        let upperCaseKey =
                          keyValue[0].toUpperCase() + keyValue.slice(1);
                        return (
                          <Grid container spacing={5}>
                            <Grid item xs={3}>
                              <Typography variant="h6">
                                {upperCaseKey}
                              </Typography>
                            </Grid>
                            <Grid item xs={9}>
                              <Typography variant="h6">
                                : {patientDetails[e]}
                              </Typography>
                            </Grid>
                          </Grid>
                        );
                      })}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper elevation={12}>
            <Grid container justifyContent="center">
              <Grid
                item
                xs={12}
                style={{
                  marginTop: "40px",
                  marginBottom: "40px",
                  backgroundColor: "#1FC59F",
                }}
              >
                <Grid container justifyContent="center">
                  <Grid item>
                    <Typography
                      variant="h4"
                      style={{ color: "white", fontWeight: "bold" }}
                    >
                      Timeline
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ marginTop: "30px" }}>
                {dataForTimeline &&
                  dataForTimeline.map((e) => {

                    return(<TimelineItem>
                      <TimelineOppositeContent color="textSecondary">
                        {moment.unix(e.createdAt).format("lll")}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>{e.claimStatus}</TimelineContent>
                    </TimelineItem>)
                  })}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(withApollo(PatientView));
