import { Delete } from "@mui/icons-material";
import { Card, Checkbox, Grid, IconButton, ImageListItem, ImageListItemBar, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeletePopup from "./deletePopup";
const CommonDecks = ({ decks, deckIndex, type, routeTo, selectedItems, setSelectedItems, sectionId }) => {
  const { deckId, deckImage, deckName, cardCount, difficultyLevel, } = decks;
  const navigate = useNavigate();
  
  const [deleteState, setDeleteState] = useState({
    open: false,
    pageType: "",
    sectionId: 0,
    deckId: 0,
    data: "",
    value: ""

  })

  const handleDeleteState = () => {
    setDeleteState({
      open: true,
      pageType: "EditDeck",
      sectionId: sectionId,
      deckId: selectedItems[deckIndex]?.deckId,
      data: "Deck",
      value: selectedItems[deckIndex]?.deckName
    })
   
  }

  // for select id and send the id to deletePopup
  const handleSelect = () => {
    setSelectedItems((preState) => {
      const updateDecks = [...preState];
      updateDecks[deckIndex] = {
        ...updateDecks[deckIndex], selected: selectedItems[deckIndex],
        selected:selectedItems[deckIndex]?.selected
      }
      return updateDecks
    })

    handleDeleteState();

  };

  return (
    <>
      <Grid item xl={2.8} lg={2.8} md={2.7} sm={3.7} xs={5.6} position="relative" sx={{
        border: "0.1px solid #FAC84C", borderRadius: 1.2, boxShadow: 4, cursor: 'pointer',
      }}  >
        < Grid item
          position={"absolute"}
          sx={{ left: { lg: -7, md: -6, sm: -4.5, xs: -5 }, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, background: 'linear-gradient(180deg, #FFC634 0%, #DC7617 68.48%)' }}
          width={{ xs: 5, lg: 7.3, md: 6, sm: 5 }}
          height={{ xs: 35, lg: 60, md: 60, sm: 50 }}
        >
        </Grid>
        <Card
          sx={{
            opacity: selectedItems?.[deckIndex]?.selected||selectedItems?.[deckIndex]?.hover ? .1 : 1,
            '&:hover': {
              opacity: selectedItems ? 0.3 : 1,
            },
          }}
          onMouseOut={() => {
            if (selectedItems) {
              setSelectedItems((preState) => {
                const updateDecks = [...preState];
                updateDecks[deckIndex] = {
                  ...updateDecks[deckIndex], hover: false,
                }
                return updateDecks;
              })
            }

          }}
          onMouseOver={() => {
            if (selectedItems) {
              setSelectedItems((preState) => {
                const updateDecks = [...preState];
                updateDecks[deckIndex] = {
                  ...updateDecks[deckIndex], hover: true,
                }
                return updateDecks;
              })
            }

          }}
        onClick={() =>{
          if(type=="viewDeck"){
            navigate(routeTo, { state: { deckName: deckName, cardcount: cardCount, img: deckImage, deckId: deckId, difficulty: difficultyLevel } })}
          }
        }
        >
          <ImageListItem key={deckId} sx={{
            objectFit: 'cover', aspectRatio: '3/2', m: .6, borderRadius: 2,
          }}  >
            <img
              src={deckImage}
              style={{ width: '100%', height: '100%', borderRadius: 5 }}
            />
            <ImageListItemBar
            
              title={
                < Grid item display={"flex"} justifyContent={"space-between"} alignItems="center">
                  <Typography fontSize={{ xs: ".6rem", sm: ".8rem", md: ".9rem", lg: "1rem" }}  sx={{overflow:'hidden',wordWrap:'break-word',textOverflow:"ellipsis"}}>{deckName}</Typography>
                  <Typography fontSize={{ xs: ".6rem", sm: ".7rem", md: ".8rem", lg: ".9rem" }} >{cardCount}{" "}Cards</Typography>
                </Grid>
              }
              subtitle={
                <Grid item display={"flex"} justifyContent="end" >
                  <Typography fontSize={{ xs: ".5rem", sm: '.7rem', md: '.8rem', lg: ".9rem" }} color={difficultyLevel == "Easy" ? "green" : difficultyLevel == "Hard" ? "#EF6201" : "#214CE5"}>{difficultyLevel}</Typography>
                </Grid>
              }

              sx={{
                p: { lg: 0.7, md: 0.4, sm: 0.5, xs: 0.3 },
                opacity: .9,
                borderRadius: "0 0 4px 4px",
              }}
            />
          </ImageListItem>
        </Card>
        {type == "createSection" || type == "editSelectSection" ?
          <Grid item
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            position: "absolute",
            left: { lg: "45%", sm: "43%", xs: "38%" },
            top: { sm: "38%", xs: "30%" },
            

          }}
          
          >
            {selectedItems[deckIndex].hover || selectedItems[deckIndex].selected ?
              <Checkbox
                size="small"
                onMouseOver={() => {
                  
                  setSelectedItems((preState) => {
                    const updateDecks = [...preState];
                    updateDecks[deckIndex] = {
                      ...updateDecks[deckIndex], hover: true,
                      selected: selectedItems[deckIndex]?.selected,
                    }
                    return updateDecks;
                  })
                }}
                checked={selectedItems[deckIndex].selected}
                onChange={(e) => {
                  setSelectedItems((preState) => {
                    const updateDecks = [...preState];
                    updateDecks[deckIndex] = {
                      ...updateDecks[deckIndex], selected: e.target.checked
                    }
                    return updateDecks;
                  })

                }}

                sx={{
                  '&.Mui-checked': {
                    color: "orangered",
                  },
                }}
                /> :
              <></>

            }
          </Grid> :
          type == "editSection" ?
            <Grid item
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              position: "absolute",
              left: { lg: "45%", sm: "43%", xs: "38%" },
              top: { sm: "38%", xs: "30%" }

            }}
            >
              <DeletePopup deleteState={deleteState} setDeleteState={setDeleteState} />
              {selectedItems[deckIndex]?.hover ?
                <IconButton
                  onClick={
                    handleSelect
                  }
                  onMouseOver={() => {
                    
                    setSelectedItems((preState) => {
                      const updateDecks = [...preState];
                      updateDecks[deckIndex] = {
                        ...updateDecks[deckIndex], hover: true,
                      }
                      return updateDecks;
                    })
                  }}

                 
                >
                  <Delete
                    sx={{ fill: "#F35959" }}

                  />
                </IconButton>
                :
                <></>
              }
            </Grid>
            :
            <></>
        }
        <></>
      </Grid>
    </>
  );
}
export default CommonDecks;