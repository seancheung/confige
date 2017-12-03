function $upper(params) {
    if (typeof params === 'string') {
        return params.toUpperCase();
    }
    throw new Error('$upper expects a string');
}

function $lower(params) {
    if (typeof params === 'string') {
        return params.toLowerCase();
    }
    throw new Error('$lower expects a string');
}

function $snake(params) {
    if (typeof params === 'string') {
        return require('inflection').underscore(params);
    }
    throw new Error('$snake expects a string');
}

function $pascal(params) {
    if (typeof params === 'string') {
        return require('inflection').classify(params);
    }
    throw new Error('$pascal expects a string');
}

function $camel(params) {
    if (typeof params === 'string') {
        return require('inflection').camelize(params);
    }
    throw new Error('$camel expects a string');
}

function $dash(params) {
    if (typeof params === 'string') {
        return require('inflection').dasherize(params);
    }
    throw new Error('$dash expects a string');
}

function $plural(params) {
    if (typeof params === 'string') {
        return require('inflection').pluralize(params);
    }
    throw new Error('$plural expects a string');
}

function $singular(params) {
    if (typeof params === 'string') {
        return require('inflection').singularize(params);
    }
    throw new Error('$singular expects a string');
}

module.exports = {
    $upper,
    $lower,
    $snake,
    $pascal,
    $camel,
    $dash,
    $plural,
    $singular
};
