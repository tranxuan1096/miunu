import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import * as HELPER from '../../../api/helper';
import * as STORE from '../../../api/firestoreServices';
import * as FIREBASE from "../../../api/firebase";
import './room.scss';
import { cleanup } from '@testing-library/react';
const FS = FIREBASE.firestore;

const Room = (props) => {
    let { roomCode } = useParams();
    let history = useHistory();
    let [room, setRoom] = useState(null)
    let [users, setUsers] = useState(null)
    let [me, setMe] = useState(null)
    const mount = () => {
        init();

    }
    useEffect(mount, [setRoom, setUsers, setMe])
    const init = async () => {
        let UID = HELPER.getLocal('miunopoly').UID;
        let localRoomCode = HELPER.getLocal('miunopoly').roomCode;
        if (UID && localRoomCode && localRoomCode == roomCode) {
            //các ref
            let roomRef = FS.collection('rooms').doc(roomCode)
            let meRef = FS.collection("rooms").doc(roomCode).collection("users").doc(UID);
            let userRef = FS.collection("rooms").doc(roomCode).collection("users")
            var realtimeUsers = await userRef.onSnapshot(q => {
                let ms = []
                q.forEach(doc => {
                    ms.push(doc.data())
                })
                setUsers(ms);
            })
            var realtimeRoom = await roomRef.onSnapshot(doc => {
                setRoom(doc.data())
            })
            var realtimeMe = await meRef.onSnapshot(doc => {
                setMe(doc.data())
            })

        }
        else {
            history.push('typhu/room/' + localRoomCode);
        }

        return function cleanup() {
            console.log('unmount')
            //unmount clear subscribe
            realtimeRoom();
            realtimeMe();
            realtimeUsers();
        }
    }
    const handleOut = e => {
        let UID = HELPER.getLocal('miunopoly').UID;
        let roomCode = HELPER.getLocal('miunopoly').roomCode;
        const afterDelete = () => {
            //push history
            setTimeout(() => {
                console.log(UID, ' đã thoát!')
                history.push(props.parentPath);
            }, 0);
        }
        //update số người trong phòng
        let count = room.peopleCount;
        FS.collection('rooms').doc(roomCode).update({ peopleCount: count - 1 })
        //delete user trên server
        let userRef = FS.collection("rooms").doc(roomCode).collection("users").doc(UID);
        STORE.removeDoc_v2(userRef, afterDelete);
        //delete localstorage
        HELPER.removeLocal('miunopoly');
    };
    return (<div className="container room">
        <div className="header-action-bar">
            <span className="header-action-bar__out"><button onClick={handleOut}>◁</button></span>
            <div className="header-action-bar__code">{roomCode}</div>
            <span className="header-action-bar__setting">Set</span>
        </div>
        <div className="room-content">
            {/* {room ? room.roomCode : 'dsadas'} */}
            {users && me ? <Users list={users} me={me.UID} /> : 'Load người chơi'}
        </div>
        <div className="room-footer-log">

        </div>
    </div>);
};
export default Room;

const Users = (props) => {
    let me = props.me ? props.me : null;
    let list = props.list ? props.list : '';
    let [userList, setUserList] = useState([])
    const init = () => {
        setUserList(list);
    }
    useEffect(init, [list])
    const getLink = (id) => {
        return `https://avatars.dicebear.com/api/avataaars/${id}.svg?mood[]=happy'`;
    }
    return (<div className="room-user-list">
        {userList.map((item, index) => {
            return (
                <div key={index} className={`room-user-item ${item.UID == me ? 'me ' : ''}${item.role == 'admin' ? 'admin' : ''}`}>
                    <div className="user-avatar"><img src={getLink(item.UID)} alt={item.UID} /></div>
                    <div className="user-name">{item.role == 'admin' ? <span>⭐</span> : ''} {item.userName}</div>
                </div>
            )
        })}
    </div>);
}

export { Users };