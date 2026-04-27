const { pathToRegexp } = require('path-to-regexp');

try {
  console.log('Testing *any:');
  const re = pathToRegexp('*any');
  console.log('Success for *any: ' + re);
  console.log('Matches /test: ' + re.test('/test'));
  console.log('Matches /: ' + re.test('/'));
} catch (e) {
  console.log('Error for *any: ' + e.message);
}

try {
  console.log('Testing /*any:');
  const re = pathToRegexp('/*any');
  console.log('Success for /*any: ' + re);
  console.log('Matches /test: ' + re.test('/test'));
  console.log('Matches /: ' + re.test('/'));
} catch (e) {
  console.log('Error for /*any: ' + e.message);
}
