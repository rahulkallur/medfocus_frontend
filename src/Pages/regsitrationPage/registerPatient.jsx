import React, { Component } from "react";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";
import { withApollo } from "react-apollo";
import { withStyles } from "@material-ui/core";
import AddUserByAdmin from "./registerPatientByAdmin";
import { Grid, Typography, Button, TextField } from "@material-ui/core";
import PersonIcon from "@mui/icons-material/Person";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PolicyIcon from "@mui/icons-material/Policy";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import EmailIcon from "@mui/icons-material/Email";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PateintViewOnly from "./patientViewOnly";
import Snackbar from "@mui/material/Snackbar";

const CREATE_PATIENT_BY_USER = gql`
  mutation addPatientClaimsByUser(
    $loginId: Int!
    $userId: String!
    $patientName: String!
    $mobileNo: String!
    $emailId: String!
    $hospitalName: String!
    $companyName: String
    $policyHolderName: String
    $empId: String
  ) {
    addPatientClaimsByUser(
      loginId: $loginId
      userId: $userId
      patientName: $patientName
      mobileNo: $mobileNo
      emailId: $emailId
      hospitalName: $hospitalName
      companyName: $companyName
      policyHolderName: $policyHolderName
      empId: $empId
    )
  }
`;

const GET_DEFAULT_HOSPITAL_NAME = gql`
  {
    getHospitalDetailsLoginId {
      name
    }
  }
`;

const GET_ALL_PATIENTS_BY_LOGINID = gql`
  query getAllPatientsByLoginId($loginId: Int!) {
    getAllPatientsByLoginId(loginId: $loginId) {
      patientName
      mobileNo
      hospitalName
      employeeId
      policyHolderName
      companyName
    }
  }
`;

const styles = (theme) => ({
  reportHeader: {
    color: "#1FC59F",
    fontSize: "100",
  },
});

class RegisterPatient extends Component {
  state = {
    showPassword: false,
    userDetailsArray: [],
    isRegisteredSuccess: false,
    patientName: "",
    mobileNumber: "",
    emailId: "",
    hospitalName: "",
    policyHolderName: "",
    companyName: "",
    empId: "",
    isAdmin: false,
    allPatients: [],
    isLoading: false,
    defaultHospitalName: "",
  };

  inputChangeField = (e, inputType) => {
    e.preventDefault();

    this.setState({
      [e.target.name]: e.target.value,
      isRegisteredSuccess: false,
      registrationFailed: false,
    });
  };

  getAllPatientsByLogin = async () => {
    let localStorageLoginId = localStorage.getItem("loginId");
    this.setState({ isLoading: true });

    let allPatientsResponse = await this.props.client.query({
      query: GET_ALL_PATIENTS_BY_LOGINID,
      variables: {
        loginId: parseInt(localStorageLoginId),
      },
      fetchPolicy: "network-only",
    });

    this.setState({
      allPatients: allPatientsResponse.data.getAllPatientsByLoginId,
      isLoading: false,
    });
  };

  handleSubmit = async (loginId) => {
    let localStorageLoginId = localStorage.getItem("loginId");

    let currentTimestamp = Math.floor(Date.now() / 1000);
    let userId = `${localStorageLoginId}MED${currentTimestamp}`;

    let response = await this.props.client.mutate({
      mutation: CREATE_PATIENT_BY_USER,
      variables: {
        loginId: parseInt(localStorageLoginId),
        userId: userId,
        patientName: this.state.patientName,
        mobileNo: this.state.mobileNumber,
        emailId: this.state.emailId,
        hospitalName: this.state.hospitalName,
        companyName: this.state.companyName,
        policyHolderName: this.state.policyHolderName,
        empId: this.state.empId,
      },
    });

    if (response.data.addPatientClaimsByUser == true) {
      this.props.socketData.emit("sendNotification", {
        patientName: this.state.patientName,
        hospitalName: this.state.hospitalName,
      });

      this.setState({
        isRegisteredSuccess: true,
        patientName: "",
        mobileNumber: "",
        emailId: "",
        hospitalName: "",
        companyName: "",
        empId: "",
        policyHolderName: "",
      });
      await this.getAllPatientsByLogin();
    } else {
      this.setState({
        isRegisteredSuccess: false,
        registrationFailed: true,
      });
    }
  };

