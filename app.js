const http = require('http');

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs')
const hostname = '127.0.0.1';
const port = 4000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  const output = getEmojiDetails('hi');
  console.log(output);
  return output;
//   (async () => {
//     await getWebsiteLinks(url)
//     await downloadLinks(linkList)
//     await downloadFiles(dlinkList)
//   })()
});

// get all the emojis and links and create an array

function getEmojiDetails(uri) {
    return uri
} 
