import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";
import { Button, Grid, Typography } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const GET_ALL_PATIENTS = gql`
  query getAllPatients {
    getAllPatients {
      id
      patientName
      mobileNo
      hospitalName
      employeeId
      policyHolderName
      companyName
    }
  }
`;

export class AllClients extends Component {
  state = {
    allPatients: [],
    isLoading: false,
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

  handleEditClick = async (value, tableMeta) => {
    let filteredPatientData = this.state.allPatients[tableMeta.rowIndex];

    console.log("filteredPatientData ---------", filteredPatientData);

    let requiredId = filteredPatientData.id;
    console.log("requiredId -----", requiredId);

    this.props.history.push({
      pathname: "/home/registerPatient",
      state: { id: parseInt(requiredId) },
    });
  };

  getAllPatients = async () => {
    this.setState({ isLoading: true });

    let allPatientsResponse = await this.props.client.query({
      query: GET_ALL_PATIENTS,
      fetchPolicy: "network-only",
    });

    console.log(
      "allPatients  new big form----",
      allPatientsResponse.data.getAllPatients
    );

    this.setState({
      allPatients: allPatientsResponse.data.getAllPatients,
      isLoading: false,
    });
  };

  async componentDidMount() {
    await this.getAllPatients();
  }

  backButtonHandler = () => {
    this.props.history.push("/home");
  };

  render() {
    const { classes, client } = this.props;

    const { allPatients, isLoading } = this.state;

    return (
      <Grid container justifyContent="flex-start">
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
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={11} style={{ padding: "0px 0px 30px 50px" }}>
          {isLoading ? (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          ) : (
            <ThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable
                title={
                  <Typography
                    variant="h4"
                    style={{ color: "#1FC59F", fontSize: "100" }}
                  >
                    Patients List
                  </Typography>
                }
                data={allPatients}
                columns={[
                  { label: "Patient Name", name: "patientName" },
                  { label: "Mobile No.", name: "mobileNo" },
                  { label: "Hospital Name", name: "hospitalName" },
                  { label: "Employee Id", name: "employeeId" },
                  { label: "Ploicy Holder Name", name: "policyHolderName" },
                  { label: "Company Name", name: "companyName" },
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
                            // onClick={() => console.log(value, tableMeta)}
                            onClick={() =>
                              this.handleEditClick(value, tableMeta)
                            }
                          >
                            Edit
                          </Button>
                        );
                      },
                    },
                  },
                ]}
                options={{
                  filterType: "dropdown",
                  responsive: "standard",
                  selectableRows: "none",
                }}
              />
            </ThemeProvider>
          )}
        </Grid>
      </Grid>
    );
  }
}

export default withApollo(AllClients);
