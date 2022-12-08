import {
  Grid,
  Typography,
  withStyles,
  LinearProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Collapse,
  Button,
  CircularProgress,
} from "@material-ui/core";
import React, { Component } from "react";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import { Card, CardContent, Tabs, Tab, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  BarChart,
  Bar,
} from "recharts";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";
import Snackbar from "@mui/material/Snackbar";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const styles = (theme) => ({
  reportHeader: {
    color: "#1FC59F",
  },
  cardStyle: {
    minWidth: 225,
    height: 150,
  },
  linearColorPrimary: {
    backgroundColor: "white",
  },
  linearBarColorPrimary: {
    backgroundColor: "#677381",
  },
  tableCellStyle: {
    fontSize: "1.2rem",
    fontWeight: "600",
  },
  tableCellDataStyle: {
    fontSize: "0.9rem",
    fontWeight: "600",
  },
});

const data = [
  "Active Claims",
  "Settelement Claims",
  "Missing Documents",
  "Rejected Claims",
  "Under Process",
  "Under Query",
  "Approved Claims",
  "Submitted Query",
  "Submission",
  // "TPA Claims",
];

const dataColors = [
  "linear-gradient( 135deg, #e09936 10%, #ffe933 100%)",
  "linear-gradient( 135deg, #00f3ff 10%, #3CD500 100%)",
  "linear-gradient( 135deg, #ffa9d6 10%, #ff5233 100%)",
  "linear-gradient( 135deg, #9ac6dc 10%, #029486 100%)",
  "linear-gradient( 135deg, #85b7fb 10%, #05a4f9 100%)",
  "linear-gradient( 135deg, #6cb6a1 10%, #907159 100%)",
  "linear-gradient( 135deg, #43CBFF 10%, #9708CC 100%)",
  "linear-gradient( 135deg, #ffbdd6 10%, #ffa500 100%)",
  "linear-gradient( 135deg, #ff969f 10%, #ff7f50 100%)",
  "linear-gradient( 135deg, #85b7fb 10%, #05a4f9 100%)",
  "linear-gradient( 135deg, #6cb6a1 10%, #907159 100%)",
  "linear-gradient( 135deg, #43CBFF 10%, #9708CC 100%)",
  "linear-gradient( 135deg, #ffbdd6 10%, #ffa500 100%)",
  "linear-gradient( 135deg, #ff969f 10%, #ff7f50 100%)",
  "linear-gradient( 135deg, #4a969f 10%, #4a9680 100%)",
];

const dataColorsForChart = [
  " #e09936 ",
  " #00f3ff ",
  " #ff5233",
  " #9ac6dc ",
  " #85b7fb ",
  " #6cb6a1 ",
  " #9708CC",
  " #ffbdd6  ",
  " #ff969f ",
  " #05a4f9",
  " #907159",
  " #ffe933 ",
  " #ffa500",
  " #ff969f",
   "#4a9680"
];

const GET_DASHBOARD_COUNT = gql`
  query getDashboardCount {
    getDashboardCount {
      claimStatus
      count
    }
  }
`;

const CLAIM_AND_COUNT = gql`
  query getClaimAmountAndCount($clientId: Int, $hospitalName: String) {
    getClaimAmountAndCount(clientId: $clientId, hospitalName: $hospitalName) {
      claimStatus
      totalAmountPaid
      totalApprovedAmount
      count
      totalApprovedAmount
    }
  }
`;

const GET_HOSPITAL_LIST = gql`
  query getAllHospitalDetails {
    getAllHospitalDetails {
      name
    }
  }
`;

const rows = [createData("Frozen yoghurt", 159, 6.0, 24, 4.0)];
class Home extends Component {
  state = {
    graphSelectionValue: "lineChart",
    dashboardCount: [],
    dashboardMaxCount: 0,
    userRole: null,
    hospitalList: null,
    hospitalDetails: [],
    snackbarEnable: false,
    errorMessage: "",
    totalnoOfPatientes: [],
    totalamountpaidStatus: [],
    totalApprovedAmount: [],
    isHospitalLoading: false,
  };

