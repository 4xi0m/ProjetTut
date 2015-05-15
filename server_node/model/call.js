function Call (strStartTime, strEndTime, strUserId, strStaffId, strComment, id, strLocation, strWaitTime){
	this.startTime = strStartTime;
	this.endTime = strEndTime;
	this.client = strUserId;
	this.staff = strStaffId;
	this.comment = strComment;
	this.id = id;
	this.location= strLocation;
	this.waitTime = strWaitTime;
}
Call.prototype.toString = function (){
	return "Call == from:"+this.startTime+", to: "+this.endTime;
}
Call.prototype.startCall = function (startTime){
	this.startTime = startTime;
}
Call.prototype.endCall = function (endTime, comment){
	this.endTime = endTime;
	this.comment = comment;
}
module.exports.Call = Call;

