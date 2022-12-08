// Author: Prithvi Kumar M
// Project Name: Medfoucs
// Date: 25/07/2022

import React, { Component } from "react";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";
import {
  Grid,
  Typography,
  Paper,
  withStyles,
  Box,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Modal,
} from "@material-ui/core";
import FormHelperText from "@mui/material/FormHelperText";
import login_page from "../../Assets/images/login_page_display.png";
import medLogo from "../../Assets/images/medfocus.png";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CoronavirusIcon from "@mui/icons-material/Coronavirus";
import SpaIcon from "@mui/icons-material/Spa";
import { withRouter } from "react-router-dom";
import auth from "../../packages/common/apollo/auth";
import CircularProgress from "@mui/material/CircularProgress";
import { split } from "@apollo/client";

const CLIENT_SIGNUP = gql`
  mutation clientSignup(
    $username: String!
    $password: String!
    $accountType: String
    $clientName: String!
    $email: String!
    $contactNumber: String!
    $address: String!
  ) {
    clientSignup(
      username: $username
      password: $password
      accountType: $accountType
      clientName: $clientName
      email: $email
      contactNumber: $contactNumber
      address: $address
    )
  }
`;

const CHECK_CONTACT = gql`
  query checkContactNo($contactNumber: String!) {
    checkContactNo(contactNumber: $contactNumber)
  }
`;

const CHECK_EMAIL = gql`
  query checkEmailId($emailId: String!) {
    checkEmailId(emailId: $emailId)
  }
`;

const LOGIN = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;
const styles = (theme) => ({
  headerTypo: {
    fontWeight: 550,
  },
  boxBorder: {
    borderRadius: 5,
    borderColor: "#1FC59F",
  },
  iconColor: {
    fill: "#1FC59F",
  },
  setFontColor: {
    color: "#1FC59F",
  },
});

class Login extends Component {
  state = {
    loginUser: null,
    userPassword: null,
    modalOpen: false,
    isFormSubmitted: false,
    isFormSubmitError: false,
    errorMessage: "",
    nameBlurClicked: false,
    userNameBlurClicked: false,
    emailBlurClicked: false,
    contactBlurClicked: false,
    addressBlurClicked: false,
    passBlurClicked: false,
    confirmPassBlurClicked: false,
    isNameValid: false,
    isUserNameValid: false,
    isEmailValid: false,
    isContactValid: false,
    isAddressvalid: false,
    isPasswordValid: false,
    isPasswordMatching: false,
    isEmailPresentInDb: false,
    isContactPresentInDb: false,
    wrongCredentials: null,
    setToken: null,
    validationMessage: "Please Check Your Username / Password",
  };

  inputChangeField = (e, inputType) => {
    e.preventDefault();
    if (inputType == "password") {
      this.setState({ userPassword: e.target.value });
    }

    if (inputType == "username") {
      this.setState({ loginUser: e.target.value });
    }

    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  checkContactNoInDb = async () => {
    let response = await this.props.client.query({
      query: CHECK_CONTACT,
      variables: {
        contactNumber: this.state.mobileNumber,
      },
    });

    if (response.data.checkContactNo == true) {
      this.setState({
        isContactPresentInDb: true,
      });
    } else {
      this.setState({
        isContactPresentInDb: false,
      });
    }
  };

  checkEmailIdInDb = async () => {
    let response = await this.props.client.query({
      query: CHECK_EMAIL,
      variables: {
        emailId: this.state.emailId,
      },
    });

    if (response.data.checkEmailId) {
      this.setState({
        isEmailPresentInDb: true,
      });
    } else {
      this.setState({
        isEmailPresentInDb: false,
      });
    }
  };

  checkName = async () => {
    this.setState({ nameBlurClicked: true });

    const regex = new RegExp(/^[a-zA-Z]{5,100}$/);
    let checkNameResult =
      regex.test(this.state.name) && this.state.name != undefined;
    if (checkNameResult) {
      this.setState({ isNameValid: true });
    } else {
      this.setState({ isNameValid: false });
    }
  };

  checkUserName = async () => {
    this.setState({ userNameBlurClicked: true });

    const regex = new RegExp(/^[a-zA-Z0-9]{5,32}$/);
    let checkUserNameResult =
      regex.test(this.state.signUpUsername) &&
      this.state.signUpUsername != undefined;

    if (checkUserNameResult) {
      this.setState({ isUserNameValid: true });
    } else {
      this.setState({ isUserNameValid: false });
    }
  };

  checkContactNumber = async () => {
    this.setState({ contactBlurClicked: true });

    const regex = new RegExp(/^[0-9]{8,20}$/);
    let checkContactNumberResult =
      regex.test(this.state.mobileNumber) &&
      this.state.mobileNumber != undefined;
    if (checkContactNumberResult) {
      this.setState({ isContactValid: true });
      await this.checkContactNoInDb();
    } else {
      this.setState({ isContactValid: false });
    }
  };

  checkEmailId = async () => {
    this.setState({ emailBlurClicked: true });

    let regex = new RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/);
    let checkEmailResult =
      regex.test(this.state.emailId) &&
      this.state.emailId != undefined &&
      this.state.emailId.length >= 6 &&
      this.state.emailId.length <= 100;
    if (checkEmailResult) {
      this.setState({ isEmailValid: true });
      await this.checkEmailIdInDb();
    } else {
      this.setState({ isEmailValid: false });
    }
  };

