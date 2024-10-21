import { Search } from '@mui/icons-material';
import { Box, Breadcrumbs, Button, Container, Grid, IconButton, ImageListItem, ImageListItemBar, InputAdornment, Modal, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { addDeckService, deckviewallservice, deckviewEditallservice, searchDecks, searchDecksbyName } from '../../services/homescreenService';
import CommonDecks from '../common/commonDeck';
import { HandleSubmitComponent } from '../common/handle_submit_component';
import HandleViewComponent from '../common/handle_view_component';
import SearchComponent from '../common/SearchComponent';
import NoDataPage from '../common/nodata';

export default function EditSection() {
    const location = useLocation();
    const navigate = useNavigate();
    const [editDecksAll, setEditDecksAll] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        (async () => {
            var deckAll = await deckviewEditallservice(location?.state?.sectionId);
            setEditDecksAll(deckAll)
            if (deckAll.header.code == 600) {
                setSelectedItems(deckAll.body.value)
            }
        })()
    }, [])

    // search component cb
    const searchCb = async (val) => {
        let serviceres;
        serviceres = await searchDecks(val);
        return serviceres;
    }
    const setSearchCb = async (values) => {
        if (values) {
            let serviceRes = await searchDecksbyName(values)
            setEditDecksAll(serviceRes)
        }
    }



    const onSubmit = async (handleSubmitResponse) => {
        const selectedDeckIds = selectedItems
            .filter((item) => item.selected)
            .map((item) => item.deckId)
        await handleSubmitResponse({
            serviceCb: async () => {
                let addDeck = await addDeckService({
                    sectionId: location?.state?.sectionId,
                    deckIdList: selectedDeckIds
                })
                return addDeck
            },
            successCb: () => {
                navigate("/createSection",{state:{
                    sectionId:location?.state?.sectionId,
                    sectionName:location?.state?.sectionName
                }})
            },
        })

    }

    const breadcrumbs = [
        <Breadcrumbs >
            <Typography sx={{ cursor: 'pointer' }} onClick={() => navigate("/createSection", { state: { sectionId: location?.state?.sectionId, sectionName: location?.state?.sectionName } })} color="black" >Edit Section</Typography>
            <Typography sx={{ cursor: 'pointer' }} color="#EF6201">Select Deck</Typography>
        </Breadcrumbs>
    ]
    return (
        <HandleSubmitComponent
            successComponent={(handleServiceCall) => {
                return (

                    <Container maxWidth={"100%"}>
                        <Grid container py={3} gap={2} >
                            <Grid item pl={{ lg: 3, md: 3 }}>
                                {breadcrumbs}
                            </Grid>
                            <Grid item xs={12} pl={{ lg: 3, md: 3 }}>
                                <Typography fontSize={"1.3rem"}>Select Deck</Typography>
                            </Grid>
                            <Grid container p={{ lg: 3, md: 4, sm: 4, xs: 2 }} border={"1px solid #D9D9D9"} borderRadius={2} rowGap={3} ml={{ lg: 3, md: 3 }} bgcolor='#fff'>
                                <Grid item container display="flex" justifyContent={"space-between"} alignItems="center" >
                                    <Grid item lg={3} sm={5} xs={6.1}>
                                        <SearchComponent val={searchCb} setSearchCb={setSearchCb} />

                                    </Grid>
                                    <Grid item lg={2} sm={3} xs={5.5}>
                                        <Typography color={"#EF6201"} fontSize={{ lg: "1rem", xs: ".7rem" }}>{selectedItems.filter((i) => i.selected).length}{" "}{selectedItems.filter((i) => i.selected).length === 1 || selectedItems.filter((i) => i.selected).length === 0 ? "Deck" : "Decks"} are selected</Typography>
                                    </Grid>
                                </Grid>
                                <HandleViewComponent
                                    data={editDecksAll}
                                    successComponent={(data) => {
                                        return (
                                            <Grid container gap={{ lg: 3, sm: 3, xs: 2 }} pl={{ lg: 1, md: 1 }}>
                                                {data.map((item, index) =>
                                                (
                                                    <CommonDecks decks={item} deckIndex={index} selectedItems={selectedItems} setSelectedItems={setSelectedItems} type="editSelectSection" />
                                                ))}
                                            </Grid>
                                        )
                                    }}
                                    noData={(data) => {
                                        return (
                                            <NoDataPage data={data} />
                                        )
                                    }}
                                />
                            </Grid>

                            <Grid item display="flex" justifyContent={"end"} xs={11.8} >
                                <Button variant='contained' sx={{ textTransform: "none", bgcolor: "black" }} onClick={() => onSubmit(handleServiceCall)} disabled={selectedItems.filter((i)=>i.selected).length==0}>Add to Section</Button>
                            </Grid>
                        </Grid>
                    </Container>

                )
            }}
        />
    )
}