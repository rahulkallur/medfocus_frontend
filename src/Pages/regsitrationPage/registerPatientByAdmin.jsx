import React, { Component } from "react";
import gql from "graphql-tag";

import { withApollo } from "react-apollo";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Modal,
  Input,
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { withStyles } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";

const CREATE_PATIENT_BY_ADMIN = gql`
  mutation addPatientClaims(
    $loginId: Int
    $patientName: String!
    $userId: String
    $mobileNo: String!
    $age: Int
    $claimNo: String
    $cardNo: String
    $claimStatus: String
    $patientRemarks: String
    $internalRemarks: String
    $lastUpdatedON: String
    $TPAName: String
    $insuranceName: String
    $hospitalName: String!
    $claimType: String
    $admissionDate: String
    $dischargeDate: String
    $treatmentName: String
    $mailId: String!
    $policyNumber: String
    $policyType: String
    $policyHolderName: String
    $companyName: String
    $employeeId: String
    $pickupDate: String
    $submissionDate: String
    $claimedAmount: String
    $approvedAmount: String
    $settlementDate: String
    $feeQuoted: String
    $feeStructure: String
    $amountPaid: String
    $modeOfPayment: String
    $balance: String
    $postDatedCheque: String
    $convertedBy: String
    $claimDocument: String
  ) {
    addPatientClaims(
      loginId: $loginId
      patientName: $patientName
      userId: $userId
      mobileNo: $mobileNo
      age: $age
      claimNo: $claimNo
      cardNo: $cardNo
      claimStatus: $claimStatus
      patientRemarks: $patientRemarks
      internalRemarks: $internalRemarks
      lastUpdatedON: $lastUpdatedON
      TPAName: $TPAName
      insuranceName: $insuranceName
      hospitalName: $hospitalName
      claimType: $claimType
      admissionDate: $admissionDate
      dischargeDate: $dischargeDate
      treatmentName: $treatmentName
      mailId: $mailId
      policyNumber: $policyNumber
      policyType: $policyType
      policyHolderName: $policyHolderName
      companyName: $companyName
      employeeId: $employeeId
      pickupDate: $pickupDate
      submissionDate: $submissionDate
      claimedAmount: $claimedAmount
      approvedAmount: $approvedAmount
      settlementDate: $settlementDate
      feeQuoted: $feeQuoted
      feeStructure: $feeStructure
      amountPaid: $amountPaid
      modeOfPayment: $modeOfPayment
      balance: $balance
      postDatedCheque: $postDatedCheque
      convertedBy: $convertedBy
      claimDocument: $claimDocument
    )
  }
`;

const PUBLIC_UPLOAD_URL = gql`
  mutation getPublicUploadURL($fileExtension: String!) {
    getPublicUploadURL(fileExtension: $fileExtension) {
      filename
      bucketName
      publicUploadURL
    }
  }
`;

const UPDATE_PATIENT_BY_ADMIN = gql`
  mutation updatePatientClaims(
    $id: Int
    $patientName: String!
    $userId: String
    $mobileNo: String!
    $age: Int
    $claimNo: String
    $cardNo: String
    $claimStatus: String
    $patientRemarks: String
    $internalRemarks: String
    $lastUpdatedON: String
    $TPAName: String
    $insuranceName: String
    $hospitalName: String!
    $claimType: String
    $admissionDate: String
    $dischargeDate: String
    $treatmentName: String
    $mailId: String!
    $policyNumber: String
    $policyType: String
    $policyHolderName: String
    $companyName: String
    $employeeId: String
    $pickupDate: String
    $submissionDate: String
    $claimedAmount: String
    $approvedAmount: String
    $settlementDate: String
    $feeQuoted: String
    $feeStructure: String
    $amountPaid: String
    $modeOfPayment: String
    $balance: String
    $postDatedCheque: String
    $convertedBy: String
    $claimDocument: String
  ) {
    updatePatientClaims(
      id: $id
      patientName: $patientName
      mobileNo: $mobileNo
      userId: $userId
      age: $age
      claimNo: $claimNo
      cardNo: $cardNo
      claimStatus: $claimStatus
      patientRemarks: $patientRemarks
      internalRemarks: $internalRemarks
      lastUpdatedON: $lastUpdatedON
      TPAName: $TPAName
      insuranceName: $insuranceName
      hospitalName: $hospitalName
      claimType: $claimType
      admissionDate: $admissionDate
      dischargeDate: $dischargeDate
      treatmentName: $treatmentName
      mailId: $mailId
      policyNumber: $policyNumber
      policyType: $policyType
      policyHolderName: $policyHolderName
      companyName: $companyName
      employeeId: $employeeId
      pickupDate: $pickupDate
      submissionDate: $submissionDate
      claimedAmount: $claimedAmount
      approvedAmount: $approvedAmount
      settlementDate: $settlementDate
      feeQuoted: $feeQuoted
      feeStructure: $feeStructure
      amountPaid: $amountPaid
      modeOfPayment: $modeOfPayment
      balance: $balance
      postDatedCheque: $postDatedCheque
      convertedBy: $convertedBy
      claimDocument: $claimDocument
    )
  }
`;

