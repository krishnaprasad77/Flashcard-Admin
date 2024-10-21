import {
  Button,
  Card,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deckviewallservice, homescreensectionservice } from "../../services/homescreenService";
import CommonDecks from "../common/commonDeck";
import HandleViewComponent from "../common/handle_view_component";
import NoDataPage from "../common/nodata";
export default function HomeScreen() {


  const navigate = useNavigate();
  const [res, setRes] = useState([]);
  const [decksAll, setDecksAll] = useState([]);
  const [disable, setDisable] = useState(false);

  // section card component
  const SectionCard = ({ decks }) => {
    return (
      <Grid item lg={2.25} xs={5.6} md={2.1} sm={3} sx={{ position: "relative" }} >
        < Grid item display="flex"
          position={"absolute"}
          sx={{ left: { lg: -7, xs: -5 }, borderTopLeftRadius: 7, borderBottomLeftRadius: 10, background: 'linear-gradient(180deg, #FFC634 0%, #DC7617 68.48%)' }}
          width={{ xs: 5, lg: 7 }}
          height={{ xs: 35, lg: 45 }}
        >
        </Grid>
        <Card onClick={() => navigate("/viewSection", { state: { name: decks.sectionName, deckCount: decks.deckCount, id: decks.sectionId } })} sx={{ cursor: "pointer" }}>
          <Grid container p={{ lg: 2.5, xs: 1 }} display="flex" gap={3} flexDirection="column" >
            <Grid item >
              <Typography fontSize={{ lg: "1.1rem", xs: ".7rem" }} >{decks.sectionName}</Typography>
            </Grid>
            <Grid item bgcolor="#FDEEE3" p={.7} borderRadius={1.4} display="flex" alignSelf="flex-start" >
              <Typography fontSize={"0.7rem"} color="#F49655">{decks.deckCount}{" "}{decks.deckCount == 1 || decks.deckCount == 0 ? "Deck" : "Decks"}</Typography>
            </Grid>
          </Grid>

        </Card>
      </Grid>
    )
  }

  useEffect(() => {
    (async () => {
      var section = await homescreensectionservice();
      setRes(section)

      var deckAll = await deckviewallservice();

      setDecksAll(deckAll)
      if (deckAll.header.code == 607) {
        setDisable(true);
      }



    })()
  }, [])

  return (

    <Container maxWidth={"100%"}>

      <Grid container gap={2} py={3} >

        {/* My section & Button */}
        <Grid
          item
          container
          display={"flex"}
          justifyContent="space-between"
          pl={{ lg: 3, md: 3 }}
          pr={{ lg: 3, md: 3 }}>
          <Grid item >
            <Typography fontSize={{ lg: "1.5rem", xs: "1.1rem" }}>
              My Sections
            </Typography>
          </Grid>
          <Grid item display={"flex"} columnGap={1} alignItems="center"  >
            {disable ? <></> :
              <Button
                variant="contained"
                color="yellowButtonColor"
                size="small"
                sx={{
                  textTransform: "none",
                  fontSize: { xs: "0.6rem", sm: ".8rem", lg: "1rem" },
                }}
                onClick={() => navigate("/createSection")}
              >
                +{" "} Create Section
              </Button>}
            <Button
              variant="contained"
              color="blackButtonColor"
              size="small"
              sx={{
                textTransform: "none",
                color: "white",
                fontSize: { xs: "0.6rem", sm: ".8rem", lg: "1rem" },
              }}
              onClick={() => {
                navigate("/adddeck", { state: { pageType: "create" } });
              }}
            >
              + Create Deck
            </Button>
          </Grid>
        </Grid>
        {/* section card */}
        <Grid container gap={2.2} pl={{ lg: 3, md: 2 }}>
          <HandleViewComponent
            data={res}
            successComponent={(data) => {
              return (
                <>
                  {data.map((item, index) => {
                    return (
                      <SectionCard decks={item} key={index} />
                    )
                  }
                  )}
                </>
              )
            }}
            noData={(data) => {
              return (

                <NoDataPage data={data} />
              )
            }}
          />
        </Grid>
        <Grid item pl={{ lg: 3, md: 3 }}>
          <Typography fontSize={{ lg: "1.5rem", xs: "1.1rem" }}>
            My Decks
          </Typography>
        </Grid>

        <Grid container gap={{ lg: 3, sm: 3, xs: 2 }} pl={{ lg: 3, md: 3 }}>
          <HandleViewComponent
            data={decksAll}
            successComponent={(data) => {
              return (
                <>
                  {data.map((item, index) => (
                    <CommonDecks decks={item} key={index} routeTo='/viewDeck' type="viewDeck" />
                  ))}
                </>
              );

            }}
            noData={(data) => {
              return (
                <NoDataPage data={data} />
              )
            }}
          />


        </Grid>
      </Grid>
    </Container >

  );
}
