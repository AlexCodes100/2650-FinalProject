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
PORT=3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SESSION_SECRET=cd1f3add13cb5fcaa12f3f8ba818c4b2d35d798920276dbe0483a6560f4cf31f57618a07d37e8676c597a425ba236c3137483fa16d6cf888e6c616e0898a85ac
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=''
SQL_HOST=localhost
SQL_USER=
SQL_PASSWORD=
SQL_DATABASE=db
CORS_ORIGIN=http://localhost:4000
```
## You will need to have running a redis server and a mysql database.

## After that just do npm install followed by npm start to setup the server.
```
npm install
npm start
```

##Give credit 
```
We would like to give credit to J Andre Furtado for the amazing picture 
```
https://www.pexels.com/photo/woman-draped-in-a-flag-of-canada-2916826/

```
And we use canvas for creating the logo 
```