  fetchDashboardCount = async () => {
    let fetchDashboardCountData = await this.props.client.query({
      query: GET_DASHBOARD_COUNT,
      fetchPolicy: "network-only",
    });

    if (fetchDashboardCountData && fetchDashboardCountData.data) {
      let fetchDetails = fetchDashboardCountData.data.getDashboardCount;
      let fetchArr = [];
      let totalAdder = 0;
      for (let i = 0; i < fetchDetails.length; i++) {
        totalAdder += fetchDetails[i].count;
        fetchDetails[i].fill = dataColorsForChart[i];
        fetchArr.push(fetchDetails[i]);
      }
      if (fetchArr.length) {
        this.setState({
          dashboardCount: fetchArr,
          dashboardMaxCount: totalAdder,
        });
      }
    }
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackbarEnable: false });
  };

  fetchHospitalDetails = async () => {
    let fetchHospitalDetails = await this.props.client.query({
      query: GET_HOSPITAL_LIST,
      fetchPolicy: "network-only",
    });

    if (fetchHospitalDetails && fetchHospitalDetails.data) {
      let fetchDetails = fetchHospitalDetails.data.getAllHospitalDetails;
      let fetchArr = [];
      let totalAdder = 0;
      for (let i = 0; i < fetchDetails.length; i++) {
        totalAdder += fetchDetails[i].count;
        fetchArr.push(fetchDetails[i].name);
      }
      if (fetchArr.length) {
        this.setState({
          hospitalDetails: fetchArr,
        });
      }
    }
  };

  handleChangeDropDown = (e, x) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount = () => {
    this.fetchDashboardCount();
    this.fetchHospitalDetails();
    this.setState({ userRole: localStorage.getItem("roles") }, () => {
      if (this.state.userRole == "CLIENT") {
        let loginId = JSON.parse(localStorage.getItem("loginId"));
        this.dataWidgetHandler(loginId);
      }
    });
  };

  drownHandler = (e) => {
    console.log("Eventy drownHandler", e.taget.value);
  };

  dataWidgetHandler = async (loginId) => {
    this.setState({ isHospitalLoading: true });
    if (this.state.hospitalList || this.state.userRole == "CLIENT") {
      let fetchCountAndAmountWidget = await this.props.client.query({
        query: CLAIM_AND_COUNT,
        fetchPolicy: "network-only",
        variables: {
          hospitalName:
            this.state.userRole != "CLIENT" ? this.state.hospitalList : "",
          clientId: this.state.userRole == "CLIENT" ? loginId : null,
        },
      });
      if (
        fetchCountAndAmountWidget &&
        fetchCountAndAmountWidget.data &&
        fetchCountAndAmountWidget.data.getClaimAmountAndCount.length
      ) {
        let amountAndClaimDetails =
          fetchCountAndAmountWidget.data.getClaimAmountAndCount;
        let totalnoOfPatientes = [];
        let totalnoOfPatientesObj = {};
        let totalamountpaidStatus = [];
        let totalamountpaidStatusObj = {};
        let totalApprovedAmount = [];
        let totalApprovedAmountObj = {};
        for (let i in amountAndClaimDetails) {
          let selectedClaimName = amountAndClaimDetails[i].claimStatus;
          switch (selectedClaimName) {
            case "Selected":
              totalnoOfPatientesObj.Selected = amountAndClaimDetails[i].count;
              totalamountpaidStatusObj.Selected =
                amountAndClaimDetails[i].totalAmountPaid;
              totalApprovedAmountObj.Selected =
                amountAndClaimDetails[i].totalApprovedAmount;

              break;
            case "Rejected Claims":
              totalnoOfPatientesObj.Rejected = amountAndClaimDetails[i].count;
              totalamountpaidStatusObj.Rejected =
                amountAndClaimDetails[i].totalAmountPaid;
              totalApprovedAmountObj.Rejected =
                amountAndClaimDetails[i].totalApprovedAmount;

              break;
            case "Under Process":
              totalnoOfPatientesObj.UnderProcess =
                amountAndClaimDetails[i].count;
              totalamountpaidStatusObj.UnderProcess =
                amountAndClaimDetails[i].totalAmountPaid;
              totalApprovedAmountObj.UnderProcess =
                amountAndClaimDetails[i].totalApprovedAmount;

              break;
            default:
              break;
          }
        }
        totalnoOfPatientes.push(totalnoOfPatientesObj);
        totalamountpaidStatus.push(totalamountpaidStatusObj);
        totalApprovedAmount.push(totalApprovedAmountObj);
        this.setState({
          totalnoOfPatientes: totalnoOfPatientes,
          totalamountpaidStatus: totalamountpaidStatus,
          totalApprovedAmount: totalApprovedAmount,
          isHospitalLoading: false,
        });
      }
      console.log("fetchCountAndAmountWidget", fetchCountAndAmountWidget);
    } else {
      this.setState({
        errorMessage: "Please select a Hospital",
        snackbarEnable: true,
        isHospitalLoading: false,
      });
    }
  };

  handleTabChange = (event, value) => {
    this.setState({ graphSelectionValue: value });
  };
  render() {
    const { classes } = this.props;
    const {
      graphSelectionValue,
      dashboardCount,
      dashboardMaxCount,
      hospitalList,
      userRole,
      snackbarEnable,
      isHospitalLoading,
    } = this.state;
    console.log("userRole", userRole);
    return (
      <Grid container justifyContent="flex-start" spacing={3}>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={1}>
              <Grid container justifyContent="space-around">
                <Grid item xs={3}>
                  <Typography variant="h4" className={classes.reportHeader}>
                    Dashboard
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="center">
            <Grid item xs={11}>
              <Grid container justifyContent="center" spacing={3}>
                {dashboardCount.map((e, i) => {
                  return (
                    <Grid item xs={3}>
                      <Card
                        elevation={3}
                        className={classes.cardStyle}
                        style={{ background: dataColors[i] }}
                      >
                        <Grid
                          container
                          justifyContent="space-around"
                          style={{ padding: "10px" }}
                        >
                          <Grid item xs={12}>
                            <Grid container justifyContent="center">
                              <Grid item>
                                <Typography
                                  style={{ fontSize: "23px", fontWeight: 700 }}
                                >
                                  {e.claimStatus}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Grid
                                  container
                                  style={{ paddingTop: "10px" }}
                                  justifyContent="center"
                                >
                                  <Grid item>
                                    <Typography
                                      style={{
                                        color: "white",
                                        fontWeight: 600,
                                      }}
                                      variant="h2"
                                    >
                                      {e.count}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          {/* <Grid item xs={2}>
                        <Grid container justifyContent="flex-end">
                          <Grid item xs={4}>
                            <CoPresentIcon sx={{ color: "#1FC59F" }} />
                          </Grid>
                        </Grid>
                      </Grid> */}
                          <Grid item style={{ paddingTop: "10px" }} xs={12}>
                            <LinearProgress
                              // style={{barColorPrimary:"primary",backgroundColor:"white"}}
                              classes={{
                                colorPrimary: classes.linearColorPrimary,
                                barColorPrimary: classes.linearBarColorPrimary,
                              }}
                              variant="determinate"
                              value={Math.round(
                                (100 / dashboardMaxCount) * e.count
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* NOTE: THIS IS THE RE-CHARTS FOR ALL THE LIST OF PROCESS */}
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={1}>
              <Grid container justifyContent="space-around">
                <Grid item xs={3}>
                  <Typography variant="h4" className={classes.reportHeader}>
                    Chart
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="center">
            <Paper elevation="5">
              <Grid item xs={12}>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <Box sx={{ width: "100%" }}>
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                          value={graphSelectionValue}
                          onChange={this.handleTabChange}
                          aria-label="basic tabs example"
                        >
                          <Tab label="Line Chart" value="lineChart" />
                          <Tab label="Pie Chart" value="pieChart" />
                        </Tabs>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    {graphSelectionValue == "lineChart" ? (
                      <Grid container justifyContent="center">
                        <BarChart
                          width={730}
                          height={250}
                          data={dashboardCount}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="claimStatus" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                      </Grid>
                    ) : (
                      <Grid container justifyContent="center">
                        <PieChart width={800} height={400}>
                          <Pie
                            dataKey="count"
                            isAnimationActive={true}
                            data={dashboardCount}
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            label={({
                              cx,
                              cy,
                              midAngle,
                              innerRadius,
                              outerRadius,
                              value,
                              index,
                            }) => {
                              console.log("handling label?");
                              const RADIAN = Math.PI / 180;
                              // eslint-disable-next-line
                              const radius =
                                25 + innerRadius + (outerRadius - innerRadius);
                              // eslint-disable-next-line
                              const x =
                                cx + radius * Math.cos(-midAngle * RADIAN);
                              // eslint-disable-next-line
                              const y =
                                cy + radius * Math.sin(-midAngle * RADIAN);
                              if (value > 0) {
                                return (
                                  <text
                                    x={x}
                                    y={y}
                                    fill="#8884d8"
                                    textAnchor={x > cx ? "start" : "end"}
                                    dominantBaseline="central"
                                  >
                                    {dashboardCount[index].claimStatus} ({value}
                                    )
                                  </text>
                                );
                              }
                            }}
                          />

                          <Tooltip />
                        </PieChart>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={3}>
              <Grid container justifyContent="space-around">
                <Grid item xs={9}>
                  <Typography variant="h4" className={classes.reportHeader}>
                    Data Widget
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="center">
            <Paper elevation="5" style={{ width: "90%", minHeight: 300 }}>
              <Grid container style={{ margin: "20px" }}>
                <Grid item xs={12}>
                  {userRole != "CLIENT" && (
                    <Grid container justifyContent="space-between">
                      <Grid xs={3}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Hospital List
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select-label"
                            value={this.state.hospitalList}
                            name="hospitalList"
                            label="Hospital List"
                            onChange={this.handleChangeDropDown}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {this.state.hospitalDetails.map((e) => (
                              <MenuItem value={e}>{e}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={8}>
                        <Button
                          style={{
                            marginTop: "10px",
                            backgroundColor: "#1FC59F",
                            color: "white",
                          }}
                          onClick={() => this.dataWidgetHandler()}
                        >
                          SUBMIT
                          {/* {value ? "Disbale" : "Enable"} */}
                        </Button>
                        <Snackbar
                          open={this.state.snackbarEnable}
                          autoHideDuration={2500}
                          onClose={this.handleSnackbarClose}
                          message={this.state.errorMessage}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {!isHospitalLoading ? (
                    <Grid container justifyContent="space-evenly">
                      <Grid item xs={5}>
                        <Grid
                          xs={12}
                          style={{ marginTop: "50px", marginBottom: "20px" }}
                        >
                          <Typography variant="h5">{`Total Number of Patients`}</Typography>
                        </Grid>
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 500 }}
                            aria-label="simple table"
                          >
                            <TableHead style={{ backgroundColor: "#1FC59F" }}>
                              <TableRow>
                                <TableCell
                                  align="center"
                                  className={classes.tableCellStyle}
                                >
                                  Settled
                                </TableCell>
                                <TableCell
                                  align="center"
                                  className={classes.tableCellStyle}
                                >
                                  Rejected
                                </TableCell>
                                <TableCell
                                  align="center"
                                  className={classes.tableCellStyle}
                                >
                                  UnderProcess
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {this.state.totalnoOfPatientes.map((row) => (
                                <TableRow
                                  key={row.name}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell
                                    align="center"
                                    className={classes.tableCellDataStyle}
                                  >
                                    {row.Selected}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    className={classes.tableCellDataStyle}
                                  >
                                    {row.Rejected}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    className={classes.tableCellDataStyle}
                                  >
                                    {row.UnderProcess}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                      <Grid item xs={5}>
                        <Grid
                          xs={12}
                          style={{ marginTop: "50px", marginBottom: "20px" }}
                        >
                          <Typography variant="h5">{`Total Amount Status`}</Typography>
                        </Grid>
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 500 }}
                            aria-label="simple table"
                          >
                            <TableHead style={{ backgroundColor: "#1FC59F" }}>
                              <TableRow>
                                <TableCell
                                  align="center"
                                  className={classes.tableCellStyle}
                                >
                                  Settled
                                </TableCell>
                                <TableCell
                                  align="center"
                                  className={classes.tableCellStyle}
                                >
                                  Rejected
                                </TableCell>
                                <TableCell
                                  align="center"
                                  className={classes.tableCellStyle}
                                >
                                  UnderProcess
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {this.state.totalamountpaidStatus.map((row) => (
                                <TableRow
                                  key={row.name}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell
                                    align="center"
                                    className={classes.tableCellDataStyle}
                                  >
                                    {row.Selected}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    className={classes.tableCellDataStyle}
                                  >
                                    {row.Rejected}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    className={classes.tableCellDataStyle}
                                  >
                                    {row.UnderProcess}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                      <Grid item xs={5}>
                        <Grid
                          xs={12}
                          style={{ marginTop: "50px", marginBottom: "20px" }}
                        >
                          <Typography variant="h5">{`Total Aproved Amount`}</Typography>
                        </Grid>
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 500 }}
                            aria-label="simple table"
                          >
                            <TableHead style={{ backgroundColor: "#1FC59F" }}>
                              <TableRow>
                                <TableCell
                                  align="center"
                                  className={classes.tableCellStyle}
                                >
                                  Settled
                                </TableCell>
                                <TableCell
                                  align="center"
                                  className={classes.tableCellStyle}
                                >
                                  Rejected
                                </TableCell>
                                <TableCell
                                  align="center"
                                  className={classes.tableCellStyle}
                                >
                                  UnderProcess
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {this.state.totalApprovedAmount.map((row) => (
                                <TableRow
                                  key={row.name}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell
                                    align="center"
                                    className={classes.tableCellDataStyle}
                                  >
                                    {row.Selected}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    className={classes.tableCellDataStyle}
                                  >
                                    {row.Rejected}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    className={classes.tableCellDataStyle}
                                  >
                                    {row.UnderProcess}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid
                      container
                      direction="column"
                      justifyContent="center"
                      align="center"
                    >
                      <Grid item xs={12}>
                        <Grid container justifyContent="center" align="center">
                          <Grid item xs={12}>
                            <CircularProgress
                              size="100px"
                              sx={{
                                color: "#1FC59F",
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(withApollo(Home));
