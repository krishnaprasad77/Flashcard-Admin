import React  from 'react'
import { Grid } from '@mui/material';
import LoaderTwo from './LoaderTwo';
export default function Circular() {
    return (
        <>
            <Grid container display="flex" flexDirection="row" justifyContent="center" alignContent="center" minHeight='100vh'>
                <Grid item>
                    <LoaderTwo />
                </Grid>
            </Grid>
        </>
    )
}