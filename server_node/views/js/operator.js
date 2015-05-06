var socket = io.connect("http://localhost:8000");
var rtc = new WebRTC();

var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');



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



function offerHelpHandler(client)	{
	console.log('Help client', client);
	rtc.getUserMedia(function(stream)	{
		attachMediaStream(localVideo, stream);
		rtc.createPeerConnection(streamHandler, iceCandidateHandler);
		socket.emit('help', client);
	});
}



function RTCOfferHandler(sessionDescription)	 {
	rtc.processOffer(sessionDescription);
	rtc.createAnswer(function(sessionDescription)	{
		socket.emit('RTCAnswer', sessionDescription);
	});	
}



function insertClient(client)	{
	var table = document.getElementById('pendingCalls');
	var tr = document.createElement("tr");
	var td = document.createElement("td");
	var tdCall = document.createElement("td");
	tdCall.innerHTML = "<button id=\""+client+"\">" + client + " - Help him</button>";
	tr.appendChild(td);
	tr.appendChild(tdCall);
	table.appendChild(tr);
	document.getElementById(client).onclick = function()	{offerHelpHandler(client)};
}



socket.on('helpAsked', insertClient);
socket.on('iceCandidate', rtc.addIceCandidate);
socket.on('RTCOffer', RTCOfferHandler);