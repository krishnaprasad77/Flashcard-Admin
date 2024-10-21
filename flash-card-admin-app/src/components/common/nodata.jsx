// import React from 'react';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import Container from '@mui/material/Container';
// import Button from '@mui/material/Button';
// // import somethingthingwentwrong from '../../assets/images/somethingwentwrong.png';
// import { Typography } from '@mui/material';
// import { useNavigate, useLocation } from 'react-router-dom';
// const NoDataPage = ({ data }) => {
//     let location = useLocation();
//     let navigate = useNavigate();
//     // let value = location.state.value;
//     return (
//         // <Container>
//         //     <Box sx={{
//         //         position: 'absolute',
//         //         top: '50%',
//         //         left: '50%',
//         //         transform: 'translate(-50%, -50%)',
//         //         textAlign: 'center',
//         //         p: 4,
//         //     }} >
//         //         <Grid item>
//         //             <img src={Error} className="photo" alt="this is SE image" height='150px' />
//         //             <Typography fontSize="h6.fontSize">{data}</Typography>

//         //             <Button variant="contained" color="solutionButtoncolor" sx={{ color: '#fff', py: 2 }} size="small" onClick={() => {
//         //                 navigate(0)
//         //             }}>
//         //                 Try Again
//         //             </Button>
//         //         </Grid >
//         //     </Box>
//         // </Container>
//         <Container>
//             <Box sx={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 textAlign: 'center',
//                 p: 4,
//                 pt: 30
//             }} >
//                 <Grid item>
//                     <Box sx={{
//                         mx: 'auto',
//                         textAlign: 'center',
//                         fontSize: '45px',
//                     }}>
//                         {/* <img src={somethingthingwentwrong} height='150px' width='150px' /> */}
//                     </Box>
//                 </Grid>
//                 <Grid item>
//                     <Box sx={{
//                         mx: 'auto',
//                         textAlign: 'center',
//                         fontSize: '20px',
//                     }}>

//                     </Box>
//                     <Box sx={{
//                         mx: 'auto',
//                         textAlign: 'center',
//                         fontSize: '14px',
//                     }}>

//                         <Typography>{data}</Typography>
//                     </Box>
//                     <Box sx={{
//                         mx: 'auto',
//                         textAlign: 'center',
//                         fontSize: '14px',
//                         fontWeight: '700',
//                         py: 2
//                     }} >
//                         {/* <Button variant="contained" color="solutionButtoncolor" sx={{ color: '#fff' }} size="small" onClick={() => {
//                             navigate(0)
//                         }}>
//                             Try Again
//                         </Button> */}
//                     </Box>
//                 </Grid>
//             </Box>

//         </Container>
//     )
// };
// export default NoDataPage;
import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import timeout from '../../assets/images/time_out.png'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate, useLocation } from 'react-router-dom';
import { History, Search } from '@mui/icons-material';
import { Card, IconButton } from '@mui/material';
const NoDataPage = () => {

    let location = useLocation();
    let navigate = useNavigate();
    let value = "No Data Found" || location.state.value;

    return (
        <Container maxWidth="100%">
            <Grid container>
                <Grid container display={"flex"} justifyContent="center" alignItems={"center"} >
                    <Grid item boxShadow={2} bgcolor={"primary.bgcolor"} borderRadius={2} lg={3} md={4} sm={4} xs={8} py={{ xs: 1, lg: 3, md: 3, sm: 3 }}>
                        <Grid item display={"flex"} gap={2} lg={12} md={12} sm={12} xs={12} alignItems="center" flexDirection={"column"}>
                            <IconButton sx={{ textAlign: 'center' }}>  <Search sx={{ fontSize: "50px", fill: "#FFBC3A" }} /></IconButton>
                            <Typography fontWeight={"bold"}  >{value}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
};
export default NoDataPage;