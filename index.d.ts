
import { Id, IBaseSqlRepo, IPaginated } from "./src/interface";
import { Component } from "merapi";

import * as Knex from "knex";

export class BaseSqlRepo<T> extends Component implements IBaseSqlRepo<T> {
    constructor (
        tableName: string,
        knex: Knex
    );

    count(query: Partial<T>): Promise<number>;
    getById(id: string): Promise<Id<T>>;
    getOne(query: Partial<T>): Promise<Id<T>>;
    getMany(query: Partial<T>, page?: number, limit?: number): Promise<IPaginated<Id<T>>>;
    getLike(column: string, queryString: string): Promise<Id<T>>;
    insertOne(object: T): Promise<Id<T>>;
    insertMany(objects: T[]): Promise<T[]>;
    removeById(id: string): Promise<boolean>;
    removeByIds(id: string[]): Promise<boolean>;
    removeBy(query: Partial<T>): Promise<number>    
    updateById(id: string, object: Partial<T>): Promise<Id<T>>;
    updateBy(query: Partial<T>, object: Partial<T>): Promise<number>;
}

/**
 * interface.ts
 */
export { Id as Id };
export { IBaseSqlRepo as IBaseSqlRepo };
export { IPaginated as IPaginated };
