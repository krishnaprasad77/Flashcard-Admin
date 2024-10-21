import {
  Button,
  Container,
  Grid,
  Modal,
  Typography,
  useMediaQuery,
} from "@mui/material";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import pic from "../../assets/images/delete.gif";
import {
  deleteImageService,
  updateCardService,
} from "../../services/card_service";
import {
  deleteDeck,
  deleteSectionById,
} from "../../services/homescreenService";
import { HandleSubmitComponent } from "./handle_submit_component";
import { deleteDeckImageService } from "../../services/deckService";
import {
  deleteCardService,
  deleteDeckService,
} from "../../services/viewdeckService";
import { Delete } from "@mui/icons-material";

export default function ({ deleteState, setDeleteState }) {
  const mobileMatches = useMediaQuery("(max-width:500px)");
  const tabletMatches = useMediaQuery("(max-width:900px)");
  const navigate = useNavigate();
  const handleClose = () => {
    setDeleteState({
      ...deleteState,
      open: false,
    });
  };

  const onSubmit = async (handleSubmitResponse) => {
    handleClose();
    if (deleteState.pageType == "SectionDelete") {
      await handleSubmitResponse({
        serviceCb: async () => {
          
          let response = await deleteSectionById(deleteState.sectionId);
          return response;
        },
        successCb: () => {
          navigate("/");
        },
      });
    }
    if (deleteState.pageType == "deckView") {
      if (deleteState.data == "deck") {
        await handleSubmitResponse({
          serviceCb: async () => {
            
            let response = await deleteDeckService(deleteState.deckId);
            
            return response;
          },
          successCb: () => {
            navigate("/");
          },
        });
      } else {
        await handleSubmitResponse({
          serviceCb: async () => {
            console.log(
              deleteState.deckId,
              "sectioniddddddddddddddd",
              deleteState.cardId
            );
            let response = await deleteCardService(
              deleteState.cardId,
              deleteState.deckId
            );
            
            return response;
          },
          successCb: () => {
            window.location.reload();
          },
        });
      }
    } else if (deleteState.pageType == "EditDeck") {
      await handleSubmitResponse({
        serviceCb: async () => {
          let response = await deleteDeck(
            deleteState.sectionId,
            deleteState.deckId
          );
          console.log(
            deleteState.sectionId,
            deleteState.deckId,
            "sectionand delete"
          );
          
          return response;
        },
        successCb: () => {
          navigate("/");
        },
      });
    }
    if (deleteState.type === "cardImageDelete") {
      await handleSubmitResponse({
        serviceCb: async () => {
          let response = await deleteImageService({
            imageId: deleteState.imageId,
            cardId: deleteState.cardId,
            type: deleteState.optType,
          });
          return response;
        },
        successCb: (data) => {
          window.location.reload();
        },
      });
    }

    if (deleteState.type === "cardOptionDelete") {
      const index = deleteState.index;
      const setValue = deleteState.setValue;
      const getValues = deleteState.getValues;
      const images = deleteState.images;
      const solution = deleteState.solution;
      await handleSubmitResponse({
        serviceCb: async () => {
          //Delete Image call
          if (deleteState?.imageId) {
            await deleteImageService({
              imageId: deleteState.imageId,
              cardId: deleteState.cardId,
              type: deleteState.optType,
            });
          }
          //update Card
          let options = getValues("options");
          if (options.length > 2) {
            setValue(`option${index + 1}`, null);
            setValue(`option${index + 1}Image`, null);
            images.delete(`option${index + 1}Image`);
            for (let i = index; i < options.length; i++) {
              setValue(`option${i + 1}`, getValues(`option${i + 2}`));
              setValue(`option${i + 1}Image`, getValues(`option${i + 2}Image`));
              images.set(
                `option${i + 1}Image`,
                images.get(`option${i + 2}Image`)
              );
              if(getValues("solution")==solution[i+2]){
                setValue("solution",solution[i+1])
              }
            }
            let temp = [...options];
            temp.splice(index, 1);
            // if (getValues("solution") === solution[index]) {
            //   setValue("solution", null);
            // }
            setValue("options", temp);
          }
          const requestBody = {
            question: getValues("question"),
            solution: getValues("solution"),
            hint: getValues("hintText"),
            cardId: deleteState.cardId,
            deckId: deleteState.deckId,
          };
          const opt = getValues("options");
          for (let i = 0; i < opt.length; i++) {
            
            requestBody[`option${i + 1}`] = getValues(`option${i + 1}`);
          }

          let updateCard = await updateCardService({
            data: requestBody,
          });
          return updateCard;
        },
        successCb: (data) => {
            window.location.reload();
        },
      });
    } 
    
    
    else if (deleteState.type === "DeckDeleteImage") {
      await handleSubmitResponse({
        serviceCb: async () => {
          let response = await deleteDeckImageService(
            deleteState.imageId,
            deleteState.deckId
          );
          return response;
        },
        successCb: (data) => {
          deleteState.setSelectedImage("");
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
                style: { backgroundColor: "black", opacity: 0.2 },
              }}
              open={deleteState.open}
              sx={{ outline: "none" }}
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
                      ? "90%"
                      : tabletMatches
                      ? "50%"
                      : "33%",
                    bgcolor: "background.paper",
                    boxShadow: 4,
                    p: 3,
                    borderRadius: 3,
                  }}
                  rowGap={2}
                >
                  <Grid item xs={12} display="flex" justifyContent="center">
                    <Typography fontWeight={"bold"}>
                      Delete {deleteState.data}?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} display="flex" justifyContent="center">
                    <Delete sx={{ fill: "#ffBC3A" }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography sx={{ textAlign: "center" }}>
                      Are you sure you want to delete {deleteState.value}?
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    marginBottom={2}
                    columnGap={{ lg: 1.3, xs: 0.6 }}
                  >
                    <Grid
                      item
                      xs={5.8}
                      display="flex"
                      justifyContent="flex-end"
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
                    <Grid item xs={5.8}>
                      <Button
                        variant="contained"
                        color="blackButtonColor"
                        size="small"
                        sx={{ textTransform: "none", color: "white" }}
                        onClick={() => {
                          onSubmit(handleServiceCall);
                        }}
                      >
                        Delete
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
}
