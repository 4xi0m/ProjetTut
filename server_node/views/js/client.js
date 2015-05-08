var socket = io.connect('http://localhost:8000');
var rtc = new WebRTC();

var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');
var helpButton = document.getElementById('help');




/*
 *
 *	Events handlers
 *
 */

function iceCandidateHandler(event) {
	console.log('handleIceCandidate event: ', event);
	if (event.candidate) {
		socket.emit('iceCandidate', {
			label: event.candidate.sdpMLineIndex,
			candidate: event.candidate.candidate
		});
	} else {
		console.log('End of candidates.');
	}
}



function streamHandler(event)	{
	attachMediaStream(remoteVideo, event.stream);
}



function askForHelpHandler()	{
	console.log('Ask for help - Create room', 'C1');
	rtc.getUserMedia(function(stream)	{
		attachMediaStream(localVideo, stream);
		socket.emit('askForHelp', 'C1');
	});
};



function helpOfferedHandler(client){
	console.log('Help accepted', client);
	rtc.createPeerConnection(streamHandler, iceCandidateHandler);
	rtc.createOffer(function(sessionDescription)	{
		socket.emit('RTCOffer', sessionDescription);
	});
}




helpButton.onclick = askForHelpHandler;
socket.on('helpOffered', helpOfferedHandler);
socket.on('RTCAnswer', rtc.processAnswer);
socket.on('iceCandidate', rtc.addIceCandidate);