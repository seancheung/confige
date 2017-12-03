const expect = require('chai').expect;

describe('core test', function() {
    before(function() {
        process.env.ENV_FILE = 'tests/config/env';
    });
    it('expect .env file to be applied correctly', function() {
        const config = require('../');
        expect(config.name).to.eq('myapp');
        expect(config.tag.key).to.eq('key');
        expect(config.array).to.contain(0);
        expect(config.nested).to.eq('');
    });
    after(function() {
        delete process.env.ENV_FILE;
        delete process.env.CONFIG_FILE;
        delete process.env.APP_NAME;
        delete process.env.TAG_KEY;
        delete process.env.NESTED_FIRST;
        delete require.cache[require.resolve('../')];
    });
});
