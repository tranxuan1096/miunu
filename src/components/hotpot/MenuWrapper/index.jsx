import React from 'react';
import './menu-wrapper.scss';
import { $MENU, $SHEET, $CART } from "../../../constant";
import { getJSON, currencyFormat, removeElement, removeItemAll, getSheetURL } from "../../../api/helper";
import MenuItem from '../MenuItem';


const MenuWrapper = (props) => {
    let menu = props.menu ? props.menu : $MENU;
    let [state, setState] = React.useState({
        viewMode: false,
        reset: false,
        selections: [],
    });
    const filterRef = React.useRef("");
    const bistroRef = React.useRef(1);

    React.useEffect(() => {
        //get sheet name
        async function fetchData() {
            let url =
                "https://spreadsheets.google.com/feeds/worksheets/" +
                $SHEET.baseCode +
                "/public/basic?alt=json";
            const response = await getJSON(url, function (err, data) {
                let tempA = [];
                if (err !== null) {
                    alert("Something went wrong: " + err);
                } else {
                    let resArray = data.feed.entry;
                    resArray.forEach((item, index) => {
                        let obj = item.title.$t;
                        tempA.push(obj);
                    });
                }
                setState({ ...state, selections: tempA });
                return tempA;
            });
        }
        fetchData();
    }, []);

    const changeView = () => {
        setState({
            ...state,
            viewMode: !state.viewMode,
        });
        props.clear();
    };
    let timeout = null;

    const inputChange = (e) => {
        function to() {
            let value = filterRef.current.value;
            props.collectFilter(value);
        }
        clearTimeout(timeout);
        timeout = setTimeout(to, 800);
    };
    const inputClear = (e) => {
        filterRef.current.value = "";
        filterRef.current.focus();
        props.collectFilter("");
    };
    const selectChange = (e) => {
        props.setTab(bistroRef.current.value);
    };
    const refreshHandle = e => {
        console.log('f5')
    }
    const saveHandle = e => {
        console.log('save')
    }
    // const clearCart = () => {

    // 	props.clear();
    // };
    //  UI
    const tableRender = () => {
        return (
            <table className="menu-table">
                <caption>Lẩu cá viên</caption>
                <thead>
                    <tr>
                        <th className="menu-head__index">Stt</th>
                        <th className="menu-head__name">Tên món</th>
                        <th className="menu-head__image">Hình</th>
                        <th className="menu-head__price">Đơn giá</th>
                        <th className="menu-head__quantity">Số lượng</th>
                        <th className="menu-head__sum">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {menu.map((item, index) => {
                        return (
                            <MenuItem
                                key={index}
                                data={item}
                                add={props.add}
                                minus={props.minus}
                                view={state.viewMode}
                                reset={props.resetItem}
                            />
                        );
                    })}
                </tbody>
            </table>
        );
    };
    const blocksRender = () => {
        return (
            <div className="blocks-wrapper">
                <div className="blocks-content-wrapper">
                    {menu.map((item, index) => {
                        return (
                            <MenuItem
                                key={index}
                                data={item}
                                add={props.add}
                                minus={props.minus}
                                view={state.viewMode}
                                reset={props.resetItem}
                            />
                        );
                    })}
                </div>
            </div>
        );
    };
    return (
        <div>
            <div className="action-select-bistro-wrapper">
                <h2 className="page-heading-2">Chọn quán</h2>
                <select name="bistro" ref={bistroRef} onChange={selectChange}>
                    {state.selections.length > 0
                        ? state.selections.map((it, ix) => {
                            return (
                                <option key={ix} value={ix + 1}>
                                    {it}
                                </option>
                            );
                        })
                        : ""}
                </select>
            </div>
            <h3 className="bistro-name">
                Menu {props.bistroName ? props.bistroName : ""}
                <p className="last-updated">({props.lastUpdate ? props.lastUpdate : ""})</p>
            </h3>

            <div className="action-bar">
                <div className="action-filter-wrapper">
                    <input
                        className="action-filter-input"
                        type="text"
                        ref={filterRef}
                        onKeyUp={inputChange}
                        placeholder="Tìm kiếm"
                    />

                    <button onClick={inputClear}>
                        <i className="fa fa-times"></i>
                    </button>

                </div>
                <div className="quick-btn-wrapper">
                    {/* <button className="action-btn action-del" onClick={clearCart}>
						<i className="far fa-trash-alt"></i>
					</button> 
                    <button className="action-btn" onClick={refreshHandle}>
                        <i className="fas fa-sync-alt"></i>
                    </button >
                    <button className="action-btn" onClick={saveHandle}>
                        <i className="far fa-save"></i>
                    </button>*/}
                    <button
                        className="action-btn action-change-view"
                        onClick={changeView}
                    >
                        {state.viewMode ? (
                            <i className="fas fa-th"></i>
                        ) : (
                            <i className="fas fa-table"></i>
                        )}{" "}
                    </button>

                </div>
            </div>
            {state.viewMode ? tableRender() : blocksRender()}
        </div>
    );
};
export default MenuWrapper;