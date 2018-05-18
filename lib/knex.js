"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Knex = require("knex");
async function default_1(config) {
    let dbConf = config.default("storages.sql", {});
    if (dbConf.pool) {
        dbConf.pool.min = parseInt(config.default("storages.sql.pool.min", "2"));
        dbConf.pool.max = parseInt(config.default("storages.sql.pool.max", "10"));
    }
    const client = Knex(dbConf);
    if (dbConf.autoMigrate === "true" || dbConf.autoMigrate === true) {
        await client.migrate.latest();
    }
    return client;
}
exports.default = default_1;
//# sourceMappingURL=knex.js.map