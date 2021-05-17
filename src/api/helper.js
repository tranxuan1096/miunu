import { $CART, $MENU, $SHEET } from "../constant";

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
function makeID(length) {
	var result = [];
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result.push(
			characters.charAt(Math.floor(Math.random() * charactersLength)),
		);
	}
	return result.join("");
}
const getLocal = (name) => {
	return JSON.parse(localStorage.getItem(name));
};
const removeLocal = (name) => {
	localStorage.removeItem(name);
};
const setLocal = (name, value) => {
	localStorage.setItem(name, JSON.stringify(value));
};
function timeConverter(UNIX_timestamp) {
	var a = new Date(UNIX_timestamp * 1000);
	var months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	if (hour < 10) {
		hour = "0" + hour;
	}
	var min = a.getMinutes();
	if (min < 10) {
		min = "0" + min;
	}
	var sec = a.getSeconds();
	if (sec < 10) {
		sec = "0" + sec;
	}
	//var time =
	//date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
	let time = hour + ":" + min;
	return time;
}
export {
	getJSON,
	currencyFormat,
	removeElement,
	removeItemAll,
	getSheetURL,
	makeID,
	getLocal,
	removeLocal,
	setLocal,
	timeConverter,
};
