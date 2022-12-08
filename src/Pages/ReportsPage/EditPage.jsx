import React, { Component } from "react"
import {
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  withStyles,
} from "@material-ui/core"

const styles = (theme) => ({
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  },
})
class EditPage extends Component {
  state = {}
  render() {
    // {selected} = props
    // console.log("props=====", props)
    const { classes } = this.props
    console.log("props====", this.props)
    return (
      //   <div>
      //     <Box className={classes.modalStyle}>
      //       <Grid container>
      //         <Grid item xs={12} style={{ paddingBottom: "15px" }}>
      //           <Typography id='modal-modal-title' variant='h6' component='h2'>
      //             Edit Form
      //           </Typography>
      //         </Grid>
      //         <Grid item xs={12}>
      //           <Grid container dirction='row' justifyContent='space-around'>
      //             <Grid item xs={6}>
      //               <TextField
      //                 required
      //                 id='patientName'
      //                 label='Patient Name'
      //                 placeholder='Enter Patient Name'
      //                 variant='standard'
      //               />
      //             </Grid>
      //             <Grid item xs={6}>
      //               <TextField
      //                 required
      //                 id='patientAge'
      //                 label='Age'
      //                 placeholder='Enter Patient Age'
      //                 variant='standard'
      //               />
      //             </Grid>
      //           </Grid>
      //           <Grid
      //             container
      //             style={{ paddingTop: "15px" }}
      //             dirction='row'
      //             justifyContent='space-around'
      //           >
      //             <Grid item xs={6}>
      //               <TextField
      //                 required
      //                 id='claimAmount'
      //                 label='Claim Amount'
      //                 placeholder='Enter Claim Amount'
      //                 variant='standard'
      //               />
      //             </Grid>
      //             <Grid item xs={6}>
      //               <TextField
      //                 required
      //                 id='daysOfHospitalization'
      //                 label='Days of Hospitalizaion'
      //                 placeholder='Enter Total Days'
      //                 variant='standard'
      //               />
      //             </Grid>
      //           </Grid>
      //           <Grid
      //             container
      //             style={{ paddingTop: "15px" }}
      //             dirction='row'
      //             justifyContent='space-around'
      //           >
      //             <Grid item xs={6}>
      //               <TextField
      //                 required
      //                 id='totalExpense'
      //                 label='Total Expense'
      //                 placeholder='Enter Total Expense'
      //                 variant='standard'
      //               />
      //             </Grid>
      //             <Grid item xs={6}></Grid>
      //           </Grid>
      //         </Grid>
      //         <Grid item xs={12} style={{ padding: "15px 0px 0px 0px" }}>
      //           <Grid container justifyContent='flex-end' alignItems='flex-end'>
      //             <Grid item>
      //               <Button>
      //                 {/* onClick={() => handleClose()} */}
      //                 <Typography style={{ color: "black" }}>Cancel</Typography>
      //               </Button>
      //             </Grid>
      //             <Grid item style={{ paddingLeft: "15px" }}>
      //               <Button
      //                 style={{
      //                   backgroundColor: "#1FC59F",
      //                 }}
      //               >
      //                 <Typography style={{ color: "white" }}>Submit</Typography>
      //               </Button>
      //             </Grid>
      //           </Grid>
      //         </Grid>
      //       </Grid>
      //     </Box>
      //   </div>
      <Grid>
        <Typography>Heklosgg</Typography>
      </Grid>
    )
  }
}

export default withStyles(styles)(EditPage)
