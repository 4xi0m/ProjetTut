var socket = io.connect('http://localhost:8000');
var rtc = new WebRTC();

var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');
var helpButton = document.getElementById('help');
var hangupButton = document.getElementById('hangupButton');
	hangupButton.disabled = true;




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
	console.log('Ask for help - Create room for client ', client.name);
	rtc.getUserMedia(function(stream)	{
		attachMediaStream(localVideo, stream);
		socket.emit('askForHelp', client);
	});
	helpButton.disabled = true;
	statusLog('Please wait, an operator will help you in a few seconds...');
};



function helpOfferedHandler(client){
	console.log('Help accepted ', client.name);
	rtc.createPeerConnection(streamHandler, iceCandidateHandler);
	rtc.createOffer(function(sessionDescription)	{
		socket.emit('RTCOffer', sessionDescription);
		hangupButton.disabled = false;
		statusLog('Connection established !');
	});
}





window.onbeforeunload = rtc.stop;
helpButton.onclick = askForHelpHandler;
socket.on('helpOffered', helpOfferedHandler);
socket.on('RTCAnswer', rtc.processAnswer);
socket.on('iceCandidate', rtc.addIceCandidate);
socket.on('stopConnection', function()	{
	helpButton.disabled = false;
	hangupButton.disabled = true;
	statusLog('The operator hanged up !');
	rtc.stop();
});
hangupButton.onclick = function()	{
	rtc.stop();
	socket.emit('stopConnection');
	helpButton.disabled = false;
	hangupButton.disabled = true;
	statusLog('Connection terminated !');
};
socket.on('disconnect', rtc.stop);