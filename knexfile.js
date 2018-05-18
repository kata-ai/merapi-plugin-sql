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

let dbConf = config.default("storages.sql", {});
if (dbConf.pool) {
    dbConf.pool.min = parseInt(config.default("storages.sql.pool.min", "2"));
    dbConf.pool.max = parseInt(config.default("storages.sql.pool.max", "10"));
}

module.exports = dbConf;
