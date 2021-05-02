import React from "react";
import * as CONST from "./constant";
import * as HELPER from "./api/helper";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HotPot from "./containers/HotPot";
import Monopoly from "./containers/Monopoly";

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/">
					<HotPot />
				</Route>
				<Route path="/typhu">
					<Monopoly />
				</Route>
				<Route path="/"></Route>
			</Switch>
		</BrowserRouter>
	);
}
export default App;
