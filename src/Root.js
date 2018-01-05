/* @flow */
import * as React from "react";

import { applyMiddleware, createStore, combineReducers } from "redux"; // 3.7.2
import { reducer as reduxFormReducer } from "redux-form"; // 7.2.0
import { Provider } from "react-redux"; // 5.0.6
import thunk from "redux-thunk";

// Logger with default options
import { createLogger } from "redux-logger";

const logger = createLogger({
	diff: true,
});

const reducer = combineReducers(
	{
		form: reduxFormReducer, // mounted under "form"
	},
	applyMiddleware(thunk, logger)
);
const store = createStore(reducer);

export default class Root extends React.Component<{}> {
	render() {
		return <Provider store={store}>{this.props.children}</Provider>;
	}
}
