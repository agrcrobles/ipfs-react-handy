/* @flow */

import { ReactMic } from "react-mic";
import * as React from "react";

export default class Example extends React.Component<
	void,
	{
		record: boolean | string,
	}
> {
	state = {
		record: false,
	};
	startRecording = () => {
		this.setState({
			record: true,
		});
	};

	stopRecording = () => {
		this.setState({
			record: false,
		});
	};

	onStop(recordedBlob) {
		console.log("recordedBlob is: ", recordedBlob);
	}

	render() {
		return (
			<div>
				<ReactMic
					record={this.state.record}
					className="sound-wave"
					onStop={this.onStop}
					strokeColor="#000000"
					backgroundColor="#FF4081"
				/>
				<button onTouchTap={this.startRecording} type="button">
					Start
				</button>
				<button onTouchTap={this.stopRecording} type="button">
					Stop
				</button>
			</div>
		);
	}
}
