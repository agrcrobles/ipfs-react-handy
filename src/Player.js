/* @flow */
import React, { Component } from "react";

import { View, StyleSheet, Button } from "react-native";
import TextField from "material-ui/TextField";

import withIPFS from "./withIPFS";

// https://www.html5rocks.com/en/tutorials/file/filesystem/
const windowFS = window.webkitRequestFileSystem || window.requestFileSystem;

type Props = {
	ipfs: string,
	IPFS: *,
	output?: string,
};

class Player extends Component<
	Props,
	{
		output: string,
	}
> {
	constructor(props: Props) {
		super(props);
		this.state = {};
		this.node = this.props.IPFS;
	}
	node: *;

	// componentDidMount() {
	// 	this.node.files.cat("hash_to_fetch", (err, res) => {
	// 		if (err) {
	// 			throw err;
	// 		}
	// 		res.on("data", data => {
	// 			// const data = data + d;
	// 			console.log("got", data);
	// 		});
	// 		res.on("end", () => {
	// 			console.log("end");
	// 		});
	// 	});
	// }
	handleChange = event => {
		this.setState({
			output: event.target.value,
		});
	};
	loadAudio = () => {
		const hash = this.state.output;
		this.node.files.get(hash, (err, data) => {
			if (err) {
				throw err;
			}

			const newBlob = new Blob([new Uint8Array(data[0].content)], {
				type: "audio/webm;codecs=opus",
			});

			windowFS(window.TEMPORARY, 1024 * 1024, fs => {
				fs.root.getFile(`${hash || ""}.ogg`, { create: true }, fileEntry => {
					fileEntry.createWriter(fileWriter => {
						fileWriter.onwriteend = (e: any) => {
							console.log(e);
							// $FlowFixMe
							this.audio.src = fileEntry.toURL();
							console.log("Write completed.");
						};
						fileWriter.onerror = e => {
							console.log("Write failed: " + e.toString());
						};

						fileWriter.write(newBlob);
					});
				});
			});
		});
	};
	audio: *;
	render() {
		return (
			<View style={styles.input}>
				<TextField
					onChange={this.handleChange}
					floatingLabelText="Output Hash"
					fullWidth
				/>
				{this.state.output && (
					<Button
						title="Play"
						style={styles.button}
						onPress={this.loadAudio}
					/>
				)}
				{this.state.output && (
					<View style={styles.playerContainer}>
						<audio
							controls
							autoPlay
							ref={audio => (this.audio = audio)}
							style={{ width: "100%" }}
						/>
					</View>
				)}
			</View>
		);
	}
}
const styles = StyleSheet.create({
	button: { padding: 5 },
	playerContainer: {
		backgroundColor: "#CFD8DC",
		padding: 10,
		marginVertical: 5,
		// borderRadius: 10,
	},
	description: {
		paddingHorizontal: 12,
		paddingVertical: 9,
		backgroundColor: "#444",
		color: "white",
	},
	input: {
		paddingHorizontal: 5,
	},
});

export default withIPFS(Player);
