import pgp from "pg-promise";
import ConfigDatabase from "./ConfigDatabase.js";
import Connection from "./Connection.js";

export default class PostgreSQLConnection implements Connection {

    protected pgp: any;

    constructor(configDatabase: ConfigDatabase) {
        this.pgp = pgp()({
            host: configDatabase.db_host,
            port: configDatabase.db_port,
            database: configDatabase.db_database,
            user: configDatabase.db_user,
            password: configDatabase.db_password,
        });
    }

    execute(statement: string, params?: any[]): Promise<any[]> {
        return this.pgp.query(statement, params);
    }

    close(): Promise<void> {
        return this.pgp.$pool.end();
    }

}