import React, { useEffect } from 'react';
import { Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import * as STORE from '../../api/firestoreServices.js';
import * as HELPER from '../../api/helper';
import { Room } from '../../components/miunopoly/Room';
import { Entrance } from './Entrance';
import './monopoly.scss';


const Miunopoly = () => {
    let { path, url } = useRouteMatch();
    let location = useLocation();
    let history = useHistory();
    useEffect(() => {
        //Check local để chuyển route
        let localData = HELPER.getLocal('miunopoly')
        if (localData) {
            console.log('Đang vào lại phòng');
            const afterGetRoom = (doc) => {
                if (doc.exists) {
                    //có phòng
                    //kiểm tra expired, full người, start chưa
                    let exp = doc.data().expired;
                    let full = doc.data().peopleCount < doc.data().maxPeople ? false : true;
                    let start = doc.data().gameStart;
                    if (!exp && !full && !start) {
                        //phòng available
                        history.push(`${path}/room/${localData.roomCode}`);
                    }
                    else {
                        //phòng unavailable
                        history.push(`${path}`);
                    }
                } else {
                    console.log("Phòng không tồn tại!");
                    history.push(path);

                }
            }
            STORE.getDoc('rooms', localData.roomCode, afterGetRoom)
        }
        else {
            console.log('Chưa tham gia!');
            history.push(path);
        }
    }, [-1])
    return (
        <Switch>
            <Route exact path={`${path}`} >
                <Entrance />
            </Route>
            <Route path={`${path}/room/:roomCode`}><Room parentPath={path} /></Route>
        </Switch>);
}

export default Miunopoly;

