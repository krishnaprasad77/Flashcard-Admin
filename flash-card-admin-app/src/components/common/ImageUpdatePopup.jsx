import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Modal,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Image } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { HandleSubmitComponent } from "./handle_submit_component";
import { updateDeckImageService } from "../../services/deckService";
import { updateImageService } from "../../services/card_service";
export const UpdateImagePopup = ({
  updateState,
  setUpdateState,
  ImgUpload,
  getValues,
  updatedImage,
  screenType,
  errors,
}) => {
  const handleClose = () => {
    setUpdateState({
      ...updateState,
      open: false,
    });
  };

  const onSubmit = async (handleSubmitResponse) => {
    handleClose();
    if (screenType === "card") {
      console.log("updateState", updateState);
      const formData = new FormData();
      formData.append("cardId", updateState.cardId);
      formData.append("type", updateState.imageType);
      formData.append("image", updateState.image);
      if (updateState.type === "updateCardImage") {
        formData.append("imageId", updateState.imageId);
      }

      await handleSubmitResponse({
        serviceCb: async () => {
          let response = await updateImageService({
            data: formData,
          });
          return response;
        },
        successCb: (data) => {
          window.location.reload();
        },
      });
    } else if (screenType == "deckUpdate") {
      const image = getValues("image");
      const formdata = new FormData();
      formdata.append("image", image);
      formdata.append("deckId", updateState.deckId);
      if (updateState.type === "DeckUpdateImage") {
        formdata.append("imageId", updateState.imageId);
      }
      await handleSubmitResponse({
        serviceCb: async () => {
          let updateImgService = await updateDeckImageService({
            data: formdata,
          });
          return updateImgService;
        },
        successCb: (data) => {
          window.location.reload();
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
              open={updateState?.open}
            >
              <Container
                maxWidth="sm"
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
                    justifyContent: "center",
                    bgcolor: "background.paper",
                    boxShadow: 4,
                    p: 2,
                    borderRadius: "5px",
                  }}
                  rowGap={2}
                >
                  <Grid item lg={10}>
                    <Typography
                      display={"flex"}
                      justifyContent={"center"}
                      color="black"
                      fontSize="1.4rem"
                      fontWeight="500"
                      sx={{ mt: 2, mb: 2 }}
                    >
                      {updatedImage ? "Preview Image" : "Upload Image"}
                    </Typography>
                    {updatedImage ? (
                      <Box>
                        <img
                          src={updatedImage}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "150px",
                            borderRadius: "10px",
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        border="1px solid #D3D8DE"
                        borderRadius={2}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        py="2rem"
                      >
                        <Typography>Click here to upload your image</Typography>
                        <Typography color="grey">Maximum size 1MB</Typography>
                        <IconButton
                          type="button"
                          onClick={() =>
                            ImgUpload(
                              updateState.imageType,
                              updateState.cardImgId
                            )
                          }
                        >
                          <Image
                            sx={{ fontSize: "1.7rem", color: "#F1A628" }}
                          />
                        </IconButton>
                        {screenType === "deckUpdate" &&
                          updateState.errors?.image && (
                            <Typography color="red">
                              {updateState.errors?.image?.message}
                            </Typography>
                          )}
                        {screenType === "card" &&
                          updateState.errors?.[updateState.imageType] && (
                            <Typography color="red">
                              {
                                updateState.errors[updateState.imageType]
                                  ?.message
                              }
                            </Typography>
                          )}
                      </Box>
                    )}
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      gap={1}
                      sx={{ mt: 3, mb: 4 }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => {
                          handleClose();
                          updateState.setUpdatedImage(null);
                          screenType === "deckUpdate" &&
                            updateState.setError("image", "");
                          screenType === "card" &&
                            updateState.setError(updateState.imageType, "");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        disabled={updatedImage ? false : true}
                        onClick={() => {
                          onSubmit(handleServiceCall);
                        }}
                      >
                        Upload
                      </Button>
                    </Box>
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
