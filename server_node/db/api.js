var users = require("../model/user.js");
var calls = require("../model/call.js");
var config_values = require("../package.json").config.data_base;
var db_host = config_values.hosting;
var db_port = config_values.hosting_port;
var db_database = config_values.database;
var db_user = config_values.user_name;
var db_pass = config_values.passphrase;
var db          = require('mysql'); //This sets up the MySQL connection

var connectparam = {
        host        : db_host,
        database    : db_database,
        user        : db_user,
        password    : db_pass,
        multipleStatements: true
};
var foundUser;
var tespd = "pdpdpdpdpdpd"
function logerror (method, message, error){
    console.error(method+', '+message+' === '+error);
}

/**
In case of with the connection with the database could not
be established
*/
var connectionError = function (error, callback){
    console.error(error);
    callback();
}
/**Connection of a client

*/
function clientLogin (strEmail, strPassphrase, send_response){
    var strQuery = "";
    var foundUser = null;
    var connection = db.createConnection(connectparam);

    connection.connect();
    console.log("begin");
    var timeAndId = "select date_created, id from user where email='"+strEmail+"' into @time, @id;";
    var hash1 = "select md5('"+strPassphrase+"') into @hash1;"
    var hash2 = "select concat(@time,@hash1) into @hash2;";
    var query = "select * from user where id=@id and passphrase=md5(@hash2);";
    strQuery =timeAndId+hash1+hash2+query;
    console.log(strQuery);
    connection.query(
        strQuery, 
        function ( objError, objRows, objFields){
            //console.log(objRows);
            if( objError ){
                logerror('userLogin','query error',objError);
                send_response(objError, null);
            }else{
                if (objRows[3][0]) {//3 because we have 4 queries 
                    var foundUser =objRows[3][0];
                    email = foundUser.email;
                    id = foundUser.id;
                    name = foundUser.name;
                    firstName = foundUser.first_name;
                    creationDate = foundUser.date_created; 
                    foundUser = new users.Client(email,id,name,firstName,creationDate);                       
                }
                send_response(null,foundUser);
            }
        });        
    connection.end();        
}
module.exports.clientLogin = clientLogin;

/**Add a new cleint to the application 
param  : 

*/
function addClient (strEmail, strName, strFirstName, strPassphrase, send_response){
    var strQuery = "";
    var added_User = null;
    //connection to the database
    var connection = db.createConnection(connectparam);
    connection.connect();
       
    //creating the valid query      
    var time = "select now() into @a;"
    var hashpass = "select md5('"+strPassphrase+"') into @b;";
    var hashadtime = "select concat(@a, @b) into @c; ";
    var prepquery =  "insert into User (email, name, first_name, passphrase, date_created)";
    var values = "values ('"+strEmail+"','"+strName+"','"+strFirstName+"',md5(@c), @a);";   
    var id = "select id, date_created from user where email='"+strEmail+"';"  
    strQuery = time+hashpass+hashadtime+prepquery+values+id;
    
    connection.query(
        strQuery,
        function ( objError, objRows, objFields ){
            if( objError ){
                console.log("cound not add user");
                send_response(objError, null)
            }else{ 
                //sending the response 
                if(objRows[4][0]){
                   added_User = new users.Client(strEmail,objRows[4][0].id,strName,strFirstName,objRows[4][0].date_created); 
                }                   
                send_response(null, added_User);
            }
        });
    //ending the connection with the database
    connection.end();    
} 
module.exports.addClient = addClient;


function staffLogin(strEmail, strPassphrase, send_response){
    var strQuery = "";
    var connection = db.createConnection(connectparam);
    connection.connect;

    var timeAndId = "select date_created, id from staff where email='"+strEmail+"' into @time, @id;";
    var hash1 = "select md5('"+strPassphrase+"') into @hash1;"
    var hash2 = "select concat(@time,@hash1) into @hash2;";
    var query = "select * from staff where id=@id and passphrase=md5(@hash2);";
    strQuery =timeAndId+hash1+hash2+query;
    console.log(strQuery);
    connection.query(
        strQuery, 
        function ( objError, objRows, objFields){
            //console.log(objRows);
            if( objError ){
                logerror('userLogin','query error',objError);
                send_response(objError, null);
            }else{ 
                if (objRows[3][0]) {//3 because we have 4 queries 
                    var foundUser =objRows[3][0];
                    email = foundUser.email;
                    id = foundUser.id;
                    name = foundUser.name;
                    firstName = foundUser.first_name;
                    creationDate = foundUser.date_created; 
                    foundUser = new users.Staff(email,id,name,firstName,creationDate);                       
                }
                send_response(null,foundUser);                
            }
        });
    connection.end();
        
}
module.exports.staffLogin = staffLogin;

