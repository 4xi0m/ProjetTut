function Call (){
	this.startTime;
	this.endTime;
	this.client;
	this.staff;
	this.comment;
	this.id;
	this.location;
	this.waitTime;
}
Call.prototype.toString = function (){
	return "Call == from:"+startTime+", to: "+endTime;
}
Call.prototype.startCall = function (startTime){
	this.startTime = startTime;
}
Call.prototype.endCall = function (endTime, comment){
	this.endTime = endTime;
	this.comment = comment;
}
module.export.Call = Call;

