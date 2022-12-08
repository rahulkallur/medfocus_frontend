import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  NativeSelect,
  Select,
  MenuItem,
} from "@mui/material";
import moment from "moment";
import { Component } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { withStyles } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";
import CircularProgress from "@mui/material/CircularProgress";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import { withRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PatientView from "./PatientView";

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

const options = {
  filterType: "dropdown",
  responsive: "scroll",
  selectableRows: false,
};

const GET_REPORT_DATA = gql`
  query getReportDetails(
    $claimType: String
    $startTime: String
    $endTime: String
  ) {
    getReportDetails(
      claimType: $claimType
      startTime: $startTime
      endTime: $endTime
    ) {
      id
      patientName
      userId
      mobileNo
      age
      claimNo
      cardNo
      claimStatus
      patientRemarks
      internalRemarks
      lastUpdatedON
      TPAName
      insuranceName
      hospitalName
      claimType
      admissionDate
      dischargeDate
      treatmentName
      mailId
      policyNumber
      policyType
      companyName
      employeeId
      pickupDate
      submissionDate
      claimedAmount
      approvedAmount
      settlementDate
      feeQuoted
      feeStructure
      amountPaid
      modeOfPayment
      balance
      postDatedCheque
      convertedBy
      claimDocument
    }
  }
`;

// const DOWNLOAD_PUBLIC_DOC = gql`
// query getPublicDownloadURL($bucketName:String!,$filename:String!){
//   getPublicDownloadURL(bucketName: $bucketName",filename:$filename)}
//   `;


const DOWNLOAD_PUBLIC_DOC = gql`
  query getPublicDownloadURL($bucketName:String!,$filename:String!) {
    getPublicDownloadURL(bucketName: $bucketName, filename: $filename)
  }
`;
class ReportViewer1 extends Component {
  state = {
    reportDetailsArray: [],
    selectedClaimType: null,
    reportColumn: [],
    isLoading: false,
    timeRange: "Today",
    fromDate: "",
    toDate: "",
    patientViewData: {},
    isPatientView: false,
  };
  getMuiTheme = () =>
    createTheme({
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: "#EAF7F2",
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            head: {
              color: "#EAF7F2",
              backgroundColor: "#1FC59F !important",
              font: "30px",
            },
          },
        },
      },
    });

  componentDidMount() {
    this.setState(
      { selectedClaimType: this.props.location.state.selectedReportName },
      () => {
        this.getReportData(this.state.selectedClaimType);
      }
    );
  }

  handleViewClick = (e, i) => {
    let filteredPatientData = this.state.reportDetailsArray[i.rowIndex];
    if (filteredPatientData) {
      this.setState({
        patientViewData: filteredPatientData,
        isPatientView: true,
      });
    }
  };

  backButtonHandler = () => {
    this.props.history.push("/home/reports");
  };

  getReportData = async (selectedReportType) => {
    this.setState({ isLoading: true });

    let currentTimeStamp = Math.floor(Date.now() / 1000);
    let fromTimeStamp;

    if (selectedReportType) {
      console.log("this.state.timeRange ---", this.state.timeRange);
      if (this.state.timeRange == "Today") {
        fromTimeStamp = currentTimeStamp - 86400;
      } else if (this.state.timeRange == "Weekly") {
        fromTimeStamp = currentTimeStamp - 604800;
      } else if (this.state.timeRange == "Monthly") {
        fromTimeStamp = currentTimeStamp - 2630000;
      } else if (this.state.timeRange == "Yearly") {
        fromTimeStamp = currentTimeStamp - 31536000;
      } else if (this.state.timeRange == "Custom") {
        fromTimeStamp =
          moment(`${this.state.fromDate}`, "YYYY-MM-DD").valueOf() / 1000;

        currentTimeStamp =
          moment(`${this.state.toDate}`, "YYYY-MM-DD").valueOf() / 1000;
      }

      console.log("fromTimeStamp ---", fromTimeStamp);

      let getReportDetails = await this.props.client.query({
        query: GET_REPORT_DATA,
        fetchPolicy: "network-only",
        variables: {
          claimType: selectedReportType,
          startTime: fromTimeStamp.toString(),
          endTime: currentTimeStamp.toString(),
        },
      });
      if (
        getReportDetails &&
        getReportDetails.data &&
        getReportDetails.data.getReportDetails.length
      ) {
        let fetchedReportDetails = getReportDetails.data.getReportDetails;
        let columnArray = [];
        let rolesName = localStorage.getItem("roles");

        let objectToBeMerged;
        if (rolesName != "CLIENT") {
          objectToBeMerged = [
            {
              label: "",
              name: "",
              options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                  return (
                    <Button
                      style={{ width: "15vh", backgroundColor: "#1FC59F" }}
                      variant="contained"
                      // onClick={() => console.log(value, tableMeta)}
                      onClick={() => this.handleDocDownload(value, tableMeta)}
                    >
                      Claim Doc
                    </Button>
                  );
                },
              },
            },
            {
              label: "",
              name: "",
              options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                  return (
                    <Button
                      style={{ width: "15vh", backgroundColor: "#1FC59F" }}
                      variant="contained"
                      // onClick={() => console.log(value, tableMeta)}
                      onClick={() => this.handleEditClick(value, tableMeta)}
                    >
                      Edit
                    </Button>
                  );
                },
              },
            },
            {
              label: "",
              name: "",
              options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                  return (
                    <Button
                      style={{ width: "15vh", backgroundColor: "#1FC59F" }}
                      variant="contained"
                      // onClick={() => console.log(value, tableMeta)}
                      onClick={() => this.handleViewClick(value, tableMeta)}
                    >
                      View
                    </Button>
                  );
                },
              },
            },
          ];
        } else {
          objectToBeMerged = [
            {
              label: "",
              name: "",
              options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                  return (
                    <Button
                      style={{ width: "15vh", backgroundColor: "#1FC59F" }}
                      variant="contained"
                      // onClick={() => console.log(value, tableMeta)}
                      onClick={() => this.handleViewClick(value, tableMeta)}
                    >
                      View
                    </Button>
                  );
                },
              },
            },
          ];
        }

        console.log("fetchedReportDetails =====----", fetchedReportDetails);
        if (fetchedReportDetails) {
          let reportColumn = Object.keys(fetchedReportDetails[0]).map((e) => {
            let columnObj = {};

            let columnLabel = e
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());
            columnObj.label = columnLabel;
            columnObj.name = e;
            columnArray.push(columnObj);
          });
          this.setState({
            reportColumn: [...columnArray, ...objectToBeMerged],
            reportDetailsArray: fetchedReportDetails,
          });
        }
      }
      this.setState({ isLoading: false });
    }
  };

  handleSubmitButton = async () => {
    console.log("this.state.fromDate -------", this.state.fromDate);
    console.log("this.state.toDate -------", this.state.toDate);
    if (this.state.timeRange != "Custom") {
      await this.getReportData(this.state.selectedClaimType);
    } else {
      if (this.state.fromDate == "") {
        toast("Please select From Date");
      } else if (this.state.toDate == "") {
        toast("Please select To Date");
      } else if (this.state.toDate < this.state.fromDate) {
        toast("From Date must be smaller than To Date");
      } else {
        await this.getReportData(this.state.selectedClaimType);
      }
    }
  };

  inputChangeField = (e, inputType) => {
    // console.log("e.target.value ------", e.target.value);
    // console.log("e.target.name -----", e.target.name);
    e.preventDefault();

    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleEditClick = async (value, tableMeta) => {
    let filteredPatientData = this.state.reportDetailsArray[tableMeta.rowIndex];

    console.log("filteredPatientData ---------", filteredPatientData);

    let requiredId = filteredPatientData.id;
    console.log("requiredId -----", requiredId);

    this.props.history.push({
      pathname: "/home/registerPatient",
      state: { id: parseInt(requiredId) },
    });
  };

  handleDocDownload = async (value, tableMeta) => {
    let filteredPatientDocDownload =
      this.state.reportDetailsArray[tableMeta.rowIndex];
    console.log(
      "filteredPatientDocDownload==>",
      filteredPatientDocDownload.claimDocument
    );

    if (filteredPatientDocDownload.claimDocument) {
      let downloadUplicUrl = await this.props.client.query({
        query: DOWNLOAD_PUBLIC_DOC,
        variables: {
          bucketName: "medfocus-patient-documents",
          filename: filteredPatientDocDownload.claimDocument,
        },
        fetchPolicy: "network-only",
      });
      if(downloadUplicUrl && downloadUplicUrl.data && downloadUplicUrl.data.getPublicDownloadURL){
        let linkToDownload = document.createElement('a');
        linkToDownload.href =  downloadUplicUrl.data.getPublicDownloadURL;
        document.body.appendChild(linkToDownload);
        linkToDownload.click();
        document.body.removeChild(linkToDownload);
      }
    }
  };

  render() {
    const { classes } = this.props;
    const { isLoading, timeRange } = this.state;
    const { selectedReportName, selectedReportKey } = this.props.location.state;
    return (
      <>
        {!this.state.isPatientView ? (
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
                      <ArrowBackIcon
                        fontSize="large"
                        onClick={this.backButtonHandler}
                        style={{ cursor: "pointer" }}
                      />
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant="h4" className={classes.reportHeader}>
                        {selectedReportName}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                direction="row"
                style={{ padding: "0px 0px 0px 30px" }}
              >
                <Grid item style={{ padding: "0px 25px 10px 0px" }}>
                  <FormControl
                    variant="standard"
                    fullWidth
                    style={{ width: "200px" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Select Time Range
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      name="timeRange"
                      defaultValue={timeRange}
                      onChange={(e) => this.inputChangeField(e, "timeRange")}
                    >
                      <MenuItem value={"Today"}>Today</MenuItem>
                      <MenuItem value={"Weekly"}>Weekly</MenuItem>
                      <MenuItem value={"Monthly"}>Monthly</MenuItem>
                      <MenuItem value={"Yearly"}>Yearly</MenuItem>
                      <MenuItem value={"Custom"}>Custom</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {timeRange == "Custom" && (
                  <>
                    <Grid item style={{ padding: "0px 25px 10px 0px" }}>
                      <TextField
                        style={{ width: "200px" }}
                        id="fromDate"
                        label="Select From Date"
                        name="fromDate"
                        type="date"
                        variant="outlined"
                        disabled={timeRange != "Custom"}
                        onChange={(e) => this.inputChangeField(e, "fromDate")}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>

                    <Grid item style={{ padding: "0px 25px 10px 0px" }}>
                      <TextField
                        style={{ width: "200px" }}
                        id="toDate"
                        label="Select To Date"
                        name="toDate"
                        type="date"
                        variant="outlined"
                        disabled={timeRange != "Custom"}
                        onChange={(e) => this.inputChangeField(e, "toDate")}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  </>
                )}

                <Grid item style={{ padding: "10px 25px 10px 0px" }}>
                  <Button
                    style={{ width: "30vh", backgroundColor: "#1FC59F" }}
                    variant="contained"
                    onClick={() => this.handleSubmitButton()}
                  >
                    Submit
                  </Button>
                </Grid>

                <Grid item style={{ padding: "10px 25px 10px 0px" }}>
                  <ToastContainer />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {isLoading ? (
                <Grid container justifyContent="center">
                  <Grid xs={3} textAlign="center">
                    <CircularProgress
                      size="80px"
                      sx={{
                        color: "#1FC59F",
                      }}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container justifyContent="center">
                  {!this.state.reportDetailsArray.length ? (
                    <Grid item xs={12}>
                      <Grid container justifyContent="center">
                        <Grid xs={3} textAlign="center">
                          <BrokenImageIcon
                            sx={{
                              fontSize: "100px",
                              color: "#106350",
                            }}
                          />
                          <Typography
                            className={classes.reportHeader}
                            variant="h4"
                          >
                            No Data Available
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <ThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                          className={classes.dataTable}
                          data={this.state.reportDetailsArray}
                          columns={this.state.reportColumn}
                          options={options}
                        />
                      </ThemeProvider>
                    </Grid>
                  )}
                </Grid>
              )}
            </Grid>
          </Grid>
        ) : (
          <Grid>
            <PatientView patientViewData={this.state.patientViewData} />
          </Grid>
        )}
      </>
    );
  }
}

export default withRouter(withStyles(styles)(withApollo(ReportViewer1)));
