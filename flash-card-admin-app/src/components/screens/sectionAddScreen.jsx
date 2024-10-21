import { Search } from '@mui/icons-material'
import { Button, Card, Checkbox, Container, Dialog, Grid, ImageListItem, ImageListItemBar, InputAdornment, Modal, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { createSection, deckviewallservice, editSectionService, getsectionbyidservice, searchDecks, searchDecksbyName } from '../../services/homescreenService'
import CommonDecks from '../common/commonDeck'
import EditSectionPopup from './editSection'
import HandleViewComponent from '../common/handle_view_component'
import SearchComponent from '../common/SearchComponent'
import { HandleSubmitComponent } from '../common/handle_submit_component'
import { useForm } from 'react-hook-form'
import { UpdatePopup } from '../common/updatePopup'
import NoDataPage from '../common/nodata'
export default function SectionCreateScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [res, setRes] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [updatePopup, setUpdatePopup] = useState({
    open: false,
    type: "",
    sectionName: "",
    sectionId: 0
  })
  const {
    register,
    handleSubmit,
    setValue,
    formState:{errors}
  } = useForm({});

  let SectionId = location?.state?.sectionId
  let pageType = location?.state?.pageType
  useEffect(() => {
    (async () => {
      var deckAll = await deckviewallservice();
      setRes(deckAll)
      if (deckAll.header.code == 600) {
        setSelectedItems(deckAll.body.value)
      }
      var deckbySectionId = await getsectionbyidservice(SectionId);
      if (SectionId) {
        setRes(deckbySectionId)
        setSelectedItems(deckbySectionId?.body?.value?.deck_details?.map((i) => i))
        setValue("sectionName", location?.state?.sectionName)
      }
    })()
  }, [SectionId])


  const onSubmit = async (data, handleSubmitResponse) => {
    
    
    if (pageType == "edit") {
      

      setUpdatePopup({
        open: true,
        type: "updateSection",
        data: 'Section',
        value: data.sectionName,
        sectionName: data.sectionName,
        sectionId: SectionId
      })
    }
    else {
      const selectedDeckIds = selectedItems
        .filter((item) => item.selected)
        .map((item) => item.deckId)
      await handleSubmitResponse({
        serviceCb: async () => {
          let addsection = await createSection({
            sectionName: data.sectionName,
            deckIdList: selectedDeckIds
          });

          return addsection
        },
        successCb: () => {
          navigate("/")
        },

      }
      )
    };

  };

  // search component cb
  const searchCb = async (val) => {
    let serviceres;

    serviceres = await searchDecks(val);
    return serviceres;

  }
  const setSearchCb = async (values) => {
    if (values) {
      let serviceRes = await searchDecksbyName(values)
      setRes(serviceRes)
    }
  }
  return (
    <>
      <UpdatePopup updateState={updatePopup} setUpdateState={setUpdatePopup} />
      <HandleSubmitComponent
        successComponent={(handleServiceCall) => {
          return (
            <HandleViewComponent
              data={res}
              successComponent={(data) => {
                return (
                  <Container maxWidth={"100%"}>
                    <form onSubmit={handleSubmit((data) => {
                      onSubmit(data, handleServiceCall);
                    })}>
                      <Grid container display="flex" rowGap={3} pt={2}>
                        {/* Section */}
                        <Grid item container flexDirection={"column"} spacing={2} pl={{ lg: 3, md: 3 }}>
                          <Grid item>
                            <Typography fontSize={"1.5rem"}>{SectionId ? "Edit Section" : "Create Section"}</Typography>
                          </Grid>
                          <Grid item>
                            <Typography fontSize={"1rem"}>Section Name</Typography>
                          </Grid>
                        </Grid>
                        {/* Textfield and button */}

                        <Grid item container display={"flex"} alignItems={"center"} gap={SectionId ? 2 : ""} pl={{ lg: 3, md: 3 }}>
                          <Grid item lg={3} md={3} sm={3} xs={6}>
                            <TextField size='small'
                              label={SectionId ? data?.sectionName : "Enter Section Name"}
                              required
                              {...register("sectionName",{required:true,maxLength:15})}
                              fullWidth
                              inputProps={{ style: { backgroundColor: "white" } }} sx={{
                                '& input::placeholder': {
                                  fontSize: { lg: "1rem", xs: ".78rem" }
                                },

                              }}  ></TextField>
                              {errors && errors.sectionName&&(
                                <Typography fontSize={".7rem"} color="error">This field is required and should not exceed 15 characters.</Typography>
                              )}
                          </Grid>
                          {SectionId &&
                            <>
                              <Grid item>
                                <Button variant='contained' color='blackButtonColor' sx={{ color: "#fff", textTransform: "none" }} type='submit'>Update Section Name</Button>
                              </Grid>
                              <Grid item display={"flex"} justifyContent="flex-end" lg={7} md={5.8} sm={5} xs={12}>
                                <Typography variant="button"
                                  onClick={() => { navigate("/editSection", { state: { sectionId: SectionId, sectionName: location?.state?.sectionName } }) }}
                                  style={{ textTransform: 'none', textDecoration: 'underline', color: '#EF6201', cursor: 'pointer' }}>+Add More</Typography>
                              </Grid>
                            </>
                          }
                        </Grid>
                        {SectionId ?
                          <Grid container gap={{ lg: 3, sm: 3, xs: 2 }} pl={{ lg: 3, md: 3 }}>
                            {data?.deck_details.map((item, index) => {
                              return (
                                <CommonDecks decks={item} key={index} deckIndex={index} selectedItems={selectedItems} setSelectedItems={setSelectedItems} type="editSection" sectionId={SectionId} />
                              )
                            }
                            )}
                          </Grid> :
                          <Grid container pl={{ lg: 2, md: 4, sm: 4, xs: 2 }} py={3} border={"1px solid #D9D9D9"} borderRadius={2} rowGap={3} ml={{ lg: 3, md: 3 }} bgcolor={"#FFF"}>
                            <Grid item container display="flex" justifyContent={"space-between"} alignItems="center">
                              <Grid item lg={4.5} sm={5} xs={6.1}>
                                <SearchComponent val={searchCb} setSearchCb={setSearchCb} />

                              </Grid>
                              <Grid item lg={2} sm={3} xs={5.5}>
                                <Typography color={"#EF6201"} fontSize={{ lg: "1rem", xs: ".7rem" }}>{selectedItems.filter((i) => i.selected).length}{" "}{selectedItems.filter((i) => i.selected).length === 1 || selectedItems.filter((i) => i.selected).length === 0 ? "Deck" : "Decks"} are selected</Typography>

                              </Grid>
                            </Grid>
                            <Grid container display={"flex"} flexDirection='row' gap={{ lg: 3, sm: 3, xs: 2 }} pl={{ lg: 1, md: 1 }}>
                              {data.map((item, index) =>
                              (
                                // <CommonDecks decks={item} deckIndex={index} select={select} setSelect={setSelect} />
                                <CommonDecks decks={item} deckIndex={index} selectedItems={selectedItems} setSelectedItems={setSelectedItems} type="createSection" />

                              ))}
                            </Grid>
                          </Grid>
                        }
                        {
                          !SectionId &&
                          <Grid item xs={12} display="flex" justifyContent={"end"} columnGap={2} pb={2}>
                            <Button variant='outlined' sx={{ textTransform: "none", borderColor: "black", color: "black", px: 5 }} onClick={() => navigate("/")}  >Cancel</Button>
                            <Button variant='contained' color='primary' sx={{ textTransform: "none", color: "white", px: 5 }} type="submit">
                              Create
                            </Button>
                          </Grid>
                        }

                      </Grid>
                    </form>
                  </Container >

                )

              }}
              noData={(data) => {
                return (
                  <NoDataPage data={data} />
                )

              }} />
          )
        }} />


    </>

  )
}