/**
 * Represents an output variable for a stored procedure.
 */
export interface OutVariable {
    /** The name of the variable (without the @ symbol). */
    name: string;
    /** The SQL type of the variable (e.g., 'VARCHAR(255)', 'INT'). Defaults to 'VARCHAR(255)'. */
    type?: string;
}
/**
 * Options for executing a stored procedure.
 */
export interface ExecSPOptions {
    /**
     * Parameters to pass to the stored procedure.
     * Can be an array of values or an object (if `extract` is set to true).
     */
    params?: any[] | Record<string, any>;
    /**
     * Definitions of output variables to be captured after execution.
     */
    out?: OutVariable[];
    /**
     * If true, flattens the result into a single object when the SP returns a single row.
     * @default true
     */
    plain?: boolean;
    /**
     * If true, extracts parameters from an object based on the `order` array.
     * Useful when you want to pass an object but the SP expects positional parameters.
     * @default false
     */
    extract?: boolean;
    /**
     * The order of keys to extract from `params` when `extract` is true.
     */
    order?: string[];
    /**
     * If true, deletes keys from the `params` object that are not specified in the `order` array.
     * @default false
     */
    deleteExtra?: boolean;
    /**
     * If true, fills missing parameters defined in `order` with `null` if they are not in `params`.
     * @default false
     */
    fillWithNulls?: boolean;
}
