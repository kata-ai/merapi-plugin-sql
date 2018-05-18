/// <reference types="knex" />
import * as Knex from "knex";
import { IConfigReader } from "merapi";
export default function (config: IConfigReader): Promise<Knex>;
