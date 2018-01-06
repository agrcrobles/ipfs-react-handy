# push-to-talk

> a react app to talk when push, this is just an experiment an can fail

## Overview

TODO

## Run the web server

* Node 8 LTS
* You can use yarn or npm

```bash
# Install dependencies
yarn
```

## How it works?

TODO

## How IPFS works?

Each file and all of the blocks within it are given a unique fingerprint called a cryptographic hash.

IPFS removes duplications across the network and tracks version history for every file.

Each network node stores only content it is interested in, and some indexing information that helps figure out who is storing what.

When looking up files, you're asking the network to find nodes storing the content behind a unique hash.

Every file can be found by human-readable names using a decentralized naming system called IPNS.

## Dependencies

* [react](https://reactjs.org/) for building user interface
* [react-native-web](https://github.com/necolas/react-native-web) to handle native like components in the web
* [react-broadcast](https://github.com/ReactTraining/react-broadcast) to handle eficiently IPFS in the component tree
* [js-ipfs](https://github.com/ipfs/js-ipfs) IPFS implementation in JavaScript 
* [react-mic](https://github.com/hackingbeauty/react-mic) to record audio from a user's microphone and display as a sound oscillation.
* [material-ui](material-ui.com) React components that implement Google's Material Design
* ... among others cool ones like `redux`, etc

## License

MIT