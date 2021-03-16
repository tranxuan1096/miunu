import React from 'react';
import { getJSON, currencyFormat, removeElement, removeItemAll, getSheetURL } from "../../api/helper";
import { $MENU, $CART, $SHEET } from "../../constant";
import './menu-item.scss';
const MenuItem = (props) => {
    let item = props.data;
    let viewMode = props.view;
    let [state, setState] = React.useState({
        count: 0,
        sum: 0,
        selected: false,
    });
    React.useEffect(() => {
        setState({
            count: 0,
            sum: 0,
            selected: false,
        });
    }, [props.reset]);
    const handleMinus = (item) => {
        if (state.count > 0) {
            setState({
                count: state.count--,
                ...state,
                sum: state.count * item.price,
                selected: state.count > 0 ? true : false,
            });
        }
        let obj = {
            count: state.count,
            sum: state.count * item.price,
            ...item,
        };
        props.minus(obj);
    };
    const handleAdd = (item) => {
        setState({
            count: state.count++,
            ...state,
            sum: state.count * item.price,
            selected: state.count > 0 ? true : false,
        });
        let obj = {
            count: state.count,
            sum: state.count * item.price,
            ...item,
        };
        props.add(obj);
    };

    let select = state.selected ? " selected " : "";
    let visible = item.visible ? "" : " hidden ";
    let finClass = select + visible;
    const tableRowRender = () => {
        return (
            <tr className={"menu-row " + finClass}>
                <td className="menu-row__index">
                    <div className="cell-wrap">{item.id}</div>
                </td>
                <td className="menu-row__name">
                    <div className="cell-wrap">{item.name}</div>
                </td>
                <td className="menu-row__image">
                    <div className="name">{item.name}</div>
                    <div className="cell-wrap img-wrap">
                        <img src={item.img} alt={item.slug} />
                    </div>
                </td>
                <td className="menu-row__price">
                    <div className="cell-wrap">{currencyFormat(item.price)}</div>
                </td>
                <td className="menu-row__quantity">
                    <div className="cell-wrap">
                        <span
                            className="row-btn minus"
                            onClick={() => handleMinus(item)}
                        >
                            -
						</span>
                        <span className="number">{state.count}</span>
                        <span className="row-btn add" onClick={() => handleAdd(item)}>
                            +
						</span>
                    </div>
                </td>
                <td className="menu-row__sum">
                    <div className="cell-wrap">{currencyFormat(state.sum)}</div>
                </td>
            </tr>
        );
    };
    const blockRender = () => {
        return (
            <div className={"block-item-wrapper" + finClass} data-id={item.id}>
                <div className="block-item__name">{item.name}</div>
                <div className="block-item__image">
                    {" "}
                    <img src={item.img} alt={item.slug} />
                </div>
                <div className="block-item__price">
                    {currencyFormat(item.price)}
                </div>
                <div className="block-item__quantity">
                    <div className="minus-add">
                        <span
                            className="sm-btn minus"
                            onClick={() => handleMinus(item)}
                        >
                            -
						</span>
                        <span className="number">{state.count}</span>
                        <span className="sm-btn add" onClick={() => handleAdd(item)}>
                            +
						</span>
                    </div>
                </div>
            </div>
        );
    };
    return viewMode ? tableRowRender() : blockRender();
};
export default MenuItem;