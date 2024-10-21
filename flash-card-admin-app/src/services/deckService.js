import { serviceCall } from "../App"
import { deleteCardUrl, deleteDeckUrl, hideCardUrl, hideDeckUrl, viewDeckUrl, deckCreateUrl, deckGetUrl, deckImageDeleteUrl, deckImageUpdateUrl, deckUpdateUrl } from "../config/app_urls";
import axios from 'axios';

export const deckCreateService = async ({ data }) => {
    var res;
    try {
        res = await axios({
            method: 'POST',
            url: deckCreateUrl,
            data: data,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "multipart/form-data",
                Authorization: `Bearer ${serviceCall.tokenEntity.accessToken}`,
            },

        });
    } catch (error) {
        
    }
    return res.data;
};

export const getDeckService = async (id) => {
    var res = await serviceCall.getCall({
        url: `${deckGetUrl}/${id}`,

    })
    return res;
}

export const updateDeckService = async ({ data }) => {
    var res = await serviceCall.putCall({
        url: deckUpdateUrl,
        body: data
    })
    return res;
}

export const deleteDeckImageService = async (imageId, deckId) => {

    var res = await serviceCall.deleteCall({
        url: `${deckImageDeleteUrl}/?deckId=${deckId}&imageId=${imageId}`,

    })
    return res;
}

export const updateDeckImageService = async ({ data }) => {
    var res;
    try {
        res = await axios({
            method: 'PUT',
            url: deckImageUpdateUrl,
            data: data,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "multipart/form-data",
                Authorization: `Bearer ${serviceCall.tokenEntity.accessToken}`,
            },

        });
    } catch (error) {
        
    }
    return res.data;
}