  backButtonHandler = () => {
    this.props.history.push("/home");
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ isRegisteredSuccess: false, registrationFailed: false });
  };

  getHospitalName = async () => {
    let hospitalNameData = await this.props.client.mutate({
      mutation: GET_DEFAULT_HOSPITAL_NAME,
    });
    if (
      hospitalNameData &&
      hospitalNameData.data &&
      hospitalNameData.data.getHospitalDetailsLoginId
    ) {
      this.setState({
        defaultHospitalName:
          hospitalNameData.data.getHospitalDetailsLoginId.name,
        hospitalName: hospitalNameData.data.getHospitalDetailsLoginId.name,
      });
    }
  };

  async componentDidMount() {
    let rolesName = localStorage.getItem("roles");

    if (rolesName != "CLIENT") {
      this.setState({ isAdmin: true });
    }
    await this.getHospitalName();
    await this.getAllPatientsByLogin();
  }

  render() {
    const { classes, client } = this.props;
    console.log("props ======", this.props);
    console.log("socket data till here ====", this.props.socketData);

    const {
      patientName,
      mobileNumber,
      emailId,
      hospitalName,
      policyHolderName,
      companyName,
      empId,
      isRegisteredSuccess,
      registrationFailed,
      isAdmin,
      allPatients,
      isLoading,
    } = this.state;
    return isAdmin ? (
      <AddUserByAdmin props={this.props} />
    ) : (
      <Grid container>
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
                    New Client Registration
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
                id="patientName"
                label="Patient Name"
                name="patientName"
                value={patientName}
                type="text"
                variant="outlined"
                onChange={(e) => this.inputChangeField(e, "patientName")}
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
                id="mobileNumber"
                label="Mobile Number"
                name="mobileNumber"
                value={mobileNumber}
                type="number"
                variant="outlined"
                onChange={(e) => this.inputChangeField(e, "mobileNumber")}
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
            <Grid
              item
              style={{
                padding: "20px 0px 0px 50px",
              }}
            >
              <TextField
                id="emailId"
                label="Email Id"
                name="emailId"
                value={emailId}
                type="text"
                variant="outlined"
                onChange={(e) => this.inputChangeField(e, "emailId")}
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
                id="hospitalName"
                label="Hospital Name"
                name="hospitalName"
                value={hospitalName}
                type="text"
                disabled={this.state.defaultHospitalName != ""}
                variant="outlined"
                onChange={(e) => this.inputChangeField(e, "hospitalName")}
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
            <Grid
              item
              style={{
                padding: "20px 0px 0px 50px",
              }}
            >
              <TextField
                id="companyName"
                label="Company Name"
                name="companyName"
                value={companyName}
                type="text"
                variant="outlined"
                onChange={(e) => this.inputChangeField(e, "companyName")}
                InputProps={{
                  startAdornment: (
                    <ApartmentIcon
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
                id="policyHolderName"
                label="Policy Holder Name"
                name="policyHolderName"
                value={policyHolderName}
                type="text"
                variant="outlined"
                onChange={(e) => this.inputChangeField(e, "policyHolderName")}
                InputProps={{
                  startAdornment: (
                    <PolicyIcon
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
                id="empId"
                label="Employee Id"
                name="empId"
                value={empId}
                type="text"
                variant="outlined"
                onChange={(e) => this.inputChangeField(e, "empId")}
                InputProps={{
                  startAdornment: (
                    <MedicalInformationIcon
                      style={{
                        fill: "#1FC59F",
                        marginRight: "10px",
                      }}
                    />
                  ),
                }}
              />
            </Grid>
            <Snackbar
              open={isRegisteredSuccess || registrationFailed}
              autoHideDuration={2500}
              onClose={this.handleSnackbarClose}
              message={
                isRegisteredSuccess
                  ? "Form successfully submitted."
                  : "Form Failed to Submit"
              }
            />

            {/* {isRegisteredSuccess ? (
              <Grid
                container
                justifyContent="center"
                style={{ padding: "15px 0px 15px 50px" }}
              >
                <Grid item xs={12}>
                  <Typography style={{ color: "green" }}>
                    Form successfully submitted.
                  </Typography>
                </Grid>
              </Grid>
            ) : null} */}
            <Grid
              item
              style={{
                padding: "30px 0px 0px 50px",
              }}
            >
              <Button
                style={{ width: "30vh" }}
                color="primary"
                variant="contained"
                onClick={() => this.handleSubmit()}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} style={{ padding: "30px 0px 25px 10px" }}>
          <PateintViewOnly tableData={allPatients} isLoading={isLoading} />
        </Grid>
      </Grid>
    );
  }
}
export default withRouter(withApollo(withStyles(styles)(RegisterPatient)));
