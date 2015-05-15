# ProjetTut


##Instalation 
###Basics
Install node and npm.
To install the dependencies :
```shel
npm install
````
###Setup database
The .sql file, in the db dirrectory, represents the latest version of the database. Import it in your favorite data base engine. Edit the package.json file to insure the good connection with the database (pass word, user name...).

##Runing 
###Not secure and no DataBase
To without a Database connection and not in https, go to the package.json file and edit like followed :

```json
secure_http : false
```
and 
```json
database : {
  "connected" : false
  }
```

###Use Https
In the package.json file edit the secure_http parameter to true.
###Use the database
In the package.json file edit the database->connected parameter to true.


