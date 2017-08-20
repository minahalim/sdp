# Shortest Driving Path App

Calculating the shortest driving path from origin point to destinations, created by Mina Halim Hanna

## Getting Started

These instructions will get you an instance of the project up and running on your local machine for development and it's a production ready App.

### Prerequisite

This app is built on top of Node.Js and MongoDB so make sure you have them installed in your system.

Node.js: https://nodejs.org/en/download/

MongoDB: https://docs.mongodb.com/getting-started/shell/installation/

Make sure MongoDB is running.

### Setting up the App:

1- Clone the app from github repo, develop branch
	
	```
	Github: https://github.com/minahalim/sdp
	```

2- Use the terminal to go inside the App directory:
	
	```
	cd <project_folder>
	```

3- Install node dependencies

	```
	npm install
	```

4- Star the App*

	```
	npm start
	```

Note*: if you want to run specific environment use the node env variable:

	```
	NODE_ENV=<ENVIRONMENT> npm start
	```
You can run different environments just replace <ENVIRONMENT> with one of the following:

LOCAL
DEVELOPMENT
QA
STAGING
PRODUCTION
DOCKER

### Docker

You can build and run docker image for the project using the following command:

```
docker-compose build
docker-compose run
```

### For the Database:

You can easily configure the database from the config folder per environment, Simply change the following variables under <project_name>/config/env<environment>

	```
	databaseHostName: "localhost",
    databaseHostPort: "27017",
    databaseUsername: "",
    databasePassword: "",
    databaseName: "sdp"
    ```

### For Postman:

You can find postman collection in the github `SDP.postman_collection` import it into postman so that you can play around with the routes.

### For running the tests:

```
npm test
```

## New Branches and code 

Please make sure you are branching from develop into your new branch

after commiting please create a pull request to develop branch

peer code reviews is a must

run Jslint and Jscs with the following commands to make sure you are following the code convention

```
npm run jshin
npm run jscs
``

## Demo

I have hosted a demo for this App in openshift, you can also play around with it in the postman:

```
http://nodejs-mongo-persistent-sdp.a3c1.starter-us-west-1.openshiftapps.com/
```

I have done auto deployment setup from github to openshift, so that whenever I push a new code into the develop branch it will trigger a deployment to openshift immediately.

## Authors

* **Mina Halim Hanna**

Feel free to contact me for any issues or any enquiries. :)