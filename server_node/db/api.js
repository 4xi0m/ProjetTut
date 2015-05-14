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


    var timeAndId = "select dateCreated, id from user where email='"+strEmail+"' into @time, @id;";
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
                    name = objRows[3][0].name;
                    email = objRows[3][0].email;
                    foundUser = new users.Client(email , name);                       
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
    var added_User;
    //connection to the database
    var connection = db.createConnection(connectparam);
    connection.connect();
       
    //creating the valid query      
    var time = "select now() into @a;"
    var hashpass = "select md5('"+strPassphrase+"') into @b;";
    var hashadtime = "select concat(@a, @b) into @c; ";
    var prepquery =  "insert into User (email, name, firstName, passphrase, dateCreated)";
    var values = "values ('"+strEmail+"','"+strName+"','"+strFirstName+"',md5(@c), @a);";     
    strQuery = time+hashpass+hashadtime+prepquery+values;
    
    connection.query(
        strQuery,
        function ( objError, objRows, objFields ){
            if( objError ){
                console.log("cound not add user");
                send_response(objError, null)
            }else{ 
                //sending the response         
                added_User = new users.Client(strEmail, strName);
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
            strQuery = "insert into Staff (login, email, name, firstName, passphrase) VALUES ("+ tmpStr +")";
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
/*
    // Get a connection to the database
    db_pool.getConnection( function ( objError, objConnection ){

        // check for any connection errors
        if( objError ){
            // There was an error, so send JSON with an error message and an HTTP status of 503 (Service Unavailable)
            sendError( objResponse, 503, 'error', 'connection', objError );

        }else{

            // We have a connection to the database server and db:
            //      Let's figure out which CONTENT_TYPE they want and build
            //      the correct QUERY to request from MySQL
            var strQuery = "";
            var method = objRequest.params['method'];
            console.log(objRequest.params);
            var params = objRequest.query;
            console.log(params);
            switch( method ){
                case 'addUser':
                    strEmail = params['email'];
                    strName = params['name'];
                    strFirstName = params['firstName'];
                    strPassphrase = params['passphrase'];
                    tmpStr = "'" +strEmail + "','" + strName + "','" + strFirstName + "','" + strPassphrase +"'";
                    strQuery = "insert into User (email, name, firstName, passphrase) VALUES ("+ tmpStr +")";
                    console.log(strQuery);

                    //sending the query to db server
                    objConnection.query(
                        strQuery,
                        function ( objError, objRows, objFields ){
                        if( objError ){
                            // Couldn't get the query to run, so send JSON with an error message and an HTTP status of 500 (Internal Server Error)
                            sendError( objResponse, 500, 'error', 'query', objError );
                            }else{
                            // We have query results back, so lets put the results in JSON and return them
                            objResponse.send({
                                result      : '0', // 0 indicate that we added user successfully

                                insertedID  : objRows['insertId']
                            });
                            }
                        }
                    );
                    objConnection.release();
                    break;


                case 'userLogin':
                    strEmail = params['email'];
                    strPassphrase = params['passphrase'];
                    strQuery = "select email from user where email=" + "'" + strEmail + "' and " + "passphrase="+"'" + strPassphrase + "'";
                    console.log(strQuery);
                    //sending the query to db server
                    objConnection.query(
                        strQuery,
                        function ( objError, objRows, objFields ){
                        if( objError ){
                            // Couldn't get the query to run, so send JSON with an error message and an HTTP status of 500 (Internal Server Error)
                            sendError( objResponse, 500, 'error', 'query', objError );
                            }else{
                                // We have query results back, so lets put the results in JSON and return them
                                if (objRows.length == 0) {
                                   objResponse.send({
                                    result      : '-1' // -1 indicates the authentication process failed
                                });
                                }else{
                                    objResponse.send({
                                    result      : '0' // -1 indicates the authentication process failed
                                    });
                                }

                            }
                        }
                    );
                    break;
                case 'addStaff':
                    strEmail = params['email'];
                    strName = params['name'];

                    strFirstName = params['firstName'];
                    strPassphrase = params['passphrase'];


                    console.log(params['login']);
                    if (params['login']) {
                        strLogin = params['login'];
                        
                    }else{
                        console.log("hello");
                        strLogin = strEmail;
                    }
                    
                
                    tmpStr = "'" + strLogin + "','" + strEmail + "','" + strName + "','" + strFirstName + "','" + strPassphrase +"'";
                    strQuery = "insert into Staff (login, email, name, firstName, passphrase) VALUES ("+ tmpStr +")";
                    console.log(strQuery);

                    //sending the query to db server
                    objConnection.query(
                        strQuery,
                        function ( objError, objRows, objFields ){
                        if( objError ){
                            // Couldn't get the query to run, so send JSON with an error message and an HTTP status of 500 (Internal Server Error)
                            sendError( objResponse, 500, 'error', 'query', objError );
                            }else{
                            // We have query results back, so lets put the results in JSON and return them
                            objResponse.send({
                                result      : '0', // 0 indicate that we added user successfully

                                insertedID  : objRows['insertId']
                            });
                            }
                        }
                    );
                    objConnection.release();
                    break;
                    
                    //generate adding a new call request related query;
                    break;
                case 'staffLogin':
                    strEmail = params['email'];
                    strPassphrase = params['passphrase'];
                    strQuery = "select email from Staff where email=" + "'" + strEmail + "' and " + "passphrase="+"'" + strPassphrase + "'";
                    console.log(strQuery);
                    //sending the query to db server
                    objConnection.query(
                        strQuery,
                        function ( objError, objRows, objFields ){
                        if( objError ){
                            // Couldn't get the query to run, so send JSON with an error message and an HTTP status of 500 (Internal Server Error)
                            sendError( objResponse, 500, 'error', 'query', objError );
                            }else{
                                // We have query results back, so lets put the results in JSON and return them
                                if (objRows.length == 0) {
                                   objResponse.send({
                                    result      : '-1' // -1 indicates the authentication process failed
                                });
                                }else{
                                    objResponse.send({
                                    result      : '0' // -1 indicates the authentication process failed
                                    });
                                }
                            }
                        }
                    );
                    break;
                default :
                    console.log("no information");
                    // We don't know how to handle this kind of CONTENT_TYPE so
                    // we simply want to blow it up right now
                    //sendError( objResponse, 503, 'error', 'content-type unkown', { code : 'CONTENT-TYPE MISMATCH' } );
            }



        }
    });
});


function sendError( objResponse, iStatusCode, strResult,  strType, objError ){
    objResponse.send({
        result  : strResult,
        err     : objError,
        err_type    : strType
    });
}
*/