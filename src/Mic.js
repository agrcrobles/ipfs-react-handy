/* @flow */
import React, { Component } from "react";
import { FloatingActionButton } from "material-ui";

import MicrophoneOn from "material-ui/svg-icons/av/mic";
import MicrophoneOff from "material-ui/svg-icons/av/stop";

import { ReactMic } from "react-mic";

import "./Mic.css";

import { View, StyleSheet } from "react-native";

import { reduxForm } from "redux-form";
import { connect } from "react-redux";

import withIPFS from "./withIPFS";

class MicForm extends Component<
	{
		ipfs: string,
		IPFS: *,
	},
	{
		record: boolean,
		blobURL: *,
		isRecording: boolean,
	}
> {
	constructor(props) {
		super(props);
		this.node = this.props.IPFS;
		this.state = {
			record: false,
			blobURL: null,
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

	onLoadEnd = e => {
		this.reader.removeEventListener("loadend", this.onLoadEnd, false);

		if (e.error) {
			throw new Error(e.error);
		}
		this.node.files.add(
			[Buffer.from(this.reader.result)],
			(err, filesAdded) => {
				if (err) {
					throw err;
				}
				const hash = filesAdded[0].hash;
				this.setState({ added_file_hash: hash });
				// this.node.files.get(hash, (err, data) => {
				// 	if (err) {
				// 		throw err;
				// 	}
				// 	console.log(data);
				// 	this.setState({ added_file_contents: data });
				// });
			}
		);
	};
	onStop = blobObject => {
		this.reader = new FileReader();
		this.reader.addEventListener("loadend", this.onLoadEnd, false);
		this.reader.readAsArrayBuffer(blobObject.blob);
		this.setState({
			blobURL: blobObject.blobURL,
		});
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
				{!!this.state.blobURL && (
					<View style={styles.playerContainer}>
						<audio
							ref={audioSource => (this.audioSource = audioSource)}
							controls="controls"
							style={{ width: "100%" }}
							src={this.state.blobURL}
						/>
					</View>
				)}
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
