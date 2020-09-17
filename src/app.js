require("dotenv").config();

const Cerberus = require("./struct/cerberus");
const cerb = new Cerberus();

cerb.events.on("discord/ready", () => {
	cerb.log("[Discord] Bot is online and ready.");
});

cerb.events.on("web/ready", () => {
	cerb.log("[Webserv] Webservices are online and ready.");
});

cerb.events.on("web/addRoute", route => {
	cerb.log(`[Webserv] Added route '${route.name}' for dir '${route.dir}'`);
});

cerb.events.on("db/ready", () => {
	cerb.log("[Databse] Database is online and ready.");
});

cerb.events.on("db/write", data => {
	cerb.log(`[Databse] Entry '${data.message}' written to database.`);
});

cerb.events.on("db/read", data => {
	cerb.log(`[Databse] Entry '${data.message}' read from database.`);
});

cerb.log("Starting Cerberus...");
cerb.registerDiscord(process.env.DISCORD_TOKEN);
cerb.registerWebservice({VHOST_DOMAIN: process.env.VHOST_DOMAIN, WEBSERVICE_PORT: process.env.WEBSERVICE_PORT, JWT_SECRET: process.env.JWT_SECRET});
cerb.registerDatabase();
