import React from "react";
import * as CONST from "./constant";
import * as HELPER from "./api/helper";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HotPot from "./containers/HotPot";
import Miunopoly from "./containers/Miunopoly";

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/">
					<HotPot />
				</Route>
				<Route path="/typhu">
					<Miunopoly />
				</Route>
				<Route path="/"></Route>
			</Switch>
		</BrowserRouter>
	);
}
export default App;
