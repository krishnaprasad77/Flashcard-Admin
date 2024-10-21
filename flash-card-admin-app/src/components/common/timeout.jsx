import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import timeout from '../../assets/images/time_out.png'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate, useLocation } from 'react-router-dom';
import { History } from '@mui/icons-material';
import { IconButton } from '@mui/material';
const TimeOutPage = () => {

    let location = useLocation();
    let navigate = useNavigate();
    let value = "Time Out" || location.state.value;

    return (
        <Container maxWidth="100%">
            <Grid container minHeight="85vh">
                <Grid container display={"flex"} justifyContent="center" alignItems={"center"} >
                    <Grid item display={"flex"} gap={2} lg={12} alignItems="center" flexDirection={"column"}>
                        <IconButton sx={{ textAlign: 'center' }}>  <History sx={{ fontSize: "50px", fill: "#FFBC3A" }} /></IconButton>
                        <Typography fontWeight={"bold"}  >{`Oh no! ${value}`}</Typography>
                        <Typography fontSize={".8rem"} textAlign="center">Please try again later</Typography>
                        <Grid item mt={4} >
                            <Button variant='contained' color="blackButtonColor" sx={{ color: "white" }} onClick={()=>navigate(0)} >Try again</Button>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </Container>
    )
};
export default TimeOutPage;