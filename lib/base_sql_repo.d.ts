/// <reference types="knex" />
import * as Knex from "knex";
import { Component } from "merapi";
import { Id, IBaseSqlRepo, IPaginated } from "./interface";
export default class BaseSqlRepo<T> extends Component implements IBaseSqlRepo<T> {
    protected readonly tableName: string;
    protected readonly knex: Knex;
    protected readonly table: () => Knex.QueryBuilder;
    constructor(tableName: string, knex: Knex);
    count(query?: Partial<T>): Promise<number>;
    getById(id: string): Promise<Id<T>>;
    getOne(query: Partial<T>): Promise<Id<T>>;
    getMany(query: Partial<T>, page?: number, limit?: number): Promise<IPaginated<Id<T>>>;
    getManyByIds(ids: string[], page?: number, limit?: number): Promise<IPaginated<Id<T>>>;
    getLike(column: string, queryString: string): Promise<Id<T>>;
    insertOne(object: T): Promise<Id<T>>;
    insertMany(objects: T[]): Promise<T[]>;
    removeById(id: string): Promise<boolean>;
    removeByIds(id: string[]): Promise<boolean>;
    removeBy(query: Partial<T>): Promise<number>;
    updateById(id: string, object: Partial<T>): Promise<Id<T>>;
    updateBy(query: Partial<T>, object: Partial<T>): Promise<number>;
}
