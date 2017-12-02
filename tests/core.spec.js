const expect = require('chai').expect;

describe('core test', function() {
    before(function() {
        process.env.CONFIG_FILE = 'tests/core.json';
        process.env.APP_NAME = 'myapp';
        process.env.ARRAY_FIRST = 10;
    });
    it('expect file to be parsed correctly', function() {
        const config = require('../');
        expect(config).to.be.an('object');
        expect(config.name).to.eq('myapp');
        expect(config.tag.key).to.not.exist;
        expect(config.tag.value).to.eq(3);
        expect(config.nested).to.eq(1);
        expect(config.content).to.match(new RegExp(`^${process.cwd()}`));
    });
});
