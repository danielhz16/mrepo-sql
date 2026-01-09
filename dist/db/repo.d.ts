import mariadb, { type PoolConfig } from "mariadb";
import { ExecSPOptions } from "../interfaces/db.interface.js";
export declare class BaseRepository {
    private pool;
    /**
     * Creates a new BaseRepository instance.
     * @param {PoolConfig} config - Connection configuration for the MariaDB pool.
     */
    constructor(config: PoolConfig);
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
    execSP<T = any>(spName: string, { params, out, plain, extract, order, deleteExtra, fillWithNulls, }: ExecSPOptions): Promise<T>;
    /**
     * Retrieves all records from a database view.
     *
     * @param {string} viewName - The name of the view to query.
     * @returns {Promise<T[]>} An array containing the records from the view.
     */
    view<T = any>(viewName: string): Promise<T[]>;
    /**
     * Executes a raw SQL query with optional parameters.
     *
     * @param {string} query - The SQL query to execute.
     * @param {any[]} [params] - The parameters to safely bind to the query.
     * @returns {Promise<T[]>} The result set from the query.
     */
    query<T = any>(query: string, params?: any[]): Promise<T[]>;
    /**
     * Tests the database connection and invokes callbacks based on the result.
     *
     * @param {function} [onSuccess] - Callback function to execute if the connection is successful.
     * @param {function} [onError] - Callback function to execute if the connection fails.
     * @throws {Error} If the connection fails and no onError callback is provided.
     */
    connectDB(onSuccess?: () => void, onError?: (error: Error) => void): Promise<void>;
    /**
     * Closes the connection pool and all active connections.
     *
     * @param {function} [onSuccess] - Callback function to execute after the pool is closed.
     * @param {function} [onError] - Callback function to execute if closing the pool fails.
     * @returns {Promise<void>}
     */
    closeDB(onSuccess?: () => void, onError?: (error: Error) => void): Promise<void>;
    /**
     * Returns the underlying MariaDB connection pool.
     * @returns {Promise<mariadb.Pool>} The MariaDB pool instance.
     */
    getOriginalPool(): Promise<mariadb.Pool>;
}
