# Meta.TF README
Website: http://www.meta.tf/
Backpack viewer: http://www.meta.tf/backpack/76561197991291041
Create a trade: http://www.meta.tf/trade/create

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

Current Collections:
* Users
* Trades

The actual schema initialization is called in server.js

### Controllers
The controllers folder contains all of the controller functions.

Controller Files (controllers/):
* admin_controller.js - Routes admin functions; renders admin.ejs
	- updateSchema - calls ../models/download_schema_model to download the new tf2 item schema, and item icons to the file system
		- Sends a message as a status update to admin.ejs view
	- resizeItems - BUGGY - calls ../models/download_schema_model to resize images
	- AddAnAdmin - In development
	- AddAModerator - In development
* homepage_controller.js - Renders the index.ejs view
* item_controller.js - Gets backpack from item_model.js, renders backpack.ejs, or schema.ejs
	- showbackpack will render the user's backpack
	- showschema will render the whole item schema
* trade_controller.js - Handles POST and GET to /trade/create, and pulls data to render $url.com/trade/view/$id
	- exports.index - routes calls to following functions
		- ShowCreateATrade - GET /trade/create/ - Pulls backpack, and schema data from ../models/item_model.js, renders view createtrade.ejs
		- ViewTrade - GET /trade/view/$id - Pulls trade information from trade_model, renders viewtrade.ejs
		- POST /trade/create - Sends data to trade_model for creation
* user_controller.js - Routes user functions
	- exports.profile - shows the user's profile with trades
	


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
	- exports.resizeitems - UNUSUED - Should use imagemagick to resize item icons. Currently buggy.
* item_model.js
	- exports.getbackpack - Hosts the backpack function.  Parses SteamAPI getplayeritems and models/tf2item_schema.txt to extract relevant backpack data.  Returns player backpack.
	- exports.getschema - Parses our downloaded item schema to JSON, and returns the JSON object.
* trade_model.js
	- CRUD functions for trades
* user_model.js
	- CRUD functions for users

## License
All rights reserved.  Code may be used for reference, and educational purposes only.