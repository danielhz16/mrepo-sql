/**
 * Generates a string of comma-separated placeholders.
 */
export const generateParams = (n) => Array.from({ length: n }, (_, i) => `?`).join(',');
/**
 * Flattens MariaDB query results into a single object.
 */
export const flattenToObject = (input) => {
    const result = {};
    function helper(item) {
        if (Array.isArray(item)) {
            item.forEach(inner => helper(inner));
        }
        else if (item !== null && typeof item === 'object') {
            Object.entries(item).forEach(([key, value]) => {
                result[key] = value;
            });
        }
    }
    helper(input);
    delete result.affectedRows;
    delete result.insertId;
    delete result.warningStatus;
    return result;
};
/**
 * Extracts and orders parameters from an object.
 */
export const extractParams = ({ params, order, deleteExtra = false, fillWithNulls = false }) => {
    const ordered = [];
    order.forEach(key => {
        if (params[key] === undefined) {
            if (fillWithNulls) {
                ordered.push(null);
            }
            return;
        }
        ordered.push(params[key]);
    });
    if (deleteExtra) {
        return ordered;
    }
    const remaining = Object.keys(params)
        .filter(key => !order.includes(key))
        .map(key => params[key]);
    return [...ordered, ...remaining];
};
