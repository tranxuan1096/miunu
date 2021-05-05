import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Route, Switch, useLocation, useRouteMatch, withRouter } from 'react-router-dom';
import CreateRoomForm from '../../components/miunopoly/CreateRoomForm';
import JoinRoomForm from '../../components/miunopoly/JoinRoomForm';
import NavBar from '../../components/NavBar';

// CONTAINERS
const Entrance = (props) => {
    let [form, setForm] = useState(1);


    const createRoom = e => {
        e.preventDefault()
        setForm(1)
    }
    const joinRoom = e => {
        e.preventDefault()
        setForm(2)
    }
    return (
        <div className="center-container">
            <NavBar />
            <div className="starter-form">
                <div className="starter__choose">
                    <button className={`starter__choose__link ${form == 1 ? 'active' : ''}`} onClick={createRoom}>Tạo phòng</button>
                    <button className={`starter__choose__link ${form == 2 ? 'active' : ''}`} onClick={joinRoom}>Tham gia phòng</button>
                </div>
                <div className="starter__setting">
                    {form == 1 ? <CreateRoomForm /> : <JoinRoomForm />}
                </div>
            </div>
        </div >
    );
};
export default Entrance;
