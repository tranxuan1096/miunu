import React from 'react';
import * as CONST from "../../constant";
import * as HELPER from "../../api/helper";
import OrderTable from '../../components/hotpot/OrderTable';
import MenuWrapper from '../../components/hotpot/MenuWrapper';
import NavBar from '../../components/NavBar';


var $MENU = CONST.$MENU;
var $CART = CONST.$CART;
const HotPot = () => {
    let [state, setState] = React.useState({
        cart: $CART,
        menu: $MENU,
        bistroName: "",
        bistroTab: "1", //also is resetITEM
        resetOrder: false,
        lastUpdate: ""
    });
    async function fetchData() {
        const response = await HELPER.getJSON(
            //get sheet content
            HELPER.getSheetURL("", state.bistroTab),
            function (err, data) {
                let tempA = [];
                let nameOfMenu = "";
                let lastModified = "";
                if (err !== null) {
                    alert("Something went wrong: " + err);
                } else {
                    let resArray = data.feed.entry;
                    nameOfMenu = data.feed.title.$t;
                    resArray.forEach((item, index) => {
                        let obj = {
                            id: item.gsx$id ? item.gsx$id.$t : null,
                            name: item.gsx$name ? item.gsx$name.$t : null,
                            price: item.gsx$price ? item.gsx$price.$t : null,
                            img: item.gsx$img ? item.gsx$img.$t : null,
                            visible: true,
                        };
                        if (index === 0) {
                            lastModified = item.gsx$lastmodified ? item.gsx$lastmodified.$t : '';
                        }
                        //console.log(obj);
                        tempA.push(obj);
                    });
                }
                // $MENU = tempA; SETLOCAL
                //xử lý LOCAL
                //khởi tạo
                if (!HELPER.getLocal('miuhotpot')) {
                    HELPER.setLocal('miuhotpot', []);
                }
                let localArray = HELPER.getLocal('miuhotpot');
                //check xem có menu này chưa, chưa thì push vô lưu
                if (localArray.filter(function (item) {
                    if (item)
                        return item.menuName === nameOfMenu && item.lastModified === lastModified;
                    else return item
                }).length < 1) {
                    localArray[state.bistroTab - 1] = {
                        menuName: nameOfMenu,
                        lastModified,
                        list: tempA,
                    }
                    HELPER.setLocal('miuhotpot', localArray)
                }
                console.log('online, use res')
                setState({ ...state, menu: tempA, bistroName: nameOfMenu, lastUpdate: lastModified });

                return tempA;
            });

    }
    React.useEffect(() => {
        if (window.navigator.onLine) {
            fetchData();
        }
        else {
            console.log('offline, use local')
            let localArray = HELPER.getLocal('miuhotpot');
            if (localArray[state.bistroTab - 1])
                setState({ ...state, menu: localArray[state.bistroTab - 1].list, bistroName: localArray[state.bistroTab - 1].menuName, lastUpdate: localArray[state.bistroTab - 1].lastModified });
        }
    }, [state.bistroTab]);
    const addTemp = (value) => {
        let hasI = 0;
        for (let i = 0; i < $CART.length; i++) {
            hasI = 0;
            if ($CART[i].id == value.id) {
                // console.log('có r, update', i)
                $CART[i] = value;
                break;
            } else {
                hasI++;
            }
        }
        if ($CART.length == 0 || hasI > 0) $CART.push(value);

        $CART.sort(function (a, b) {
            return a.id - b.id;
        });
        setState({ ...state, cart: $CART });
        // console.log('add',state.cart);
    };
    const minusTemp = (value) => {
        // let updateFlag=-1;
        let delFlag = -1;
        for (let i = 0; i < $CART.length; i++) {
            if ($CART[i].id == value.id && value.count == 0) {
                delFlag = i;
            }
            if ($CART[i].id == value.id && value.count > 0) {
                $CART[i] = value;
            }
        }

        if (delFlag > -1) {
            // console.log('xóa vị trí', delFlag)
            HELPER.removeElement($CART, $CART[delFlag]);
        }

        $CART.sort(function (a, b) {
            return a.id - b.id;
        });
        setState({ ...state, cart: $CART });
        // console.log('minus', state.cart);
    };
    const clearTemp = () => {
        $CART = [];
        setState({ ...state, cart: $CART });
        // console.log('clear', state)
    };
    const filterMenu = (collectData) => {
        let inputData = collectData.toUpperCase();
        // console.log(collectData);
        // console.log($MENU);

        state.menu.forEach((it, ix) => {
            let itemName = it.name.toUpperCase();
            if (itemName.indexOf(inputData) > -1) {
                it.visible = true;
            } else {
                it.visible = false;
            }
        });
        setState({
            ...state,
            menu: state.menu,
        });
        // console.log(state.menu);
    };
    const setTab = (collectTab) => {
        $CART = [];
        $MENU = [];
        setState({
            ...state,
            cart: [],
            bistroTab: collectTab,
            resetOrder: true,
            menu: $MENU,
        });

        console.log("settab");
    };
    return (
        <div className="container bistro">
            <NavBar />
            <MenuWrapper
                add={addTemp}
                minus={minusTemp}
                clear={clearTemp}
                collectFilter={filterMenu}
                setTab={setTab}
                view={state.viewMode}
                bistroName={state.bistroName}
                lastUpdate={state.lastUpdate}
                menu={state.menu}
                resetItem={state.bistroTab}
            />
            <OrderTable data={state.cart} reset={state.resetOrder} />
        </div>
    );
}

export default HotPot;

