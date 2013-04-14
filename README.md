# Meta.TF README

To run locally, you will need a MongoDB / Mongoose instance.
If using Heroku with the MongoLab or MongoHQ addons, the server will automatically connect.

## Overview
The Meta.tf code utilizes an MVC architecture as much as possible.
<b>This code is still in pre-alpha.  Many features are still being implemented, written, and tested.</b>

### Database
The database configuration is in db/connect.js
Database schemas are present in the db/models folder

db/models/schemas.js will export the schemas for Mongoose when called
db/models/foo.js will define the schemas

The actual schema initialization is called in server.js

### Controllers
The controllers folder contains all of the controller functions.

### Models
The models folder contains all of functions that pull data from the database, or the steam API.
It also contains common functions such as CRUD