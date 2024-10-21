import './App.css';
import ServiceCall from '../src/services/service_call'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { theme } from './config/theme'
import { useEffect, useState } from 'react';
import Navigationbar from './components/common/navigation';
import TokenService from './services/token_service';
import axios from 'axios';
import { tokenUrl } from './config/app_urls';
import Loader from './components/common/Loader'


function getNetworkStatus() {
  return new Promise((resolve, reject) => {
    if (window.navigator.onLine) {
      return resolve(true);
    } else {
      return resolve(false);
    }
  });
}
export var serviceCall;
let calling = true;

export async function updateTokenEntity({ accToken, refToken }) {
  
  let tokenEntity = await TokenService.setTokenEntity({
    accessToken: accToken,
    refreshToken:refToken
  });
  serviceCall = await getServiceCall();
  return tokenEntity;
}


export async function getServiceCall() {

  let tokenEntity = await TokenService.getTokenEntity();
  return new ServiceCall({
    tokenEntity: tokenEntity,
    updateTokenEntity: updateTokenEntity,
    checkNetwork: getNetworkStatus
  });
}
function App() {
  const [refereshPage, setRefereshPage] = useState(false);
  const refereshPageCb = () => {
    setRefereshPage(!refereshPage);
  }
  var flashcardAdmin;
  var origin;
  useEffect(() => {
    (
      async () => {
        // flashcardAdmin = new URLSearchParams(window.location.search).get('data')
        // // 
        // 
        // origin = window.location.origin
        // setTimeout(async () => {
        //   window.history.replaceState(null, null, origin)
        // }, 0)

        // if (!serviceCall && flashcardAdmin) {
        //   


        //   let response = await axios.post(tokenUrl, {
        //     clientId: JSON.parse(flashcardAdmin).clientId,
        //     secretKey: JSON.parse(flashcardAdmin).secretKey,
        //     userName: JSON.parse(flashcardAdmin).userName,
        //     email: JSON.parse(flashcardAdmin).email,
        //     role: "admin"
        //   });
        if (!serviceCall && calling) {
          calling = false;
          let response = await axios.post(tokenUrl, {
            clientId: "1",
            secretKey: "1c1dcf640bbd469fb4c964dcc6062645",
            userName: "FlashCardAdmin",
            email: "flashcardadmin@gmail.com",
            role: "admin"
            // clientId: JSON.parse(flashcardlearner).clientId,
            // secretKey: JSON.parse(flashcardlearner).secretKey,
            // userName: JSON.parse(flashcardlearner).userName,
            // email: JSON.parse(flashcardlearner).email,
            // role: "learner"
          });
          
          if (response.data) {
            
            if (response.data.header.code == 600) {
              // window.location.assign(`http://localhost:3001/?data=${response.data.body.value}`)
              

              await updateTokenEntity({
                accToken: response.data.body.value.accessToken, refToken: response.data.body.value.refreshToken
              })
              localStorage.setItem('primaryColor',response?.data?.body?.value?.primaryColor)
              localStorage.setItem('secondaryLightColor',response?.data?.body?.value?.secondaryLightColor)
              localStorage.setItem('secondaryDarkColor',response?.data?.body?.value?.secondaryDarkColor)
              refereshPageCb();
              //  serviceCall = await getServiceCall();
              // let accTok = serviceCall.tokenEntity.accessToken;
            }

          }
        } else {

          serviceCall = await getServiceCall();
          
        }
      }
    )();
  }, []);


  return (
    <BrowserRouter>

      {serviceCall && serviceCall.tokenEntity.accessToken ? (
        <Navigationbar theme={theme} />) :
        <CircularComp refereshPageCb={refereshPageCb} />}

    </BrowserRouter>
  );
  function CircularComp({ refereshPageCb }) {
    setTimeout(() => {
      refereshPageCb();
    }, 0)
    return <Loader />

  }

}

export default App;
