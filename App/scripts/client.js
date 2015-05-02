var socket = io.connect('http://localhost:8000');
var rtc = new WebRTC();



var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');
var helpButton = document.getElementById('help');




// ICE candidates management
function handleIceCandidate(event) {
	console.log('handleIceCandidate event: ', event);
	if (event.candidate) {
		socket.emit('ice', {
			type: 'candidate',
			label: event.candidate.sdpMLineIndex,
			id: event.candidate.sdpMid,
			candidate: event.candidate.candidate
		});
	} else {
		console.log('End of candidates.');
	}
}


function askForHelpHandler()	{
	console.log('Ask for help - Create room', 'C1');
	rtc.getUserMedia(function(stream)	{
		attachMediaStream(localVideo, stream);
		socket.emit('askForHelp', 'C1');
	});
};


helpButton.onclick = askForHelpHandler;





socket.on('log', function (array){
	console.log.apply(console, array);
});


socket.on('helpOffered', function (client){
	console.log('Help accepted', client);
	rtc.createPeerConnection(function(event)	{
		attachMediaStream(remoteVideo, event.stream);
	}, handleIceCandidate);
	rtc.createOffer(socket);
});



socket.on('answer', function (sessionDescription){
	rtc.processSession(sessionDescription);
});


socket.on('ice', function (ice){
		rtc.addIceCandidate(ice);
});