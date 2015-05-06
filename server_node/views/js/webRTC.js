var WebRTC = function()	{

	var private = {
		// PeerConnection ICE protocol configuration (either Firefox or Chrome)
		pc_config: webrtcDetectedBrowser === 'firefox' ? {'iceServers':[{'url':'stun:23.21.150.121'}]} : {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]},
		pc_constraints: {'optional': [{'DtlsSrtpKeyAgreement': true}]},
		sdpConstraints: {},
		// Set getUserMedia constraints
		constraints: {video: true, audio: true},
		//	Streams
		localStream: null,
		//	RTCPeerConnection
		pc: null,
	};




	var public = {



		getUserMedia: function(successHandler)	{
			navigator.getUserMedia(

				private.constraints,

				function(stream)	{
					console.log('Adding local stream.');
					private.localStream = stream;
					successHandler(stream);
				},

				function(error)	{
					console.log('navigator.getUserMedia error: ', error);
				}
			);
		},




		createPeerConnection: function(streamHandler, iceHandler)	{
			console.log('Created RTCPeerConnnection with:\n' +
			' config: \'' + JSON.stringify(private.pc_config) + '\';\n' +
			' constraints: \'' + JSON.stringify(private.pc_constraints) + '\'.');

			private.pc = new RTCPeerConnection(private.pc_config, private.pc_constraints);
			private.pc.addStream(private.localStream);
			private.pc.onicecandidate = iceHandler;
			private.pc.onaddstream = streamHandler;
		},



		createOffer: function(successHandler)	{
			private.pc.createOffer(

				function(sessionDescription)	{
					private.pc.setLocalDescription(sessionDescription);
					successHandler(sessionDescription);
				},

				function(error)	{
					console.log('Failed to create signaling message : ' + error);
				}
			);
		},



		createAnswer: function(successHandler)	{
			private.pc.createAnswer(

				function(sessionDescription)	{
					private.pc.setLocalDescription(sessionDescription);
					successHandler(sessionDescription);
				},

				function(error)	{
					console.log('Failed to create signaling message : ' + error);
				}
			);
		},



		processOffer: function(sessionDescription)	{
			private.pc.setRemoteDescription(new RTCSessionDescription(sessionDescription));
		},



		processAnswer: function(sessionDescription)	{
			private.pc.setRemoteDescription(new RTCSessionDescription(sessionDescription));
		},



		addIceCandidate: function(ice)	{
			var candidate = new RTCIceCandidate({sdpMLineIndex:ice.label, candidate:ice.candidate});
			private.pc.addIceCandidate(candidate);
		}


	};

	return public;

}