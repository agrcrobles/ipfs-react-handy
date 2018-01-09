/* @flow */

import * as React from "react";
import IPFS from "ipfs";

import { StyleSheet, View, Text } from "react-native";

import ThemeProvider from "./ThemeProvider";
import { connect } from "react-redux";

import IPFSProvider from "./IPFSProvider";

type State = {
	id: ?string,
	version: ?string,
	ipfsBAddr: ?string,
};

type Action = {
	type: "INIT_IPFS",
	repository: *,
};
type IPFSState = {
	repository?: string,
};

type Dispatch = (action: Action) => void;

export function ipfsReducer(state: IPFSState = {}, action: Action) {
	switch (action.type) {
		case "INIT_IPFS":
			return {
				repository: action.repository,
			};
		default:
			return state;
	}
}
class App extends React.Component<
	{
		dispatch: Dispatch,
	},
	State
> {
	state = {
		version: null,
		id: null,
		ipfsBAddr: null,
	};
	componentWillMount() {
		const repository = "QmUXexMPkZT1C8uynABEqLHpEdNJxfoZb9Vy1fJ6X9DYYs";
		// const signalServer = ('/libp2p-webrtc-star/ip4/178.62.241.75/tcp/9090/ws/ipfs/' + config.Identity.PeerID)
		// const Addresses = {
		//   API: '/ip4/127.0.0.1/tcp/5001',
		//   Swarm: ['/ip4/0.0.0.0/tcp/4001', signalServer],
		//   Gateway: '/ip4/0.0.0.0/tcp/8080'
		// }
		this.node = new IPFS({
			repo: repository,
			// enable WebRTC support for js-ipfs in the Browser
			config: {
				Addresses: {
					Swarm: [
						"/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star",
					],
				},
			},
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
				const ipfsBAddr = res.addresses[0];

				this.setState({
					id: res.id,
					version: res.agentVersion,
				});

				this.node.swarm.connect(ipfsBAddr).then(() => {
					this.node.swarm.peers((err, peers) => {
						console.log(peers);
					});
				});
			});
		});
	}
	componentWillUnmount() {
		this.node.swarm.disconnect(this.state.ipfsBAddr);
	}
	node: *;
	node = {};
	render() {
		return (
			<IPFSProvider IPFS={this.node}>
				<View>
					<View style={styles.banner}>
						<Text style={styles.title}>Cool! everything is working fine!</Text>
						<Text style={styles.subtitle}>{this.state.id}</Text>
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
