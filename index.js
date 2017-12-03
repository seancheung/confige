const fs = require('fs');
const path = require('path');

/**
 * Deep clone an object
 *
 * @param {any} source
 * @returns {any}
 */
function clone(source) {
    return source != null ? JSON.parse(JSON.stringify(source)) : source;
}

/**
 * Make clones of two objects then merge the second one into the first one and returns the merged object
 *
 * @param {any} source
 * @param {any} target
 * @returns {any}
 */
function merge(source, target) {
    if (target == null) {
        return clone(source);
    }
    if (source == null) {
        return clone(target);
    }
    if (typeof source !== 'object' || typeof target !== 'object') {
        return clone(target);
    }
    const merge = (source, target) => {
        Object.keys(target).forEach(key => {
            if (source[key] == null) {
                source[key] = target[key];
            } else if (typeof source[key] === 'object') {
                if (typeof target[key] === 'object') {
                    merge(source[key], target[key]);
                } else {
                    source[key] = target[key];
                }
            } else {
                source[key] = target[key];
            }
        });

        return source;
    };

    return merge(clone(source), clone(target));
}

/**
 * Read envs from file path
 *
 * @param {string} file
 * @param {boolean} inject
 * @returns {Map<string, string>}
 */
function env(file, inject) {
    const map = new Map();
    if (!path.isAbsolute(file)) {
        file = path.resolve(process.cwd(), file);
    }
    if (fs.existsSync(file) && fs.lstatSync(file).isFile()) {
        const content = fs.readFileSync(file, 'utf8');
        content.split('\n').forEach(line => {
            const kv = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (kv) {
                const k = kv[1];
                let v = kv[2] || '';
                if (
                    v &&
                    v.length > 0 &&
                    v.charAt(0) === '"' &&
                    v.charAt(v.length - 1) === '"'
                ) {
                    v = v.replace(/\\n/gm, '\n');
                }
                v = v.replace(/(^['"]|['"]$)/g, '').trim();
                map.set(k, v);
            }
        });
    }

    if (inject) {
        map.forEach((v, k) => (process.env[k] = v));
    }

    return map;
}

/**
 * Resolve source
 *
 * @param {Object<string, (source: any)=>any>} fn
 * @param {any} source
 * @returns {any}
 */
function resolve(fn, source) {
    if (source == null) {
        return source;
    }
    if (typeof source !== 'object') {
        return source;
    }
    for (const key of Object.keys(source)) {
        let value = resolve(fn, source[key]);
        if (key in fn) {
            value = fn[key](value);

            return value;
        }
        source[key] = value;
    }

    return source;
}

/**
 * Boot functions
 *
 * @returns {Object<string, (source: any)=>any>}
 */
function boot() {
    const dir = path.join(__dirname, './lib');
    const fn = {};
    fs
        .readdirSync(dir)
        .filter(f => /.js$/.test(f))
        .forEach(filename => {
            const file = path.join(dir, filename);
            const mod = require(file);
            if (mod && typeof mod === 'object') {
                Object.assign(fn, mod);
            }
        });
    fn.resolve = resolve.bind(fn, fn);

    return fn;
}

function load() {
    env(process.env.ENV_FILE || '.env', true);
    let filename = process.env.CONFIG_FILE || 'config';
    const fn = boot();
    const config = {};
    if (!path.isAbsolute(filename)) {
        filename = path.resolve(process.cwd(), filename);
    }
    if (fs.existsSync(filename)) {
        const stat = fs.lstatSync(filename);
        if (stat.isFile()) {
            if (/.json$/.test(filename)) {
                const content = fs.readFileSync(filename, 'utf8');
                Object.assign(config, fn.resolve(JSON.parse(content)));
            }
        } else if (stat.isDirectory()) {
            const files = fs
                .readdirSync(filename)
                .filter(
                    f =>
                        fs.lstatSync(path.resolve(filename, f)).isFile() &&
                        /.json$/.test(f)
                );
            files.forEach(file => {
                const content = fs.readFileSync(
                    path.resolve(filename, file),
                    'utf8'
                );
                const basename = path.basename(file, path.extname(file));
                Object.assign(config, { [basename]: fn.resolve(JSON.parse(content)) });
            });
        }
    }

    config.__ = {
        clone,
        merge,
        env,
        resolve: resolve.bind(fn, fn),
        desolve: () => delete require.cache[__filename]
    };

    return config;
}

module.exports = load();
