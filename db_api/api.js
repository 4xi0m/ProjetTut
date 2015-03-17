var node_port   = 8080;
var express     = require('express'); // This makes REST easy
var app         = express();
var db          = require('mysql'); //This sets up the MySQL connection
var db_pool     = db.createPool({
    host        : 'localhost',
    database    : 'WebRTC',
    user        : 'api',
    password    : 'api'
});



app.get( '/api/:method', function ( objRequest, objResponse ){
    // Set response type from text/html to application/json
    objResponse.setHeader( 'content-type', 'application/json' );

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
                case 'callRequest':
                    //generate adding a new call request related query;
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

/* Start listening on port 3000 */
app.listen( node_port );
console.log( "App listening on port " + node_port );
