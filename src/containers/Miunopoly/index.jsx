import React, { Fragment, useEffect, useState } from 'react';
import { NavLink, Route, Switch, useHistory, useLocation, useRouteMatch, withRouter } from 'react-router-dom';
import * as STORE from '../../api/firestoreServices.js';
import * as HELPER from '../../api/helper';
import CreateRoomForm from '../../components/miunopoly/CreateRoomForm/index.jsx';
import JoinRoomForm from '../../components/miunopoly/JoinRoomForm/index.jsx';
import { Room } from '../../components/miunopoly/Room';
import PrivateRoute from '../../components/PrivateRoute/index.jsx';
import Entrance from './Entrance';
import './monopoly.scss';


const Miunopoly = (props) => {
    let [isLoged, setLog] = useState(false);
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
                        setLog(true);
                        history.push(`${path}/room/${localData.roomCode}`);
                    }
                    else {
                        //phòng unavailable
                        history.push(path);
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
    const ACTIVE_CLASS = 'active';
    return (
        <div>
            <Switch>
                <Route exact path={`${path}`} render={() => { return (<Entrance />) }} />
                <Route exact path={`${path}/room/:roomCode`} children={<Room parentPath={path} />} />
            </Switch>
        </div >);
}

export default withRouter(Miunopoly);

