/* @flow */

import * as React from "react";

import { MuiThemeProvider } from "material-ui";
import Mic from "./Mic";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { cyan500 } from "material-ui/styles/colors";

// This replaces the textColor value on the palette
// and then update the keys for each component that depends on it.
// More on Colors: http://www.material-ui.com/#/customization/colors
const muiTheme = getMuiTheme({
	palette: {
		textColor: cyan500,
	},
	appBar: {
		height: 50,
	},
});

class ThemeProvider extends React.PureComponent<{}> {
	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<Mic />
			</MuiThemeProvider>
		);
	}
}

export default ThemeProvider;
