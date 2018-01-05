/* @flow */

import React from "react";
import { AppRegistry } from "react-native";

import { AppContainer } from "react-hot-loader";

import App from "./App";

import Root from "./Root";

const renderApp = () => (
	<AppContainer>
		<Root>
			<App />
		</Root>
	</AppContainer>
);

AppRegistry.registerComponent("ipfs-test", () => renderApp);

if (module.hot) {
	// $FlowFixMe
	module.hot.accept();

	// App registration and rendering
	AppRegistry.registerComponent("ipfs-test", () => App);
}

AppRegistry.runApplication("ipfs-test", {
	rootTag: document.getElementById("root"),
});
