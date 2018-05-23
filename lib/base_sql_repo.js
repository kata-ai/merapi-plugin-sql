"use strict";
// tslint:disable:curly
// tslint:disable:no-shadowed-variable
Object.defineProperty(exports, "__esModule", { value: true });
const merapi_1 = require("merapi");
const uuid_1 = require("uuid");
class BaseSqlRepo extends merapi_1.Component {
    constructor(tableName, knex) {
        super();
        this.tableName = tableName;
        this.knex = knex;
        this.table = () => this.knex(this.tableName);
    }
    async count(query = {}) {
        try {
            const result = await this.table().where(query).count("*");
            return result[0]["count(*)"];
        }
        catch (error) {
            throw error;
        }
    }
    async getById(id) {
        try {
            return this.table().where({ id }).first();
        }
        catch (error) {
            throw error;
        }
    }
    async getOne(query) {
        try {
            return this.table().where(query).first();
        }
        catch (error) {
            throw error;
        }
    }
    async getMany(query, page = 1, limit = 10) {
        try {
            let dataPromise;
            if (page) {
                const pg = page > 0 ? page : 1;
                const lmt = limit ? limit : 10;
                dataPromise = this.table().where(query).offset((pg - 1) * lmt).limit(lmt);
            }
            else if (limit) {
                dataPromise = this.table().where(query).limit(limit);
                page = 1;
            }
            else {
                dataPromise = this.table().where(query);
                page = 1;
            }
            const totalPromise = this.count(query);
            const [data, total] = await Promise.all([dataPromise, totalPromise]);
            return { data, limit, page, total };
        }
        catch (error) {
            throw error;
        }
    }
    async getManyByIds(ids, page = 1, limit = 10) {
        try {
            let dataPromise;
            if (page) {
                const pg = page > 0 ? page : 1;
                const lmt = limit ? limit : 10;
                dataPromise = this.table().whereIn("id", ids).offset((pg - 1) * lmt).limit(lmt);
            }
            else if (limit) {
                dataPromise = this.table().whereIn("id", ids).limit(limit);
                page = 1;
            }
            else {
                dataPromise = this.table().whereIn("id", ids);
                page = 1;
            }
            const totalPromise = await this.table().whereIn("id", ids).count("*");
            const [data, total] = await Promise.all([dataPromise, totalPromise]);
            return { data, limit, page, total: total[0]["count(*)"] };
        }
        catch (error) {
            throw error;
        }
    }
    async getLike(column, queryString) {
        try {
            const result = await this.table().where(column, "like", `%${queryString}%`).first();
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async insertOne(object) {
        try {
            const res = Object.assign({}, object);
            if (!res.id)
                res.id = uuid_1.v4();
            await this.table().insert(res);
            return res;
        }
        catch (error) {
            throw error;
        }
    }
    async insertMany(objects) {
        try {
            const res = objects.map((object) => !object.id ? Object.assign({ id: uuid_1.v4() }, object) : object);
            await this.knex.batchInsert(this.tableName, res);
            return res;
        }
        catch (error) {
            throw error;
        }
    }
    async removeById(id) {
        try {
            const item = this.knex.transaction(async (trx) => {
                const result = await trx.select().from(this.tableName).where({ id }).forUpdate();
                if (result) {
                    await trx.from(this.tableName).where({ id }).del();
                }
                return result;
            });
            return item ? true : false;
        }
        catch (error) {
            throw error;
        }
    }
    async removeByIds(id) {
        try {
            const item = this.knex.transaction(async (trx) => {
                const result = await trx.select().from(this.tableName).whereIn("id", id).forUpdate();
                await trx.from(this.tableName).whereIn("id", id).del();
                return result;
            });
            return item ? true : false;
        }
        catch (error) {
            throw error;
        }
    }
    async removeBy(query) {
        const res = this.knex.transaction(async (trx) => {
            const result = await trx.select().from(this.tableName).where(query).forUpdate();
            await trx.from(this.tableName).where(query).del();
            return result;
        });
        return res;
    }
    async updateById(id, object) {
        try {
            if (!id)
                throw new Error(`id cannot be ${id}`);
            const numUpdatedRows = await this.table().where({ id }).update(object);
            if (numUpdatedRows < 1)
                throw new Error(`id=${id} does not exists`);
            return this.getById(id);
        }
        catch (error) {
            throw error;
        }
    }
    async updateBy(query, object) {
        try {
            const numUpdatedRows = await this.table().where(query).update(object);
            return numUpdatedRows;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = BaseSqlRepo;
//# sourceMappingURL=base_sql_repo.js.map