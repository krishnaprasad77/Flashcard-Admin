import { Route, Routes } from "react-router-dom";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar, CssBaseline, Grid, styled, Toolbar, Typography } from "@mui/material";
import HomeScreen from "../screens/homescreen";
import ViewSection from "../screens/viewSection";
import CreateDeck from "../screens/deckCreateScreen";
import ViewDeck from "../screens/viewDeckScreen";
import AddCardScreen from "../screens/cardCreateScreen";
import SectionCreateScreen from "../screens/sectionAddScreen";
import EditSection from "../screens/editSection";
import { UpdatePopup } from "./updatePopup";
import ServerErrorPage from "./server_error_page";
import OfflineScreen from "./no_network";
import TimeOutPage from "./timeout";
import CreateImageLinkScreen from "../screens/createImageLinkScreen";

export default function Navigationbar({ theme }) {
  const AppHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  }));
  return (
    <ThemeProvider theme={theme}>


      <Box
        component="main"
        sx={{
          bgcolor: "primary.bgcolor",
          minHeight: "100vh",
          minWidth: "100%",
        }}
      >

        <CssBaseline />

        <Routes>
          <Route path="/" element={<HomeScreen />}></Route>
          <Route path="/viewSection" element={<ViewSection />}></Route>
          <Route path="/viewDeck" element={<ViewDeck />}></Route>
          <Route path="/adddeck" element={<CreateDeck />}></Route>
          <Route path="/addcard" element={<AddCardScreen />}></Route>
          <Route path="/createSection" element={<SectionCreateScreen />}></Route>
          <Route path="/editSection" element={<EditSection />}></Route>
          <Route path="/timeout" element={<TimeOutPage />}></Route>
          <Route path="/nonetwork" element={<OfflineScreen />}></Route>
          <Route path="/somethingwentwrong" element={<ServerErrorPage />}></Route>
          <Route path="/cardImageLinkScreen" element={<CreateImageLinkScreen />}></Route>
        </Routes>
      </Box>
    </ThemeProvider>
  );
};

