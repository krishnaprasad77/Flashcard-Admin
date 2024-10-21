import { createTheme } from "@mui/material";

const primary = "#000";
const secondary = '#0F4CD9';
const third = '#F6F6F4';

export const theme = createTheme({
    palette: {
        primary: {
            main: primary,
            bgcolor: '#FBFBFB'

        },
        secondary: {
            main: secondary
        },
        third: {
            main: third
        },
        yellowButtonColor: {
            main: '#FFC555'
        },
        buttonTextColor: {
            main: '#000'
        },
        blackButtonColor: {
            main: '#2A2A2A'
        },
        addCard: {
            main: '#D9D9D9'
        },
        editButton: {
            main: "#daecf3"
        },
        deleteButton: {
            main: "#fadcd5"
        }

    },

    typography: {
        fontFamily: "'Open Sans'"
    },

    components: {
        MuiImageListItemBar: {
            styleOverrides: {
                titleWrap: {
                    padding: 0,
                    color: "black"

                },

                root: {
                    backgroundColor: '#DAD6D2',
                    opacity: .9
                }
            }

        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    color: "#C4C4C4",
                    '&.Mui-checked': {
                        color: "#000",
                    },
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& label.Mui-focused': {
                        color: '#707070',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#D9D9D9',
                        },
                        '&:hover fieldset': {
                            borderColor: '#D9D9D9',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#D9D9D9',
                        },
                    },
                }
            }
        }

    }

});