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
		removeClient(client);
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
	tdCall.innerHTML = "<button id=\""+client.name+"\">" + client.name + " - Help him</button>";
	tr.appendChild(td);
	tr.appendChild(tdCall);
	table.appendChild(tr);
	document.getElementById(client.name).onclick = function()	{offerHelpHandler(client)};
}



function removeClient(client)	{
	document.getElementById(client.name).parentNode.removeChild(document.getElementById(client.name));
}



function connectionHandler(pendingCalls)	{
	for(var client in pendingCalls)	{
		if(pendingCalls[client].full == false)	{
			insertClient(pendingCalls[client]);
		}
	}
}



window.onbeforeunload = rtc.stop;
socket.on('helpAsked', insertClient);
socket.on('iceCandidate', rtc.addIceCandidate);
socket.on('RTCOffer', RTCOfferHandler);
socket.on('stopConnection', rtc.stop);
socket.on('connected', connectionHandler);
socket.on('helpOP', removeClient);