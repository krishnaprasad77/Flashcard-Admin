import {
  ExpandMore,
  ToggleOffRounded,
  ToggleOnRounded,
  RemoveRedEyeOutlined,
  InsertEmoticonOutlined,
  AspectRatio,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Modal,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  RadioGroup,
  Typography,
  Radio,
  useMediaQuery,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HandleViewComponent from "../common/handle_view_component";
import {
  hidecardservice,
  hidedeckservice,
  viewdeckservice,
} from "../../services/viewdeckService";
import { HandleSubmitComponent } from "../common/handle_submit_component";
import DeletePopup from "../common/deletePopup";
import HidePopup from "../common/hide_popup";
import NoDataPage from "../common/nodata";

export default function ViewDeck() {
  const [flip, setFlip] = useState("");
  const [toggle, setToggle] = useState({
    show: true,
    deckId: "",
    cardId: "",
    open: false,
    type: "",
    visibility: "",
  });

  const [deleteState, setDeleteState] = useState({
    open: false,
    deckId: "",
    pageType: "deckView",
    cardId: "",
    data: "", //deck
    value: "", //deckName
  });

  const navigate = useNavigate();
  const [val, setVal] = useState([]);
  const location = useLocation();

  let deckId = location?.state?.deckId;

  useEffect(() => {
    (async () => {
      if (deckId) {
        var viewDeck = await viewdeckservice(deckId);
        // if(toggle.type=='deck'){
        //   setToggle({...toggle,show:viewDeck.body.value.visibility})
        // }

        setVal(viewDeck);
      }
    })();
  }, [deckId]);

  return (
    <>
      <HandleViewComponent
        data={val}
        successComponent={(data) => {
          {
            
          }
          return (
            <>
              <DeletePopup
                deleteState={deleteState}
                setDeleteState={setDeleteState}
              />
              <HidePopup toggle={toggle} setToggle={setToggle} />
              <Grid container columnSpacing={3} rowSpacing={3}>
                <Grid item sm={12} xl={7} md={6} lg={7}>
                  {data.deckImage && (
                    <img
                      src={data.deckImage}
                      alt=""
                      style={{
                        aspectRatio: "3/2",
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={5}
                  xl={4}
                  lg={4}
                  m={1}
                  height={{ xl: "80vh", sm: "" }}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  rowGap={1}
                >
                  <Grid
                    item
                    display={"flex"}
                    justifyContent={"space-between"}
                  >
                    <Grid item>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          width: "300px",
                          wordWrap: "break-word",
                        }}
                        fontSize={"2rem"}
                      >
                        {data.deckName}
                      </Typography>
                    </Grid>

                    <Grid item display={"flex"} justifyContent={"flex-end"}>
                      <Typography alignSelf={"center"} fontSize={20}>
                        {" "}
                        Hide{" "}
                      </Typography>
                      <IconButton
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            open: true,
                            deckId: data.deckId,
                            visibility: !data.visibility,
                            type: "deck",
                          });
                        }}
                        sx={{ color: "#ffbc3a" }}
                      >
                        {data.visibility ? (
                          <ToggleOffRounded sx={{ fontSize: "50px" }} />
                        ) : (
                          <ToggleOnRounded sx={{ fontSize: "50px" }} />
                        )}
                      </IconButton>
                    </Grid>
                  </Grid>

                  {/* visiblity=true -- unhide toggleoff */}
                  <Grid
                    item
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                  >
                    <Typography fontSize={"1.3rem"} lineHeight={"26px"}>
                      {data.subject}{" "}
                    </Typography>
                    <Typography sx={{ width: "6rem" }}>
                      {" "}
                      {data.difficultyLevel}
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Typography fontSize={"1.3rem"}>{data.topic}</Typography>
                    <Typography fontSize={"1.3rem"}>{data.subTopic}</Typography>
                    <Typography fontSize={"1.3rem"}>{data.exam}</Typography>
                    <Typography fontSize={"1.3rem"}>
                      {" "}
                      {data.standard}
                    </Typography>
                  </Grid>

                  <Grid item display={"flex"} justifyContent={"space-between"}>
                    <Grid item justifyContent={"flex-start"}>
                      <Typography fontSize={"1.6rem"}>
                        {data.cardCount > 1
                          ? `${data.cardCount} Cards`
                          : `${data.cardCount} Card`}
                      </Typography>
                    </Grid>

                    <Grid item display={"flex"} justifyContent={"flex-end"}>
                      <Button
                        onClick={() =>
                          navigate("/adddeck", {
                            state: { pageType: "edit", deckId: data.deckId },
                          })
                        }
                        sx={{
                          textTransform: "none",
                          backgroundColor: "#d6e3f7",
                          mx: 1,
                          width: "6rem",
                          "&:hover": { backgroundColor: "#d6e3f7" },
                        }}
                      >
                        Edit{" "}
                      </Button>
                      <Button
                        onClick={() => {
                          setDeleteState({
                            ...deleteState,
                            open: true,
                            data: "deck",
                            deckId: data.deckId,
                            value: data.deckName,
                          });
                        }}
                        sx={{
                          textTransform: "none",
                          backgroundColor: "#fadcd5",
                          color: "#f48280",
                          width: "6rem",
                          "&:hover": { backgroundColor: "#fadcd5" },
                        }}
                      >
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                m={5}
                sx={{
                  transform: {
                    sm: "translate(0px,0px)",
                    md: "translate(0px,-60px)",
                  },
                }}
              >
                {" "}
                {/* {item.hint} */}
                {data.cards.map((item, index) => {
                  

                  return (
                    <Grid mt={3} key={index}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography
                            fontSize={18}
                            style={{ cursor: 'default' }}
                            dangerouslySetInnerHTML={{ __html: item.question }}
                          ></Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                          {flip === "hint" + index ? (
                            <>
                              <Grid
                                container
                                flexDirection={"column"}
                                alignContent={"center"}
                                justifyContent={"center"}
                              >
                                <Typography
                                  fontWeight={"bold"}
                                  textAlign={"center"}
                                >
                                  {" "}
                                  Hint
                                </Typography>
                                <Grid
                                  item
                                  display={"flex"}
                                  justifyContent={"center"}
                                  mt={4}
                                >
                                  <img
                                    style={{ aspectRatio: "4/3", width: "75%" }}
                                    src={item.hintImage}
                                    alt=""
                                  />
                                </Grid>
                                <Typography
                                  sx={{ textAlign: "center" }}
                                  dangerouslySetInnerHTML={{
                                    __html: item.hint,
                                  }}
                                  mt={4}
                                ></Typography>
                              </Grid>
                              <Grid
                                mt={2}
                                item
                                display="flex"
                                flexDirection={"row"}
                                justifyContent={"flex-end"}
                                columnGap={2}
                              >
                                <Typography alignSelf={"center"}>
                                  Hide
                                </Typography>
                                <IconButton
                                  onClick={() =>
                                    setToggle({
                                      ...toggle,
                                      open: true,
                                      cardId: item.cardId,
                                      visibility: item.visibility,
                                      deckId: data.deckId,
                                      type: "card",
                                    })
                                  }
                                  sx={{ color: "#ffbc3a" }}
                                >
                                  {toggle.type == "card" && toggle.show ? (
                                    <ToggleOffRounded
                                      sx={{ fontSize: "50px" }}
                                    />
                                  ) : (
                                    <ToggleOnRounded
                                      sx={{ fontSize: "50px" }}
                                    />
                                  )}
                                </IconButton>
                                <Grid
                                  item
                                  display={"flex"}
                                  gap={2}
                                  alignItems={"center"}
                                >
                                  <Button
                                    size="small"
                                    sx={{
                                      backgroundColor: "#ffbc3a",
                                      "&:hover": { backgroundColor: "#ffbc3a" },
                                    }}
                                    onClick={() => {
                                      setFlip("");
                                    }}
                                  >
                                    Card
                                  </Button>
                                  <Button
                                    size="small"
                                    sx={{
                                      backgroundColor: "#ffbc3a",
                                      "&:hover": { backgroundColor: "#ffbc3a" },
                                    }}
                                    onClick={() => {
                                      setFlip("solution" + index);
                                    }}
                                  >
                                    Solution
                                  </Button>
                                </Grid>
                              </Grid>
                            </>
                          ) : flip === "solution" + index ? (
                            <>
                              <Grid
                                container
                                flexDirection={"row"}
                                alignContent={"center"}
                                rowSpacing={5}
                                justifyContent={"center"}
                              >
                                <Grid item textAlign={"center"}>
                                  <Typography fontWeight={"bold"}>
                                    Solution
                                  </Typography>

                                  {item.questionType == "multiple" ? (
                                    item.options
                                      .filter((f) => f.id === item.solution)
                                      .map((t) => (
                                        <Grid textAlign={"center"}>

                                          {t.text && <Typography
                                            dangerouslySetInnerHTML={{
                                              __html: t.text,
                                            }}
                                          ></Typography>}
                                          {t.image &&
                                            <img src={t.image} style={{ aspectRatio: "4/3", width: "75%" }} alt="" />}
                                        </Grid>
                                      ))
                                  ) : (
                                    <Typography
                                      dangerouslySetInnerHTML={{
                                        __html: item.solution,
                                      }}
                                    ></Typography>
                                  )}
                                </Grid>
                                <Grid
                                  item
                                  container
                                  mt={1}
                                  display={"flex"}
                                  flexDirection={"row"}
                                  justifyContent={"flex-end"}
                                  columnGap={2}
                                >
                                  <Typography alignSelf={"center"}>
                                    Hide
                                  </Typography>
                                  <IconButton
                                    onClick={
                                      () =>
                                        setToggle({
                                          ...toggle,
                                          open: true,
                                          cardId: item.cardId,
                                          visibility: item.visibility,
                                          deckId: data.deckId,
                                          type: "card",
                                        })
                                      //  handleClickCard(item.cardId, item.visibility, data.deckId)
                                    }
                                    sx={{ color: "#ffbc3a" }}
                                  >
                                    {toggle.type == "card" && toggle.show ? (
                                      <ToggleOffRounded
                                        sx={{ fontSize: "50px" }}
                                      />
                                    ) : (
                                      <ToggleOnRounded
                                        sx={{ fontSize: "50px" }}
                                      />
                                    )}
                                  </IconButton>
                                  <Grid
                                    item
                                    display={"flex"}
                                    alignItems={"center"}
                                    gap={2}
                                  >
                                    <Button
                                      sx={{
                                        bgcolor: "#ffbc3a",
                                        "&:hover": {
                                          backgroundColor: "#ffbc3a",
                                        },
                                      }}
                                      onClick={() => setFlip("")}
                                    >
                                      Card
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          ) : (
                            //Questions
                            <Grid>
                              <Box display="flex" justifyContent={"flex-end"}>
                                <IconButton
                                  onClick={() => {
                                    navigate("/addcard", {
                                      state: {
                                        deckId: data.deckId,
                                        cardId: item.cardId,
                                      },
                                    });
                                    // navigate("/addcard/deckId:");
                                  }}
                                >
                                  <BorderColorOutlinedIcon
                                    sx={{
                                      backgroundColor: "#ddf6fc",
                                      color: "#39a1cd",
                                      borderRadius: 1,
                                      padding: 0.5,
                                    }}
                                  />
                                </IconButton>
                                <IconButton>
                                  <DeleteOutlineIcon
                                    onClick={() => {
                                      setDeleteState({
                                        ...deleteState,
                                        open: true,
                                        data: "card",
                                        deckId: data.deckId,
                                        cardId: item.cardId,
                                      });
                                    }}
                                    sx={{
                                      backgroundColor: "#ddf6fc",
                                      color: "#f25959",
                                      borderRadius: 1,
                                      padding: 0.5,
                                    }}
                                  />
                                </IconButton>
                              </Box>
                              {item.questionImage != null ? (
                                <Grid item>
                                  <img style={{ aspectRatio: "4/3", width: "25%" }} src={item.questionImage} alt="" />
                                </Grid>
                              ) : (
                                <></>
                              )}

                              {item.questionType == "multiple" ? (
                                <RadioGroup
                                  defaultValue={item.solution}
                                  sx={{ mt: 2, pointerEvents: "none" }}
                                >
                                  {item.options.map((option, index) => (
                                    <FormControlLabel
                                      key={index}
                                      value={option.text}
                                      control={<Radio value={option.id} />}
                                      label={
                                        <Grid
                                          sx={{
                                            alignItems: "center",
                                            display: "flex",
                                            padding: "10px",
                                          }}
                                        >
                                          {option.image && (
                                            <img
                                              src={option.image}
                                              alt="image"
                                              style={{
                                                height: "50px",
                                                width: "50px",
                                              }}
                                            />
                                          )}{option.text && (
                                            <Grid sx={{ marginLeft: "10px" }}>
                                              {option.text}
                                            </Grid>
                                          )}
                                        </Grid>
                                      }
                                    />
                                  ))}
                                </RadioGroup>
                              ) : (
                                <TextField
                                  fontWeight="bold"
                                  size="small"
                                  sx={{ pointerEvents: "none" }}
                                  value={item.solution}
                                />
                              )}
                              {/* <Grid
                                item
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"flex-end"}
                                gap={1}
                              >
                                <Grid display={"flex"} gap={1}>
                                  <Typography
                                    alignSelf={"center"}
                                    fontSize={20}
                                  >
                                    Hide
                                  </Typography>
                                  <IconButton
                                    onClick={() => {
                                      setToggle({
                                        ...toggle,
                                        open: true,
                                        cardId: item.cardId,
                                        visibility: !item.visibility,
                                        deckId: data.deckId,
                                        type: "card",
                                      });
                                    }}
                                    sx={{ color: "#ffbc3a" }}
                                  >
                                    {item.visibility ? (
                                      <ToggleOffRounded
                                        sx={{ fontSize: "50px" }}
                                      />
                                    ) : (
                                      <ToggleOnRounded
                                        sx={{ fontSize: "50px" }}
                                      />
                                    )}
                                  </IconButton>
                                </Grid>
                                </Grid>
                                <Grid item display={"flex"} gap={2}>
                                  <Button
                                    sx={{
                                      backgroundColor: "#ffc555",
                                      color: "black",
                                      "&:hover": { backgroundColor: "#ffc555" },
                                    }}
                                    onClick={() => setFlip("hint" + index)}
                                  >
                                    Hint
                                  </Button>
                                  <Button
                                    sx={{
                                      backgroundColor: "#ffc555",
                                      color: "black",
                                      "&:hover": { backgroundColor: "#ffbc3a" },
                                    }}
                                    onClick={() => setFlip("solution" + index)}
                                  >
                                    Solution
                                  </Button>
                                </Grid> */}
                              <Grid
                                item
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"flex-end"}
                                gap={1}
                              >
                                <Grid display={"flex"} gap={1}>
                                  <Typography
                                    alignSelf={"center"}
                                    fontSize={20}
                                  >
                                    Hide
                                  </Typography>
                                  <IconButton
                                    onClick={() => {
                                      setToggle({
                                        ...toggle,
                                        open: true,
                                        cardId: item.cardId,
                                        visibility: !item.visibility,
                                        deckId: data.deckId,
                                        type: "card",
                                      });
                                    }}
                                    sx={{ color: "#ffbc3a" }}
                                  >
                                    {item.visibility ? (
                                      <ToggleOffRounded
                                        sx={{ fontSize: "50px" }}
                                      />
                                    ) : (
                                      <ToggleOnRounded
                                        sx={{ fontSize: "50px" }}
                                      />
                                    )}
                                  </IconButton>
                                </Grid>
                                <Grid item display={"flex"} gap={2}>
                                  {item.hintImage && item.hint != "" ? (
                                    <Button
                                      sx={{
                                        backgroundColor: "#ffc555",
                                        color: "black",
                                        "&:hover": {
                                          backgroundColor: "#ffc555",
                                        },
                                      }}
                                      onClick={() => setFlip("hint" + index)}
                                    >
                                      Hint
                                    </Button>
                                  ) : (
                                    <></>
                                  )}
                                  <Button
                                    sx={{
                                      backgroundColor: "#ffc555",
                                      color: "black",
                                      "&:hover": { backgroundColor: "#ffbc3a" },
                                    }}
                                    onClick={() => setFlip("solution" + index)}
                                  >
                                    Solution
                                  </Button>
                                </Grid>
                              </Grid>
                            </Grid>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  );
                })}
                <Grid item display={"flex"} mt={2} justifyContent={"flex-end"}>
                  <Typography
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate("/addcard", { state: { deckId: data.deckId } });
                    }}
                    color={"blue"}
                  >
                    + Add card
                  </Typography>
                </Grid>
              </Grid>
            </>
          );
        }}
        noData={(data) => {
          return (
            // <Grid item minHeight='100vh'  alignSelf='center' bgcolor='gray'>
            <NoDataPage data={data} />
            // </Grid>
          );
        }}
      />
    </>
  );
}