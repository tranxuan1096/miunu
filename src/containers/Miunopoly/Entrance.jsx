import React from 'react';
import { NavLink, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import { CreateRoomForm } from '../../components/miunopoly/CreateRoomForm';
import JoinRoomForm from '../../components/miunopoly/JoinRoomForm.jsx/index.jsx';
export const ACTIVE_CLASS = 'active';

// CONTAINERS
export const Entrance = () => {
    let { path, url } = useRouteMatch();
    let location = useLocation();

    return (
        <div className="center-container">
            <div className="starter-form">
                <div className="starter__choose">
                    <NavLink className="starter__choose__link" activeClassName={location.pathname !== url ? null : ACTIVE_CLASS} to={`${url}`}>Tạo phòng</NavLink>
                    <NavLink className="starter__choose__link" to={`${url}/joinRoom`}>Tham gia phòng</NavLink>
                </div>
                <div className="starter__setting">
                    <Switch>
                        <Route exact path={`${path}`}><CreateRoomForm /></Route>
                        <Route exact path={`${path}/joinRoom`}><JoinRoomForm /></Route>

                    </Switch>
                </div>
            </div>
        </div>
    );
};
export default Entrance;