const GET_PATIENT_BY_ID = gql`
  query getPatientDetailsById($id: Int!) {
    getPatientDetailsById(id: $id) {
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
      policyHolderName
    }
  }
`;

const GET_CLAIMS_LIST = gql`
  query getClaimStatusList {
    getClaimStatusList {
      name
      id
      iconName
      key
    }
  }
`;

const EXCEL_FILE_UPLOAD = gql`
  mutation excelFileUpload(
    $fileInfo: FileUploadInput!
    $commonInput: CommonInput!
  ) {
    excelFileUpload(fileInfo: $fileInfo, commonInput: $commonInput) {
      successfullyUploaded
      totalExcelDataRecords
      totalDuplicateRecords
      failedUploadList
    }
  }
`;

// const BULK_UPLOAD_PATIENT = gql `

// `
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
  responsive: "standard",
  selectableRows: "none",
};

const columns = [
  { label: "Patient Name", name: "patientName" },
  { label: "Mobile No.", name: "mobileNo" },
  { label: "Hospital Name", name: "hospitalName" },
  {
    label: "",
    name: "",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <Button
            style={{ width: "15vh" }}
            color="primary"
            variant="contained"
            onClick={() => console.log(value, tableMeta)}
          >
            Edit
          </Button>
        );
      },
    },
  },
];
export class AddUserByAdmin extends Component {
  state = {
    isFormSubmitted: false,
    isFormSubmitError: false,
    message: "",
    isLoading: false,
    patientName: "",
    userId: "",
    mobileNo: "",
    age: "",
    claimNo: "",
    cardNo: "",
    claimStatus: "",
    patientRemarks: "",
    internalRemarks: "",
    lastUpdatedOn: "",
    TPAName: "",
    insuranceName: "",
    hospitalName: "",
    claimType: "",
    admissionDate: "",
    dischargeDate: "",
    treatmentName: "",
    mailId: "",
    policyNumber: "",
    policyType: "",
    policyHolderName: "",
    companyName: "",
    employeeId: "",
    pickupDate: "",
    submissionDate: "",
    claimedAmount: "",
    approvedAmount: "",
    settlementDate: "",
    feeQuoted: "",
    feeStructure: "",
    amountPaid: "",
    modeOfPayment: "",
    balance: "",
    postDatedCheque: "",
    convertedBy: "",
    claimDocument: "",
    fileName: "",
    bucketName: "",
    publicUploadURL: "",
    isFileSelected: false,
    claimsList: [],
    snackbarEnable: false,
    errorMessage: "",
    isLoading: false,
    fileNameOfDoc:""
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
              backgroundColor: "#1FC59F !important",
              font: "30px",
            },
          },
        },
      },
    });

  inputChangeField = (e, inputType) => {
    e.preventDefault();

    this.setState(
      {
        [e.target.name]: e.target.value,
      }
    );
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackbarEnable: false });
  };

  handleFilesChange = async (e) => {
    console.log("This is the files", e.target.files[0]);
    if (e.target.files[0]) {
      let uploadEndPoint = e.target.files[0];
      if (uploadEndPoint) {
        const formData = new FormData();
        formData.append("file", uploadEndPoint);
        let fileUploadResponse = await axios.post(
          process.env.REACT_APP_BULK_UPLOAD_TO_S3,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        console.log("fileUploadResponse", fileUploadResponse.data.status);
        if (fileUploadResponse.data.status == 200) {
          this.setState({
            fileName: fileUploadResponse.data.fileName,
            bucketName: fileUploadResponse.data.bucketName,
            isFileSelected: true,
          });
        }
      }
    }
  };
// NOTE: To Upload Document in registration page
  handleFilesChangeDoc = async (e) => {
    e.preventDefault()
    console.log("This is the files", e.target.files[0]);
    if (e.target.files[0]) {
      let uploadEndPoint = e.target.files[0];
      if (uploadEndPoint) {
        const formData = new FormData();
        formData.append("file", uploadEndPoint);
        let fileUploadResponse = await axios.post(
          process.env.REACT_APP_DOC_UPLOAD_TO_S3,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        console.log("fileUploadResponse", fileUploadResponse.data);
        if (fileUploadResponse.data.status == 200) {
          this.setState({
            claimDocument:fileUploadResponse.data.fileName,
          });
        }
      }
    }
  };

  handleUploadSubmit = async () => {
    this.setState({ isLoading: true });
    console.log("handleUploadSubmit");
    let fileUploadS3Bucket = await this.props.client.mutate({
      mutation: EXCEL_FILE_UPLOAD,
      variables: {
        fileInfo: {
          uploadFor: "PatientClaimsUpload",
          bucketName: this.state.bucketName,
          fileName: this.state.fileName,
        },
        commonInput: {
          clientLoginId: null,
          superAdminLoginId: null,
        },
      },
    });
    console.log(
      "fileUploadS3Bucket",
      fileUploadS3Bucket.data.excelFileUpload.successfullyUploaded
    );
    if (
      fileUploadS3Bucket &&
      fileUploadS3Bucket.data &&
      fileUploadS3Bucket.data.excelFileUpload
    ) {
      let snackBarData = `Upload Record: ${fileUploadS3Bucket.data.excelFileUpload.successfullyUploaded}, Duplicate Record: ${fileUploadS3Bucket.data.excelFileUpload.totalDuplicateRecords}, Total Records: ${fileUploadS3Bucket.data.excelFileUpload.totalExcelDataRecords}`;
      this.setState({
        errorMessage: snackBarData,
        isLoading: false,
        snackbarEnable: true,
      });
    } else {
      this.setState({
        errorMessage: "Error In Uploading",
        isLoading: false,
        snackbarEnable: true,
      });
    }
  };

  getAllClaimStatusList = async () => {
    let claimList = await this.props.client.query({
      query: GET_CLAIMS_LIST,
    });
    if (claimList && claimList.data) {
      this.setState({ claimsList: claimList.data.getClaimStatusList });
    }
  };

  checkvalidation = () => {
    if (
      this.state.patientName == undefined ||
      this.state.patientName == "" ||
      this.state.mobileNo == undefined ||
      this.state.mobileNo == "" ||
      this.state.mailId == undefined ||
      this.state.mailId == "" ||
      this.state.hospitalName == undefined ||
      this.state.hospitalName == "" ||
      this.state.claimStatus == undefined ||
      this.state.claimStatus == ""
    ) {
      return false;
    } else {
      return true;
    }
  };

  handleSubmit = async () => {
    let validations = await this.checkvalidation();

    if (validations == true && this.props.props.location.state == undefined) {
      let currentLoginId = localStorage.getItem("loginId");
      console.log("currentLoginId -----", currentLoginId);

      let currentTimestamp = Math.floor(Date.now() / 1000);
      let userId = `${currentLoginId}MED${currentTimestamp}`;

      const { loading, errors, data } = await this.props.client.mutate({
        mutation: CREATE_PATIENT_BY_ADMIN,
        variables: {
          loginId: parseInt(currentLoginId),
          userId: userId,
          patientName: this.state.patientName,
          mobileNo: this.state.mobileNo,
          age: parseInt(this.state.age),
          claimNo: this.state.claimNo,
          cardNo: this.state.cardNo,
          claimStatus: this.state.claimStatus,
          patientRemarks: this.state.patientRemarks,
          internalRemarks: this.state.internalRemarks,
          lastUpdatedON: this.state.lastUpdatedOn,
          TPAName: this.state.TPAName,
          insuranceName: this.state.insuranceName,
          hospitalName: this.state.hospitalName,
          claimType: this.state.claimType,
          admissionDate: this.state.admissionDate,
          dischargeDate: this.state.dischargeDate,
          treatmentName: this.state.treatmentName,
          mailId: this.state.mailId,
          policyNumber: this.state.policyNumber,
          policyType: this.state.policyType,
          policyHolderName: this.state.policyHolderName,
          companyName: this.state.companyName,
          employeeId: this.state.employeeId,
          pickupDate: this.state.pickupDate,
          submissionDate: this.state.submissionDate,
          claimedAmount: this.state.claimedAmount,
          approvedAmount: this.state.approvedAmount,
          settlementDate: this.state.settlementDate,
          feeQuoted: this.state.feeQuoted,
          feeStructure: this.state.feeStructure,
          amountPaid: this.state.amountPaid,
          modeOfPayment: this.state.modeOfPayment,
          balance: this.state.balance,
          postDatedCheque: this.state.postDatedCheque,
          convertedBy: this.state.convertedBy,
          claimDocument: this.state.claimDocument,
        },
      });

      if (data.addPatientClaims == true) {
        this.setState({
          isFormSubmitted: true,
          message: "Form submitted successfully",
          //Clearing all fields after success submission
          patientName: "",
          userId: "",
          mobileNo: "",
          age: "",
          claimNo: "",
          cardNo: "",
          claimStatus: "",
          patientRemarks: "",
          internalRemarks: "",
          lastUpdatedOn: "",
          TPAName: "",
          insuranceName: "",
          hospitalName: "",
          claimType: "",
          admissionDate: "",
          dischargeDate: "",
          treatmentName: "",
          mailId: "",
          policyNumber: "",
          policyType: "",
          policyHolderName: "",
          companyName: "",
          employeeId: "",
          pickupDate: "",
          submissionDate: "",
          claimedAmount: "",
          approvedAmount: "",
          settlementDate: "",
          feeQuoted: "",
          feeStructure: "",
          amountPaid: "",
          modeOfPayment: "",
          balance: "",
          postDatedCheque: "",
          convertedBy: "",
          claimDocument: "",
        });
      } else {
        this.setState({
          isFormSubmitError: true,
          message: "Form failed to submit",
        });
      }
    } else if (
      validations == true &&
      this.props.props.location.state != undefined
    ) {
      const { loading, errors, data } = await this.props.client.mutate({
        mutation: UPDATE_PATIENT_BY_ADMIN,
        variables: {
          id: parseInt(this.props.props.location.state.id),
          userId: this.state.userId,
          patientName: this.state.patientName,
          mobileNo: this.state.mobileNo,
          age: parseInt(this.state.age),
          claimNo: this.state.claimNo,
          cardNo: this.state.cardNo,
          claimStatus: this.state.claimStatus,
          patientRemarks: this.state.patientRemarks,
          internalRemarks: this.state.internalRemarks,
          lastUpdatedON: this.state.lastUpdatedOn,
          TPAName: this.state.TPAName,
          insuranceName: this.state.insuranceName,
          hospitalName: this.state.hospitalName,
          claimType: this.state.claimType,
          admissionDate: this.state.admissionDate,
          dischargeDate: this.state.dischargeDate,
          treatmentName: this.state.treatmentName,
          mailId: this.state.mailId,
          policyNumber: this.state.policyNumber,
          policyType: this.state.policyType,
          policyHolderName: this.state.policyHolderName,
          companyName: this.state.companyName,
          employeeId: this.state.employeeId,
          pickupDate: this.state.pickupDate,
          submissionDate: this.state.submissionDate,
          claimedAmount: this.state.claimedAmount,
          approvedAmount: this.state.approvedAmount,
          settlementDate: this.state.settlementDate,
          feeQuoted: this.state.feeQuoted,
          feeStructure: this.state.feeStructure,
          amountPaid: this.state.amountPaid,
          modeOfPayment: this.state.modeOfPayment,
          balance: this.state.balance,
          postDatedCheque: this.state.postDatedCheque,
          convertedBy: this.state.convertedBy,
          claimDocument: this.state.claimDocument,
        },
      });
      if (data.updatePatientClaims == true) {
        this.setState({
          isFormSubmitted: true,
          message: "Form updated successfully",
          //Clearing all fields after success submission
          patientName: "",
          userId: "",
          mobileNo: "",
          age: "",
          claimNo: "",
          cardNo: "",
          claimStatus: "",
          patientRemarks: "",
          internalRemarks: "",
          lastUpdatedOn: "",
          TPAName: "",
          insuranceName: "",
          hospitalName: "",
          claimType: "",
          admissionDate: "",
          dischargeDate: "",
          treatmentName: "",
          mailId: "",
          policyNumber: "",
          policyType: "",
          policyHolderName: "",
          companyName: "",
          employeeId: "",
          pickupDate: "",
          submissionDate: "",
          claimedAmount: "",
          approvedAmount: "",
          settlementDate: "",
          feeQuoted: "",
          feeStructure: "",
          amountPaid: "",
          modeOfPayment: "",
          balance: "",
          postDatedCheque: "",
          convertedBy: "",
          claimDocument: "",
        });
      } else {
        this.setState({
          isFormSubmitError: true,
          message: "Form failed to update",
        });
      }
    } else {
      this.setState({
        isFormSubmitError: true,
        message: "Please enter all manadatory fields.",
      });
    }
  };

  getPatientDetails = async (id) => {
    this.setState({ isLoading: true });

    let queryResponse = await this.props.client.query({
      query: GET_PATIENT_BY_ID,
      variables: { id: id },
      fetchPolicy: "network-only",
    });

    console.log(
      "one patient detail -   new big form----",
      queryResponse.data.getPatientDetailsById
    );

    let obj = queryResponse.data.getPatientDetailsById;

    this.setState({
      patientName: obj.patientName,
      userId: obj.userId,
      mobileNo: obj.mobileNo,
      age: obj.age,
      claimNo: obj.claimNo,
      cardNo: obj.cardNo,
      claimStatus: obj.claimStatus,
      patientRemarks: obj.patientRemarks,
      internalRemarks: obj.internalRemarks,
      lastUpdatedOn: obj.lastUpdatedON,
      TPAName: obj.TPAName,
      insuranceName: obj.insuranceName,
      hospitalName: obj.hospitalName,
      claimType: obj.claimType,
      admissionDate: obj.admissionDate,
      dischargeDate: obj.dischargeDate,
      treatmentName: obj.treatmentName,
      mailId: obj.mailId,
      policyNumber: obj.policyNumber,
      policyType: obj.policyType,
      policyHolderName: obj.policyHolderName,
      companyName: obj.companyName,
      employeeId: obj.employeeId,
      pickupDate: obj.pickupDate,
      submissionDate: obj.submissionDate,
      claimedAmount: obj.claimedAmount,
      approvedAmount: obj.approvedAmount,
      settlementDate: obj.settlementDate,
      feeQuoted: obj.feeQuoted,
      feeStructure: obj.feeStructure,
      amountPaid: obj.amountPaid,
      modeOfPayment: obj.modeOfPayment,
      balance: obj.balance,
      postDatedCheque: obj.postDatedCheque,
      convertedBy: obj.convertedBy,
      claimDocument: obj.claimDocument,
      //Loader related
      isLoading: false,
    });
  };

  handleClear = async () => {
    this.setState({
      patientName: "",
      userId: "",
      mobileNo: "",
      age: "",
      claimNo: "",
      cardNo: "",
      claimStatus: "",
      patientRemarks: "",
      internalRemarks: "",
      lastUpdatedOn: "",
      TPAName: "",
      insuranceName: "",
      hospitalName: "",
      claimType: "",
      admissionDate: "",
      dischargeDate: "",
      treatmentName: "",
      mailId: "",
      policyNumber: "",
      policyType: "",
      policyHolderName: "",
      companyName: "",
      employeeId: "",
      pickupDate: "",
      submissionDate: "",
      claimedAmount: "",
      approvedAmount: "",
      settlementDate: "",
      feeQuoted: "",
      feeStructure: "",
      amountPaid: "",
      modeOfPayment: "",
      balance: "",
      postDatedCheque: "",
      convertedBy: "",
      claimDocument: "",
    });
  };

  closeEditHandler = () => {
    this.setState({ bulkUploadModal: false });
  };

  bulkUploadHandler = () => {
    console.log("inside the bulk upload handler");
    this.setState({ bulkUploadModal: true });
  };

  async componentDidMount() {
    this.getAllClaimStatusList();
    let propsState = this.props.props.location.state;
    if (propsState != undefined) {
      await this.getPatientDetails(propsState.id);
    }
  }

  render() {
    const { classes, client } = this.props;

    const {
      isFormSubmitted,
      isFormSubmitError,
      message,
      patientName,
      userId,
      mobileNo,
      age,
      claimNo,
      cardNo,
      claimStatus,
      patientRemarks,
      internalRemarks,
      lastUpdatedOn,
      TPAName,
      insuranceName,
      hospitalName,
      claimType,
      admissionDate,
      dischargeDate,
      treatmentName,
      mailId,
      policyNumber,
      policyType,
      policyHolderName,
      companyName,
      employeeId,
      pickupDate,
      submissionDate,
      claimedAmount,
      approvedAmount,
      settlementDate,
      feeQuoted,
      feeStructure,
      amountPaid,
      modeOfPayment,
      balance,
      postDatedCheque,
      convertedBy,
      claimDocument,
      claimsList,
      isLoading,
    } = this.state;
    return (
      <>
        <Grid container>
          <Grid
            item
            xs={12}
            style={{
              padding: "20px 0px 0px 50px",
            }}
          >
            <Grid container justifyContent="flex-start">
              <Grid xs={10}>
                <Typography
                  variant="h4"
                  style={{ color: "#1FC59F", fontSize: "100" }}
                >
                  Patient Detail Form
                </Typography>
              </Grid>
              <Grid xs={1}>
                <Button
                  style={{ width: "20vh", color: "white", fontWeight: "bold" }}
                  color="primary"
                  variant="contained"
                  disabled={isFormSubmitted == true}
                  onClick={() => this.bulkUploadHandler()}
                >
                  Bulk Upload
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container style={{ padding: "20px 0px 0px 50px" }}>
              <Typography variant="caption">
                Fields marked as * are manadatory.
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={10} style={{ marginTop: "30px", marginLeft: "10px" }}>
            <Grid container justifyContent="space-around" spacing={4}>
              <Grid item>
                <TextField
                  required
                  id="patientName"
                  label="Name"
                  name="patientName"
                  value={patientName}
                  type="text"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "patientName")}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="userId"
                  label="User Id"
                  name="userId"
                  value={userId}
                  type="text"
                  variant="outlined"
                  disabled={true}
                  onChange={(e) => this.inputChangeField(e, "userId")}
                />
              </Grid>
              <Grid item>
                <TextField
                  required
                  id="mobileNo"
                  label="Mobile Number"
                  name="mobileNo"
                  value={mobileNo}
                  type="number"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "mobileNo")}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="age"
                  label="Age"
                  name="age"
                  value={age}
                  type="number"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "age")}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="claimNo"
                  label="Claim Number"
                  value={claimNo}
                  name="claimNo"
                  type="text"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "claimNo")}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="cardNo"
                  label="Card Number"
                  value={cardNo}
                  name="cardNo"
                  type="text"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "cardNo")}
                />
              </Grid>
              <Grid item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Claim Status*
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="claimStatus"
                    value={claimStatus}
                    onChange={(e) => this.inputChangeField(e, "claimStatus")}
                    style={{ width: "200px" }}
                  >
                    {claimsList &&
                      claimsList.map((e) => (
                        <MenuItem value={e.name}>{e.name}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <TextField
                  style={{ width: "200px" }}
                  id="lastUpdatedOn"
                  label="Last Updated On"
                  name="lastUpdatedOn"
                  value={lastUpdatedOn}
                  type="date"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "lastUpdatedOn")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    TPA Name
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="TPAName"
                    value={TPAName}
                    onChange={(e) => this.inputChangeField(e, "TPAName")}
                    style={{ width: "200px" }}
                  >
                    <MenuItem value={"United Health Care Parekh InsuranceTPA"}>
                      United Health Care Parekh InsuranceTPA
                    </MenuItem>
                    <MenuItem value={"Medi Assist Insurance TPA"}>
                      Medi Assist Insurance TPA
                    </MenuItem>
                    <MenuItem value={"MDIndia Health Insurance TPA"}>
                      MDIndia Health Insurance TPA
                    </MenuItem>
                    <MenuItem
                      value={"Paramount Health Services & Insurance TPA"}
                    >
                      Paramount Health Services & Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Heritage Health Insurance TPA"}>
                      Heritage Health Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Family Health Plan Insurance TPA"}>
                      Family Health Plan Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Raksha Health Insurance TPA"}>
                      Raksha Health Insurance TPA
                    </MenuItem>
                    <MenuItem
                      value={"Vidal Health Insurance TPA,Anyuta Insuance TPA"}
                    >
                      Vidal Health Insurance TPA,Anyuta Insuance TPA
                    </MenuItem>
                    <MenuItem value={"East West Assist Insurance TPA"}>
                      East West Assist Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Medsave Health Insurance TPA"}>
                      Medsave Health Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Genins India Insurance TPA"}>
                      Genins India Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Alankit Insurance TPA"}>
                      Alankit Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Health India Insurance TPA"}>
                      Health India Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Good Health Insurance TPA"}>
                      Good Health Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Vipul Medcorp Insurance TPA"}>
                      Vipul Medcorp Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Park Mediclaim Insurance TPA"}>
                      Park Mediclaim Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Safeway Insurance TPA"}>
                      Safeway Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Anmol Medicare Insurance TPA"}>
                      Anmol Medicare Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Grand Insurance TPA"}>
                      Grand Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Rothshield Insurance TPA"}>
                      Rothshield Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Ericson Insurance TPA"}>
                      Ericson Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Health Insurance TPA"}>
                      Health Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Vision Digital Insurance TPA"}>
                      Vision Digital Insurance TPA
                    </MenuItem>
                    <MenuItem value={"Happy Insurance TPA"}>
                      Happy Insurance TPA
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Insurance Name
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="insuranceName"
                    value={insuranceName}
                    onChange={(e) => this.inputChangeField(e, "insuranceName")}
                    style={{ width: "200px" }}
                  >
                    <MenuItem value={"Bajaj Allianz General Insurance Co. Ltd"}>
                      Bajaj Allianz General Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"Bharti Axa General Insurance Co. Ltd"}>
                      Bharti Axa General Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem
                      value={"Cholamandalam MS General Insurance Co. Ltd"}
                    >
                      Cholamandalam MS General Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"Manipal Cigna Health Insurance Co.Ltd"}>
                      Manipal Cigna Health Insurance Co.Ltd
                    </MenuItem>
                    <MenuItem value={"Future Generali India Insurance Co. Ltd"}>
                      Future Generali India Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"HDFC ERGO General Insurance Co. Ltd"}>
                      HDFC ERGO General Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"ICICI Lombard General Insurance Co. Ltd"}>
                      ICICI Lombard General Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"IFFCO Tokio General Insurance Co. Ltd"}>
                      IFFCO Tokio General Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"L&T General Insurance Co. Ltd"}>
                      L&T General Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem
                      value={"Liberty Videocon General Insurance Co. Ltd"}
                    >
                      Liberty Videocon General Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"Magma HDI General Insurance Co. Ltd"}>
                      Magma HDI General Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"Max Bupa Health Insurance Co. Ltd"}>
                      Max Bupa Health Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"National Insurance Co. Ltd"}>
                      National Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"The New India Assurance Co. Ltd"}>
                      The New India Assurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"The Oriental Insurance Co. Ltd"}>
                      The Oriental Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"Raheja QBE General Insurance Co. Ltd"}>
                      Raheja QBE General Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"Reliance General Insurance Co. Ltd"}>
                      Reliance General Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"Religare Health Insurance Co. Ltd"}>
                      Religare Health Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem
                      value={"Royal Sundaram Alliance Insurance Co. Ltd"}
                    >
                      Royal Sundaram Alliance Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"SBI General Insurance Co. Ltd"}>
                      SBI General Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"Shriram General Insurance Co. Ltd"}>
                      Shriram General Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem
                      value={"Star Health and Allied Insurance Co. Ltd"}
                    >
                      Star Health and Allied Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"Tata AIG General Insurance Co. Ltd"}>
                      Tata AIG General Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"United India Insurance Co. Ltd"}>
                      United India Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem
                      value={"Universal Sompo General Insurance Co. Ltd"}
                    >
                      Universal Sompo General Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem
                      value={"Kotak Mahindra General Insurance Co. Ltd"}
                    >
                      Kotak Mahindra General Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"Aditya Birla Health Insurance Co. Ltd"}>
                      Aditya Birla Health Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem
                      value={
                        "Reliance Health Insurance Limited,Acko General Insurance Limited"
                      }
                    >
                      Reliance Health Insurance Limited,Acko General Insurance
                      Limited
                    </MenuItem>
                    <MenuItem value={"DHFL General Insurance Co.Ltd"}>
                      DHFL General Insurance Co.Ltd
                    </MenuItem>
                    <MenuItem value={"Edelweiss General Insurance Co.Ltd"}>
                      Edelweiss General Insurance Co.Ltd
                    </MenuItem>
                    <MenuItem value={"Go Digit General Insurance Ltd"}>
                      Go Digit General Insurance Ltd
                    </MenuItem>
                    <MenuItem value={"Care Health Insurance"}>
                      Care Health Insurance
                    </MenuItem>
                    <MenuItem value={"Niva Bupa Health Insurance Co. Ltd"}>
                      Niva Bupa Health Insurance Co. Ltd
                    </MenuItem>
                    <MenuItem value={"Navi General Insurance Ltd"}>
                      Navi General Insurance Ltd
                    </MenuItem>
                    <MenuItem value={"LIC Insurance"}>LIC Insurance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <TextField
                  required
                  id="hospitalName"
                  label="Hospital Name"
                  name="hospitalName"
                  value={hospitalName}
                  type="text"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "hospitalName")}
                />
              </Grid>
              <Grid item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Claim Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="claimType"
                    value={claimType}
                    onChange={(e) => this.inputChangeField(e, "claimType")}
                    style={{ width: "200px" }}
                  >
                    <MenuItem value={"HC"}>HC</MenuItem>
                    <MenuItem value={"PPHC"}>PPHC</MenuItem>
                    <MenuItem value={"Partial Claim"}>Partial Claim</MenuItem>
                    <MenuItem value={"Rejection Consideration"}>
                      Rejection Consideration
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <TextField
                  style={{ width: "200px" }}
                  id="admissionDate"
                  label="Admission Date"
                  name="admissionDate"
                  type="date"
                  value={admissionDate}
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "admissionDate")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  style={{ width: "200px" }}
                  id="dischargeDate"
                  label="Discharge Date"
                  name="dischargeDate"
                  type="date"
                  value={dischargeDate}
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "dischargeDate")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="treatmentName"
                  label="Treatment Name"
                  name="treatmentName"
                  value={treatmentName}
                  type="text"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "treatmentName")}
                />
              </Grid>
              <Grid item>
                <TextField
                  required
                  id="mailId"
                  label="Email Id"
                  name="mailId"
                  value={mailId}
                  type="text"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "mailId")}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="policyNumber"
                  label="Policy Number"
                  value={policyNumber}
                  name="policyNumber"
                  type="text"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "policyNumber")}
                />
              </Grid>
              <Grid item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Policy Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="policyType"
                    value={policyType}
                    onChange={(e) => this.inputChangeField(e, "policyType")}
                    style={{ width: "200px" }}
                  >
                    <MenuItem value={"Corporate"}>Corporate</MenuItem>
                    <MenuItem value={"Retail"}>Retail</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <TextField
                  id="companyName"
                  label="Company Name"
                  name="companyName"
                  value={companyName}
                  type="text"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "companyName")}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="employeeId"
                  label="Employee Id"
                  value={employeeId}
                  name="employeeId"
                  type="text"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "employeeId")}
                />
              </Grid>

              <Grid item>
                <TextField
                  style={{ width: "200px" }}
                  id="pickupDate"
                  label="Pickup Date"
                  value={pickupDate}
                  name="pickupDate"
                  type="date"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "pickupDate")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="policyHolderName"
                  label="Policy Holder Name"
                  name="policyHolderName"
                  value={policyHolderName}
                  type="text"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "policyHolderName")}
                />
              </Grid>
              <Grid item>
                <TextField
                  style={{ width: "200px" }}
                  id="submissionDate"
                  label="Submission Date"
                  name="submissionDate"
                  value={submissionDate}
                  type="date"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "submissionDate")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="claimedAmount"
                  label="Claimed Amount"
                  value={claimedAmount}
                  name="claimedAmount"
                  type="number"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "claimedAmount")}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="approvedAmount"
                  label="Approved Amount"
                  value={approvedAmount}
                  name="approvedAmount"
                  type="number"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "approvedAmount")}
                />
              </Grid>
              <Grid item>
                <TextField
                  style={{ width: "200px" }}
                  id="settlementDate"
                  label="Settlement Date"
                  name="settlementDate"
                  value={settlementDate}
                  type="date"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "settlementDate")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="feeQuoted"
                  value={feeQuoted}
                  label="Fee Quoted"
                  name="feeQuoted"
                  type="number"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "feeQuoted")}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="feeStructure"
                  label="Fee Structure"
                  name="feeStructure"
                  value={feeStructure}
                  type="text"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "feeStructure")}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="amountPaid"
                  label="Amount Paid"
                  name="amountPaid"
                  value={amountPaid}
                  type="number"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "amountPaid")}
                />
              </Grid>

              <Grid item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Mode Of Payment
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="modeOfPayment"
                    value={modeOfPayment}
                    onChange={(e) => this.inputChangeField(e, "modeOfPayment")}
                    style={{ width: "200px" }}
                  >
                    <MenuItem value={"Cash"}>Cash</MenuItem>
                    <MenuItem value={"Card"}>Card</MenuItem>
                    <MenuItem value={"Credit"}>Credit</MenuItem>
                    <MenuItem value={"G-Pay"}>G-Pay</MenuItem>
                    <MenuItem value={"PhonePe"}>Phonepe</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <TextField
                  id="balance"
                  label="Balance"
                  value={balance}
                  name="balance"
                  type="number"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "balance")}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="postDatedCheque"
                  label="Post Dated Cheque"
                  value={postDatedCheque}
                  name="postDatedCheque"
                  type="text"
                  variant="outlined"
                  onChange={(e) => this.inputChangeField(e, "postDatedCheque")}
                />
              </Grid>
              <Grid item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Converted By
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="convertedBy"
                    value={convertedBy}
                    onChange={(e) => this.inputChangeField(e, "convertedBy")}
                    style={{ width: "200px" }}
                  >
                    <MenuItem value={"Murali"}>Murali</MenuItem>
                    <MenuItem value={"Kantha Raj"}>Kantha Raj</MenuItem>
                    <MenuItem value={"Chaitanya"}>Chaitanya</MenuItem>
                    <MenuItem value={"Nelivigi"}>Nelivigi</MenuItem>
                    <MenuItem value={"Manyata"}>Manyata</MenuItem>
                    <MenuItem value={"Rescue"}>Rescue</MenuItem>
                    <MenuItem value={"Abiramm"}>Abiramm</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <TextField
                  id="patientRemarks"
                  label="Patient Remarks"
                  name="patientRemarks"
                  value={patientRemarks}
                  type="text"
                  variant="outlined"
                  maxRows={5}
                  minRows={5}
                  inputProps={{ width: "30px" }}
                  multiline
                  style={{ padding: "0px" }}
                  onChange={(e) => this.inputChangeField(e, "patientRemarks")}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="internalRemarks"
                  label="Internal Remark"
                  name="internalRemarks"
                  type="text"
                  value={internalRemarks}
                  variant="outlined"
                  maxRows={5}
                  minRows={5}
                  inputProps={{ maxLength: 50 }}
                  multiline
                  onChange={(e) => this.inputChangeField(e, "internalRemarks")}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="claimDocument"
                  name="claimDocument"
                  label="Claim Documents"
                  type="file"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  onChange={(e) => this.handleFilesChangeDoc(e, "claimDocument")}
                >
                  <Input
                    type="file"
                    color="primary"
                    fullWidth={true}
                    // onChange={this.handleFilesChange}
                  ></Input>
                </TextField>
              </Grid>
            </Grid>
          </Grid>

          {isFormSubmitted ? (
            <Grid
              container
              xs={12}
              justifyContent="flex-start"
              alignItems="center"
              style={{ padding: "15px 0px 0px 50px" }}
            >
              <Grid item>
                <Typography variant="body2" style={{ color: "green" }}>
                  {message}
                </Typography>
              </Grid>
            </Grid>
          ) : isFormSubmitError ? (
            <Grid
              container
              xs={12}
              justifyContent="flex-start"
              alignItems="center"
              style={{ padding: "15px 0px 0px 50px" }}
            >
              <Grid item>
                <Typography variant="body2" style={{ color: "red" }}>
                  {message}
                </Typography>
              </Grid>{" "}
            </Grid>
          ) : null}

          <Grid
            item
            xs={10}
            style={{ marginTop: "30px", marginBottom: "30px" }}
          >
            <Grid container justifyContent="center">
              <Grid item>
                <Button
                  style={{ width: "30vh" }}
                  color="primary"
                  variant="contained"
                  onClick={() => this.handleClear()}
                >
                  Clear
                </Button>
              </Grid>
              <Grid item style={{ paddingLeft: "30px" }}>
                <Button
                  style={{ width: "30vh" }}
                  color="primary"
                  variant="contained"
                  disabled={isFormSubmitted == true}
                  onClick={() => this.handleSubmit()}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Modal
          open={this.state.bulkUploadModal}
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
                borderRadius: "10px",
              }}
            >
              <Grid item xs={12} style={{ padding: "20px 0px 0px 50px" }}>
                <Typography variant="h4">Bulk Upload</Typography>
              </Grid>
              <Grid item xs={12} style={{ padding: "20px 0px 0px 50px" }}>
                <Typography variant="h5">
                  Please upload only excel / xlsx Files
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  justifyContent="space-around"
                  alignItems="center"
                >
                  <Grid
                    item
                    style={{ marginTop: "20px", marginBottom: "20px" }}
                  >
                    <Button
                      style={{ width: "30vh" }}
                      color="primary"
                      variant="contained"
                    >
                      <Input
                        type="file"
                        color="primary"
                        fullWidth={true}
                        onChange={this.handleFilesChange}
                      ></Input>
                    </Button>
                  </Grid>
                  <Grid
                    item
                    style={{ marginTop: "20px", marginBottom: "20px" }}
                  >
                    {isLoading ? (
                      <Box sx={{ display: "flex" }}>
                        <CircularProgress color="primary" />
                      </Box>
                    ) : (
                      <Button
                        style={{ width: "30vh" }}
                        color="primary"
                        variant="contained"
                        disabled={!this.state.isFileSelected == true}
                        onClick={() => this.handleUploadSubmit()}
                      >
                        Submit
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Modal>
        <Snackbar
          open={this.state.snackbarEnable}
          autoHideDuration={3500}
          onClose={this.handleSnackbarClose}
          message={this.state.errorMessage}
        />
      </>
    );
  }
}

export default withStyles(styles)(withApollo(AddUserByAdmin));