  checkAddress = async () => {
    this.setState({ addressBlurClicked: true });

    if (
      this.state.address != undefined &&
      this.state.address.length >= 5 &&
      this.state.address.length <= 200
    ) {
      this.setState({
        isAddressvalid: true,
      });
    } else {
      this.setState({
        isAddressvalid: false,
      });
    }
  };

  checkPassword = async () => {
    this.setState({ passBlurClicked: true });

    if (
      this.state.signUpPassword != undefined &&
      this.state.confirmPassword != undefined &&
      this.state.signUpPassword.length >= 8 &&
      this.state.confirmPassword.length <= 20
    ) {
      this.setState({
        isPasswordValid: true,
      });
    } else {
      this.setState({
        isPasswordValid: false,
      });
    }
  };

  checkPasswordMatch = async () => {
    this.setState({ confirmPassBlurClicked: true });

    if (this.state.signUpPassword === this.state.confirmPassword) {
      this.setState({
        isPasswordMatching: true,
      });
    } else {
      this.setState({
        isPasswordMatching: false,
      });
    }
  };

  handleSubmit = async () => {
    await this.checkName();
    await this.checkUserName();
    await this.checkContactNumber();
    await this.checkEmailId();
    await this.checkAddress();
    await this.checkPassword();
    await this.checkPasswordMatch();

    if (
      this.state.isNameValid == true &&
      this.state.isUserNameValid == true &&
      this.state.isEmailValid == true &&
      this.state.isContactValid == true &&
      this.state.isAddressvalid == true &&
      this.state.isPasswordValid == true &&
      this.state.isPasswordMatching == true
    ) {
      const { loading, errors, data } = await this.props.client.mutate({
        mutation: CLIENT_SIGNUP,
        variables: {
          clientName: this.state.name,
          username: this.state.signUpUsername,
          password: this.state.signUpPassword,
          email: this.state.emailId,
          contactNumber: this.state.mobileNumber,
          address: this.state.address,
          accountType: "CLT",
        },
      });

      if (data.clientSignup == "Success") {
        this.setState({
          isFormSubmitted: true,
        });
      } else {
        this.setState({
          isFormSubmitError: true,

          errorMessage: "User signup failed. Something went wrong",
        });
      }
    } else {
      this.setState({
        isFormSubmitError: true,

        errorMessage: "User signup failed. Please enter correct details.",
      });
    }
  };

  onSubmitLoginHandler = async () => {
    //TODO: Call the API Once the authentication is true pass the authbearer to auth.js

    if (this.state.loginUser && this.state.userPassword) {
      let errorMsg;
      this.setState({ isLoading: true });
      try {
        const { loading, errors, data } = await this.props.client.query({
          query: LOGIN,
          variables: {
            username: this.state.loginUser,
            password: this.state.userPassword,
          },
        });
        if (data && data.login) {
          this.setState({ setToken: data.login.token }, async () => {
            let setTokenResult = await auth.performAuthentication(
              this.state.setToken
            );
            if (setTokenResult) {
              this.props.history.push("/home");
              window.location.reload();
              // }
            }
          });
        }
      } catch (e) {
        errorMsg = e.message.split(":")[2];
        this.setState({ wrongCredentials: true, validationMessage: errorMsg });
      }
      this.setState({ isLoading: false });
    } else {
      this.setState({
        validationMessage: "Please Check Your Username / Password",
        wrongCredentials: true,
      });
    }
  };

