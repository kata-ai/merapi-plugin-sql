import * as Knex from "knex";
import { IConfigReader } from "merapi";

export default async function(config: IConfigReader) {
    let dbConf : Knex.Config & { autoMigrate?: boolean | string } = config.default("storages.sql", {});
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
