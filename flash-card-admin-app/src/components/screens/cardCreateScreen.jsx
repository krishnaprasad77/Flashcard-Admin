import {
  Button,
  Grid,
  FormControl,
  Radio,
  Typography,
  TextField,
  IconButton,
  Container,
  useMediaQuery,
  Box,
  InputAdornment,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation, useNavigate } from "react-router-dom";
import { HandleSubmitComponent } from "../common/handle_submit_component";
import imageUpload from "../../assets/images/imageUpload.png";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/RichText.css";
import { createCardService, getCardService } from "../../services/card_service";
import DeletePopup from "../common/deletePopup";
import { UpdatePopup } from "../common/updatePopup";
import { UpdateImagePopup } from "../common/ImageUpdatePopup";

const AddCardScreen = () => {
  const solution = ["A", "B", "C", "D", "E"];
  const [images, setImages] = useState(new Map());
  const [deleteState, setDeleteState] = useState("");

  const [updatePopup, setUpdatePopup] = useState("");

  const [updateState, setUpdateState] = useState("");
  const [updatedImage, setUpdatedImage] = useState("");

  const [responseData, setResponseData] = useState("");

  const isMedium = useMediaQuery("(max-width: 1200px)");
  const isSmall = useMediaQuery("(max-width: 600px)");
  const isTab = useMediaQuery("(max-width: 900px)");

  const schema = yup.object().shape({
    question: yup.string().required("*Please enter the question"),
    questionType: yup.string().required("*Please choose a answer type"),
    solution: yup.string().required("*Please enter the correct answer"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    setError,
    getValues,
    watch,
  } = useForm({ resolver: yupResolver(schema) });
  const location = useLocation();
  const deckId = location.state.deckId;
  const cardId = location.state.cardId;

  useEffect(() => {
    if (cardId) {
      (async () => {
        const response = await getCardService(cardId);
        if (response.header.code === 600) {
          //NEED TO CHANGE THIS
          const values = response.body.value;
          
          setResponseData(values);
          reset(values);
          
          const options = getValues("options");
          images.set("questionImage", values.questionImage);
          images.set("hintImage", values.hintImage);
          for (var i = 0; i < options.length; i++) {
            setValue(`option${i + 1}`, options[i].text);
            setValue(`option${i + 1}Image`, options[i].image);
            images.set(`option${i + 1}Image`, options[i].image);
          }
          
        }
      })();
    } else {
      setValue("options", ["", ""]);
    }
  }, [cardId, deckId]);

  useEffect(() => {
    
  }, [errors]);

  const watchQuestionType = watch("questionType");
  const watchSolution = watch("solution");
  const watchOptions = watch("options");

  const handleSetText = (name, value) => {
    setValue(name, value);
  };

  const handleDecreaseOption = () => {
    let options = getValues("options");
    if (cardId && options.length === responseData.options.length) {
      let index = options.length - 1;
      if (getValues("options").length == 2) {
        setError("solution", {
          type: "length",
          message: "*Minimum two options are required",
        });
        return;
      }
      if (getValues("solution") === solution[index]) {
        setError("solution", {
          type: "mandatory",
          message: "*Correct answer cannot be deleted",
        });
        return;
      }
      setDeleteState({
        open: true,
        imageId: options[index].imageId,
        cardId,
        deckId,
        optType: `option${index + 1}Image`,
        type: "cardOptionDelete",
        setValue,
        getValues,
        index,
        images,
        solution,
        data: "Option",
      });
      return;
    }

    let temp = [...options];
    let length = temp.length;
    if (length > 2) {
      setValue(`option${length}`, null);
      setValue(`option${length}Image`, null);
      images.delete(`option${length}Image`);
      temp.pop();
      setValue("options", temp);
    }
    
  };

  const handleIncreaseOption = () => {
    let temp = getValues("options");
    const number = temp.length + 1;
    if (number <= 5) {
      if (temp.length < number) {
        const entries = number - temp.length;
        for (let i = 0; i < entries; i++) {
          temp.push("");
        }
      }
      setValue("options", [...temp]);
      
    }
  };

  const handleDeleteOption = (index, imageId, optType) => {
    //for update card
    if (cardId && responseData.options[index]) {
      if (getValues("solution") === solution[index]) {
        setError("solution", {
          type: "mandatory",
          message: "*Correct answer cannot be deleted",
        });
        return;
      }
      if (getValues("options").length == 2) {
        setError("solution", {
          type: "length",
          message: "*Minimum two options are required",
        });
        return;
      }
      setDeleteState({
        open: true,
        imageId,
        cardId,
        deckId,
        optType,
        type: "cardOptionDelete",
        setValue,
        getValues,
        index,
        images,
        solution,
        data: "Option",
      });
      return;
    }

    // for create card
    let options = getValues("options");
    if (options.length > 2) {
      setValue(`option${index + 1}`, null);
      setValue(`option${index + 1}Image`, null);
      images.delete(`option${index + 1}Image`);
      for (let i = index; i < options.length; i++) {
        setValue(`option${i + 1}`, getValues(`option${i + 2}`));
        setValue(`option${i + 1}Image`, getValues(`option${i + 2}Image`));
        images.set(`option${i + 1}Image`, images.get(`option${i + 2}Image`));
      }
      let temp = [...options];
      temp.splice(index, 1);
      if (getValues("solution") === solution[index]) {
        setValue("solution", null);
      }
      setValue("options", temp);
    }
  };

  const handleDeleteImage = (imageId, cardId, type) => {
    if (responseData) {
      setDeleteState({
        open: true,
        type: "cardImageDelete",
        imageId: imageId,
        cardId: cardId,
        optType: type,
        data: "Card",
        setValue: setValue,
        setImages: setImages,
        images: images,
      });
    } else {
      
      setValue(type, "");
      let temp = images;
      temp.delete(type);
      setImages(temp);
      //For re-rendering
      const opt = getValues("options");
      setValue("options", opt);
    }
  };

  const reader = new FileReader();

  const handleImageUpload = (name) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (event) => {
      const imge = event.target.files[0];
      if (imge) {
        if (imge.size <= 1024 * 1024) {
          if (!cardId) {
            
            const reader = new FileReader();
            reader.onload = (event) => {
              const url = event.target.result;
              const temp = new Map([...images]);
              temp.set(name, url);
              setImages(temp);

              register(name);
              setValue(name, imge);
              
            };
            reader.readAsDataURL(imge);
          } else {
            const reader = new FileReader();
            reader.onload = (event) => {
              setUpdatedImage(event.target.result);
            };
            reader.readAsDataURL(imge);
            setUpdateState({
              open: true,
              type: "cardUploadImage",
              cardId: responseData.cardId,
              image: imge,
              imageType: name,
              setUpdatedImage,
              setError,
              errors,
            });
          }
        } else {
          setError(name, {
            type: "maxSize",
            message: "*max size limit is 1mb",
          });
          return;
        }
      }
    };
    input.click();
    
  };

  const handleEditImage = (name, imageId) => {
    
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (event) => {
      const imge = event.target.files[0];
      if (imge) {
        if (imge.size <= 1024 * 1024) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setUpdatedImage(event.target.result);
          };
          reader.readAsDataURL(imge);
          setUpdateState({
            open: true,
            type: "updateCardImage",
            cardId: responseData.cardId,
            image: imge,
            imageType: name,
            imageId: imageId,
            setUpdatedImage,
            setError,
            errors,
          });
        } else {
          setError(name, {
            type: "maxSize",
            message: "*max size limit is 1mb",
          });
          
          return;
        }
      }
    };
    input.click();
    
  };

  const handleEditImageHelper = (name, imageId) => {
    setUpdateState({
      open: true,
      imageType: name,
      cardImgId: imageId,
      setUpdatedImage,
      errors,
      setError,
    });
  };

  let navigate = useNavigate();

  const validateOptions = (data) => {
    let isValid = true;
    if (getValues("questionType") === "multiple") {
      for (let i = 0; i < data.options.length; i++) {
        
        if (getValues(`option${i + 1}`) || getValues(`option${i + 1}Image`)) {
          continue;
        } else {
          setError(`option${i + 1}`, {
            type: "maxSize",
            message: "*Either Text or Image is mandatory",
          });
          isValid = false;
        }
      }
      
    }
    return isValid;
  };

  const onSubmit = async (data, handleSubmitResponse) => {
    if (!validateOptions(data)) {
      return;
    }
    if (getValues("question").includes("<p><br></p>")) {
      setError("question", {
        type: "required",
        message: "*Please enter the question",
      });
      return;
    }
    if (cardId) {
      //update card
      const requestBody = {
        question: data.question,
        solution: data.solution,
        hint: data.hintText,
        cardId: cardId,
        deckId: deckId,
      };
      const opt = getValues("options");
      for (let i = 0; i < opt.length; i++) {
        
        requestBody[`option${i + 1}`] = getValues(`option${i + 1}`);
      }
      
      setUpdatePopup({
        requestBody: requestBody,
        open: true,
        type: "cardUpdate",
        data: "Card",
      });
      return;
    }
    await handleSubmitResponse({
      serviceCb: async () => {
        
        //create card

        data["deckId"] = deckId;
        const formdata = new FormData();
        for (const key in data) {
          
          formdata.append(key, data[key]);
        }
        if (formdata.get("questionType") === "single") {
          const opt = getValues("options");
          for (let i = 0; i < opt.length; i++) {
            formdata.delete(`option${i + 1}`);
            formdata.delete(`option${i + 1}Image`);
          }
        }
        formdata.delete("options");
        let addCard = await createCardService({
          data: formdata,
        });
        return addCard;
      },
      successCb: (data) => {
        navigate("/viewDeck", { state: { deckId: deckId } });
      },
    });
  };

  return (
    <HandleSubmitComponent
      successComponent={(handleServiceCall) => {
        return (
          <Container maxWidth={isMedium ? "md" : "lg"}>
            <form
              onSubmit={handleSubmit((data) => {
                onSubmit(data, handleServiceCall);
              })}
            >
              <Grid container flexDirection={"column"} pt={{ xs: 2 }}>
                <DeletePopup
                  deleteState={deleteState}
                  setDeleteState={setDeleteState}
                />

                <UpdateImagePopup
                  updateState={updateState}
                  setUpdateState={setUpdateState}
                  screenType="card"
                  updatedImage={updatedImage}
                  ImgUpload={handleEditImage}
                  errors={errors}
                />

                <UpdatePopup
                  updateState={updatePopup}
                  setUpdateState={setUpdatePopup}
                />
                <FormControl>
                  <Typography variant="h5" marginBottom={2}>
                    {!cardId ? "Create Card" : "Edit Card"}
                  </Typography>
                  <Grid
                    item
                    container
                    justifyContent={"space-between"}
                    marginBottom={{ sm: 2, lg: 2 }}
                  >
                    <Grid
                      item
                      container
                      flexDirection={"column"}
                      xs={isSmall ? 12 : 7}
                      md={8.5}
                    >
                      <Grid item container justifyContent={"space-between"}>
                        <Typography display={"inline"}>
                          Question Text*
                        </Typography>
                        {errors.question && (
                          <Typography display={"inline"} color="#d32f2f">
                            {errors.question?.message}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item>
                        <ReactQuill
                          value={getValues("question")}
                          onChange={(value) => {
                            setError("question", undefined);
                            handleSetText("question", value);
                          }}
                          className="custom-editor"
                          placeholder="Type your question..."
                          style={{
                            height: isMedium ? "5.1rem" : "6.7rem",
                          }}
                          modules={{
                            toolbar: [
                              ["bold", "italic", "underline"],
                              [{ list: "ordered" }, { list: "bullet" }],
                            ],
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      container
                      flexDirection={"column"}
                      borderRadius={2}
                      xs={isSmall ? 12 : 4}
                      mt={{ xs: isSmall ? 5 : 0, md: 0 }}
                      md={3}
                    >
                      <Typography display={"inline"}>Question Image</Typography>
                      {!images.get("questionImage") ? (
                        <Box
                          bgcolor={"#ffffff"}
                          height={isMedium ? "7.75rem" : "9.45rem"}
                          borderRadius={1.2}
                          border={"2px solid #D9D9D9"}
                          display={"flex"}
                          flexDirection={"column"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          onClick={() => handleImageUpload("questionImage")}
                        >
                          <img src={imageUpload} />
                          {errors?.questionImage && (
                            <Typography display="inline" color="#d32f2f">
                              {errors.questionImage?.message}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Box
                          height={isMedium ? "7.75rem" : "9.45rem"}
                          position={"relative"}
                        >
                          <img
                            src={images.get("questionImage")}
                            width={"100%"}
                            height={"100%"}
                          />
                          {cardId && (
                            <IconButton
                              sx={{
                                position: "absolute",
                                zIndex: 1,
                                top: 5,
                                right: 40,
                                color: "#39A1CD",
                                backgroundColor: "#D9D9D9",
                              }}
                              size={"small"}
                              onClick={() => {
                                handleEditImageHelper(
                                  "questionImage",
                                  responseData.questionImageId
                                );
                              }}
                            >
                              <BorderColorOutlinedIcon fontSize="4" />
                            </IconButton>
                          )}
                          <IconButton
                            sx={{
                              position: "absolute",
                              zIndex: 1,
                              top: 5,
                              right: 5,
                              color: "#F63F3F",
                              backgroundColor: "#D9D9D9",
                            }}
                            size={"small"}
                            onClick={() => {
                              handleDeleteImage(
                                responseData?.questionImageId,
                                responseData?.cardId,
                                "questionImage"
                              );
                            }}
                          >
                            <DeleteOutlineOutlinedIcon fontSize="4" />
                          </IconButton>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                  {errors.questionType && (
                    <Grid item>
                      <Typography display="inline" color="#d32f2f">
                        {errors.questionType?.message}
                      </Typography>
                    </Grid>
                  )}
                  <Grid
                    item
                    marginBottom={{ sm: 1, lg: 2 }}
                    display={cardId ? "none" : "block"}
                  >
                    <Typography display={"inline"}>Answer Type</Typography>
                    <Radio
                      value="multiple"
                      checked={watchQuestionType === "multiple"}
                      {...register("questionType")}
                    />
                    <Typography display={"inline"}>MCQ</Typography>
                    <Radio
                      value="single"
                      checked={watchQuestionType === "single"}
                      {...register("questionType")}
                    />
                    <Typography display={"inline"}>
                      Fill in the blank
                    </Typography>
                  </Grid>

                  {/* MCQ - add options */}
                  {watchQuestionType === "multiple" && (
                    <Grid item container marginBottom={1} alignItems={"center"}>
                      <Grid item xs={6} md={2} lg={2}>
                        <Typography variant="h6" display={"inline"}>
                          Total Options
                        </Typography>
                      </Grid>
                      <Grid item container xs={6} md={3} lg={3}>
                        <Grid item xs={2.5} sm={1} md={2.7} lg={2}>
                          {getValues("options") && (
                            <TextField
                              variant="outlined"
                              value={getValues("options").length}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <Grid
                                      item
                                      display={"flex"}
                                      flexDirection={"column"}
                                      sx={{
                                        backgroundColor: "#4E4E4E",
                                        width: "40px",
                                        borderRadius: "0 10px 10px 0px",
                                      }}
                                    >
                                      <IconButton
                                        onClick={handleIncreaseOption}
                                        sx={{ p: "0px" }}
                                      >
                                        <ExpandLessIcon
                                          sx={{ color: "#fff" }}
                                        />
                                      </IconButton>
                                      <IconButton
                                        onClick={handleDecreaseOption}
                                        sx={{ p: "0px" }}
                                      >
                                        <ExpandMoreIcon
                                          sx={{ color: "#fff" }}
                                        />
                                      </IconButton>
                                    </Grid>
                                  </InputAdornment>
                                ),
                                style: {
                                  width: "90px",
                                  height: "48px",
                                  paddingRight: "0",
                                  borderRadius: "10px",
                                },
                              }}
                            />
                          )}
                        </Grid>
                      </Grid>
                      <Grid item>
                        {errors.questionType && (
                          <Typography>{errors.questionType.message}</Typography>
                        )}
                      </Grid>
                    </Grid>
                  )}

                  {/* MCQ answer type - text with image */}
                  {watchQuestionType === "multiple" &&
                    watchOptions.map((value, index) => (
                      <>
                        {errors[`option${index + 1}`] && (
                          <Grid item>
                            <Typography textAlign={"left"} color="#d32f2f">
                              {errors[`option${index + 1}`]?.message}
                            </Typography>
                          </Grid>
                        )}
                        {`option${index + 1}` === "option1" &&
                          errors.solution && (
                            <Grid item>
                              <Typography color="#d32f2f" textAlign={"right"}>
                                {errors.solution.message}
                              </Typography>
                            </Grid>
                          )}
                        {errors[`option${index + 1}Image`] && (
                          <Grid item>
                            <Typography textAlign={"right"} color="#d32f2f">
                              {errors[`option${index + 1}Image`]?.message}
                            </Typography>
                          </Grid>
                        )}

                        <Grid item container marginBottom={0.5} key={index}>
                          <Grid item xs={8} sm={7} md={8.7} lg={9}>
                            <TextField
                              fullWidth
                              multiline={true}
                              rows={!isMedium ? 2 : 1}
                              sx={{ backgroundColor: "white" }}
                              {...register(`option${index + 1}`)}
                            />
                          </Grid>
                          <Grid item xs={4} sm={2} md={1.2} lg={1.2}>
                            {!images.get(`option${index + 1}Image`) ? (
                              <Box
                                bgcolor={"#ffffff"}
                                height={{
                                  xs: "3.5rem",
                                  md: "3.5rem",
                                  lg: "5rem",
                                }}
                                borderRadius={1.2}
                                border={"2px solid #D9D9D9"}
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                onClick={() =>
                                  handleImageUpload(`option${index + 1}Image`)
                                }
                              >
                                <img src={imageUpload} />
                              </Box>
                            ) : (
                              <Box
                                height={isMedium ? "3.5rem" : "5rem"}
                                position={"relative"}
                              >
                                <img
                                  src={images.get(`option${index + 1}Image`)}
                                  width={"100%"}
                                  height={"100%"}
                                />
                                {cardId && (
                                  <IconButton
                                    sx={{
                                      position: "absolute",
                                      zIndex: 1,
                                      top: 5,
                                      right: 40,
                                      color: "#39A1CD",
                                      backgroundColor: "#D9D9D9",
                                    }}
                                    size={"small"}
                                    onClick={() => {
                                      handleEditImageHelper(
                                        `option${index + 1}Image`,
                                        value.imageId
                                      );
                                    }}
                                  >
                                    <BorderColorOutlinedIcon fontSize="4" />
                                  </IconButton>
                                )}
                                <IconButton
                                  sx={{
                                    position: "absolute",
                                    zIndex: 1,
                                    top: 5,
                                    right: 5,
                                    color: "#F63F3F",
                                    backgroundColor: "#D9D9D9",
                                  }}
                                  size="small"
                                  onClick={() => {
                                    let i = index + 1;
                                    handleDeleteImage(
                                      responseData
                                        ? responseData.options[index].imageId
                                        : undefined,
                                      cardId,
                                      `option${i}Image`
                                    );
                                  }}
                                >
                                  <DeleteOutlineOutlinedIcon fontSize="4" />
                                </IconButton>
                              </Box>
                            )}
                          </Grid>
                          <Grid
                            item
                            container
                            xs={6}
                            sm={2}
                            md={1.55}
                            lg={1.35}
                            border={1}
                            borderColor={"#D9D9D9"}
                            borderRadius={1}
                            alignItems={"center"}
                            sx={{ backgroundColor: "white" }}
                          >
                            <Radio
                              value={solution[index]}
                              checked={watchSolution === solution[index]}
                              {...register("solution")}
                            />
                            <Typography display={"inline"}>Correct</Typography>
                          </Grid>
                          <Grid
                            item
                            container
                            xs={2}
                            sm={1}
                            md={0.55}
                            lg={0.45}
                            border={1}
                            borderColor={"#D9D9D9"}
                            borderRadius={1}
                            sx={{ backgroundColor: "white" }}
                          >
                            <IconButton
                              onClick={() =>
                                handleDeleteOption(
                                  index,
                                  responseData
                                    ? responseData.options[index]?.imageId
                                    : undefined,
                                  `option${index + 1}Image`
                                )
                              }
                              sx={{ color: "#F63F3F" }}
                            >
                              <DeleteOutlineOutlinedIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </>
                    ))}

                  {/* Fill in the blank - answer   */}
                  {watchQuestionType === "single" && (
                    <Grid
                      item
                      container
                      lg={12}
                      marginBottom={{ sm: 1, lg: 2 }}
                      flexDirection={"column"}
                    >
                      <Grid item>Answer</Grid>
                      <Grid item>
                        <TextField
                          placeholder="Type your answer"
                          fullWidth
                          sx={{ backgroundColor: "white" }}
                          {...register("solution")}
                          error={!!errors.solution}
                          helperText={errors.solution?.message}
                        />
                      </Grid>
                    </Grid>
                  )}

                  <Grid item container justifyContent={"space-between"}>
                    <Grid item xs={isSmall ? 12 : 7} md={8.5}>
                      <Grid item>
                        <Typography>Hint Text</Typography>
                      </Grid>
                      <Grid item>
                        <ReactQuill
                          value={getValues("hintText")}
                          onChange={(value) => handleSetText("hintText", value)}
                          className="custom-editor"
                          placeholder="Type your question..."
                          style={{
                            height: isMedium ? "5.1rem" : "6.7rem",
                          }}
                          modules={{
                            toolbar: [
                              ["bold", "italic", "underline"],
                              [{ list: "ordered" }, { list: "bullet" }],
                            ],
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Grid
                      item
                      container
                      flexDirection={"column"}
                      borderRadius={2}
                      xs={isSmall ? 12 : 4}
                      mt={{ xs: isSmall ? 5 : 0, md: 0 }}
                      md={3}
                    >
                      <Grid item>
                        <Typography>Hint Image</Typography>
                      </Grid>
                      {!images.get("hintImage") ? (
                        <Box
                          bgcolor={"#ffffff"}
                          height={isMedium ? "7.75rem" : "9.45rem"}
                          borderRadius={1.2}
                          border={"2px solid #D9D9D9"}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          flexDirection={"column"}
                          onClick={() => handleImageUpload("hintImage")}
                        >
                          <img src={imageUpload} />
                          {errors?.hintImage && (
                            <Typography display="inline" color="#d32f2f">
                              {errors.questionImage?.message}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Box
                          height={isMedium ? "7.75rem" : "9.45rem"}
                          position={"relative"}
                        >
                          <img
                            src={images.get("hintImage")}
                            width={"100%"}
                            height={"100%"}
                          />
                          {cardId && (
                            <IconButton
                              sx={{
                                position: "absolute",
                                zIndex: 1,
                                top: 5,
                                right: 40,
                                color: "#39A1CD",
                                backgroundColor: "#D9D9D9",
                              }}
                              size={"small"}
                              onClick={() => {
                                handleEditImage(
                                  "hintImage",
                                  responseData.hintImageId
                                );
                              }}
                            >
                              <BorderColorOutlinedIcon fontSize="4" />
                            </IconButton>
                          )}
                          <IconButton
                            sx={{
                              position: "absolute",
                              zIndex: 1,
                              top: 5,
                              right: 5,
                              color: "#F63F3F",
                              backgroundColor: "#D9D9D9",
                            }}
                            size={"small"}
                            onClick={() => {
                              handleDeleteImage(
                                responseData.hintImageId,
                                responseData.cardId,
                                "hintImage"
                              );
                            }}
                          >
                            <DeleteOutlineOutlinedIcon fontSize="4" />
                          </IconButton>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    justifyContent={"flex-end"}
                    marginTop={{ xs: isTab ? 3 : 2, md: 4, lg: 8 }}
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        marginRight: 1,
                        color: "#2A2A2A",
                        borderColor: "#2A2A2A",
                      }}
                      onClick={() => {
                        reset();
                        navigate("/viewDeck", { state: { deckId: deckId } });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="blackButtonColor"
                      type="submit"
                      sx={{ color: "white" }}
                    >
                      {cardId ? "Update" : "Add"}
                    </Button>
                  </Grid>
                </FormControl>
              </Grid>
            </form>
          </Container>
        );
      }}
    />
  );
};

export default AddCardScreen;
