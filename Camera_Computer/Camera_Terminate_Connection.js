socket.on("disconnectPeer", id => {
    peerConnections[id].close();
    numberOfheadsets -= 1;
    updateConnection(peerConnections[id],numberOfheadsets);
    delete peerConnections[id];
  });