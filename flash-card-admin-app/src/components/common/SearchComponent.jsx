import React, { useState } from 'react';
import { Autocomplete, Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import { Search } from '@mui/icons-material';
export default function SearchComponent({ val, setSearchCb }) {
    const [searchSuggestion, setSearchSuggestion] = useState([]);
    console.log(searchSuggestion, "searchSuggestion");
    let deckId;
    const onChangeSearch = async (e) => {
        // console.log(e);
        let searchRes = e.target.value
        console.log(searchRes, "searchRes");
        if (searchRes.length === 0) {
            setSearchCb('');
        }
        if (searchRes.length !== 0) {
            if (searchRes !== '') {
                let searchDetails = await val(searchRes);
                if (searchDetails.header.code === 600) {
                    setSearchSuggestion(searchDetails.body.value);

                }
                else if (searchDetails.header.code === 607) {
                    setSearchSuggestion([]);
                }
            }
        }
    }


    console.log(searchSuggestion.map((i) => i?.deckName, "i.deckName"));
    const handleDeckSelection = (event, value) => {
        console.log(value, "deckvalue");
        if (value != null) {
          
                const filteredDeck = searchSuggestion.filter((deck) => deck?.deckName === value);
                const deckId = filteredDeck.length > 0 ? filteredDeck[0].deckId : null;
                setSearchCb(deckId);
        
        } else {
            window.location.reload();
        }

    }
    return (
        <Grid container display='flex' position={"relative"}>
            <Autocomplete
                onChange={handleDeckSelection}
                freeSolo
                fullWidth

                size='small'
                options={searchSuggestion.map((i) => i?.deckName)}
                renderInput={(params) => <TextField
                    placeholder="Search Decks"
                    size='small'
                    {...params}
                    onChange={onChangeSearch}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: <InputAdornment>
                            <Search fontSize='small' sx={{ ml: 2 }} />
                        </InputAdornment>,
                        style: { borderRadius: 20 }
                    }}
                    style={{ backgroundColor: "#FFF", borderRadius: 20 }}

                />}
            >
            </Autocomplete>
        </Grid>

    )
}