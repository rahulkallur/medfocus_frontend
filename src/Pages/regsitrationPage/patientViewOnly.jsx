import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Grid, Typography } from "@material-ui/core";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const options = {
  filterType: "dropdown",
  responsive: "standard",
  selectableRows: "none",
};

const columns = [
  { label: "Patient Name", name: "patientName" },
  { label: "Mobile No.", name: "mobileNo" },
  { label: "Hospital Name", name: "hospitalName" },
  { label: "Employee Id", name: "employeeId" },
  { label: "Ploicy Holder Name", name: "policyHolderName" },
  { label: "Company Name", name: "companyName" },
];

export class PatientViewOnly extends Component {
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
              paddingLeft: "10px",
              backgroundColor: "#1FC59F !important",
              font: "40px",
            },
          },
        },
      },
    });

  render() {
    const tableData = this.props.tableData;

    const loading = this.props.isLoading;
    return (
      <Grid container justifyContent="center">
        {loading ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid item xs={12}>
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
                data={tableData}
                columns={columns}
                options={options}
              />
            </ThemeProvider>
          </Grid>
        )}
      </Grid>
    );
  }
}

export default PatientViewOnly;
