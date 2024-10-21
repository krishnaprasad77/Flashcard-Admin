export const origin = `https://dev.fcards.verlab.io`
export const baseUrl = `${origin}/service`;
export const CardExcelTemplateUrl = 'https://dev-flashcards.s3.ap-southeast-1.amazonaws.com/image-1689236182350.xlsx'

export const usercardUrl = `${baseUrl}/deck/getUserCard`
export const homesectionurl = `${baseUrl}/section/getAllSection`
export const deckViewAllUrl = `${baseUrl}/deck/getAll`
export const getSectionByIdUrl = `${baseUrl}/section/getById`
export const deckViewEditAllUrl = `${baseUrl}/deck/edit/getAll`
export const searchDeckSectionUrl = `${baseUrl}/section/searchDecks`
export const deleteSectionByIdUrl = `${baseUrl}/section/deleteById`
export const deletedeckByIdUrl = `${baseUrl}/section/deleteDeck`
export const getByDeckUrl = `${baseUrl}/deck/getByName`
export const createSectionUrl = `${baseUrl}/section/create`
export const hideSectioUrl=`${baseUrl}/section/toggle`
export const searchDeckNameUrl = `${baseUrl}/deck/searchByName`
export const addDeckUrl = `${baseUrl}/section/addDeck`
export const editSectionUrl = `${baseUrl}/section/update`
export const requestTokenUrl = `${baseUrl}/authenticate/accesstoken/get`;
export const tokenUrl = `${baseUrl}/authorization`
// create card
export const createCardUrl = `${baseUrl}/card/create`
export const cardGetUrl = `${baseUrl}/card/getById/`
export const cardPutCall = `${baseUrl}/card/update`
export const cardImagePutUrl = `${baseUrl}/card/updateImage`
export const cardImageDeleteUrl = `${baseUrl}/card/deleteImage`
// deck url
export const deckCreateUrl = `${baseUrl}/deck/create`
export const deckGetUrl = `${baseUrl}/deck/getById`
export const deckUpdateUrl = `${baseUrl}/deck/update`
export const deckImageDeleteUrl = `${baseUrl}/deck/deleteCoverImage`
export const deckImageUpdateUrl = `${baseUrl}/deck/updateCoverImage`
export const viewDeckUrl = `${baseUrl}/deck/getDeckCardById`
export const deleteDeckUrl = `${baseUrl}/deck/deleteById`
export const deleteCardUrl = `${baseUrl}/card/delete`
export const hideDeckUrl = `${baseUrl}/deck/VisibiltyById`
export const hideCardUrl = `${baseUrl}/card/toggleVisibility`
//image
export const imageUrlLink = `${baseUrl}/deck/image`