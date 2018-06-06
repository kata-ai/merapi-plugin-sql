"use strict";

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const { Config } = require("merapi");

const configPath = path.resolve("./service.yml");
const configString = fs.readFileSync(configPath, "utf8");

let config = Config.create(yaml.safeLoad(configString), { left: "${", right: "}" });
Object.keys(process.env).forEach(key => {
    config.set("ENV." + key, process.env[key]);
    config.set("$" + key, process.env[key]);
});
config.resolve();

let dbConf = config.default("stores.sql", {});
if (dbConf.pool) {
    dbConf.pool.min = parseInt(config.default("stores.sql.pool.min", "2"));
    dbConf.pool.max = parseInt(config.default("stores.sql.pool.max", "10"));
}

module.exports = dbConf;
