var users = require("../model/user.js");
var crypto = require("crypto");
var db          = require('mysql'); //This sets up the MySQL connection
var db_pool     = db.createPool({
    host        : 'localhost',
    database    : 'test',
    user        : 'api',
    password    : ''
});
var connectparam = {
        host        : 'localhost',
        database    : 'test',
        user        : 'api',
        password    : '',
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
                    firstName = foundUser.firstName;
                    creationDate = foundUser.dateCreated; 
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
                   added_User = new users.Client(strEmail,objRows[4][0].id,strName,strFirstName,objRows[4][0].dateCreated); 
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
     db_pool.getConnection( function ( objError, objConnection ){
        if( objError ){
           logerror('userLogin', 'connection error',objError );
           send_response(objError, null);

        }else{
            //strQuery = "select *  from user where email=" + "'" + strEmail + "' and " + "passphrase="+"'" + strPassphrase + "'";
            strQuery = "select * from Staff where email=" + "'" + strEmail + "' and " + "passphrase="+"'" + strPassphrase + "'";
            objConnection.query(
                strQuery, 
                function ( objError, objRows, objFields){
                if( objError ){
                    logerror('userLogin','query error',objError);
                    send_response(objError, null);
                }else{
                    //console.log(objRows);
                    if (objRows.length == 1) {
                       //we found the dude
                       name = objRows[0].name;
                       email = objRows[0].email;
                       foundUser = new users.Staff(email , name);
                       send_response(null,foundUser);   
                    }
                }
            });
        }
        objConnection.release();
        });
}
module.exports.staffLogin = staffLogin;

function addStaff (strName, strFirstName, strEmail, strPassphrase, send_response){
    var strQuery = "";
    var added_User;
    var strLogin = strEmail;
    db_pool.getConnection( function ( objError, objConnection ){
        if( objError ){
           console.error("addUser "+objError);
           send_response(objError, null);
        }else{
            var tmpStr = "'" + strLogin + "','" + strEmail + "','" + strName + "','" + strFirstName + "','" + strPassphrase +"'";
            strQuery = "insert into Staff (login, email, name, first_name, passphrase) VALUES ("+ tmpStr +")";
            console.log(strQuery);

            objConnection.query(
                strQuery,
                function ( objError, objRows, objFields ){
                    if( objError ){
                        console.error("addUser bas "+objError);
                        send_response(objError, null)
                    }else{          
                        added_User = new users.Client(strEmail, strName);
                        send_response(null, added_User);
                    }
                });
            objConnection.release();
        }           
    });
}
module.exports.addStaff = addStaff;
