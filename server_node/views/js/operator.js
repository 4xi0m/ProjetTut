var socket = io.connect("http://localhost:8000");
var rtc = new WebRTC();

var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');
var hangup = document.getElementById('hangupButton');



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
		socket.emit('help', client, user);
		removeClient(client);
		hangup.disabled = false;
		hangup.onclick = function()	{
			rtc.stop();
			socket.emit('stopConnection');
			hangup.disabled = true;
			hangup.onclick = null;
		};
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
	tr.id = 'tr'+client.name;
	var tdCall = document.createElement("td");
	tdCall.innerHTML = "<button id=\""+client.name+"\" class=\"btn btn-success help\">" + client.name + " - Help him</button>";
	tr.appendChild(tdCall);
	table.getElementsByTagName('tbody')[0].appendChild(tr);
	document.getElementById(client.name).onclick = function()	{offerHelpHandler(client)};
}



function removeClient(client)	{
	document.getElementById('tr'+client.name).parentNode.removeChild(document.getElementById('tr'+client.name));
}



function connectionHandler(pendingCalls)	{
	for(var client in pendingCalls)	{
		insertClient(pendingCalls[client]);
	}
}



window.onbeforeunload = rtc.stop;
socket.on('helpAsked', insertClient);
socket.on('iceCandidate', rtc.addIceCandidate);
socket.on('RTCOffer', RTCOfferHandler);
socket.on('stopConnection', function()	{
	hangup.disabled = true;
	statusLog('The client hanged up !');
	rtc.stop();
});
socket.on('connected', connectionHandler);
socket.on('helpOP', removeClient);
socket.on('disconnect', rtc.stop);