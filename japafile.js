require('ts-node').register({
  compilerOptions: {
    module: 'CommonJS',
  },
});

const { configure } = require('japa');

configure({ files: ['test/*.ts'] });
