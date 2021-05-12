import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import * as STORE from '../../../api/firestoreServices.js';
import * as HELPER from '../../../api/helper';
import * as FIREBASE from '../../../api/firebase';


const FS = FIREBASE.firestore;

// COMPONENTS
const CreateRoomForm = () => {
    let roomCode = useRef(null);
    let maxPeople = useRef(null);
    let yourName = useRef(null);
    let starterMoney = useRef(null);
    let newRoundMoney = useRef(null);

    let [messText, setMess] = useState("");

    let { path, url } = useRouteMatch();
    let history = useHistory();

    useEffect(() => {
        yourName.current.focus();
    }, [-1]);

    const formSubmit = (e) => {
        e.preventDefault();
        //trích data
        let _roomCode = roomCode.current.value;
        let _maxPeople = parseInt(maxPeople.current.value);
        let _starterMoney = parseInt(starterMoney.current.value);
        let _newRoundMoney = parseInt(newRoundMoney.current.value);
        let _yourName = yourName.current.value;
        let UID = "u_" + HELPER.makeID(4);
        //user data
        let userSet = {
            UID,
            roomCode: _roomCode,
            role: 'admin',
            userName: _yourName,
            userMoney: _starterMoney
        };
        //init log
        let mess = {
            timestamp: new Date(),
            type: 'info',
            from: '',
            to: '',
            mess: "Admin" + _yourName + " đã tạo phòng!"
        }
        //room data
        let dataSet = {
            roomCode: _roomCode,
            adminID: UID,
            expired: false,
            gameStart: false,
            peopleCount: 1,
            maxPeople: _maxPeople,
            starterMoney: _starterMoney,
            newRoundMoney: _newRoundMoney,
            log: [mess],
        };
        //Sau khi tạo phòng
        const afterSetRoom = () => {
            setMess('Tạo phòng xong, chờ một tí!');
            //Add admin
            let userRef = FS.collection("rooms").doc(_roomCode).collection("users").doc(UID);
            STORE.setDoc_v2(userRef, userSet);
            //Chuyển URL
            history.push(`${url}/room/${_roomCode}`);
            //Lưu local
            HELPER.setLocal('miunopoly', { UID, roomCode: _roomCode });
        };
        //Tạo phòng
        STORE.setDoc('rooms', _roomCode, dataSet, afterSetRoom);

    };
    return (
        <form className="form-wrapper monopoly" method="POST" onSubmit={formSubmit}>
            <div className="form-control-group">
                <div className="form-control">
                    <label htmlFor="room-code">Mã phòng: </label>
                    <input name="room-code" type="text" ref={roomCode} disabled value={HELPER.makeID(6)}></input>
                </div>
                <div className="form-control">
                    <label htmlFor="room-max">Số người tối đa: </label>
                    <select name="room-max" ref={maxPeople}>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
                </div>
            </div>
            <div className="form-control">
                <label htmlFor="your-name">Tên của bạn: </label>
                <input name="your-name" type="text" ref={yourName} required></input>
            </div>
            <div className="form-control">
                <label htmlFor="starter">Tài sản khi bắt đầu ($): </label>
                <input name="starter" type="text" ref={starterMoney} required pattern="^\+?(?:[0-9]??).{1,10}[0-9]$" defaultValue="2500" onChange={() => { }}></input>
            </div>
            <div className="form-control">
                <label htmlFor="pass">Số tiền khi đi qua ô Bắt đầu ($): </label>
                <input name="pass" type="text" ref={newRoundMoney} required pattern="^\+?(?:[0-9]??).{1,10}[0-9]$" defaultValue="200" onChange={() => { }}></input>
            </div>
            <div className="form-control">
                <button type="submit">TẠO</button>
            </div>
            <p className="message">{messText}</p>
        </form>
    );
};
export default CreateRoomForm;