function addStaff (strName, strFirstName, strEmail, strPassphrase, send_response){
    var strQuery = "";
    var added_staff = null;  
    var connection = db.createConnection(connectparam);
    connection.connect();
    //query
    var time = "select now() into @a;"
    var hashpass = "select md5('"+strPassphrase+"') into @b;";
    var hashadtime = "select concat(@a, @b) into @c; ";
    var prepquery =  "insert into Staff (email, name, first_name, passphrase, date_created)";
    var values = "values ('"+strEmail+"','"+strName+"','"+strFirstName+"',md5(@c), @a);";   
    var id = "select id, date_created from Staff where email='"+strEmail+"';"  
    strQuery = time+hashpass+hashadtime+prepquery+values+id;
    console.log(strQuery);

    connection.query(
        strQuery,
        function ( objError, objRows, objFields ){
            if( objError ){
                console.error("addStaff"+objError);
                send_response(objError, null)
            }else{
                if(objRows[4][0]){//well added
                    added_staff = new users.Staff(strEmail,objRows[4][0].id, strName, strFirstName,objRows[4][0].date_created);
                }               
                send_response(null, added_staff);
            }
        });
    connection.end();
}
module.exports.addStaff = addStaff;

/**Store in the database finished calles
example for datatime: 2015-05-13 12:00
*/
//function storeCallFinished (strUserId, strStaffId, strStartTime, strEndTime, strComment, strWaitTime, strLocation, send_response){
function storeCallFinished (call, send_response){

    var strQuery = "";
    var addedCall = null;
    var connection = db.createConnection(connectparam);
    connection.connect();

    //get the value from the object in the parameters
    strUserId = this.client;
    strStaffId = this.staff;
    strStartTime = this.startTime;
    strEndTime = this.endTime;
    strComment = commend;
    strWaitTime = call.waitTime;
    strLocation = call.location;

    //creating the query
    strpreQuery = "insert into CallRecord (start_time, user_id, comment, staff_id, end_time, location, wait_time)";
    strValues = "values ('" +strStartTime+ "'," +strUserId+ ",'" +strComment+ "'," +strStaffId+ ",'" +strEndTime+ "','" +strLocation+ "'," + strWaitTime +");";
    strGetResIDQuery = "select id from CallRecord where start_time =" + "'" + strStartTime + "' and user_id=" +strUserId + ";";
    strQuery = strpreQuery + strValues + strGetResIDQuery;
    console.log(strQuery);

    //executing the query and returning the result
    connection.query(
        strQuery,
        function(objError, objRows, objFields){
            //console.log(objRows);
            if (objError){
                console.error("storeCallFinished Failed " + objError);
                send_response(objError, null);
            }else{
                console.log(objRows);
                if(objRows[1][0]){
                    //console.log(objRows[1][0].id);
                    storedCall = new calls.Call(strStartTime, strEndTime, strUserId, strStaffId, strComment, objRows[1][0].id, strLocation, strWaitTime);
                    //console.log(storedCall);
                }
                
                send_response(null, storedCall);
            }
        }
    );
    connection.end();
}module.exports.storeCallFinished = storeCallFinished;


/* Get Call Record information by ID
*/
function getCallById(id, send_response)
{

    var connection = db.createConnection(connectparam);
    connection.connect();
    strQuery = "select start_time, end_time, user_id, staff_id, comment, id, location, wait_time from CallRecord where id= " +id+ ";";
    console.log(strQuery);

    connection.query(
        strQuery,
        function(objError, objRows, objFields)
        {
            if(objError)
            {
                console.error("getCallById Failed: "+objError);
                send_response(null, objError);
            }
            else
            {
                console.log(objRows);
                call = new calls.Call(objRows[0].start_time, objRows[0].end_time, objRows[0].user_id, objRows[0].staff_id, objRows[0].comment, objRows[0].id, objRows[0].location,objRows[0].wait_time);
                send_response(call, null);
            }
        });

}module.exports.getCallById = getCallById;


/* Update or add a comment to a call
return 0 on success
return null on failure
*/
function updateCallComment(strComment, id, send_response)
{    
    var connection = db.createConnection(connectparam);
    connection.connect();

    var strQuery = "update CallRecord set comment = '" +strComment+ "' where id = " +id+ "";
    console.log(strQuery);

    connection.query(
        strQuery,
        function(objError, objRows, objFields){
            if(objError){
                console.error("updateCallComment Failed " + objError);
                send_response(objError, null);
            }else{
                send_response(null, "0");
            }
        }
    );

    connection.end();
}module.exports.updateCallComment = updateCallComment;

/* Update or add a comment to a call
return 0 on success
return null on failure
*/
function updateCallEndTime(strEndTime, id, send_response)
{    
    var connection = db.createConnection(connectparam);
    connection.connect();

    var strQuery = "update CallRecord set end_time = '" +strEndTime+ "' where id = " +id+ "";
    console.log(strQuery);

    connection.query(
        strQuery,
        function(objError, objRows, objFields){
            if(objError){
                console.error("updateCallEndTime Failed " + objError);
                send_response(objError, null);
            }else{
                send_response(null, "0");
            }
        }
    );

    connection.end();
}module.exports.updateCallEndTime = updateCallEndTime;


/* Get a list of Call id for a given User
return a list of Call Ids
*/

function GetCallsByUserId(userId, send_response)
{    
    var connection = db.createConnection(connectparam);
    connection.connect();

    var strQuery = "select * from CallRecord where user_id = " +userId+ ";";
    console.log(strQuery);

    connection.query(
        strQuery,
        function(objError, objRows, objFields){
            if(objError){
                console.error("GetCallsByUserId Failed " + objError);
                send_response(objError, null);
            }else{
                var callList = [];
                //console.log(objRows[0]);
                for(data in objRows){
                    call = new calls.Call(objRows[0].start_time, objRows[0].end_time, objRows[0].client_id, objRows[0].staff_id, objRows[0].comment, objRows[0].id, objRows[0].location,objRows[0].wait_time);
                    callList.push(call);
                }
                //console.log(callList);
                send_response(callList, objError);
            }
        }
    );
    connection.end();
}module.exports.GetCallsByUserId = GetCallsByUserId;

/* Change the password of a user by email adress
*/

function updateUserPassword(email, passphrase, send_response)
{    
    var connection = db.createConnection(connectparam);
    connection.connect();

    var time = "select date_created into @a from user where email ='" + email+ "';";
    var hashpass = "select md5('"+ passphrase+"') into @b;";
    var hashadtime = "select concat(@a, @b) into @c; ";
    var strQuery = "update User set passphrase = md5(@c) where email ='" +email+ "'";
    console.log(time + hashpass + hashadtime + strQuery);

    connection.query(
        time + hashpass + hashadtime + strQuery,
        function(objError, objRows, objFields){
            if(objError){
                console.error("updateUserPassword Failed " + objError);
                send_response(objError, null);
            }else{
                var callList = [];
                console.log(objRows);
                send_response("0", objError);
            }
        }
    );
    connection.end();
}module.exports.updateUserPassword = updateUserPassword;

/* Change the nane of a user by email adress
*/
function updateUserName(email, name, send_response)
{    
    var connection = db.createConnection(connectparam);
    connection.connect();
    var strQuery = "update User set name = '" +name + "'where email ='" +email+ "'";
    console.log(strQuery);

    connection.query(
        strQuery,
        function(objError, objRows, objFields){
            if(objError){
                console.error("updateUserName Failed " + objError);
                send_response(objError, null);
            }else{
                var callList = [];
                console.log(objRows);
                send_response("0", objError);
            }
        }
    );
    connection.end();
}module.exports.updateUserName = updateUserName;


/* Change the firstname of a user by email adress
*/
function updateUserFirstName(email, firstname, send_response)
{    
    var connection = db.createConnection(connectparam);
    connection.connect();
    var strQuery = "update User set first_name = '" + firstname + "'where email ='" +email+ "'";
    console.log(strQuery);

    connection.query(
        strQuery,
        function(objError, objRows, objFields){
            if(objError){
                console.error("updateUserFirstName Failed " + objError);
                send_response(objError, null);
            }else{
                var callList = [];
                console.log(objRows);
                send_response("0", objError);
            }
        }
    );
    connection.end();
}module.exports.updateUserFirstName = updateUserFirstName;
