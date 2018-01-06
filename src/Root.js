/* @flow */
import * as React from "react";

import { applyMiddleware, createStore, combineReducers, compose } from "redux"; // 3.7.2
import { reducer as reduxFormReducer } from "redux-form"; // 7.2.0
import { Provider } from "react-redux"; // 5.0.6
import thunk from "redux-thunk";

// Logger with default options
import { createLogger } from "redux-logger";

import { ipfsReducer } from "./App";

const logger = createLogger({
	diff: true,
	collapsed: true,
});
const middleware = applyMiddleware(thunk, logger);

const reducer = combineReducers({
	form: reduxFormReducer, // mounted under "form"
	ipfs: ipfsReducer,
});

const store = createStore(reducer, {}, compose(middleware));

export default class Root extends React.PureComponent<{
	children: React.Node,
}> {
	render() {
		return <Provider store={store}>{this.props.children}</Provider>;
	}
}
