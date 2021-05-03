import * as FIREBASE from "./firebase";
const FS = FIREBASE.firestore;

/*===================================
*           1. TẠO, SỬA             *
====================================*/
const successDefault = () => {
	console.log("Hoàn tất");
};
const failDefault = (error) => {
	console.error("Lỗi", error);
};
//Tạo hoặc update bản ghi có hoặc k có ID input
function setDoc(
	collectionName,
	id = null,
	dataObj,
	successCallback = successDefault,
	failCallback = failDefault,
) {
	FS.collection(collectionName)
		.doc(id)
		.set(dataObj)
		.then(successCallback)
		.catch(failCallback);
}
//Tạo bản ghi v2 (dùng ref định nghĩa bên ngoài)
function setDoc_v2(
	ref,
	dataObj,
	successCallback = successDefault,
	failCallback = failDefault,
) {
	ref.set(dataObj).then(successCallback).catch(failCallback);
}
//Tạo bản ghi (auto ID),
function addDoc(
	collectionName,
	dataObj,
	successCallback = successDefault,
	failCallback = failDefault,
) {
	FS.collection(collectionName)
		.add(dataObj)
		.then(successCallback)
		.catch(failCallback);
}
//Thêm 1 thuộc tính vào bản ghi có id là
function mergeDoc(
	collectionName,
	id,
	dataObj,
	successCallback = successDefault,
	failCallback = failDefault,
) {
	FS.collection(collectionName)
		.doc(id)
		.set(dataObj, { merge: true })
		.then(successCallback)
		.catch(failCallback);
}
//Update bản ghi (đè toàn bộ trường có sẵn)
function updateDoc(
	collectionName,
	id,
	dataObj,
	hasTimestamp = false,
	successCallback = successDefault,
	failCallback = failDefault,
) {
	//xuly
	let finData = hasTimestamp
		? {
				...dataObj,
				timestamp: FS.FieldValue.serverTimestamp(),
		  }
		: dataObj;
	//go
	FS.collection(collectionName)
		.doc(id)
		.update(finData)
		.then(successCallback)
		.catch(failCallback);
}
/*Update bản ghi lồng nhau (không đè), dùng dấu chấm
VD:
// Create an initial document to update.
var frankDocRef = db.collection("users").doc("frank");
frankDocRef.set({
    name: "Frank",
    favorites: { food: "Pizza", color: "Blue", subject: "recess" },
    age: 12
});

// To update age and favorite color:
db.collection("users").doc("frank").update({
    "age": 13,
    "favorites.color": "Red" // <== HERE
})
.then(() => {
    console.log("Document successfully updated!");
});

Nếu bản ghi của bạn chứa trường mảng, bạn có thể sử dụng FS.FieldValue.arrayUnion() và arrayRemove() để thêm và xóa các phần tử. arrayUnion() thêm các phần tử vào một mảng nhưng chỉ các phần tử chưa có mặt. arrayRemove() loại bỏ tất cả các phiên bản của mỗi phần tử đã cho.

FieldValue.increment(50)

*/

/*===================================
*            2.  XÓA                *
====================================*/
//Xóa bản ghi theo ID
function removeDoc(
	collectionName,
	id,
	successCallback = successDefault,
	failCallback = failDefault,
) {
	FS.collection(collectionName)
		.doc(id)
		.delete()
		.then(successCallback)
		.catch(failCallback);
}
/*Xóa các field trong bản ghi
var cityRef = db.collection('cities').doc('BJ');
// Remove the 'capital' field from the document
var removeCapital = cityRef.update({
    capital: firebase.firestore.FieldValue.delete()
});*/
/*===================================
*            3.  GET                *
====================================*/
const successGet = (doc) => {
	if (doc.exists) {
		console.log("Document data:", doc.data());
	} else {
		console.log("No such document!");
	}
};
//Nhận 1 bản ghi
async function getDoc(
	collectionName,
	id,
	successCallback = successGet,
	failCallback = failDefault,
) {
	let result = null;
	await FS.collection(collectionName)
		.doc(id)
		.get()
		.then(successCallback)
		.catch(failCallback);
	return result;
}
//Nhận tất cả bản ghi trong collection
const successGetAll = (querySnapshot) => {
	querySnapshot.forEach((doc) => {
		console.log(doc.id, " => ", doc.data());
	});
};
async function getAllDoc(
	collectionName,
	successCallback = successGetAll,
	failCallback = failDefault,
) {
	let result = null;
	await FS.collection(collectionName)
		.get()
		.then(successCallback)
		.catch(failCallback);
	return result;
}
/*Nhận nhiều bản ghi trong collection theo điều kiện where, có thể where.where
< less than
<= less than or equal to
== equal to
> greater than
>= greater than or equal to
!= not equal to
array-contains
array-contains-any
in
not-in
*/
async function getDocByCondition(
	collectionName,
	conditionObj,
	successCallback = successGetAll,
	failCallback = failDefault,
) {
	let result = null;
	await FS.collection(collectionName)
		.where(conditionObj.field, conditionObj.operator, conditionObj.value)
		.get()
		.then(successCallback)
		.catch(failCallback);
	return result;
}
//Nhận bản ghi từ tập hợp con theo điều kiện
async function getDocByCondition_t2(
	collectionName,
	conditionObj,
	successCallback = successGetAll,
	failCallback = failDefault,
) {
	let result = null;
	await FS.collectionGroup(collectionName)
		.where(conditionObj.field, conditionObj.operator, conditionObj.value)
		.get()
		.then(successCallback)
		.catch(failCallback);
	return result;
}
/*===================================
*            4. REALTIME            *
====================================*/
const successListen = (doc) => {
	var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
	console.log(source, " data: ", doc.data());
};
function listenDoc(
	collectionName,
	id,
	successCallback = successListen,
	failCallback = failDefault,
) {
	FS.collection(collectionName)
		.doc(id)
		.onSnapshot(successCallback, failCallback);
}
function listenDocByCondition(
	collectionName,
	conditionObj,
	successCallback = successGetAll,
	failCallback = failDefault,
) {
	let result = null;
	FS.collection(collectionName)
		.where(conditionObj.field, conditionObj.operator, conditionObj.value)
		.onSnapshot(successCallback, failCallback);
	return result;
}

/*============EXPORT===========*/
export {
	setDoc,
	setDoc_v2,
	addDoc,
	mergeDoc,
	updateDoc,
	removeDoc,
	getDoc,
	getAllDoc,
	getDocByCondition,
	getDocByCondition_t2,
	listenDoc,
	listenDocByCondition,
};
