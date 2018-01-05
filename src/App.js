/* @flow */

import * as React from "react";
import IPFS from "ipfs";

const stringToUse = "hello world from webpacked IPFS";

import { StyleSheet, View, Text } from "react-native";

import Mic from "./Mic";

type State = {
	id: any,
	version: any,
	protocol_version: any,
	added_file_hash: any,
	added_file_contents: *,
};
export default class App extends React.Component<*, State> {
	state = {
		id: null,
		version: null,
		protocol_version: null,
		added_file_hash: null,
		added_file_contents: null,
	};
	componentWillMount() {
		const node = new IPFS({ repo: String(Math.random() + Date.now()) });

		node.once("ready", () => {
			console.log("IPFS node is ready");

			node.id((err, res) => {
				if (err) {
					throw err;
				}
				this.setState({
					id: res.id,
					version: res.agentVersion,
					protocol_version: res.protocolVersion,
				});
			});

			node.files.add([Buffer.from(stringToUse)], (err, filesAdded) => {
				if (err) {
					throw err;
				}

				const hash = filesAdded[0].hash;
				this.setState({ added_file_hash: hash });

				node.files.cat(hash, (err, data) => {
					if (err) {
						throw err;
					}
					this.setState({ added_file_contents: data });
				});
			});
		});
	}

	render() {
		return (
			<View>
				<View style={styles.banner}>
					<Text style={styles.title}>Everything is working!</Text>
					<Text style={styles.subtitle}>Your ID is {this.state.id}</Text>
				</View>
				<Text style={[styles.info, styles.description]}>IPFS version</Text>
				<Text style={styles.info}>{this.state.version}</Text>
				<Text style={[styles.info, styles.description]}>
					IPFS protocol version
				</Text>
				<Text style={styles.info}>{this.state.protocol_version}</Text>
				<Text style={[styles.info, styles.description]}>FILE</Text>
				<Text style={styles.info}>{this.state.added_file_hash}</Text>
				<Text style={[styles.info, styles.description]}>FILE Hash</Text>
				<Text style={styles.info}>{this.state.added_file_contents}</Text>
				<Text style={[styles.info, styles.description]}>Mic</Text>
				<Mic />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	banner: {
		backgroundColor: "#336699",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-around",
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
		backgroundColor: "#4A148C",
		fontSize: 12,
		color: "white",
	},
});
