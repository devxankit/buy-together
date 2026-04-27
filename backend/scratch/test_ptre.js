const { pathToRegexp } = require('path-to-regexp');

try {
  console.log('Testing *:');
  pathToRegexp('*');
} catch (e) {
  console.log('Error for *: ' + e.message);
}

try {
  console.log('Testing (.*):');
  pathToRegexp('(.*)');
} catch (e) {
  console.log('Error for (.*): ' + e.message);
}

try {
  console.log('Testing :path*:');
  const re = pathToRegexp(':path*');
  console.log('Success for :path*: ' + re);
  console.log('Matches /test: ' + re.test('/test'));
  console.log('Matches /: ' + re.test('/'));
} catch (e) {
  console.log('Error for :path*: ' + e.message);
}

try {
  console.log('Testing /:path*:');
  const re = pathToRegexp('/:path*');
  console.log('Success for /:path*: ' + re);
  console.log('Matches /test: ' + re.test('/test'));
  console.log('Matches /: ' + re.test('/'));
} catch (e) {
  console.log('Error for /:path*: ' + e.message);
}
