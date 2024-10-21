import React from "react";
import { Button, Container, Grid, Modal, Typography, useMediaQuery } from "@mui/material"
import { HandleSubmitComponent } from "./handle_submit_component"
import { RemoveRedEyeOutlined, VisibilityOff } from "@mui/icons-material"
import { hidecardservice, hidedeckservice } from "../../services/viewdeckService";
import { sectionHideService } from "../../services/homescreenService";

export default function HidePopup({ toggle, setToggle }) {
    console.log(toggle, 'toggle');
    const mobileMatches = useMediaQuery("(max-width:500px)");
    const tabletMatches = useMediaQuery("(max-width:900px)");

    const onSubmit = async (handleSubmitResponse) => {
        console.log('onsubmt');

        if (toggle.type == "Section" || toggle.sectionId) {
            console.log(toggle.type, "toggletype");
            await handleSubmitResponse({
                serviceCb: async () => {
                    setToggle({ ...toggle, open: false, show: !toggle.visibility })
                    let toogleService = await sectionHideService(toggle.sectionId, toggle.visibility)
                    console.log(toogleService, 'toggleservice');
                    return toogleService
                },
                successCb: (data) => {
                    window.location.reload();
                },
            })
        }
        if (toggle.type == 'deck' || toggle.type == 'card') {
            await handleSubmitResponse({
                serviceCb: async () => {
                    // toggle.type == 'deck'?
                    setToggle({ ...toggle, open: false, show: !toggle.visibility })

                    let response = toggle.type == 'deck' ? await hidedeckservice(toggle.deckId, toggle.visibility) : await hidecardservice(toggle.cardId, toggle.deckId, toggle.visibility);
                    console.log(response, 'response');
                    return response
                },
                successCb: (data) => {
                    window.location.reload();
                    // setToggle(...toggle, { show: !toggle.show })

                },
            })
        }
    }
    return (
        <HandleSubmitComponent
            successComponent={(handleServiceCall) => {
                return (
                    <Modal
                        BackdropProps={{
                            style: { backgroundColor: "black", opacity: 0.2 },
                        }}
                        open={toggle.open}
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
                                    <Typography fontWeight={"bold"}>{toggle.visibility ? `Unhide ${toggle.type}` : `Hide ${toggle.type}`}</Typography>
                                </Grid>
                                <Grid item xs={12} display="flex" justifyContent="center">
                                    <VisibilityOff
                                        fontSize="large"
                                        sx={{ fill: "#ffBC3A" }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography sx={{ textAlign: "center" }}>
                                        {toggle.visibility ? `Are you sure want to UnHide the ${toggle.type}?` : `Are you sure want to Hide the ${toggle.type}?`}


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
                                            onClick={() => { setToggle({ ...toggle, open: false }) }}>
                                            No
                                        </Button>
                                    </Grid>
                                    <Grid item xs={5.8}>
                                        <Button
                                            variant="contained"
                                            color="blackButtonColor"
                                            size="small"
                                            sx={{ textTransform: "none", color: "white" }}
                                            onClick={() => { onSubmit(handleServiceCall) }}>
                                            Yes
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Container>
                    </Modal >
                )
            }} />

    )
}