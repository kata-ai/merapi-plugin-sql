"use strict";

const BaseSqlRepo = require("./lib/base_sql_repo").default;
const knex = require("./lib/knex").default;
const knexConfig = require("./knexfile");

function knexModule (merapi) {
    return {
        async onBeforeComponentsRegister(container) {
            container.register("knex", knex);
        },

        async onAfterComponentsRegister(container) {
            container.resolve("knex");
        }
    };
};

knexModule.BaseSqlRepo = BaseSqlRepo;
knexModule.knexConfig = knexConfig;

module.exports = knexModule;
