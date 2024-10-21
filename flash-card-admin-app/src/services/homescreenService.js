import { serviceCall } from '../App';
import { addDeckUrl, createSectionUrl, deckViewAllUrl, deckViewEditAllUrl, deletedeckByIdUrl, deleteSectionByIdUrl, editSectionUrl, getByDeckUrl, getSectionByIdUrl, hideSectioUrl, homesectionurl, searchDeckNameUrl, searchDeckSectionUrl, } from "../config/app_urls";
// homeScreengetAllSection
export const homescreensectionservice = async () => {
    var res = await serviceCall.getCall({
        url: `${homesectionurl}`
    })
    return res
}
// get all decks
export const deckviewallservice = async () => {
    var res = await serviceCall.getCall({
        url: `${deckViewAllUrl}`
    })
    return res
}
// get all decks in edit Section
export const deckviewEditallservice = async (sectionId) => {
    var res = await serviceCall.getCall({
        url: `${deckViewEditAllUrl}/${sectionId}`
    })
    return res
}
// get Section decks by section id
export const getsectionbyidservice = async (sectionId) => {
    var res = await serviceCall.getCall({
        url: `${getSectionByIdUrl}/${sectionId}`
    })
    return res
}
// search suggestion in section
export const searchDecksSection = async (val, id) => {
    let url = `${searchDeckSectionUrl}?filterText=${val}&sectionId=${id}`
    
    var res = await serviceCall.getCall({
        url: url
    })
    return res
}
// search all decks
export const searchDecksbyName = async (val) => {
    // let url=`${searchDeckNameUrl}/${val}`
    var res = await serviceCall.getCall({
        url: `${getByDeckUrl}/${val}`

    })
    return res
}
// search deckName suggestion
export const searchDecks = async (val) => {
    
    let url = `${searchDeckNameUrl}?deckName=${val}`
    
    var res = await serviceCall.getCall({
        url: url
    })
    return res
}
// delete section by id
export const deleteSectionById = async (sectionId) => {
    var res = await serviceCall.deleteCall({
        url: `${deleteSectionByIdUrl}/${sectionId}`
    })
    return res
}
// search getby name
export const getByDeckName = async (deckName) => {
    var res = await serviceCall.getCall({
        url: `${getByDeckUrl}/${deckName}`
    })
    return res
}
// create Section
export const createSection = async ({ sectionName, deckIdList }) => {
    

    var res = await serviceCall.postCall({
        url: `${createSectionUrl}`,
        body: {
            sectionName: sectionName,
            deckIdList: deckIdList
        }
    })
    return res
}
// add Deck to section
export const addDeckService = async ({ sectionId, deckIdList }) => {
    var res = await serviceCall.postCall({
        url: `${addDeckUrl}`,
        body: {
            sectionId: sectionId,
            deckIdList: deckIdList
        }
    })
    return res
}
// edit section name service

export const editSectionService = async ({ data }) => {
    
    var res = await serviceCall.putCall({
        url: `${editSectionUrl}`,
        body: {
            sectionId: data.sectionId,
            sectionName: data.sectionName
        }
    })
    return res
}
// delete deck in section
export const deleteDeck = async (sectionId, deckId) => {
    var res = await serviceCall.deleteCall({
        url: `${deletedeckByIdUrl}/${sectionId}/${deckId}`
    })
    return res
}
// hide Section 
export const sectionHideService = async (sectionId, visibility) => {
    var res = await serviceCall.putCall({
        url: `${hideSectioUrl}`,
        body: {
            sectionId: sectionId,
            visibility: visibility
        }
    })
    return res
}
