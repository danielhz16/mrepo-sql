/**
 * Generates a string of comma-separated placeholders.
 */
export declare const generateParams: (n: number) => string;
/**
 * Flattens MariaDB query results into a single object.
 */
export declare const flattenToObject: (input: unknown) => Record<string, any>;
interface ExtractParamsArgs {
    params: Record<string, any>;
    order: string[];
    deleteExtra?: boolean;
    fillWithNulls?: boolean;
}
/**
 * Extracts and orders parameters from an object.
 */
export declare const extractParams: ({ params, order, deleteExtra, fillWithNulls }: ExtractParamsArgs) => any[];
export {};
