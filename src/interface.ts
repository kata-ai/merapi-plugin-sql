
export type Id<T> = T & { id: string };

export interface IPaginated<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
}

export interface IBaseSqlRepo<T> {
    count(query: Partial<T>): Promise<number>;
    getById(id: string): Promise<Id<T>>;
    getOne(query: Partial<T>): Promise<Id<T>>;
    getMany(query: Partial<T>, page?: number, limit?: number): Promise<IPaginated<Id<T>>>;
    getManyByIds(ids: string[], page?: number, limit?: number): Promise<IPaginated<Id<T>>>;
    getLike(column: string, queryString: string): Promise<Id<T>>;
    insertOne(object: T): Promise<Id<T>>;
    insertMany(objects: T[]): Promise<T[]>;
    removeById(id: string): Promise<boolean>;
    removeByIds(id: string[]): Promise<boolean>;
    removeBy(query: Partial<T>): Promise<number>    
    updateById(id: string, object: Partial<T>): Promise<Id<T>>;
    updateBy(query: Partial<T>, object: Partial<T>): Promise<number>;
}
