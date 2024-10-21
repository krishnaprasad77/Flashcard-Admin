import { serviceCall } from "../App"
import axios from "axios";
import { imageUrlLink } from "../config/app_urls";

export const createImageLinkService = async (image) => {
    let token = serviceCall.tokenEntity.accessToken;
    
    var res;
    const data = new FormData();
    data.append('image', image)
    try {
        res = await axios({
            method: 'POST',
            url: imageUrlLink,
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