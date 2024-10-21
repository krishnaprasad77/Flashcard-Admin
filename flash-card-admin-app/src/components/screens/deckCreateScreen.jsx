import React, { useEffect, useState } from "react";
import { Delete, DriveFolderUpload, Image } from "@mui/icons-material";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-dom";
import { HandleSubmitComponent } from "../common/handle_submit_component";
import {
  deckCreateService,
  getDeckService,
  updateDeckImageService,
  updateDeckService,
} from "../../services/deckService";
import DeletePopup from "../common/deletePopup";
import { UpdateImagePopup } from "../common/ImageUpdatePopup";
import { CardExcelTemplateUrl } from "../../config/app_urls";
import { UpdatePopup } from "../common/updatePopup";

export const CreateDeck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [fileName, setFileName] = useState("");
  const [imageId, setImageId] = useState("");
  const [deleteState, setDeleteState] = useState("");
  const [updateState, setUpdateState] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [updatedImage, setUpdatedImage] = useState(null);
  const [difficulty, setDifficulty] = useState("");
  const [editState, seteditState] = useState("");

  let pageType = location?.state?.pageType;
  const deckId = location?.state?.deckId;

  const schema = yup.object().shape({
    deckName: yup
      .string()
      .required("Please enter the Deck Name")
      .max(30, "deckname should be a string with a maximum of 30 characters"),
    // .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Deck name must be valid"),
    // image:
    //   pageType == "edit"
    //     ? null
    //     : yup.mixed().required("Please select a JPEG or PNG Image"),
    file:
      pageType == "edit"
        ? null
        : yup.mixed().required("Please select an XLS File"),
    subject: yup
      .string()
      .required("Please enter the Subject")
      .max(20, "Subject should be a string with a maximum of 20 characters")
      .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Special characters and space should not be allowed"),
    topic: yup
      .string()
      .required("Please enter the Topic")
      .max(20, "Topic should be a string with a maximum of 20 characters")
      .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Special characters and space should not be allowed"),
    subTopic: yup.string().optional(),
    exam: yup.string().optional(),
    standard: yup.string().optional(),
    difficultyLevel: yup
      .string()
      .required("Please choose a difficulty")
      .oneOf(
        ["Easy", "Medium", "Hard"],
        "Difficulty should be 'easy', 'medium', or 'hard'"
      ),
  });

  const tabletMatches = useMediaQuery("(max-width:500px)");
  const mobileMatches = useMediaQuery("(max-width:350px)");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    getValues,
    setError,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data, handleSubmitResponse) => {
    if (pageType === "create") {
      const formdata = new FormData();
      for (const key in data) {
        formdata.append(key, data[key]);
      }
      await handleSubmitResponse({
        serviceCb: async () => {
          let addservice = await deckCreateService({
            data: formdata,
          });
          return addservice;
        },
        successCb: (data) => {
          navigate("/");
        },
      });
    }
    else if(pageType === "edit"){
      seteditState({
        open: true,
        type: "deckupdate",
        data: "Deck",
      });
    }
  };

  const handleReset = () => {
    reset();
    setSelectedImage(null);
  };

  const validateImage = (imge) => {
    const maxSize = 1024 * 1024;

    if (imge.size > maxSize) {
      setError("image", {
        type: "maxSize",
        message: `Image size exceeds the 1MB limit`,
      });
      return false;
    }
    return true;
  };

  const validateFile = (file) => {
    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("file", {
        type: "maxSize",
        message: `File size exceeds the 2MB limit`,
      });
      return false;
    }

    return true;
  };

  const handleImgUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event) => {
      const imge = event.target.files[0];
      if (imge) {
        if (!validateImage(imge)) {
          return;
        } else {
          setError("image", "");
          register("image");
          setValue("image", imge);
          const reader = new FileReader();
          reader.onload = () => {
            if (pageType == "edit" && selectedImage) {
              setUpdatedImage(reader.result);
            } else if (pageType == "edit" && !selectedImage) {
              setUpdatedImage(reader.result);
              setUpdateState({
                type: "DeckNewImage",
                open: true,
                image: imge,
                deckId: deckId,
                setUpdatedImage,
                setError,
              });
            } else {
              setSelectedImage(reader.result);
            }
          };
          reader.readAsDataURL(imge);
        }
      }
    };

    input.click();
  };


  const handleImageDelete = async () => {
    if (selectedImage && pageType == "edit") {
      setDeleteState({
        type: "DeckDeleteImage",
        open: true,
        deckId: deckId,
        imageId: imageId,
        setSelectedImage: setSelectedImage,
      });
    } else {
      setSelectedImage(null);
    }
  };

  const handleImageUpdate = async () => {
    setUpdateState({
      type: "DeckUpdateImage",
      open: true,
      deckId: deckId,
      imageId: imageId,
      setUpdatedImage: setUpdatedImage,
      errors,
      setError,
    });
  };


  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xls,.xlsx";

    input.onchange = (event) => {
      const file = event.target.files[0];
      setValue("file", file);
      if (file) {
        const isValidFileSize = validateFile(file);

        if (isValidFileSize) {
          const reader = new FileReader();
          reader.onload = () => {
            const filename = file.name;
            setFileName(filename);

            if (errors.file) {
              setError("file", { message: null });
            }
          };
          reader.readAsText(file);
        }
      }
    };
    input.click();
  };

  useEffect(() => {
    if (deckId) {
      (async () => {
        var dta = await getDeckService(deckId);

        reset(dta.body?.value);
        setSelectedImage(dta.body.value?.deckImage);
        setImageId(dta.body.value?.deckImageId);
        setDifficulty(dta.body.value?.difficultyLevel);
      })();
    }
  }, [deckId]);

  return (
    <HandleSubmitComponent
      successComponent={(handleServiceCall) => {
        return (
          <Container maxWidth={"xl"}>
            <DeletePopup
              deleteState={deleteState}
              setDeleteState={setDeleteState}
            />
            <UpdateImagePopup
              updateState={updateState}
              setUpdateState={setUpdateState}
              ImgUpload={handleImgUpload}
              updatedImage={updatedImage}
              getValues={getValues}
              screenType={"deckUpdate"}
            />
            <UpdatePopup
              setUpdateState={seteditState}
              updateState={editState}
              getValues={getValues}
            />
            <Grid container justifyContent="center">
              <Grid
                item
                lg={9.5}
                md={10}
                sm={11}
                xs={11}
                my={5}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <Typography sx={{ fontSize: { xs: "1.3rem", sm: "1.8rem" } }}>
                  {pageType == "edit" ? "Edit Deck" : "Create Deck"}
                </Typography>
                <Button
                  variant="contained"
                  color="yellowButtonColor"
                  size="small"
                  sx={{
                    textTransform: "none",
                    fontSize: { xs: "0.7rem", sm: "1rem" },
                  }}
                  onClick={() => navigate("/cardImageLinkScreen")}
                >
                  + Create Image link
                </Button>
              </Grid>

              <Grid
                component="form"
                onSubmit={handleSubmit((data) => {
                  onSubmit(data, handleServiceCall);
                })}
                container
                justifyContent="space-between"
                lg={9.5}
                md={10}
                sm={11}
                xs={11}
                rowGap={4}
              >
                {/* deck name */}
                <Grid
                  container
                  lg={5.7}
                  md={5.7}
                  sm={5.5}
                  xs={12}
                  rowGap={2}
                  flexDirection="column"
                >
                  <Grid item>
                    <Typography sx={{ fontSize: { xs: ".9rem", sm: "1rem" } }}>
                      Deck Name*
                    </Typography>
                  </Grid>
                  <FormControl>
                    <Grid item>
                      <TextField
                        {...register("deckName")}
                        error={!!errors.deckName}
                        helperText={errors.deckName?.message}
                        inputProps={{ style: { backgroundColor: "white" } }}
                        fullWidth
                        placeholder="Enter Deck Name"
                        size="small"
                      />
                    </Grid>
                  </FormControl>
                </Grid>

                <Grid
                  container
                  lg={5.7}
                  md={5.7}
                  sm={5.5}
                  xs={12}
                  rowGap={2}
                  flexDirection="column"
                >
                  <Grid item>
                    <Typography sx={{ fontSize: { xs: ".9rem", sm: "1rem" } }}>
                      Difficulty Level*
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Select
                      size="small"
                      fullWidth
                      {...register("difficultyLevel")}
                      displayEmpty
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      style={{ backgroundColor: 'white' }}
                    >
                      <MenuItem value="" disabled>
                        Select difficulty Level
                      </MenuItem>
                      <MenuItem value="Easy">Easy</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Hard">Hard</MenuItem>
                    </Select>
                    <Typography
                      sx={{
                        color: "#d32f2f",
                        fontFamily: "Open Sans",
                        fontWeight: "400",
                        fontSize: "0.75rem",
                      }}
                    >
                      {errors.difficultyLevel && errors.difficultyLevel.message}
                    </Typography>
                  </Grid>
                </Grid>

                {/* subject */}
                <Grid
                  container
                  lg={5.7}
                  md={5.7}
                  sm={5.5}
                  xs={12}
                  rowGap={2}
                  flexDirection="column"
                >
                  <Grid item>
                    <Typography sx={{ fontSize: { xs: ".9rem", sm: "1rem" } }}>
                      Subject*
                    </Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      {...register("subject")}
                      inputProps={{ style: { backgroundColor: "white" } }}
                      fullWidth
                      error={!!errors.subject}
                      helperText={errors.subject?.message}
                      size="small"
                    />
                  </Grid>
                </Grid>

                {/* topic and sub topic */}
                <Grid
                  container
                  lg={5.7}
                  md={5.7}
                  sm={5.5}
                  xs={12}
                  rowGap={2}
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <Grid
                    container
                    lg={5.8}
                    md={5.8}
                    sm={5.8}
                    rowGap={2}
                    flexDirection="column"
                  >
                    <Grid item>
                      <Typography
                        sx={{ fontSize: { xs: ".9rem", sm: "1rem" } }}
                      >
                        Topic*
                      </Typography>
                    </Grid>
                    <Grid item>
                      <TextField
                        {...register("topic")}
                        inputProps={{ style: { backgroundColor: "white" } }}
                        fullWidth
                        error={!!errors.topic}
                        helperText={errors.topic?.message}
                        size="small"
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    lg={5.8}
                    md={5.8}
                    sm={5.8}
                    rowGap={2}
                    flexDirection="column"
                  >
                    <Grid item>
                      <Typography
                        sx={{ fontSize: { xs: ".9rem", sm: "1rem" } }}
                      >
                        Sub Topic
                      </Typography>
                    </Grid>
                    <Grid item>
                      <TextField
                        {...register("subTopic")}
                        inputProps={{ style: { backgroundColor: "white" } }}
                        fullWidth
                        error={!!errors.subTopic}
                        helperText={errors.subTopic?.message}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* deck name */}
                <Grid
                  container
                  lg={5.7}
                  md={5.7}
                  sm={5.5}
                  xs={12}
                  rowGap={2}
                  flexDirection="column"
                >
                  <Grid item>
                    <Typography sx={{ fontSize: { xs: ".9rem", sm: "1rem" } }}>
                      Exam
                    </Typography>
                  </Grid>
                  <FormControl>
                    <Grid item>
                      <TextField
                        {...register("exam")}
                        error={!!errors.exam}
                        helperText={errors.exam?.message}
                        inputProps={{ style: { backgroundColor: "white" } }}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                  </FormControl>
                </Grid>

                {/* difficultyLevel level */}
                <Grid
                  container
                  lg={5.7}
                  md={5.7}
                  sm={5.5}
                  xs={12}
                  rowGap={2}
                  flexDirection="column"
                >
                  <Grid item>
                    <Typography sx={{ fontSize: { xs: ".9rem", sm: "1rem" } }}>
                      Standard
                    </Typography>
                  </Grid>

                  <FormControl>
                    <Grid item>
                      <TextField
                        {...register("standard")}
                        error={!!errors.standard}
                        helperText={errors.standard?.message}
                        inputProps={{ style: { backgroundColor: "white" } }}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                  </FormControl>
                </Grid>

                {/* card cover image */}
                <Grid
                  item
                  container
                  lg={5.7}
                  md={5.7}
                  sm={12}
                  xs={12}
                  rowGap={2}
                  flexDirection="column"
                >
                  <Grid item>
                    <Typography sx={{ fontSize: { xs: ".9rem", sm: "1rem" } }}>
                      Cover Image
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Box
                      border="1px solid #D3D8DE"
                      borderRadius={2}
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      bgcolor={"white"}
                    >
                      {!selectedImage ? (
                        <>
                          <Typography
                            sx={{ mt: 3 }}
                            fontSize={mobileMatches ? ".8rem" : "1rem"}
                          >
                            Click or drag your file to upload
                          </Typography>
                          <Typography
                            color="grey"
                            fontSize={mobileMatches ? ".8rem" : "1rem"}
                          >
                            Maximum size 1MB
                          </Typography>
                          {/* <Typography
                            color="grey"
                            fontSize={mobileMatches ? ".8rem" : "1rem"}
                          >
                            Accepted File Type: .JPEG & PNG only.
                          </Typography> */}
                          <IconButton type="button" onClick={handleImgUpload}>
                            <Image
                              sx={{
                                fontSize: "1.7rem",
                                color: "#F1A628",
                                mb: 3,
                              }}
                            />
                          </IconButton>

                          {errors.image && (
                            <Typography color="red">
                              {errors.image.message}
                            </Typography>
                          )}
                        </>
                      ) : (
                        <>
                          <Box
                            position="relative"
                            width="100%"
                            height={tabletMatches ? "200px" : "300px"}
                            sx={{
                              borderRadius: 2,
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={selectedImage}
                              alt="Preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 3,
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                top: 5,
                                right: 10,
                                display: "flex",
                                gap: 1,
                                zIndex: 1,
                              }}
                            >
                              {pageType == "edit" && (
                                <IconButton
                                  sx={{ background: "#D9D9D9" }}
                                  onClick={handleImageUpdate}
                                >
                                  <BorderColorOutlinedIcon
                                    sx={{
                                      fontSize: "1.5rem",
                                      color: "#39a1cd",
                                    }}
                                  />
                                </IconButton>
                              )}
                              <IconButton
                                sx={{ background: "#D9D9D9" }}
                                onClick={handleImageDelete}
                              >
                                <Delete
                                  sx={{ fontSize: "1.5rem", color: "#f63f3f" }}
                                />
                              </IconButton>
                            </Box>
                          </Box>
                        </>
                      )}
                    </Box>
                    {/* {updatedImage == null && selectedImage && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleImageUpdate}
                      >
                        update image
                      </Button>
                    )} */}
                  </Grid>
                </Grid>

                {pageType == "create" && (
                  <Grid
                    item
                    container
                    lg={5.7}
                    md={5.7}
                    sm={12}
                    xs={12}
                    rowGap={2}
                    flexDirection="column"
                  >
                    <Grid
                      item
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Typography
                        sx={{ fontSize: { xs: ".9rem", sm: "1rem" } }}
                      >
                        Cards Upload*
                      </Typography>
                      <Typography
                        component={"a"}
                        download={true}
                        href={CardExcelTemplateUrl}
                        sx={{
                          color: "#EF6201",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          fontSize: { xs: ".8rem", sm: "1rem" },
                        }}
                      >
                        <FileDownloadOutlinedIcon /> Download Template
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Box
                        border="1px solid #D3D8DE"
                        // height={150}
                        borderRadius={2}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        bgcolor={"white"}
                      >
                        <Typography
                          fontSize={mobileMatches ? ".8rem" : "1rem"}
                          sx={{ mt: 3 }}
                        >
                          Click or drag your file to upload
                        </Typography>
                        {/* <Typography color="grey" fontSize={mobileMatches ? ".8rem" : "1rem"}>Maximum size 10MB</Typography> */}
                        <Typography
                          color="grey"
                          fontSize={mobileMatches ? ".8rem" : "1rem"}
                        >
                          Accepted File Type:.XLS .XLSX
                        </Typography>

                        <IconButton
                          type="button"
                          onClick={handleFileUpload}
                          sx={{ mb: 3 }}
                        >
                          <DriveFolderUpload
                            sx={{ fontSize: "1.7rem", color: "#F1A628" }}
                          />
                        </IconButton>
                        {fileName && <Typography>{fileName}</Typography>}
                        {errors.file && (
                          <Typography color="red">
                            {errors.file.message}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                )}

                <Grid
                  container
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  display="flex"
                  justifyContent="flex-end"
                  columnGap={2}
                  sx={{ mb: 3 }}
                >
                  <Grid item>
                    <Button
                      onClick={() => {
                        handleReset();
                        pageType == 'edit' ? navigate("/viewDeck", { state: {deckId:deckId} }) : navigate('/');
                      }}
                      size="medium"
                      variant="outlined"
                      sx={{
                        borderColor: "black",
                        color: "black",
                        textTransform: "none",
                        px: 3,
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item>
                    
                    <Button
                      type="submit"
                      size="medium"
                      variant="contained"
                      sx={{
                        background: "black",
                        color: "#fff",
                        textTransform: "none",
                        px: 3,
                      }}
                    >
                      {pageType == "edit" ? "Update" : "Create"}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        );
      }}
    />
  );
};

export default CreateDeck;
