import React from "react";

//Menu Data Array
let $MENU = [
	//   {
	//     id: 1,
	//     slug: "cavien",
	//     name: "Cá viên (5 viên)",
	//     price: "7000",
	//     img: "https://imgur.com/ppqB4qz.png"
	//   },
];
const $SHEET = {
	baseCode: "1oHHkpqCWbeAkz8bwp0B7ezA9a9s_KtErOxU6WB_c75E",
};

//Helper
var getJSON = function (url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.responseType = "json";
	xhr.onload = function () {
		var status = xhr.status;
		if (status === 200) {
			callback(null, xhr.response);
		} else {
			callback(status, xhr.response);
		}
	};
	xhr.send();
};

function currencyFormat(x) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(x);
}
function removeElement(array, elem) {
	var index = array.indexOf(elem);
	if (index > -1) {
		array.splice(index, 1);
	}
	return array;
}
function removeItemAll(arr, value) {
	var i = 0;
	while (i < arr.length) {
		if (arr[i] === value) {
			arr.splice(i, 1);
		} else {
			++i;
		}
	}
	return arr;
}
function getSheetURL(base = "", tabNum = "1") {
	let resStr =
		"https://spreadsheets.google.com/feeds/list/" +
		$SHEET.baseCode +
		"/" +
		tabNum +
		"/public/values?alt=json";
	if (base != "")
		resStr =
			"https://spreadsheets.google.com/feeds/list/" +
			base +
			"/" +
			tabNum +
			"/public/values?alt=json";
	return resStr;
}
// async function getSheetTabs (variable){
//   let resArray= [];
//   let url="https://spreadsheets.google.com/feeds/worksheets/"+$SHEET.baseCode+"/public/basic?alt=json";
//   let res =  await getJSON(url, function(err, data){
//     if (err !== null) {
//       alert('Something went wrong: ' + err);
//     } else {
//       let resD=data.feed.entry
//       resD.forEach((it, ix) =>{
//         let itn= it.title.$t
//         if(name){
//           resArray.push(itn);
//         }
//       })
//       variable=resArray
//       console.log('va', variable)
//       return resArray;
//     }
//   })
//   variable=resArray
//   return resArray;
// }
//=========Main Container
var $temp = []; //mảng tạm cho giỏ hàng
function App() {
	let [state, setState] = React.useState({
		cart: $temp,
		menu: $MENU,
		bistroName: "",
		bistroTab: "1", //also is resetITEM
		resetOrder: false,
	});
	async function fetchData() {
		console.log("fetch!!!");
		const response = await getJSON(
			getSheetURL("", state.bistroTab),
			function (err, data) {
				let tempA = [];
				let nameOfMenu = "";
				if (err !== null) {
					alert("Something went wrong: " + err);
				} else {
					let resArray = data.feed.entry;
					nameOfMenu = data.feed.title.$t;
					// console.log(resArray);
					resArray.forEach((item, index) => {
						let obj = {
							id: item.gsx$id ? item.gsx$id.$t : null,
							name: item.gsx$name ? item.gsx$name.$t : null,
							price: item.gsx$price ? item.gsx$price.$t : null,
							img: item.gsx$img ? item.gsx$img.$t : null,
							visible: true,
						};
						//console.log(obj);
						tempA.push(obj);
					});
				}
				$MENU = tempA;
				setState({ ...state, menu: tempA, bistroName: nameOfMenu });
				return tempA;
			},
		);
	}
	React.useEffect(() => {
		fetchData();
	}, [state.bistroTab]);
	const addTemp = (value) => {
		let hasI = 0;
		for (let i = 0; i < $temp.length; i++) {
			hasI = 0;
			if ($temp[i].id == value.id) {
				// console.log('có r, update', i)
				$temp[i] = value;
				break;
			} else {
				hasI++;
			}
		}
		if ($temp.length == 0 || hasI > 0) $temp.push(value);

		$temp.sort(function (a, b) {
			return a.id - b.id;
		});
		setState({ ...state, cart: $temp });
		// console.log('add',state.cart);
	};
	const minusTemp = (value) => {
		// let updateFlag=-1;
		let delFlag = -1;
		for (let i = 0; i < $temp.length; i++) {
			if ($temp[i].id == value.id && value.count == 0) {
				delFlag = i;
			}
			if ($temp[i].id == value.id && value.count > 0) {
				$temp[i] = value;
			}
		}

		if (delFlag > -1) {
			// console.log('xóa vị trí', delFlag)
			removeElement($temp, $temp[delFlag]);
		}

		$temp.sort(function (a, b) {
			return a.id - b.id;
		});
		setState({ ...state, cart: $temp });
		// console.log('minus', state.cart);
	};
	const clearTemp = () => {
		$temp = [];
		setState({ ...state, cart: $temp });
		// console.log('clear', state)
	};
	const filterMenu = (collectData) => {
		let inputData = collectData.toUpperCase();
		$MENU.forEach((it, ix) => {
			let itemName = it.name.toUpperCase();
			if (itemName.indexOf(inputData) > -1) {
				it.visible = true;
			} else {
				it.visible = false;
			}
		});
		setState({
			...state,
			menu: $MENU,
		});
		// console.log($MENU)
	};
	const setTab = (collectTab) => {
		$temp = [];
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
		<div className="container">
			<Table
				add={addTemp}
				minus={minusTemp}
				clear={clearTemp}
				view={state.viewMode}
				collectFilter={filterMenu}
				bistroName={state.bistroName}
				menu={state.menu}
				setTab={setTab}
				resetItem={state.bistroTab}
			/>
			<OrderTable data={state.cart} reset={state.resetOrder} />
		</div>
	);
}
export default App;
//========Components
//=====================Menu Table====================
const Table = (props) => {
	let menu = props.menu ? props.menu : $MENU;
	let [state, setState] = React.useState({
		viewMode: false,
		reset: false,
		selections: [],
	});
	const filterRef = React.useRef("");
	const bistroRef = React.useRef(1);

	React.useEffect(() => {
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
							<TableRow
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
							<TableRow
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
						<i className="fa fa-times"></i>{" "}
					</button>
				</div>
				<div className="quick-btn-wrapper">
					{/* <button className="action-btn action-del" onClick={clearCart}>
						<i className="far fa-trash-alt"></i>
					</button> */}
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
export { Table };
//================Table Row============================
const TableRow = (props) => {
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
export { TableRow };

//================ Final order========================
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
export { OrderTable };
