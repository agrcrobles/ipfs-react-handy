/* @flow */

import React, { PureComponent } from "react";

import { Broadcast } from "react-broadcast";

class IPFSProvider extends PureComponent<{
	children: *,
	IPFS: *,
}> {
	render() {
		return (
			<Broadcast channel="IPFS" value={this.props.IPFS}>
				{this.props.children}
			</Broadcast>
		);
	}
}

export default IPFSProvider;
