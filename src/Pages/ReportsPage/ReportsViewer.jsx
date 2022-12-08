import * as React from "react"
import PropTypes from "prop-types"
import { alpha } from "@mui/material/styles"
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import DeleteIcon from "@mui/icons-material/Delete"
import FilterListIcon from "@mui/icons-material/FilterList"
import CreateIcon from "@mui/icons-material/Create"
import { visuallyHidden } from "@mui/utils"
import { Grid, Button, TextField } from "@material-ui/core"
import { withApollo } from "react-apollo";
import { withStyles } from "@material-ui/core";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";



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


function createData(id, name, age, claimAmount, days, expense) {
  return {
    id,
    name,
    age,
    claimAmount,
    days,
    expense,
  }
}

const rows = [
  createData(1, "Raja", 30, 37000, 5, 50000),
  createData(2, "Ramesh", 35, 31000, 4, 31000),
  createData(3, "Mahesh", 36, 3000, 3, 4000),
  createData(4, "Minesh", 45, 4000, 1, 4000),
  createData(5, "Dhanush", 40, 47000, 8, 50000),
  createData(6, "Ratnadeep", 50, 51000, 10, 52000),
  createData(7, "Rahul", 30, 37000, 5, 38000),
  createData(8, "Prithvi", 35, 88000, 8, 90000),
  createData(9, "Dinesh", 32, 44000, 7, 44000),
  createData(10, "Sita", 34, 52000, 10, 52000),
  createData(11, "Kiran", 50, 61000, 11, 63000),
  createData(12, "Nitin", 60, 39500, 12, 40000),
]

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

const headCells = [
  {
    id: "id",
    alignDirection: false,
    disablePadding: false,
    label: "Id",
  },
  {
    id: "name",
    alignDirection: false,
    disablePadding: true,
    label: "Patient Name",
  },
  {
    id: "age",
    alignDirection: true,
    disablePadding: false,
    label: "Age",
  },
  {
    id: "claimAmount",
    alignDirection: true,
    disablePadding: false,
    label: "Claim Amount",
  },
  {
    id: "days",
    alignDirection: true,
    disablePadding: false,
    label: "Days of Hospitalization",
  },
  {
    id: "expense",
    alignDirection: true,
    disablePadding: false,
    label: "Total Medical Expence",
  },
]

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    classes
  } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        <TableCell>
          <Typography>Edit</Typography>
        </TableCell>

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignDirection ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant='h6'
          id='tableTitle'
          component='div'
        >
          Reports
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
}

function EnhancedTable(props) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  }

  const { selectedReportName,selectedReportKey } = props.location.state
  const {classes} = props

  const [order, setOrder] = React.useState("asc")
  const [orderBy, setOrderBy] = React.useState("age")
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  // const [name, setName] = React.useState('Cat in the Hat');
  // const handleChange = (event) => {
  //   setName(event.target.value);
  // };
  const [patientName, setPatientName] = React.useState("")
  const [patientAge, setPatientAge] = React.useState("")
  const onTextChange = (event) => {
    setPatientName(event.target.value)
    setPatientAge(event.target.value)
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (name) => selected.indexOf(name) !== -1

  const handleEdit = async (id) => {
    console.log("event -===== ", id)
    await handleOpen()
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

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
            <ArrowBackIcon fontSize="large" />
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
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        {/* Model for editing table data */}
        <Modal
          open={open}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <Grid container>
              <Grid item xs={12} style={{ paddingBottom: "15px" }}>
                <Typography id='modal-modal-title' variant='h6' component='h2'>
                  Edit Form
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container dirction='row' justifyContent='space-around'>
                  <Grid item xs={6}>
                    <TextField
                      required
                      id='patientName'
                      label='Patient Name'
                      placeholder='Enter Patient Name'
                      variant='standard'
                      value={patientName}
                      onChange={onTextChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      id='patientAge'
                      label='Age'
                      placeholder='Enter Patient Age'
                      variant='standard'
                      value={patientAge}
                      onChange={onTextChange}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  style={{ paddingTop: "15px" }}
                  dirction='row'
                  justifyContent='space-around'
                >
                  <Grid item xs={6}>
                    <TextField
                      required
                      id='claimAmount'
                      label='Claim Amount'
                      placeholder='Enter Claim Amount'
                      variant='standard'
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      id='daysOfHospitalization'
                      label='Days of Hospitalizaion'
                      placeholder='Enter Total Days'
                      variant='standard'
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  style={{ paddingTop: "15px" }}
                  dirction='row'
                  justifyContent='space-around'
                >
                  <Grid item xs={6}>
                    <TextField
                      required
                      id='totalExpense'
                      label='Total Expense'
                      placeholder='Enter Total Expense'
                      variant='standard'
                    />
                  </Grid>
                  <Grid item xs={6}></Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ padding: "15px 0px 0px 0px" }}>
                <Grid container justifyContent='flex-end' alignItems='flex-end'>
                  <Grid item>
                    <Button onClick={() => handleClose()}>
                      <Typography style={{ color: "black" }}>Cancel</Typography>
                    </Button>
                  </Grid>
                  <Grid item style={{ paddingLeft: "15px" }}>
                    <Button
                      style={{
                        backgroundColor: "#1FC59F",
                      }}
                    >
                      <Typography style={{ color: "white" }}>Submit</Typography>
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Modal>

        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              classes={props.classes}
            />
            <TableBody>
              {rows
                .slice()
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role='checkbox'
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding='checkbox'>
                        <Checkbox
                          color='primary'
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <CreateIcon
                          onClick={() => handleEdit(row.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </TableCell>
                      <TableCell>{row.id}</TableCell>
                      <TableCell
                        component='th'
                        id={labelId}
                        scope='row'
                        padding='none'
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align='right'>{row.age}</TableCell>
                      <TableCell align='right'>{row.claimAmount}</TableCell>
                      <TableCell align='right'>{row.days}</TableCell>
                      <TableCell align='right'>{row.expense}</TableCell>
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
    </Grid>
  )
}

export default withStyles(styles)(withApollo(EnhancedTable))