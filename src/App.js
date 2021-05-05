import React, { Fragment } from "react";
import * as CONST from "./constant";
import * as HELPER from "./api/helper";
import { Route, Switch } from "react-router-dom";
import HotPot from "./containers/HotPot";
import Miunopoly from "./containers/Miunopoly";

function App() {
	return (
		<Fragment>
			<Switch>
				<Route exact path="/" component={HotPot} />
				<Route path="/typhu" component={Miunopoly} />
				<Route path="/*">CONTAINER NOT FOUND</Route>
			</Switch>
		</Fragment>
	);
}
export default App;
