const https = require('https');

https.get({
  hostname: 'www.unidraw.com',
  path: '/index.php',
  rejectUnauthorized: false
}, (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    const imgRegex = /<img[^>]+src="([^">]+)"/ig;
    let match;
    const imgs = [];
    while ((match = imgRegex.exec(data)) !== null) {
      imgs.push(match[1]);
    }
    console.log(imgs);
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
