import axios from "axios";
import { serviceCall } from "../App";
import {
  cardGetUrl,
  cardPutCall,
  createCardUrl,
  cardImageDeleteUrl,
  cardImagePutUrl,
} from "../config/app_urls";

export const createCardService = async ({ data }) => {
  let token = serviceCall.tokenEntity.accessToken;

  var res = await axios({
    method: "POST",

    url: createCardUrl,
    data: data,

    headers: {
      "Access-Control-Allow-Origin": "*",

      Authorization: "Bearer " + token,

      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const getCardService = async (id) => {
  var response = await serviceCall.getCall({ url: `${cardGetUrl}${id}` });
  return response;
};

export const updateCardService = async ({ data }) => {
  var response = await serviceCall.putCall({ url: cardPutCall, body: data });
  return response;
};


export const updateImageService = async ({ data }) => {
  let token = serviceCall.tokenEntity.accessToken;

  var res = await axios({
    method: "PUT",

    url: cardImagePutUrl,
    data: data,

    headers: {
      "Access-Control-Allow-Origin": "*",

      Authorization: "Bearer " + token,

      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};


export const deleteImageService = async ({ imageId, cardId, type }) => {
  var response = await serviceCall.deleteCall({
    url: `${cardImageDeleteUrl}?imageId=${imageId}&cardId=${cardId}&type=${type}`,
  });
  return response;
};