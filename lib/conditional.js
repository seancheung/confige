/**
 * Return the second or third element based on the boolean value of the first element
 *
 * @param {[boolean, any, any]} params
 * @returns {any}
 */
function $cond(params) {
    if (
        Array.isArray(params) &&
        params.length === 3 &&
        typeof params[0] === 'boolean'
    ) {
        return params[0] ? params[1] : params[2];
    }
    throw new Error(
        '$cond expects an array of three elements of which the first must be a boolean'
    );
}

/**
 * Return true if both two elements' boolean values are true
 *
 * @param {[boolean, boolean]} params
 * @returns {boolean}
 */
function $and(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        params.every(p => typeof p === 'boolean')
    ) {
        return params[0] && params[1];
    }
    throw new Error('$and expects an array of two booleans');
}

/**
 * Return true if any of the two elements' boolean value is true
 *
 * @param {[boolean, boolean]} params
 * @returns {boolean}
 */
function $or(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        params.every(p => typeof p === 'boolean')
    ) {
        return params[0] || params[1];
    }
    throw new Error('$or expects an array of two booleans');
}

function $not(params) {
    if (typeof params === 'boolean') {
        return !params;
    }
    throw new Error('$not expects a boolean');
}

module.exports = {
    $cond,
    $and,
    $or,
    $not
};
