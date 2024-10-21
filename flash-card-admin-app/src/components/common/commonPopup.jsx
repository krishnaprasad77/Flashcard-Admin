import { React } from 'react';
import Container from '@mui/material/Container';
import { Button, Grid, IconButton, useMediaQuery } from '@mui/material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

// import { logoutService } from '../../services/login_service';
import { useNavigate } from 'react-router-dom';

export default function CommonPopup({ loader, icon, actionLabel1, actionLabel2, actionLabel3, actionCb1, actionCb2, heading, content, setOpenModal, openModal, image }) {
  const mobileMatches = useMediaQuery('(max-width:600px)');
  const tabletMatches = useMediaQuery('(max-width:900px)');
  const handleClose = () => setOpenModal({ status: false });
  let navigate = useNavigate()

  return (
    <div>

      <Modal
        BackdropProps={{ style: { backgroundColor: 'white', opacity: 0.5 } }}
        open={openModal.status}>
        <Container sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        }}>
          <Grid container sx={{
            display: 'flex',
            flexDirection: 'column',
            width: mobileMatches ? '50%' : tabletMatches ? '45%' : '30%',
            bgcolor: 'background.paper',
            boxShadow: 4,
            p: 2,
            borderRadius: 3
          }}>
            <Grid item alignSelf='center'>
              {/* <Typography id="modal-modal-title" variant="h6" style={{ color: 'red' }} component="h2" fontSize={{ xs: '18px', sm: '17px', md: '16px', lg: '18px' }}> */}
              {/* {image ? <img src={image} width='25%' /> : <></>} */}
              {/* </Typography> */}
              {icon}
              {/* {icon ? icon : <></>} */}
            </Grid>
            <Grid item alignSelf='center' alignContent='center' justifyContent='center'  >
              <Typography id="modal-modal-description" fontSize={{ xs: '15px', sm: '17px', md: '16px', lg: '16px' }}>
                {heading}
              </Typography>
              <Typography id="modal-modal-description" fontSize={{ xs: '15px', sm: '17px', md: '16px', lg: '16px' }}>
                {content}
              </Typography>
            </Grid>
            <Grid container marginY={1} columnSpacing={2} sx={{
              display: 'flex',
              justifyContent: 'center',
              paddingY: 1
            }}
            >
              {actionLabel1 ? <Grid item>
                <Button onClick={() => {
                  handleClose();

                }} sx={{ width: '100%', textTransform: 'none', color: '#fff' }} type='submit' variant="contained" color="blackButtonColor" size="small">
                  {actionLabel1}
                </Button>
              </Grid> : <></>}
              {actionLabel2 ? <Grid item>
                <Button onClick={
                  async () => {
                    // await logoutService();
                    handleClose()
                    navigate('/')
                    window.location.reload()
                  }
                } sx={{ width: '100%', textTransform: 'none' }} type='submit' variant="contained" color="success" size="small">
                  {actionLabel2}
                </Button>
              </Grid> : <></>}

            </Grid>
          </Grid>
        </Container>
      </Modal>
    </div >
  );
}