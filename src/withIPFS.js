import * as React from "react";
import { Subscriber } from "react-broadcast";

function withIPFS(Component) {
	return function WrapperComponent(props: Props) {
		return (
			<Subscriber channel={"IPFS"}>
				{data => <Component {...props} IPFS={data} />}
			</Subscriber>
		);
	};
}
export default withIPFS;
