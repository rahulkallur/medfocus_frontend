import React, { Component } from "react";
import gql from "graphql-tag";
import moment from "moment";
import { withApollo } from "react-apollo";
import {
  Grid,
  Typography,
  Button,
  TextField,
  Modal,
  Box,
} from "@material-ui/core";
import PersonIcon from "@mui/icons-material/Person";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import EmailIcon from "@mui/icons-material/Email";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import KeyIcon from "@mui/icons-material/Key";
import { withStyles } from "@material-ui/core";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MUIDataTable from "mui-datatables";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { withRouter } from "react-router-dom";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import Snackbar from "@mui/material/Snackbar";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const GET_USER_DETAILS = gql`
  query {
    getUserDetails {
      loginId
      username
      accountType
      createdAt
      updatedAt
      status
      clientName
      email
      contactNumber
      address
      hospitalName
      isValidStatus
    }
  }
`;

const UPDATE_USER = gql`
  query updateUserStatus($userName: String, $loginId: Int!, $status: Int!) {
    updateUserStatus(userName: $userName, loginId: $loginId, status: $status)
  }
`;

const UPDATE_USER_DETAILS = gql`
  mutation updateClientDetails(
    $loginId: Int!
    $address: String
    $email: String
    $password: String
    $username: String
    $clientName: String
    $hospitalName: String
    $contactNumber: String
  ) {
    updateClientDetails(
      loginId: $loginId
      address: $address
      email: $email
      password: $password
      username: $username
      clientName: $clientName
      hospitalName: $hospitalName
      contactNumber: $contactNumber
    )
  }
`;

