var socket = io.connect("http://localhost:8000");
var rtc = new WebRTC();




var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');



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


function insertClient(client)	{
	var table = document.getElementById('pendingCalls');
	var tr = document.createElement("tr");
	var td = document.createElement("td");
	var tdCall = document.createElement("td");
	tdCall.innerHTML = "<button id=\""+client+"\">" + client + " - Help him</button>";
	tr.appendChild(td);
	tr.appendChild(tdCall);
	table.appendChild(tr);



	document.getElementById(client).onclick = function()	{
		console.log('Help client', client);
		rtc.getUserMedia(function(stream)	{
			attachMediaStream(localVideo, stream);
			socket.emit('help', client);
			rtc.createPeerConnection(function(event)	{
				attachMediaStream(remoteVideo, event.stream);
			}, handleIceCandidate);
		});
	};
}






socket.on('log', function (array){
	console.log.apply(console, array);
});



socket.on('helpAsked', function (client){
	insertClient(client);
});


socket.on('offer', function (sessionDescription){
	rtc.processSession(sessionDescription);
	rtc.createAnswer(socket);	
});



socket.on('ice', function (ice){
		rtc.addIceCandidate(ice);
});












