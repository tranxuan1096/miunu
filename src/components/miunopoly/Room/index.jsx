import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import * as HELPER from '../../../api/helper';

export const Room = (props) => {
    let { roomCode } = useParams();
    let history = useHistory();

    const handleOut = e => {
        e.preventDefault();
        HELPER.removeLocal('miunopoly');
        setTimeout(() => {
            history.push(props.parentPath);
        }, 1000);
    };
    return (<div>{roomCode}
        <button onClick={handleOut}>Thoát</button>
    </div>);
};
export default Room;