const CLIENT_SIGNUP = gql`
  mutation clientSignup(
    $username: String!
    $password: String!
    $accountType: String
    $clientName: String
    $email: String!
    $contactNumber: String!
    $address: String
    $hospitalName: String!
  ) {
    clientSignup(
      username: $username
      password: $password
      accountType: $accountType
      clientName: $clientName
      email: $email
      contactNumber: $contactNumber
      address: $address
      hospitalName: $hospitalName
    )
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
      backgroundColor: "#1FC59F !important",
    },
    "&:hover": {
      boxShadow: "0px 0px 10px 5px #1FC59F",
    },
  },
});

const options = {
  filterType: "dropdown",
  responsive: "scroll",
};

class AddUser extends Component {
  state = {
    showPassword: false,
    userDetailsArray: [],
    updateUserName: null,
    updateLoginId: null,
    updateUserStatus: null,
    updateUserArray: [],
    isEditUser: false,
    // isNameValid: false,
    isFormSubmitted: false,
    isFormSubmitError: false,
    isUserNameValid: false,
    isEmailValid: false,
    isContactValid: false,
    isAddressvalid: false,
    isPasswordValid: false,
    errorMessage: "",
    usernameEdit: "",
    passwordEdit: "",
    emailIdEdit: "",
    hospitalNameEdit: "",
    fullnameEdit: "",
    mobileNumberEdit: "",
    addressEdit: "",
    selectedUserId: null,
  };

  columns = [
    { label: "Login Id", name: "loginId" },
    { label: "User Name", name: "username" },
    { label: "Account Type", name: "accountType" },
    { label: "Created Date", name: "createdAt" },
    { label: "Updated Date", name: "updatedAt" },
    { label: "Client Name", name: "clientName" },
    { label: "Email Id", name: "email" },
    { label: "Phone No", name: "contactNumber" },
    { label: "Address", name: "address" },
    { label: "Hospital Name", name: "hospitalName" },

    {
      label: "Update Status",
      name: "isValidStatus",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Button
              style={{
                backgroundColor: value ? "red" : "#1FC59F",
                color: "white",
              }}
              onClick={() => this.updateUserStatus(value, tableMeta)}
            >
              {value ? "Disbale" : "Enable"}
            </Button>
          );
        },
      },
    },

    {
      label: "Update User",
      name: "status",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Button
              style={{
                backgroundColor: "#1FC59F",
                color: "white",
              }}
              onClick={() => this.editUser(value, tableMeta)}
            >
              edit
            </Button>
          );
        },
      },
    },
  ];

  resetFields = () => {
    this.setState({
      username: "",
      password: "",
      emailId: "",
      hospitalName: "",
      fullname: "",
      mobileNumber: "",
      address: "",
      usernameEdit: "",
      passwordEdit: "",
      emailIdEdit: "",
      hospitalNameEdit: "",
      fullnameEdit: "",
      mobileNumberEdit: "",
      addressEdit: "",
    });
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackbarEnable: false });
  };

  handleEditSubmit = async() => {
    let updateResponse = await this.props.client.mutate({
      mutation: UPDATE_USER_DETAILS,
      variables: {
        loginId: this.state.selectedUserId ? this.state.selectedUserId : null,
        address: this.state.addressEdit != "" ? this.state.addressEdit : null,
        email: this.state.emailIdEdit != "" ? this.state.emailIdEdit : null,
        password: this.state.passwordEdit != "" ? this.state.passwordEdit : null,
        username:
          this.state.usernameEdit != "" ? this.state.usernameEdit : null,
        clientName:
          this.state.fullnameEdit != "" ? this.state.fullnameEdit : null,
        hospitalName:
          this.state.hospitalNameEdit != ""
            ? this.state.hospitalNameEdit
            : null,
        contactNumber:
          this.state.mobileNumberEdit != ""
            ? this.state.mobileNumberEdit
            : null,
      },
    });
    if(updateResponse.data){
      this.setState(
        {
          isFormSubmitted: true,
          errorMessage: updateResponse.data.updateClientDetails,
          snackbarEnable: true,
        },
        () => {
          this.getAllUserDetails();
          this.resetFields();
          this.closeEditHandler();
        }
      );
    }
  };

  checkUserRegDetails = () => {
    const regexUserName = new RegExp(/^[a-zA-Z0-9]{5,32}$/);
    const regexContactNo = new RegExp(/^[0-9]{8,20}$/);
    const regexEmailId = new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/);
    const regexHospital = new RegExp(/^[a-zA-Z]{3,32}(?: [a-zA-Z]+){0,2}$/);

    let checkUserNameResult =
      this.state.username != undefined &&
      regexUserName.test(this.state.username);

    let checkContactNumberResult =
      this.state.mobileNumber != undefined &&
      regexContactNo.test(this.state.mobileNumber);

    let checkEmailResult =
      this.state.emailId != undefined &&
      this.state.emailId.length >= 6 &&
      this.state.emailId.length <= 100 &&
      regexEmailId.test(this.state.emailId);

    let checkHospital =
      this.state.hospitalName != undefined &&
      regexHospital.test(this.state.hospitalName);

    this.setState(
      {
        isUserNameValid: checkUserNameResult ? true : false,
        isContactValid: checkContactNumberResult ? true : false,
        isEmailValid: checkEmailResult ? true : false,
        isPasswordValid:
          this.state.password != undefined && this.state.password.length >= 8
            ? true
            : false,
        isHospitalValid: checkHospital ? true : false,
      },
      () => {
        this.freshUserSubmitHandler();
      }
    );
  };

  freshUserSubmitHandler = async () => {
    if (
      this.state.isUserNameValid == true &&
      this.state.isEmailValid == true &&
      this.state.isContactValid == true &&
      this.state.isPasswordValid == true &&
      this.state.isHospitalValid == true
    ) {
      const { loading, errors, data } = await this.props.client.mutate({
        mutation: CLIENT_SIGNUP,
        variables: {
          clientName: this.state.fullname ? this.state.fullname : "",
          username: this.state.username,
          password: this.state.password,
          email: this.state.emailId,
          contactNumber: this.state.mobileNumber,
          address: this.state.address ? this.state.address : "",
          accountType: "CLT",
          hospitalName: this.state.hospitalName,
        },
      });

      if (data.clientSignup == "Success") {
        this.setState(
          {
            isFormSubmitted: true,
            errorMessage: "User signup Success",
            snackbarEnable: true,
          },
          () => {
            this.getAllUserDetails();
            this.resetFields();
          }
        );
      } else {
        this.setState({
          isFormSubmitError: true,
          errorMessage: "User signup failed. Something went wrong",
          snackbarEnable: true,
        });
      }
    } else {
      this.setState({
        isFormSubmitError: true,
        errorMessage: "User signup failed. Please enter correct details.",
        snackbarEnable: true,
      });
    }
  };

  getAllUserDetails = async () => {
    let getUserDetails = await this.props.client.query({
      query: GET_USER_DETAILS,
      fetchPolicy: "network-only",
    });
    if (
      getUserDetails &&
      getUserDetails.data &&
      getUserDetails.data.getUserDetails
    ) {
      let fetchedUserDetails = getUserDetails.data.getUserDetails;
      this.setState({ userDetailsArray: fetchedUserDetails });
    }
  };

  updateUserStatus = async (e, args) => {
    let userUpdateResult;
    if (args.rowData) {
      userUpdateResult = await this.props.client.query({
        query: UPDATE_USER,
        variables: {
          userName: args.rowData[1],
          loginId: args.rowData[0],
          status: args.rowData[10] === 1 ? 0 : 1,
        },
        fetchPolicy: "network-only",
      });
    }
    userUpdateResult && (await this.getAllUserDetails());
  };

  editUser = (e, args) => {
    console.log("This is e", e, "this is args", args.rowData);
    this.setState({ updateUserArray: args.rowData, isEditUser: true });
    this.setState(
      {
        selectedUserId: args.rowData[0],
        usernameEdit: args.rowData[1],
        passwordEdit: "",
        emailIdEdit: args.rowData[6],
        hospitalNameEdit: args.rowData[9],
        fullnameEdit: args.rowData[5],
        mobileNumberEdit: args.rowData[7],
        addressEdit: args.rowData[8],
      },
      () => {
        console.log("usernameEdit", this.state.usernameEdit);
      }
    );
  };

  backButtonHandler = () => {
    this.props.history.push("/home");
  };

  closeEditHandler = () => {
    this.setState({ isEditUser: false });
  };

  async componentDidMount() {
    await this.getAllUserDetails();
  }
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
              backgroundColor: "#1FC59F !important",
              color: "#EAF7F2",
              font: "30px",
            },
          },
        },
      },
    });

  inputChangeField = (e, inputType) => {
    console.log("This is e ", e.target.value);
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { classes } = this.props;
    const { isEditUser } = this.state;
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
                  <ArrowBackIcon
                    fontSize="large"
                    onClick={this.backButtonHandler}
                    style={{ cursor: "pointer" }}
                  />
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="h4" className={classes.reportHeader}>
                    New User Registration
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
                label="Username *"
                type="username"
                name="username"
                variant="outlined"
                value={!isEditUser ? this.state.username : ""}
                onChange={(e) => this.inputChangeField(e)}
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
                label="Full Name"
                type="fullname"
                name="fullname"
                variant="outlined"
                value={!isEditUser ? this.state.fullname : ""}
                onChange={(e) => this.inputChangeField(e)}
                InputProps={{
                  startAdornment: (
                    <AssignmentIndIcon
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
                label="Mobile Number *"
                type="mobileNumber"
                variant="outlined"
                name="mobileNumber"
                value={!isEditUser ? this.state.mobileNumber : ""}
                onChange={(e) => this.inputChangeField(e)}
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
                // style={{ width: "40vh" }}
                id="outlined-basic"
                label="Email Id *"
                type="emailId"
                name="emailId"
                value={!isEditUser ? this.state.emailId : ""}
                variant="outlined"
                onChange={(e) => this.inputChangeField(e)}
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
                label="Address"
                type="address"
                name="address"
                value={!isEditUser ? this.state.address : ""}
                variant="outlined"
                onChange={(e) => this.inputChangeField(e)}
                InputProps={{
                  startAdornment: (
                    <BusinessIcon
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
                label="Hospital Name *"
                type="hospitalName"
                name="hospitalName"
                value={!isEditUser ? this.state.hospitalName : ""}
                variant="outlined"
                onChange={(e) => this.inputChangeField(e)}
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
                style={{ width: "250px" }}
                id="outlined-basic"
                label="Password *"
                type={this.state.showPassword ? "text" : "password"}
                name="password"
                value={!isEditUser ? this.state.password : ""}
                variant="outlined"
                onChange={(e) => this.inputChangeField(e)}
                InputProps={{
                  startAdornment: (
                    <KeyIcon
                      style={{
                        fill: "#1FC59F",
                        marginRight: "10px",
                      }}
                    />
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          this.setState({
                            showPassword: !this.state.showPassword,
                          })
                        }
                      >
                        {this.state.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

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
                onClick={() => this.checkUserRegDetails()}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container style={{ marginTop: "20px" }}>
            <Grid item xs={4}>
              <Grid container justifyContent="space-around">
                <Grid item xs={10}>
                  <Typography variant="h4" className={classes.reportHeader}>
                    List of Users
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="center">
            <Grid item xs={12}>
              <ThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                  className={classes.dataTable}
                  data={this.state.userDetailsArray}
                  columns={this.columns}
                  options={options}
                />
              </ThemeProvider>
            </Grid>
          </Grid>
        </Grid>
        <Snackbar
          open={this.state.snackbarEnable}
          autoHideDuration={2500}
          onClose={this.handleSnackbarClose}
          message={this.state.errorMessage}
        />
        <Modal
          open={isEditUser}
          onClose={this.closeEditHandler}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box>
            <Grid
              container
              style={{
                backgroundColor: "white",
                width: "650px",
                padding: "20px 0px 0px 50px",
              }}
            >
              <Grid item xs={12}>
                <Typography variant="h4">Edit User</Typography>
              </Grid>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                spacing={5}
                style={{ paddingTop: "20px" }}
              >
                <Grid item xs={6}>
                  <TextField
                    // style={{ width: "40vh" }}
                    id="outlined-basic"
                    label="Username"
                    type="usernameEdit"
                    name="usernameEdit"
                    variant="outlined"
                    value={this.state.usernameEdit}
                    onChange={(e) => this.inputChangeField(e)}
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
                <Grid item xs={6}>
                  <TextField
                    // style={{ width: "40vh" }}
                    id="outlined-basic"
                    label="Full Name"
                    type="fullname"
                    name="fullnameEdit"
                    variant="outlined"
                    value={this.state.fullnameEdit}
                    onChange={(e) => this.inputChangeField(e)}
                    InputProps={{
                      startAdornment: (
                        <AssignmentIndIcon
                          style={{
                            fill: "#1FC59F",
                            marginRight: "10px",
                          }}
                        />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    // style={{ width: "40vh" }}
                    id="outlined-basic"
                    label="Mobile Number"
                    type="mobileNumber"
                    name="mobileNumberEdit"
                    value={this.state.mobileNumberEdit}
                    variant="outlined"
                    onChange={(e) => this.inputChangeField(e)}
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
                <Grid item xs={6}>
                  <TextField
                    // style={{ width: "40vh" }}
                    id="outlined-basic"
                    label="Email Id"
                    type="emailId"
                    name="emailIdEdit"
                    variant="outlined"
                    value={this.state.emailIdEdit}
                    onChange={(e) => this.inputChangeField(e)}
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
                <Grid item xs={6}>
                  <TextField
                    // style={{ width: "40vh" }}
                    id="outlined-basic"
                    label="Address"
                    type="address"
                    name="addressEdit"
                    value={this.state.addressEdit}
                    variant="outlined"
                    onChange={(e) => this.inputChangeField(e)}
                    InputProps={{
                      startAdornment: (
                        <BusinessIcon
                          style={{
                            fill: "#1FC59F",
                            marginRight: "10px",
                          }}
                        />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    // style={{ width: "40vh" }}
                    id="outlined-basic"
                    label="Hospital Name"
                    type="hospitalName"
                    name="hospitalNameEdit"
                    variant="outlined"
                    value={this.state.hospitalNameEdit}
                    onChange={(e) => this.inputChangeField(e)}
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
                <Grid item xs={12}>
                  <TextField
                    style={{ width: "250px" }}
                    id="outlined-basic"
                    label="Password"
                    type={this.state.showPassword ? "text" : "password"}
                    name="passwordEdit"
                    variant="outlined"
                    value={this.state.passwordEdit}
                    onChange={(e) => this.inputChangeField(e)}
                    InputProps={{
                      startAdornment: (
                        <KeyIcon
                          style={{
                            fill: "#1FC59F",
                            marginRight: "10px",
                          }}
                        />
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              this.setState({
                                showPassword: !this.state.showPassword,
                              })
                            }
                          >
                            {this.state.showPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={6} style={{ marginBottom: "20px" }}>
                  <Button
                    style={{ width: "30vh" }}
                    color="primary"
                    variant="contained"
                    onClick={this.handleEditSubmit}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item xs={6} style={{ marginBottom: "20px" }}>
                  <Button
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      width: "30vh",
                    }}
                    color="primary"
                    variant="contained"
                    onClick={() => {}}
                  >
                    Delete User
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </Grid>
    );
  }
}
export default withRouter(withStyles(styles)(withApollo(AddUser)));