  signUpHandler = async () => {
    this.setState({ modalOpen: true });
  };

  handleModalClose = () => {
    this.setState({
      modalOpen: false,
      isFormSubmitted: false,
      errorMessage: "",
      nameBlurClicked: false,
      userNameBlurClicked: false,
      emailBlurClicked: false,
      contactBlurClicked: false,
      addressBlurClicked: false,
      passBlurClicked: false,
      confirmPassBlurClicked: false,
      isNameValid: false,
      isUserNameValid: false,
      isEmailValid: false,
      isContactValid: false,
      isAddressvalid: false,
      isPasswordValid: false,
      isPasswordMatching: false,
      isEmailPresentInDb: false,
      isContactPresentInDb: false,
      isLoading: false,
    });
  };

  render() {
    const { classes, client } = this.props;
    const {
      modalOpen,
      isFormSubmitted,
      isFormSubmitError,
      errorMessage,
      nameBlurClicked,
      userNameBlurClicked,
      emailBlurClicked,
      contactBlurClicked,
      addressBlurClicked,
      passBlurClicked,
      confirmPassBlurClicked,
      isNameValid,
      isUserNameValid,
      isEmailValid,
      isContactValid,
      isAddressvalid,
      isPasswordValid,
      isPasswordMatching,
      isEmailPresentInDb,
      isContactPresentInDb,
      isLoading,
      validationMessage,
    } = this.state;
    return (
      <div>
        {isLoading ? (
          <Grid container style={{ marginTop: "40vh" }}>
            <Grid item xs={12}>
              <Grid container justifyContent="center">
                <Grid item>
                  <CircularProgress
                    size="80px"
                    sx={{
                      color: "#1FC59F",
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItem="flex-start"
            style={{ textAlign: "center" }}
          >
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12} md={9} lg={9}>
                  <Grid container>
                    <Grid item xs={12} md={12} lg={12}>
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="flex-end"
                      >
                        {/* NOTE: This is the image grid*/}
                        <Grid item xs={12} md={12} lg={12}>
                          <img
                            src={login_page}
                            style={{ height: "auto", width: "30%" }}
                          />
                        </Grid>
                        {/* NOTE: This is the title grid*/}
                        <Grid item xs={12}>
                          <Grid container alignItems="flex-start">
                            <Grid item xs={12}>
                              <Typography
                                className={classes.headerTypo}
                                variant="h4"
                                color="primary"
                              >
                                Claim Insurance Made Easy
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                              <Typography>
                                General Insurance claims system has been
                                designed keeping your ease in mind.
                                <br />
                                With a convenient claim process for your health
                                insurance policy
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        {/* NOTE: This is the card grid*/}
                        <Grid item xs={12} md={12} lg={12}>
                          <Grid container spacing={5} justifyContent="center">
                            <Grid
                              item
                              xs={12}
                              md={12}
                              lg={12}
                              // style={{ backgroundColor: "red" }}
                            >
                              <Box />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      lg={12}
                      style={{ minHeight: "100vh", backgroundColor: "#F7F8FB" }}
                    >
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        style={{height: "80vh"}}
                      >
                        <Grid item xs={12}>
                          <Box style={{ height: "10vh"}} />
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container style={{ height: "20vh"}}>
                            <Grid item xs={12}>
                              <img
                                src={medLogo}
                                style={{ height: "auto", width: "40vh" }}
                                alt="LOGO"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Typography>
                                Welcome to MedFocus Management Suit
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl>
                            <Grid container>
                              <Grid item>
                                <TextField
                                  style={{ width: "40vh" }}
                                  id="username"
                                  label="User Name"
                                  variant="outlined"
                                  onChange={(e) =>
                                    this.inputChangeField(e, "username")
                                  }
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
                            </Grid>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl>
                            <Grid container>
                              <Grid item>
                                <TextField
                                  style={{ width: "40vh" }}
                                  id="password"
                                  label="Password"
                                  type="password"
                                  variant="outlined"
                                  onChange={(e) =>
                                    this.inputChangeField(e, "password")
                                  }
                                  InputProps={{
                                    startAdornment: (
                                      <LockIcon
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
                            {this.state.wrongCredentials && (
                              <Grid item xs={12}>
                                <Typography
                                  style={{ color: "red", fontWeight: 600 }}
                                >
                                  {validationMessage}
                                </Typography>
                              </Grid>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            style={{ width: "30vh" }}
                            color="primary"
                            variant="contained"
                            // component={Link}
                            onClick={this.onSubmitLoginHandler}
                          >
                            LOGIN
                          </Button>
                        </Grid>
                        <Grid
                          item
                          style={{
                            padding: "0px 0px 0px 0px",
                          }}
                        >
                          <Typography>Sign Up, If not Registered !!</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            style={{ width: "30vh" }}
                            color="primary"
                            variant="contained"
                            // component={Link}
                            onClick={this.signUpHandler}
                          >
                            SIGNUP
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* Footer state has to be changed */}
            <Grid item xs={12} md={12} lg={12} >
              <Grid container style={{position:"fixed",bottom:0}}>
                <Grid item xs={12}>
                  <Box bgcolor="#1FC59F">
                    <Typography color="secondary">
                      For any query, Please write us at help@medfocus.in <br />{" "}
                      ©2022,FalconDevs All Rights Reserved.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Modal
          open={modalOpen}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box>
            <Grid
              container
              style={{ backgroundColor: "white", width: "650px" }}
            >
              <Grid item xs={12}>
                <Grid container justifyContent="center">
                  <Grid item style={{ padding: "15px 0px 0px 15px" }}>
                    <Typography variant="h4">Signup Form</Typography>
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
                      id="name"
                      label="Name"
                      name="name"
                      type="text"
                      variant="outlined"
                      onBlur={this.checkName}
                      onChange={(e) => this.inputChangeField(e, "name")}
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
                    <FormHelperText id="name-error-text">
                      {nameBlurClicked && !isNameValid ? (
                        <Typography variant="caption" style={{ color: "red" }}>
                          Name should be letters <br></br>between 5 to 100
                          characters.
                        </Typography>
                      ) : null}
                    </FormHelperText>
                  </Grid>
                  <Grid
                    item
                    style={{
                      padding: "20px 0px 0px 50px",
                    }}
                  >
                    <TextField
                      id="signUpUsername"
                      label="Username"
                      name="signUpUsername"
                      type="text"
                      variant="outlined"
                      onBlur={this.checkUserName}
                      onChange={(e) =>
                        this.inputChangeField(e, "signUpUsername")
                      }
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
                    <FormHelperText id="name-error-text">
                      {userNameBlurClicked && !isUserNameValid ? (
                        <Typography variant="caption" style={{ color: "red" }}>
                          Username should be alpha numeric <br></br>between 5 to
                          32 characters.
                        </Typography>
                      ) : null}
                    </FormHelperText>
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
                      type="number"
                      variant="outlined"
                      onBlur={this.checkContactNumber}
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
                    <FormHelperText id="name-error-text">
                      {contactBlurClicked && !isContactValid ? (
                        <Typography variant="caption" style={{ color: "red" }}>
                          Mobile number should be numbers <br></br>between 8 to
                          20 characters.
                        </Typography>
                      ) : isContactPresentInDb ? (
                        <Typography variant="caption" style={{ color: "red" }}>
                          Mobile number already exist.
                        </Typography>
                      ) : null}
                    </FormHelperText>
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
                      type="email"
                      variant="outlined"
                      onBlur={this.checkEmailId}
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
                    <FormHelperText id="name-error-text">
                      {emailBlurClicked && !isEmailValid ? (
                        <Typography variant="caption" style={{ color: "red" }}>
                          Please enter correct email address.
                        </Typography>
                      ) : isEmailPresentInDb ? (
                        <Typography variant="caption" style={{ color: "red" }}>
                          Email id already exist.
                        </Typography>
                      ) : null}
                    </FormHelperText>
                  </Grid>
                  <Grid
                    item
                    style={{
                      padding: "20px 0px 0px 50px",
                    }}
                  >
                    <TextField
                      id="address"
                      label="Address"
                      name="address"
                      type="text"
                      variant="outlined"
                      onBlur={this.checkAddress}
                      onChange={(e) => this.inputChangeField(e, "address")}
                      InputProps={{
                        startAdornment: (
                          <LocationOnIcon
                            style={{
                              fill: "#1FC59F",
                              marginRight: "10px",
                            }}
                          />
                        ),
                      }}
                    />
                    <FormHelperText id="name-error-text">
                      {addressBlurClicked && !isAddressvalid ? (
                        <Typography variant="caption" style={{ color: "red" }}>
                          Address length should be <br></br>between 5 to 200
                          characters.
                        </Typography>
                      ) : null}
                    </FormHelperText>
                  </Grid>
                  <Grid
                    item
                    style={{
                      padding: "20px 0px 0px 50px",
                    }}
                  >
                    <TextField
                      id="signUpPassword"
                      label="Password"
                      name="signUpPassword"
                      type="password"
                      variant="outlined"
                      onBlur={this.checkPassword}
                      onChange={(e) =>
                        this.inputChangeField(e, "signUpPassword")
                      }
                      InputProps={{
                        startAdornment: (
                          <LockIcon
                            style={{
                              fill: "#1FC59F",
                              marginRight: "10px",
                            }}
                          />
                        ),
                      }}
                    />
                    <FormHelperText id="name-error-text">
                      {passBlurClicked && !isPasswordValid ? (
                        <Typography variant="caption" style={{ color: "red" }}>
                          Password length should be <br></br>between 8 to 20
                          characters.
                        </Typography>
                      ) : null}
                    </FormHelperText>
                  </Grid>
                  <Grid
                    item
                    style={{
                      padding: "20px 0px 0px 50px",
                    }}
                  >
                    <TextField
                      id="confirmPassword"
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      variant="outlined"
                      onBlur={this.checkPasswordMatch}
                      onChange={(e) =>
                        this.inputChangeField(e, "confirmPassword")
                      }
                      InputProps={{
                        startAdornment: (
                          <LockIcon
                            style={{
                              fill: "#1FC59F",
                              marginRight: "10px",
                            }}
                          />
                        ),
                      }}
                    />
                    <FormHelperText id="name-error-text">
                      {confirmPassBlurClicked && !isPasswordMatching ? (
                        <Typography variant="caption" style={{ color: "red" }}>
                          Passwords are not matching.
                        </Typography>
                      ) : null}
                    </FormHelperText>
                  </Grid>
                </Grid>
              </Grid>
              {isFormSubmitted ? (
                <Grid
                  container
                  xs={12}
                  justifyContent="center"
                  alignItems="center"
                  style={{ padding: "15px" }}
                >
                  <Grid item alignItems="center">
                    <Typography style={{ color: "green" }}>
                      Form successfully submitted.
                    </Typography>
                  </Grid>
                </Grid>
              ) : isFormSubmitError ? (
                <Grid
                  container
                  xs={12}
                  justifyContent="center"
                  alignItems="center"
                  style={{ padding: "15px" }}
                >
                  <Grid item alignItems="center">
                    <Typography style={{ color: "red" }}>
                      {errorMessage}
                    </Typography>
                  </Grid>
                </Grid>
              ) : null}
              <Grid item xs={12} style={{ padding: "30px 0px 30px 0px" }}>
                <Grid container direction="row" justifyContent="space-evenly">
                  <Grid item>
                    <Button
                      style={{ width: "30vh" }}
                      color="primary"
                      variant="contained"
                      onClick={this.handleModalClose}
                    >
                      Close
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      style={{ width: "30vh" }}
                      color="primary"
                      variant="contained"
                      disabled={isFormSubmitted}
                      onClick={() => this.handleSubmit()}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </div>
    );
  }
}
export default withRouter(withStyles(styles)(withApollo(Login)));
