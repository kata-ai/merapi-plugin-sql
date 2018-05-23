// tslint:disable:curly
// tslint:disable:no-shadowed-variable

import * as Knex from "knex";
import { Component, JsonObject } from "merapi";
import { v4 as uuid } from "uuid";
import { Id, IBaseSqlRepo, IPaginated } from "./interface";

export default class BaseSqlRepo<T> extends Component implements IBaseSqlRepo<T> {
    protected readonly table: () => Knex.QueryBuilder;

    constructor(
        protected readonly tableName: string,
        protected readonly knex: Knex,
    ) {
        super();
        this.table = () => this.knex(this.tableName);
    }

    public async count(query: Partial<T> = {}): Promise<number> {
        try {
            const result = await this.table().where(query).count("*");

            return result[0]["count(*)"];
        } catch (error) {
            throw error;
        }
    }

    public async getById(id: string): Promise<Id<T>> {
        try {
            return this.table().where({ id }).first();    
        } catch (error) {
            throw error;
        }
    }

    public async getOne(query: Partial<T>): Promise<Id<T>> {
        try {
            return this.table().where(query).first();    
        } catch (error) {
            throw error;
        }
    }

    public async getMany(query: Partial<T>, page: number = 1, limit: number = 10): Promise<IPaginated<Id<T>>> {
        try {
            let dataPromise;

            if (page) {
                const pg = page > 0 ? page : 1;
                const lmt = limit ? limit : 10;
                dataPromise = this.table().where(query).offset((pg - 1) * lmt).limit(lmt);
            } else if (limit) {
                dataPromise = this.table().where(query).limit(limit);
                page = 1;
            } else {
                dataPromise = this.table().where(query);
                page = 1;
            }

            const totalPromise = this.count(query);
            const [data, total] = await Promise.all([dataPromise, totalPromise]);

            return { data, limit, page, total };    
        } catch (error) {
            throw error;
        }
    }

    public async getManyByIds(ids: string[], page: number = 1, limit: number = 10): Promise<IPaginated<Id<T>>> {
        try {
            let dataPromise;

            if (page) {
                const pg = page > 0 ? page : 1;
                const lmt = limit ? limit : 10;
                dataPromise = this.table().whereIn("id", ids).offset((pg - 1) * lmt).limit(lmt);
            } else if (limit) {
                dataPromise = this.table().whereIn("id", ids).limit(limit);
                page = 1;
            } else {
                dataPromise = this.table().whereIn("id", ids);
                page = 1;
            }

            const totalPromise = await this.table().whereIn("id", ids).count("*");

            const [data, total] = await Promise.all([dataPromise, totalPromise]);

            return { data, limit, page, total: total[0]["count(*)"] };
        } catch (error) {
            throw error;
        }
    }

    public async getLike(column: string, queryString: string): Promise<Id<T>> {
        try {
            const result = await this.table().where(column, "like", `%${queryString}%`).first();

            return result;
        } catch (error) {
            throw error;
        }
    }

    public async insertOne(object: T): Promise<Id<T>> {
        try {
            const res = { ...(object as any) };
            if (!res.id)
                res.id = uuid();

            await this.table().insert(res);
            return res;
        } catch (error) {
            throw error;
        }
    }

    public async insertMany(objects: T[]): Promise<T[]> {
        try {
            const res = objects.map((object: Id<T>) => !object.id ? <T>{ id: uuid(), ...<any>object } : object);
            await this.knex.batchInsert(this.tableName, res);

            return res;
        } catch (error) {
            throw error;
        }
    }

    public async removeById(id: string): Promise<boolean> {
        try {
            const item = this.knex.transaction(async (trx: Knex.Transaction) => {
                const result = await trx.select().from(this.tableName).where({ id }).forUpdate();
                if (result) {
                    await trx.from(this.tableName).where({ id }).del();
                }
                return result;
            });

            return item ? true : false;
        } catch (error) {
            throw error;
        }
    }

    public async removeByIds(id: string[]): Promise<boolean> {
        try {
            const item = this.knex.transaction(async (trx: Knex.Transaction) => {
                const result = await trx.select().from(this.tableName).whereIn("id", id).forUpdate();
                await trx.from(this.tableName).whereIn("id", id).del();

                return result;
            });

            return item ? true : false;
        } catch (error) {
            throw error;
        }
    }

    public async removeBy(query: Partial<T>): Promise<number> {
        const res = this.knex.transaction(async (trx: Knex.Transaction) => {
            const result = await trx.select().from(this.tableName).where(query).forUpdate();
            await trx.from(this.tableName).where(query).del();

            return result;
        });

        return res;
    }

    public async updateById(id: string, object: Partial<T>): Promise<Id<T>> {
        try {
            if (!id)
                throw new Error(`id cannot be ${id}`);
    
            const numUpdatedRows = await this.table().where({ id }).update(object);
            if (numUpdatedRows < 1)
                throw new Error(`id=${id} does not exists`);

            return this.getById(id);
        } catch (error) {
            throw error;
        }
    }

    public async updateBy(query: Partial<T>, object: Partial<T>): Promise<number> {
        try {
            const numUpdatedRows = await this.table().where(query).update(object);

            return numUpdatedRows;
        } catch (error) {
            throw error;
        }
    }
}
