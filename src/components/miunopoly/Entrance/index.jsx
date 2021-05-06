import React, { useState } from 'react';
import CreateRoomForm from '../CreateRoomForm';
import JoinRoomForm from '../JoinRoomForm';
import NavBar from '../../NavBar';

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
