const peerConnections = {};
let numberOfheadsets = 0;
const config = {
  iceServers: [
    { 
      "urls": "stun:stun.l.google.com:19302",
    },
    // { 
    //   "urls": "turn:TURN_IP?transport=tcp",
    //   "username": "TURN_USERNAME",
    //   "credential": "TURN_CREDENTIALS"
    // }
  ]
};

const socket = io.connect(window.location.origin);

socket.on("answer", (id, description) => {
  peerConnections[id].setRemoteDescription(description);
});

socket.on("headset", id => {
  numberOfheadsets += 1;
  const peerConnection = new RTCPeerConnection(config);
  peerConnections[id] = peerConnection;

  let stream = videoElement.srcObject;
  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit("candidate", id, event.candidate);
    }
  };

  peerConnection.addEventListener('connectionstatechange', event => {
    updateConnection(peerConnections[id],numberOfheadsets);
  });

  peerConnection
    .createOffer()
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      socket.emit("offer", id, peerConnection.localDescription);
    });
});

socket.on("candidate", (id, candidate) => {
  updateConnection(peerConnections[id],numberOfheadsets);
  peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
});

window.onunload = window.onbeforeunload = () => {
  socket.close();
};

function updateConnection(connection, numberOfheadsets){
  document.getElementById("numOfheadsets").innerHTML = "Number of headsets: " + numberOfheadsets;
  if(connection.connectionState === "connected"){
    document.getElementById("circle").style.background = "green";
    document.getElementById("connectionStatus").innerHTML = connection.connectionState;
  }
  if(connection.connectionState === "connecting"){
    document.getElementById("circle").style.background = "yellow";
    document.getElementById("connectionStatus").innerHTML = connection.connectionState;
  }
  if(connection.connectionState === "new"){
    document.getElementById("circle").style.background = "blue";
    document.getElementById("connectionStatus").innerHTML = connection.connectionState;
  }
  if(numberOfheadsets === 0){
    document.getElementById("circle").style.background = "red";
    document.getElementById("connectionStatus").innerHTML = connection.connectionState;
  }
}
