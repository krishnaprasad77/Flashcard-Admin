import { serviceCall } from "../App"
import { deleteCardUrl, deleteDeckUrl, hideCardUrl, hideDeckUrl, viewDeckUrl } from "../config/app_urls"

export const viewdeckservice = async (deckId) => {
    var val = await serviceCall.getCall({
        url: `${viewDeckUrl}/${deckId}`
    })
    return val
}

export const deleteDeckService = async (deckId) => {
    
    var val = await serviceCall.deleteCall({
        url: `${deleteDeckUrl}/${deckId}`
    })
    return val
}

export const deleteCardService = async (cardId, deckId) => {
    
    // 
    var val = await serviceCall.deleteCall({
        url: `${deleteCardUrl}?cardId=${cardId}&deckId=${deckId}`
    })

    
    return val
}

export const hidecardservice = async (cardId, deckId, active) => {
    
    var val = await serviceCall.putCall({
        url: `${hideCardUrl}`,
        body: {
            "cardId": cardId,
            "deckId": deckId,
            "visibility": active
        }
    })
    return val
}

export const hidedeckservice = async (deckId, active) => {
    
    var val = await serviceCall.putCall({
        url: `${hideDeckUrl}`,
        body: {
            "deckId": deckId,
            "visibility": active
        }
    })
    return val;
}