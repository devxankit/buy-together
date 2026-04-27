const { pathToRegexp } = require('path-to-regexp');

const result = pathToRegexp('*any');
console.log('Result for *any:', JSON.stringify(result, (key, value) => value instanceof RegExp ? value.toString() : value, 2));

const re = result.regexp;
console.log('Matches /test:', re.test('/test'));
console.log('Matches /:', re.test('/'));
console.log('Matches empty string:', re.test(''));
