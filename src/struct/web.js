const fs = require("fs");
const events = require("events");

const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const vhost = require("vhost");
const subdomain = require("express-subdomain");
const exphbs = require("express-handlebars");

app.engine("hbs", exphbs());
app.set("view engine", "hbs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

module.exports = class Webservice {
	constructor() {
		this.events = new events.EventEmitter();
		this.routes = [];
		return this;
	}

	start(data) {
		if(!data) throw new Error("No data provided.");
		if(!data.WEBSERVICE_PORT) throw new Error("No WEBSERVICE_PORT provided.");
		if(!data.VHOST_DOMAIN) throw new Error("No VHOST_DOMAIN provided.");
		if(!data.JWT_SECRET) throw new Error("No JWT_SECRET provided.");

		for (const routeFile of fs.readdirSync("./routes").filter(file => file.endsWith(".js"))) {
			const route = require(`../routes/${routeFile}`);
			this.routes.push({name:route.name, dir:route.dir, router:route.router});

			if(route.dir.endsWith(".")) {
				app.use(subdomain(route.dir.slice(0, -1), route.router));
			} else {
				app.use(route.dir, route.router);
			}
			this.events.emit("addRoute", {name:route.name,dir:route.dir});
		}

		// ! Causes Max Range Exceeded error - will need to check this out...
		//app.use(vhost(data.VHOST_DOMAIN, app));

		http.createServer(app).listen(data.WEBSERVICE_PORT, () => this.events.emit("ready"));
	}
}
