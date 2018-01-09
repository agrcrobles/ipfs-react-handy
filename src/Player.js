/* @flow */
import React, { Component } from "react";

import { View, StyleSheet, TextInput, Button } from "react-native";

import withIPFS from "./withIPFS";

// https://www.html5rocks.com/en/tutorials/file/filesystem/
const windowFS = window.webkitRequestFileSystem || window.requestFileSystem;

class Player extends Component<
	{
		ipfs: string,
		IPFS: *,
	},
	{
		output?: string,
	}
> {
	constructor(props) {
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

	loadAudio = (hash: ?string) => {
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
			<View>
				<TextInput
					style={styles.input}
					placeholder="Output Hash"
					onChangeText={output => this.setState({ output })}
				/>
				<Button
					title="Play"
					style={styles.button}
					onPress={() => this.loadAudio(this.state.output)}
				/>
				<View style={styles.playerContainer}>
					<audio
						controls
						autoPlay
						ref={audio => (this.audio = audio)}
						style={{ width: "100%" }}
					/>
				</View>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	button: { padding: 9, margin: 9 },
	playerContainer: {
		backgroundColor: "#CFD8DC",
		padding: 10,
		margin: 10,
		borderRadius: 10,
	},
	description: {
		paddingHorizontal: 12,
		paddingVertical: 9,
		backgroundColor: "#444",
		color: "white",
	},
	input: { padding: 9, fontSize: 10 },
});

export default withIPFS(Player);
