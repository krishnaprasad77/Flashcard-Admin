import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import imageUpload from "../../assets/images/imageUpload.png";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import axios from "axios";
import { serviceCall } from "../../App";
import { createImageLinkService } from "../../services/image_service";

const CreateImageLinkScreen = () => {
  const [getLink, setGetLink] = useState([]);
  const [link, setLink] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [image, setImage] = useState("");


  const validateImage = (image) => {
    const maxSize = 2 * 1024 * 1024;

    if (image.size > maxSize) {
      //error message
      return false;
    }

    return true;
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (event) => {
      const imge = event.target.files[0];
      if (imge) {
        const isValidSize = validateImage(imge);

        if (isValidSize) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const url = event.target.result;
            setImage(imge);
            setSelectedImage(url);
          };

          reader.readAsDataURL(imge);
        }
      }
    };

    input.click();
  };






  const handleCopyToClipborad = (value) => {

    
    navigator.clipboard.writeText(value);
  };


  const deleteImage = () => {
    setSelectedImage(null)
    setLink(null);
    
  }


  const handleGetLink = async () => {
    let response = await createImageLinkService(image);
    
    if (response.header.code == '600') {
      // setSelectedImage("")
      setLink(true);
      setGetLink(response.body?.value.image);
      // 
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container flexDirection={"column"} spacing={3} paddingTop={4}>
        <Grid item>
          <Typography variant="h5">Create Image Link</Typography>
        </Grid>
        <Grid item>
          <Typography
            borderRadius={1}
            bgcolor={"#EF620114"}
            padding={{ xs: 2, md: 4 }}
          >
            As an admin you can upload images and generate URLs for the images that can be associated with your flashcard content.
            Once you upload an image here  you will get a “Get Link”  button by clicking on it unique URL will be  generated for it. This acts as a direct link to the uploaded image.
            To link an image to a specific card in your deck, simply copy the image URL using “copy link” button and paste it into the relevant cell in the Excel spreadsheet. By doing so, the image will be associated with the corresponding card when you upload the spreadsheet.

          </Typography>
        </Grid>
        <Grid item md={3}>
          <Typography>Upload Image</Typography>
          {!selectedImage ? (
            <Box
              bgcolor={"#ffffff"}
              height={{ xs: "7.75rem", lg: "9.45rem" }}
              borderRadius={1.2}
              border={"2px solid #D9D9D9"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              onClick={handleImageUpload}
            >
              <img src={imageUpload} />
            </Box>
          ) : (
            <Box height={{ sx: "7.75rem", lg: "9.45rem" }} position={"relative"}>
              <img
                src={selectedImage}
                width={"100%"}
                height={"100%"}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  zIndex: 1,
                  top: 5,
                  right: 5,
                  color: "#F63F3F",
                  backgroundColor: "#D9D9D9",
                }}
                onClick={() => {
                  deleteImage();
                }}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>

            </Box>
          )}
        </Grid>
        <Grid item container>
          {link ? <TextField
            placeholder="Image Link"
            size="small"
            value={getLink}
            sx={{
              width: "50%",
              paddingRight: 2,
              "&.css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled":
              {
                "-webkit-text-fill-color": "#000!important",
              },
            }}
            onClick={(e) => {
              handleCopyToClipborad(e.target.value);
            }}
            disabled
          /> : <></>}
          {
            getLink?.length > 0 ?
              <Button
                variant="outlined"
                onClick={() => handleCopyToClipborad(getLink)}
              >
                Copy link
              </Button> :
              <></>
          }
          {
            selectedImage && getLink?.length <= 0 ?
              <Button
                variant="contained"
                onClick={() => handleGetLink()}
                color="blackButtonColor"
                style={{ color: 'white' }}
              >
                Get link
              </Button> : <></>
          }

        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateImageLinkScreen;