var users = require("../model/user.js");
var db          = require('mysql'); //This sets up the MySQL connection
var db_pool     = db.createPool({
    host        : 'localhost',
    database    : 'test',
    user        : 'root',
    password    : 'root'
});
var connectparam = {
        host        : 'localhost',
        database    : 'test',
        user        : 'root',
        password    : 'root',
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

    var timeAndId = "select date_created, id from user where email='"+strEmail+"' into @time, @id;";
    var hash1 = "select md5('"+strPassphrase+"') into @hash1;"
    var hash2 = "select concat(@time,@hash1) into @hash2;";
    var query = "select * from user where id=@id and passphrase=md5(@hash2);";
    strQuery =timeAndId+hash1+hash2+query;
    //console.log(strQuery);
    connection.query(
        strQuery, 
        function ( objError, objRows, objFields){
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
    connection.query(
        strQuery, 
        function ( objError, objRows, objFields){
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
function storeCallFinished (strUserId, strStaffId, strStartTime, strEndTime, strComment, strWaitTime, strLocation, send_response){
    var strQuery = "";
    var addedCall = null;
    var connection = db.createConnection(connectparam);
    connection.connect();

    //creating the query
    strpreQuery = "insert into CallRecord (start_time, user_id, comment, staff_id, end_time, location, wait_time)";
    strValues = "values ('" +strStartTime+ "'," +strUserId+ ",'" +strComment+ "'," +strStaffId+ ",'" +strEndTime+ "','" +strLocation+ "','" + strWaitTime +"';";
    strGetResIDQuery = "select id from CallRecord where strStartTime =" + "'" + strStartTime + "', strUserId=" +strUserId + ";";
    strQuery = strpreQuery + strValues + strGetResIDQuery;
    console.log(strQuery);

    //executing the query and returning the result
    connection.query(
        strQuery,
        function(objError, objRows, objFields){
            if (objError){
                console.error("storeCallFinished Error" + objError);
                send_response(objError, null);
            }else{
                if(objRows[0][0]){
                    
                }
            }
        }

        )


}module.exports.stroreCallFinished = stroreCallFinished;
