import {
    Button,
    Container,
    Grid,
    Modal,
    Typography,
    useMediaQuery,
  } from "@mui/material";
  
  import React, { useState } from "react";
  
  import update from "../../assets/images/update.png";
  
  import { HandleSubmitComponent } from "./handle_submit_component";
  import {
    updateCardService,
  } from "../../services/card_service";
  import { CheckCircle } from "@mui/icons-material";
  import { Navigate, useNavigate } from "react-router-dom";
  import { editSectionService } from "../../services/homescreenService";
import { updateDeckService } from "../../services/deckService";
  
  export const UpdatePopup = ({ updateState, setUpdateState,getValues}) => {
    const handleClose = () => {
        setUpdateState({
        ...updateState,
        open: false,
      });
    };
  
    const mobileMatches = useMediaQuery("(max-width:500px)");
  
    const tabletMatches = useMediaQuery("(max-width:900px)");
  
    let navigate = useNavigate();
  
    const onSubmit = async (handleSubmitResponse) => {
      handleClose();
  
      if (updateState.type === "cardUpdate") {
        await handleSubmitResponse({
          serviceCb: async () => {
            let updateCard = await updateCardService({
              data: updateState.requestBody,
            });
            return updateCard;
          },
          successCb: (data) => {
            navigate("/viewDeck", {
              state: { deckId: updateState.requestBody.deckId },
            });
          },
        });
      }
      if (updateState.type == "updateSection") {
  
        let data = {
          sectionName: updateState.sectionName,
          sectionId: updateState.sectionId
        }
        await handleSubmitResponse({
          serviceCb: async () => {
            let editSection = await editSectionService({
              data: data
            });
            return editSection
          },
          successCb: async () => {
            navigate('/')
          }
        })
      }
      if (updateState.type == "deckupdate") {
        let data = getValues();
        let finaldata = {
          deckName: data.deckName,
          difficultyLevel: data.difficultyLevel,
          subject: data.subject,
          topic: data.topic,
          exam:data.exam,
          standard:data.standard,
          subTopic: data.subTopic,
          deckId: data.deckId,
        };
        await handleSubmitResponse({
          serviceCb: async () => {
            let addservice = await updateDeckService({
              data: finaldata,
            });
  
            return addservice;
          },
          successCb: (dat) => {
            navigate('/viewDeck',{state:{deckId:data.deckId}})
          },
        });
      }
    };
  
    return (
      <>
        <HandleSubmitComponent
          successComponent={(handleServiceCall) => {
            return (
              <Modal
                BackdropProps={{
                  style: { backgroundColor: "black", opacity: 0.1 },
                }}
                open={updateState.open}
              >
                <Container
                  sx={{
                    display: "flex",
  
                    alignItems: "center",
  
                    justifyContent: "center",
  
                    height: "100vh",
  
                    borderRadius: "10px",
                  }}
                >
                  <Grid
                    container
                    sx={{
                      display: "flex",
  
                      flexDirection: "column",
  
                      width: mobileMatches
                        ? "70%"
                        : tabletMatches
                          ? "50%"
                          : "30%",
  
                      bgcolor: "background.paper",
  
                      boxShadow: 4,
  
                      p: 2,
  
                      borderRadius: "5px",
  
                      // borderTop: "5px solid #0F4CD9",
                    }}
                    rowGap={2}
                  >
                    <Grid item xs={12} display="flex" justifyContent="center">
                      <Typography fontWeight={"bold"}>Update {updateState.data}</Typography>
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="center">
                      {/* <img src={update}></img> */}
                      <CheckCircle sx={{ fill: "#ffBC3A", fontSize: "50px" }} />
                    </Grid>
  
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <Typography
                        sx={{ textAlign: "center" }}
                      // fontSize="h6.fontSize"
                      // fontWeight="h6.fontWeight"
                      // color="#0F4CD9"
                      >
                        Are you sure you want to update {updateState.value}?
                      </Typography>
                    </Grid>
  
                    <Grid container marginBottom={2}>
                      <Grid
                        item
                        lg={6}
                        md={6}
                        sm={6}
                        xs={6}
                        display="flex"
                        justifyContent="flex-end"
                        paddingX={1}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: "black",
  
                            color: "black",
  
                            textTransform: "none",
                          }}
                          size="small"
                          onClick={handleClose}
                        >
                          Cancel
                        </Button>
                      </Grid>
  
                      <Grid item lg={6} md={6} sm={6} xs={6}>
                        <Button
                          variant="contained"
                          color="blackButtonColor"
                          size="small"
                          sx={{ textTransform: "none", color: "white" }}
                          onClick={() => {
                            onSubmit(handleServiceCall);
                          }}
                        >
                          Update
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Container>
              </Modal>
            );
          }}
        />
      </>
    );
  };