import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useRouteMatch, withRouter } from 'react-router-dom';
import * as STORE from '../../../api/firestoreServices.js';
import * as HELPER from '../../../api/helper';
import * as FIREBASE from "../../../api/firebase";


const FS = FIREBASE.firestore;

const JoinRoomForm = () => {
    let yourName = useRef(null);
    let roomCode = useRef(null);

    let [messText, setMess] = useState("");

    let { path, url } = useRouteMatch();
    let history = useHistory();


    useEffect(() => {
        roomCode.current.focus();
    }, [-1])
    const formSubmit = e => {
        e.preventDefault();
        let _roomCode = roomCode.current.value;
        let _yourName = yourName.current.value;
        let UID = "u_" + HELPER.makeID(4);
        const afterGetRoom = (doc) => {
            if (doc.exists) {
                //có phòng
                //kiểm tra expired, full người, start chưa
                let exp = doc.data().expired;
                let full = doc.data().peopleCount < doc.data().maxPeople ? false : true;
                let start = doc.data().gameStart;
                let startMoney = doc.data().starterMoney;
                if (!exp && !full && !start) {
                    setMess('Phòng sẵn sàng! Chờ một tí ~')
                    //Add user vào phòng
                    //user data
                    let userSet = {
                        UID,
                        roomCode: _roomCode,
                        role: 'member',
                        userName: _yourName,
                        userMoney: startMoney
                    }
                    let userRef = FS.collection("rooms").doc(_roomCode).collection("users").doc(UID);
                    STORE.setDoc_v2(userRef, userSet);
                    console.log(_yourName + ' đã tham gia')
                    //Tăng số người trong phòng
                    let count = doc.data().peopleCount;
                    STORE.updateDoc('rooms', _roomCode, { peopleCount: count + 1 })
                    //Chuyển URL
                    history.push(`${url}/room/${_roomCode}`)
                    //Lưu Local
                    HELPER.setLocal('miunopoly', { UID, roomCode: _roomCode })
                }
                else {
                    if (exp) setMess('Phòng đã hết hạn!');
                    if (full) setMess('Phòng đã đầy!');
                    if (start) setMess('Trò chơi đã bắt đầu!');
                }
            } else {
                setMess("Phòng không tồn tại!");
            }
        }
        STORE.getDoc('rooms', _roomCode, afterGetRoom)
    }
    return (
        <form className="form-wrapper monopoly" method="POST" onSubmit={formSubmit}>
            <div className="form-control">
                <label htmlFor="room-code">Mã phòng: </label>
                <input name="room-code" type="text" ref={roomCode} required></input>
            </div>
            <div className="form-control">
                <label htmlFor="your-name">Tên của bạn: </label>
                <input name="your-name" type="text" ref={yourName} required></input>
            </div>
            <div className="form-control">
                <button type="submit">THAM GIA</button>
            </div>
            <p className="message">{messText}</p>
        </form>
    );
}
export default withRouter(JoinRoomForm);