import mariadb, { type PoolConfig } from "mariadb";

import { extractParams, flattenToObject, generateParams } from "../helpers/hepers.js";
import { ExecSPOptions } from "../interfaces/db.interface.js";

const defaultConfig = {
    multipleStatements: true,
}

export class BaseRepository {
    private pool: mariadb.Pool;

    /**
     * Creates a new BaseRepository instance.
     * @param {PoolConfig} config - Connection configuration for the MariaDB pool.
     */
    constructor(config: PoolConfig) {
        this.pool = mariadb.createPool(
            {
                ...defaultConfig,
                ...config
            }
        );
    }

    /**
     * Executes a stored procedure with the given parameters and handling options.
     * 
     * @param {string} spName - The name of the stored procedure to call.
     * @param {ExecSPOptions} options - Execution and result handling options.
     * @param {any[] | Record<string, any>} [options.params=[]] - Parameters for the SP.
     * @param {OutVariable[]} [options.out=[]] - Output variables to handle.
     * @param {boolean} [options.plain=true] - Whether to return a single object (true) or an array of results.
     * @param {boolean} [options.extract=false] - Whether to extract parameters from an object based on `order`.
     * @param {string[]} [options.order=[]] - The order of keys for parameter extraction.
     * @param {boolean} [options.deleteExtra=false] - Whether to remove keys not present in `order`.
     * @param {boolean} [options.fillWithNulls=false] - Whether to fill missing ordered parameters with null.
     * @returns {Promise<T>} The result of the stored procedure execution.
     */
    async execSP<T = any>(spName: string, {
        params = [],
        out = [],
        plain = true,
        extract = false,
        order = [],
        deleteExtra = false,
        fillWithNulls = false,
    }: ExecSPOptions): Promise<T> {
        const endParams = extract && !Array.isArray(params) && params !== null
            ? extractParams({ params: params as Record<string, any>, order, deleteExtra, fillWithNulls })
            : (Array.isArray(params) ? params : []);

        const placeholders = generateParams(endParams.length);

        const callParams = [
            ...(placeholders ? [placeholders] : []),
            ...(out.length ? out.map(({ name }) => `@${name}`) : [])
        ].join(',');

        let conn;
        try {
            conn = await this.pool.getConnection();

            const declareOutVars = out.length
                ? out.map(({ name, type }) => `SET @${name} = CAST(NULL AS ${type ?? 'VARCHAR(255)'});`).join('\n')
                : '';

            const selectOuts = out.length
                ? 'SELECT ' + out
                    .map(({ name }) => `@${name} AS ${name}`)
                    .join(',')
                : '';

            const query = `
        ${declareOutVars}
        CALL ${spName}(${callParams});
        ${selectOuts}
      `;

            const res = await conn.query(query, endParams);

            return (plain ? flattenToObject(res) : (res[0] ?? [])) as T;
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    /**
     * Retrieves all records from a database view.
     * 
     * @param {string} viewName - The name of the view to query.
     * @returns {Promise<T[]>} An array containing the records from the view.
     */
    async view<T = any>(viewName: string): Promise<T[]> {
        let conn;
        try {
            conn = await this.pool.getConnection();
            const result = await conn.query(`SELECT * FROM ${viewName}`);
            return result as T[];
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    /**
     * Executes a raw SQL query with optional parameters.
     * 
     * @param {string} query - The SQL query to execute.
     * @param {any[]} [params] - The parameters to safely bind to the query.
     * @returns {Promise<T[]>} The result set from the query.
     */
    async query<T = any>(query: string, params?: any[]): Promise<T[]> {
        let conn;
        try {
            conn = await this.pool.getConnection();
            const result = await conn.query(query, params);
            return result as T[];
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }

    /**
     * Tests the database connection and invokes callbacks based on the result.
     * 
     * @param {function} [onSuccess] - Callback function to execute if the connection is successful.
     * @param {function} [onError] - Callback function to execute if the connection fails.
     * @throws {Error} If the connection fails and no onError callback is provided.
     */
    async connectDB(onSuccess?: () => void, onError?: (error: Error) => void) {
        try {
            const conn = await this.pool.getConnection();
            conn.release();
            onSuccess?.();
        } catch (error) {
            onError?.(error as Error);
            throw error;
        }
    }

    /**
     * Closes the connection pool and all active connections.
     * 
     * @param {function} [onSuccess] - Callback function to execute after the pool is closed.
     * @param {function} [onError] - Callback function to execute if closing the pool fails.
     * @returns {Promise<void>}
     */
    async closeDB(onSuccess?: () => void, onError?: (error: Error) => void) {
        return this.pool.end().then(() => {
            onSuccess?.();
        }).catch(error => {
            onError?.(error);
            throw error;
        });
    }

    /**
     * Returns the underlying MariaDB connection pool.
     * @returns {Promise<mariadb.Pool>} The MariaDB pool instance.
     */
    async getOriginalPool() {
        return this.pool;
    }
}
