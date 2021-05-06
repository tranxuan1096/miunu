import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory, useLocation, useRouteMatch, withRouter } from 'react-router-dom';
import * as STORE from '../../api/firestoreServices.js';
import * as HELPER from '../../api/helper';
import Room from '../../components/miunopoly/Room';
import Entrance from '../../components/miunopoly/Entrance';
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
                        console.log('Đã tham gia');

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

