const expect = require('chai').expect;

describe('folder test', function() {
    before(function() {
        this.cwd = process.cwd();
        process.chdir(__dirname);
        process.env.APP_NAME = 'myapp';
        process.env.ARRAY_FIRST = 10;
    });
    it('expect config folder to be loaded correctly', function() {
        const config = require('../');
        expect(config.core).to.exist;
        expect(config.core.name).to.eq('myapp');
    });
    after(function() {
        process.chdir(this.cwd);
        delete process.env.APP_NAME;
        delete process.env.ARRAY_FIRST;
        delete require.cache[require.resolve('../')];
    });
});
