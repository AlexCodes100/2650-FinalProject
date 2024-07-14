# 2650-FinalProject

Clone the repository in your computer by 
```
git clone [repository URL]
```
Change directory into the folder you have just cloned by

## Client side

Go inside the client directory in the downloaded folder:
```
cd 2650-FinalProject/client
```
Install all the dependencies by: (make sure you have node package manager
```
npm install
```
Run the client side webpage by:
```
npm start
```

## Server side

Change directory from client to server by:
```
cd ../server
```
## For the server create a .env file with the following variables:
```
PORT=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SESSION_SECRET=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
MONGODB_URI=
SQL_HOST=
SQL_USER=
SQL_PASSWORD=
SQL_DATABASE=
```
## You will need to have running a redis server, a mysql database and a connection to a mongodb atlas database.

## After that just do npm install followed by npm start to setup the server.
```
npm install
npm start
```
