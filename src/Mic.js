/* @flow */
import React, { Component } from "react";
import { FloatingActionButton } from "material-ui";

import MicrophoneOn from "material-ui/svg-icons/av/mic";
import MicrophoneOff from "material-ui/svg-icons/av/stop";

import { ReactMic } from "react-mic";

import "./Mic.css";

import Player from "./Player";

import { View, StyleSheet, Text } from "react-native";

import { reduxForm } from "redux-form";
import { connect } from "react-redux";

import withIPFS from "./withIPFS";

class MicForm extends Component<
	{
		ipfs: string,
		IPFS: *,
	},
	{
		hash?: string,
		record: boolean,
		isRecording: boolean,
	}
> {
	constructor(props) {
		super(props);
		this.node = this.props.IPFS;
		this.state = {
			record: false,
			isRecording: false,
		};
		this.reader = new FileReader();
	}
	node: *;
	reader: *;

	startRecording = () => {
		this.setState({
			record: true,
			isRecording: true,
		});
	};

	stopRecording = () => {
		this.setState({
			record: false,
			isRecording: false,
		});
	};

	onStart = () => {
		console.log("You can tap into the onStart callback");
	};

	audio: *;
	onStop = blobObject => {
		// this.reader.removeEventListener("loadend", this.onLoadEnd, false);
		this.reader.addEventListener(
			"loadend",
			() => {
				this.node.files.add(
					[Buffer.from(this.reader.result)],
					(err, filesAdded) => {
						if (err) {
							throw err;
						}

						const hash = filesAdded[0].hash;

						// this.loadAudio(hash);
						this.setState({ hash: hash });
					}
				);
			},
			false
		);
		this.reader.readAsArrayBuffer(blobObject.blob);
	};
	audioSource: *;
	render() {
		const { isRecording } = this.state;

		return (
			<View>
				<View style={styles.micContainer}>
					<ReactMic
						className="oscilloscope"
						record={this.state.record}
						backgroundColor="white"
						visualSetting="sinewave"
						audioBitsPerSecond={128000}
						onStop={this.onStop}
						onStart={this.onStart}
						strokeColor="#FF4081"
					/>
					<View style={styles.actionMicContainer}>
						<FloatingActionButton
							className="btn"
							secondary
							disabled={isRecording}
							onClick={this.startRecording}
						>
							<MicrophoneOn />
						</FloatingActionButton>
						<FloatingActionButton
							className="btn"
							secondary
							disabled={!isRecording}
							onClick={this.stopRecording}
						>
							<MicrophoneOff />
						</FloatingActionButton>
					</View>
				</View>
				<Text style={[styles.description]}>Hash</Text>
				{this.state.hash && (
					<Text style={[styles.description]}>{this.state.hash}</Text>
				)}
				<Player />
			</View>
		);
	}
}
const styles = StyleSheet.create({
	micContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 5,
		marginHorizontal: 10,
	},
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
	actionMicContainer: {
		flexDirection: "row",
	},
});

export default reduxForm({
	form: "myForm",
})(
	connect(state => ({
		ipfs: state.ipfs.repository,
	}))(withIPFS(MicForm))
);
