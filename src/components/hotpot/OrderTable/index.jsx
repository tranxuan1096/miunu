import React from 'react';
import './order-table.scss';
import { getJSON, currencyFormat, removeElement, removeItemAll, getSheetURL } from "../../../api/helper";
import { $MENU, $CART, $SHEET } from "../../../constant";

const OrderTable = (props) => {
    let order = props.data;
    let finSum = 0;
    const [state, setState] = React.useState({
        ...props,
        sum: 0,
        person: 1,
        perOne: 0,
        fullView: false,
    });

    React.useEffect(() => {
        // console.log('props changes');
        let finSum = 0;
        order.forEach((item) => (finSum += item.sum));
        setState({
            ...state,
            sum: finSum,
            perOne: finSum / state.person,
        });
    }, [props]);
    React.useEffect(() => {
        setState({
            ...props,
            sum: 0,
            person: 1,
            perOne: 0,
            fullView: false,
        });
    }, [props.reset]);
    const handleMinus = (e) => {
        let temp = state.person;
        if (temp > 1) {
            setState({
                person: state.person--,
                ...state,
                perOne: state.sum / state.person--,
            });
        }
    };
    const handleAdd = (e) => {
        let temp = state.person;

        setState({
            person: state.person++,
            ...state,
            perOne: state.sum / state.person++,
        });
    };
    const viewAll = (e) => {
        setState({
            ...state,
            fullView: !state.fullView,
        });
    };
    //UI
    let wrapClass = order.length > 0 ? " visible " : " hid ";
    let view = state.fullView ? " full-view " : "";

    return (
        <div className={"order-wrapper " + wrapClass + view}>
            <div className="order__list">
                <table className="order__table">
                    <thead>
                        <tr>
                            <th className="order-head__name">Tên món</th>
                            <th className="order-head__count">Số lượng</th>
                            <th className="order-head__sum">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.length > 0 ? (
                            order.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="order-row__name">{item.name}</td>
                                        <td className="order-row__count">{item.count}</td>
                                        <td className="order-row__sum">
                                            {currencyFormat(item.sum)}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr className="hidden"></tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="order-foot__label">Tổng cộng:</td>
                            <td className="order-foot__value" colSpan="2">
                                {currencyFormat(state.sum)}
                            </td>
                        </tr>
                        <tr>
                            <td className="order-foot__label" colSpan="2">
                                Số người:
							</td>
                            <td className="order-foot__btn">
                                <div className="person-quantity">
                                    <span className="sm-btn minus" onClick={handleMinus}>
                                        -
									</span>
                                    <span className="number">{state.person}</span>
                                    <span className="sm-btn add" onClick={handleAdd}>
                                        +
									</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="order-foot__label">Mỗi thằng trả:</td>
                            <td className="order-foot__value" colSpan="2">
                                {currencyFormat(state.perOne)}
                            </td>
                        </tr>
                        <tr>
                            <td className="order-foot__btn" colSpan="3">
                                <button onClick={viewAll}>
                                    {state.fullView ? "Ẩn hóa đơn" : "Xem hóa đơn"}
                                </button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};
export default OrderTable;
