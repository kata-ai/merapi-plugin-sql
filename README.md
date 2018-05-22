# Merapi Plugin SQL

## Introduction

[Merapi](https://github.com/kata-ai/merapi) plugin for SQL connection using [knex](https://github.com/tgriesser/knex).

# Quick Start

## Installation

```
npm install merapi-plugin-sql --save
```

## Configuration

Put knex configuration in config `storages.sql`:
```json
{
    "name": "merapi",
    "version": "0.1.0",
    "plugins": [
        "sql"
    ],
    "storages": {
        "sql": {
            "client": "mysql",
            "connection": {
                "host": "localhost",
                "user": "localhost",
                "password": "",
                "port": "3306",
                "database": "test-db",
                "encrypt": true
            },
            "pool": { "min": 2, "max": 5 },
            "migrations": {
                "tableName": "migrations"
            }
        }
    }
}
```
