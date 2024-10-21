import { Button, Card, CardActionArea, Container, Grid, IconButton, ImageListItem, ImageListItemBar, InputAdornment, TextField, Typography } from '@mui/material'
import { toHaveFormValues } from '@testing-library/jest-dom/dist/matchers';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { deleteSectionById, getByDeckName, getsectionbyidservice, searchDecks, searchDecksbyName, searchDecksSection } from '../../services/homescreenService';
import CommonDecks from '../common/commonDeck';
import DeletePopup from '../common/deletePopup';
import HandleViewComponent from '../common/handle_view_component';
import SearchComponent from '../common/SearchComponent';
import NoDataPage from '../common/nodata';
import HidePopup from '../common/hide_popup';
import { ToggleOffRounded, ToggleOnRounded } from '@mui/icons-material';

export default function ViewSection() {
  const navigate = useNavigate();
  const [deckSection, setdeckSection] = useState();
  const location = useLocation();
  let sectionId = location?.state?.id;
  const [deleteState, setDeleteState] = useState({
    open: false,
    sectionId: 0,
    deckId: 0,
    pageType: "",
    data: "",
    value: "",


  })

  const [toggle, setToggle] = useState({
    show: true,
    open: false,
    sectionId:0,
    type: "",
    visibility: "",

  });
  const handleDeleteState = () => {
    setDeleteState({
      ...deleteState,
      open: true,
      sectionId: sectionId,
      data: "Section",
      pageType: "SectionDelete",
      value: location?.state?.name
    })
  }
  useEffect(() => {
    (async () => {
      var decksAll = await getsectionbyidservice(sectionId);
      setdeckSection(decksAll)
      if (sectionId) {
        setdeckSection(decksAll);
      }

    })()
  }, [sectionId])

  // search component cb
  const searchCb = async (val) => {
    let serviceres;
    serviceres = await searchDecksSection(val, sectionId);
    return serviceres;
  }
  const setSearchCb = async (values) => {
    if (values) {
      let serviceRes = await searchDecksbyName(values)
      setdeckSection(serviceRes)
    }
  }
 
 
  return (
    <>
      <DeletePopup deleteState={deleteState} setDeleteState={setDeleteState} />
      <HidePopup toggle={toggle} setToggle={setToggle}/>
      <HandleViewComponent
        data={deckSection}
        successComponent={(data) => {
          return (
            <Container maxWidth={"xl"}>
              <Grid container display={"flex"} gap={2.5} py={3} >
              <Grid item container display={"flex"} justifyContent="space-between" pl={{ lg: 3, md: 3 }}>
                 <Grid item  rowGap={1} alignItems="center" >
                  <Typography fontSize={{ lg: "1.3rem", xs: "1rem" }} fontWeight={"bold"}>{data?.sectionName}</Typography>
                  <Typography>{(data?.deck_details).length}{" "}{(data?.deck_details).length==0||(data?.deck_details).length==1?"Deck":"Decks"}</Typography>
                </Grid>

                <Grid item display={"flex"}>
                 <Typography alignSelf={"center"}>Hide Section</Typography>
              <IconButton
               onClick={()=>{
                setToggle({
                  ...toggle,
                  open: true,
                  sectionId: data?.sectionId,
                  visibility: !data.visibility,
                  type:"Section",
                });
               }}
              >
                {data?.visibility?
                <ToggleOffRounded fontSize='large' sx={{fill:'#FFBC3A'}}/>:<ToggleOnRounded fontSize='large' sx={{fill:'#FFBC3A'}}/>}
                </IconButton>
                </Grid>
                 </Grid>
                <Grid item container display={"flex"} justifyContent="space-between" pl={{ lg: 3, md: 3 }} >
                  <Grid item lg={4} md={4} sm={5} xs={6}>
                    <SearchComponent val={searchCb} setSearchCb={setSearchCb}  />
                  </Grid>
                  <Grid item display={"flex"} alignSelf="center" columnGap={1.3} lg={1.3} md={2}  >
                    <Button variant='contained' size='small' color='editButton' sx={{ fontSize: ".8rem", textTransform: "none", color: "#89c6e0" }} onClick={() => navigate("/createSection", { state: { sectionName: location.state.name, sectionId: sectionId, pageType: "edit" } })}>Edit</Button>
                    <Button variant='contained' size='small' color='deleteButton' sx={{ fontSize: ".8rem", textTransform: "none", color: "#f47978" }} onClick={handleDeleteState} >Delete</Button>
                  </Grid>
                </Grid>
                {/* Cards */}
                <Grid item container gap={{ lg: 3, sm: 3, xs: 2 }} pl={{ lg: 3, md: 3 }}>
                  {data?.deck_details ? data.deck_details.map((item, index) => {
                    return (
                      <CommonDecks decks={item} key={index} routeTo={'/viewDeck'} />

                    )
                  }
                  ) : <>
                    {data.map((item, index) => (
                      <CommonDecks decks={item} key={index} routeTo={'/viewDeck'} />
                    ))}
                  </>}
                </Grid>
              </Grid>
            </Container>
          )
        }}
        noData={(data) => {
          return (
            <NoDataPage data={data} />
          )
        }} />

    </>
  )
}