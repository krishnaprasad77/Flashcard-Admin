import appConfig from '../../config/app_config.json';
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import TokenService from '../../services/token_service';
import Circular from './circular';

// import Circular from './circular';
// import { Permissions } from '../../App';
// import { logoutService } from '../../services/login_service';
//success

export default function HandleViewComponent(
    {
        //this a method returns the component of success page
        successComponent,
        //this a Object of server respose
        data,
        //this a method returns the component of No data page
        noData
    }
) {


    // let { userDetails } = useContext();
    const usernotfound = async () => {
        //   let id = userDetails.id
        // await logoutService(id);
        TokenService.cleanTokenEntity();
        navigate('/')
        window.location.reload()
    };

    let timeOut = true;
    let myTimeOut = useRef();
    useEffect(() => {
        (
            async () => {
                myTimeOut.current = setTimeout(() => {

                    if (timeOut) {
                        navigate({
                            pathname: '/timeout',
                            state: {
                                value: "Time out try again"
                            }
                        });
                    }
                }, 8000)
            }
        )();
        return () => { clearTimeout(myTimeOut.current) }
    }, [])
    let navigate = useNavigate();
    try {
        if (data && data.header) {
            // 
            if (data.header.code == appConfig.statusCode.Success) {
                timeOut = false
                clearTimeout(myTimeOut.current);
                return successComponent(data.body.value);
            } else if (data.header.code == appConfig.statusCode.TimeOut) {
                timeOut = false
                clearTimeout(myTimeOut.current);
                navigate({
                    pathname: '/timeout',
                    state: {
                        value: data.body.value
                    }
                });
                return <></>;
            }
            else if (data.header.code == appConfig.statusCode.NoNetConn) {
                timeOut = false
                clearTimeout(myTimeOut.current);
                navigate({
                    pathname: '/nonetwork',
                });
                return <></>
            }
            else if (data.header.code == appConfig.statusCode.ServerError || data.header.code == appConfig.statusCode.ServerSendError) {
                timeOut = false
                clearTimeout(myTimeOut.current);
                navigate({
                    pathname: '/somethingthingwentwrong',
                    state: {
                        // value: data.body.value
                        value: data.body?.error ? data.body?.error : data.body?.value ? data.body?.value : 'something went wrong'
                    }
                });
                return <></>;
            }
            else if (data.header.code == appConfig.statusCode.Authorize) {
                timeOut = false
                clearTimeout(myTimeOut.current);
                navigate({
                    pathname: '/unauthorize',
                });
                return <></>;
            }
            else if (data.header.code == appConfig.statusCode.UserNotFound) {
                timeOut = false
                clearTimeout(myTimeOut.current);
                usernotfound()
                // navigate({
                //     pathname: '/usernotfound',
                //     state: {
                //         value: data.body?.error ? data.body?.error : data.body?.value? data.body?.value:'something went wrong'
                //     }
                // });
                return <></>;
            }
            else if (data.header.code == appConfig.statusCode.NoData) {
                timeOut = false
                clearTimeout(myTimeOut.current);
                let msg = data.body.value ? data.body.value : data.body.error ? data.body.error : 'No Data'
                return noData(msg);
            } else if (data.header.code == appConfig.statusCode.TokenExpires) {
                timeOut = false
                clearTimeout(myTimeOut.current);
                TokenService.cleanTokenEntity();
                navigate('/')
                window.location.reload()
                return <></>;
            }
            else if (data.header.code == appConfig.statusCode.WrongEndPoint) {
                timeOut = false
                clearTimeout(myTimeOut.current);

                navigate({
                    pathname: '/somethingwentwrong',
                    state: {
                        value: data.body?.error ? data.body?.error : data.body?.value ? data.body?.value : 'something went wrong'
                    }
                });
                return <></>;
            }
            else {
                return <Circular></Circular>;
            }
        } else {

            return <Circular></Circular>;
        }
    } catch (e) {


        return <Circular></Circular>;
    }
}
