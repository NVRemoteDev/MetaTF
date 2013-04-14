# Meta.TF README

## Overview
The Meta.tf code utilizes an MVC architecture as much as possible.
<b>This code is still in pre-alpha.  Many features are still being implemented, written, and tested.</b>

### Database
To run locally, you will need a MongoDB / Mongoose instance.
If using Heroku with the MongoLab or MongoHQ addons, the server will automatically connect without modifications.
The database configuration is in db/connect.js
Database schemas are present in the db/models folder

db/models/schemas.js will export the schemas for Mongoose when called
db/models/foo.js will define the schemas

<b>Current Collections:</b>
* Users
* Trades

The actual schema initialization is called in server.js

### Controllers
The controllers folder contains all of the controller functions.

### Models
The models folder contains all of functions that pull data from the database, or the steam API.
It also contains common functions such as CRUD

Model Files (models/):
* steamapi_model.js - Connects to SteamAPI, returns function with API data in JSON
	- user - Returns userdata from Steam, such as username and avatar
	- backpack - Returns players' items from Steam
	- schema - Returns latest tf2item schema from Steam
* download_schema_model.js
	- exports.download - Downloads the item schema to models/tf2item_schema.txt, calls function DownloadItemIcons 
	- function DownloadItemIcons - Downloads item icons to static/item_icons/$(defindex).png
	- exports.resizeitems - Should use imagemagick to resize item icons. Currently buggy.  Library problem?
* item_model.js
	- exports.getbackpack - Hosts the backpack function.  Parses SteamAPI getplayeritems and models/tf2item_schema.txt to extract relevant backpack data.  Returns player backpack.
	- exports.getschema - Parses our downloaded item schema to JSON, and returns the JSON object.
* trade_model.js
	- CRUD functions for trades
* user_model.js
	- CRUD functions for users

## License
All rights reserved.  Code may be used for reference, and educational purposes only.