import React, { useState } from "react";
import appConfig from '../../config/app_config.json';
import CommonPopup from "./commonPopup";
import Success from '../../assets/images/update.png'
import swal from 'sweetalert';
import TokenService from "../../services/token_service";
import NoNetwork from "../../assets/images/no_internet.gif";
// import Error from "../../assets/images/error.gif";
import Timeout from "../../assets/images/time_out.png"
import preloading from "./Loader"
import '../styles/success.css';
import { useNavigate } from "react-router-dom";
import { Error, History, WarningAmberRounded, Wifi } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

export const HandleSubmitComponent = ({
    //this a method returns the component and has a parameter as callback (handleSubmitResponse)
    successComponent
}) => {
    let navigate = useNavigate()
    const [dup, setdup] = useState({
        status: false,
        value: ''
    })
    const [nnc, setNnc] = useState({ status: false })
    const [se, setSe] = useState({ status: false, value: '' })
    const [unf, setunf] = useState({ status: false, value: '' })
    const [fve, setFve] = useState({ status: false, value: '' })
    const [auth, setAuth] = useState({ status: false })
    const [timeout, setTimeOut] = useState({ status: false, value: '' })
    const [userMissMatch, setUserMissMatch] = useState({ status: false, value: '' })
    const [waiting, setWaiting] = useState({ status: false, value: '' })
    const [login, setLogin] = useState({ status: false, value: '' })
    const handleServiceCall = async ({ successCb, serviceCb, userNotMatch, successMessage }) => {
        setWaiting({ status: true });

        let val;
        if (serviceCb) {
            val = await serviceCb();
        }
        if (val) {
            handleSubmitResponse({
                successCb: successCb,
                data: val,
                userNotMatch: userNotMatch,
                successMessage: successMessage
            })

        }
    }
    const handleSubmitResponse = async ({ successCb, data, userNotMatch, successMessage }) => {
        setWaiting({ status: false });
        if (data && data.header) {
            if (data.header.code == appConfig.statusCode.Success) {
                if (data.body) {
                    return successSweetAlert(data.body.value, async () => {
                        await successCb(data.body.value);

                    })
                } else {
                    return successSweetAlert(successMessage, async () => {
                        await successCb();
                    })
                }
            }
            else if (data.header.code == appConfig.statusCode.ServerError || data.header.code == appConfig.statusCode.ServerSendError || data.header.code == appConfig.statusCode.WrongEndPoint) {

                setSe({ status: true, value: data.body?.error ? data.body?.error : data.body?.value ? data.body?.value : 'Something went wrong' });
            }
            else if (data.header.code === appConfig.statusCode.UserNotFound) {
                setunf({ status: true, value: data.body.value });
            }
            else if (data.header.code == appConfig.statusCode.NoData) {
                if (userNotMatch) {
                    // no data as something went wrong

                    setSe({ status: true, value: data.body?.error ? data.body?.error : data.body?.value ? data.body?.value : 'Something went wrong' });

                } else {
                    setUserMissMatch({ status: true, value: data.body.value ? data.body.value : data.body.error });
                }
            }

            else if (data.header.code == appConfig.statusCode.NoNetConn) {
                setNnc({ status: true });
            }
            else if (data.header.code == appConfig.statusCode.Authorize) {
                setAuth({ status: true });
            }
            else if (data.header.code == appConfig.statusCode.Dupliation) {
                setdup({
                    status: true,
                    value: data.body.value
                });
            }
            else if (data.header.code == appConfig.statusCode.TimeOut) {
                setTimeOut({ status: true, value: data.body.value });
            }
            else if (data.header.code == appConfig.statusCode.FieldValidate) {


                setFve({
                    status: true,
                    value: data.error[0].msg
                })
            }
            else if (data.header.code == appConfig.statusCode.TokenExpires) {
                TokenService.cleanTokenEntity();
                navigate('/')
                window.location.reload()
                return <></>;
            }
            // else if (!window.navigator.onLine) {
            //     setNnc({ status: true });
            // }
        } else {
            setunf({ status: true, value: data.body.value });

        }
    }
    return (<>
        {waiting && <CommonPopup setOpenModal={setWaiting}
            // image={preloading}
            icon={<CircularProgress sx={{ color: '#FFBC3A' }} />}
            openModal={waiting}
            content="Submitting.........."
        />}
        {nnc && <CommonPopup
            setOpenModal={setNnc}
            openModal={nnc}
            heading='No Internet Connection!'
            content='Please Try Again Later'
            actionLabel1='Ok'
            icon={<Wifi sx={{ fill: '#FFBC3A' }} />}
        />}

        {se && <CommonPopup
            setOpenModal={setSe}
            openModal={se}
            content={se.value}
            actionLabel1='OK'
            icon={<WarningAmberRounded sx={{ fill: '#FFBC3A' }} />}
        />
        }

        {dup && <CommonPopup
            setOpenModal={setdup}
            openModal={dup}
            // heading='Oops'
            content={dup.value}
            actionLabel1='OK'
            icon={<Error sx={{ fill: '#FFBC3A' }} />}
        />}
        {auth && <CommonPopup
            setOpenModal={setAuth}
            openModal={auth}
            heading='Access Denied'
            content='You are not authorized for this page.'
            actionLabel1='OK'
            icon={<Error sx={{ fill: '#FFBC3A' }} />}
        />}
        {unf && <CommonPopup
            setOpenModal={setunf}
            openModal={unf}
            // heading='Oops'
            content={unf.value}
            actionLabel1='Login Again'
            icon={<Error sx={{ fill: '#FFBC3A' }} />}
        />}
        {timeout && <CommonPopup
            setOpenModal={setTimeOut}
            openModal={timeout}
            // heading='TimeOut'
            content={timeout.value}
            actionLabel1='OK'
            icon={<History sx={{ fill: '#FFBC3A' }} />}
        />}
        {userMissMatch && <CommonPopup
            setOpenModal={setUserMissMatch}
            openModal={userMissMatch}
            // heading='User Miss Match'
            content={userMissMatch.value}
            actionLabel1='OK'
            icon={<Error sx={{ fill: '#FFBC3A' }} />}
        />}
        {fve && <CommonPopup

            setOpenModal={setFve}
            openModal={fve}
            content={fve.value}
            actionLabel1='OK'
            icon={<Error sx={{ fill: '#FFBC3A' }} />}
        />
        }
        {successComponent(handleServiceCall)}
    </>)
}
const successSweetAlert = (successMessage, successCb) => {
    swal({
        icon: Success,
        className: "swal-class",
        text: successMessage || "Success",
        button: false,
    });
    setTimeout(async () => {
        swal.close();
        await successCb()
    }, 2000)
}