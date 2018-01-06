/* @flow */

import * as React from "react";
import IPFS from "ipfs";

import { StyleSheet, View, Text } from "react-native";

import ThemeProvider from "./ThemeProvider";
import { connect } from "react-redux";

import IPFSProvider from "./IPFSProvider";

type State = {
	id?: string,
	version?: string,
};

export function ipfsReducer(state = {}, action) {
	switch (action.type) {
		case "INIT_IPFS":
			return {
				repository: action.repository,
			};
		default:
			return state;
	}
}
class App extends React.Component<*, State> {
	state = {
		version: null,
		id: null,
	};
	componentWillMount() {
		const repository = "QmUXexMPkZT1C8uynABEqLHpEdNJxfoZb9Vy1fJ6X9DYYs";
		this.node = new IPFS({
			repo: repository,
		});

		this.props.dispatch({
			type: "INIT_IPFS",
			repository,
		});

		this.node.once("ready", () => {
			console.log("IPFS node is ready");

			this.node.id((err, res) => {
				if (err) {
					throw err;
				}
				this.setState({
					id: res.id,
					version: res.agentVersion,
				});
			});
		});
	}
	node: *;
	node = null;
	render() {
		return (
			<IPFSProvider IPFS={this.node}>
				<View>
					<View style={styles.banner}>
						<Text style={styles.title}>Cool! everything is working fine!</Text>
						<Text style={styles.subtitle}>Your ID is {this.state.id}</Text>
					</View>
					<Text style={[styles.info, styles.description]}>IPFS version</Text>
					<Text style={styles.info}>{this.state.version}</Text>
					<Text style={[styles.info, styles.description]}>
						Record a voice message
					</Text>
					<ThemeProvider />
				</View>
			</IPFSProvider>
		);
	}
}

export default connect()(App);

const styles = StyleSheet.create({
	banner: {
		backgroundColor: "#336699",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 16,
	},
	title: {
		fontSize: 16,
		fontWeight: "400",
		color: "#fff",
		margin: 8,
	},
	subtitle: {
		fontSize: 12,
		fontWeight: "200",
		color: "#eee",
		margin: 8,
	},
	info: {
		paddingHorizontal: 12,
		paddingTop: 12,
		height: 40,
	},
	description: {
		backgroundColor: "#607D8B",
		fontSize: 12,
		color: "white",
	},
});
