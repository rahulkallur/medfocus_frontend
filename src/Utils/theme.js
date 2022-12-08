import { createTheme } from "@material-ui/core/styles"
import Nunito from '../Assets/fonts/Nunito-Medium.ttf';


export const theme = createTheme({
    palette:{
        primary:{
            main:"#1FC59F"
        },
        secondary:{
            main:'#fff'
        },
        
    },
    typography:{
        fontFamily:'Nunito',
        h6:{
            fontFamily:'Nunito',
            fontSize:'10px',
            fontWeight:'800'
        },
        h5:{
            fontFamily:'Nunito',
            fontSize:'20px',
            fontWeight:'800',
        },
        h4:{
            fontFamily:'Nunito',
            fontSize:'30px',
            fontWeight:'600'
        },
        h3:{
            fontFamily:'Nunito',
            fontSize:'15px',
            fontWeight:'600'
        }
    }
})