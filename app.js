const http = require('http');

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const Path = require('path');
const download = require('image-downloader');
const request = require('request');

const hostname = '127.0.0.1';
const port = 4000;

const emojiTypes = ['emoji-people', 'emoji-symbols'];
const url = 'https://www.webfx.com/tools/emoji-cheat-sheet/';
const saveFolder = './img/slack/'
const emojiData = [];

// const emojiTypes = ['people emojis', 'nature emojis', 'objects emojis', 'places emojis', 'symbols emojis']

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('emojiData');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  (async () => {
    await getEmojiDetails(url)
  })()
});

async function getEmojiDetails(uri) {
  axios.get(uri)
    .then((response) => {
      let $ = cheerio.load(response.data);
      emojiTypes.forEach((idToSearch) => {
        const stringOfClass = '#' + idToSearch + ' li div';
        let category = idToSearch
        console.log(stringOfClass);

        $(stringOfClass).each(function (i, elm) {

          let name = '';
          let imgUrl = '';

          $(elm.children).each(function (i, elm) {

            if ($(this).attr('class') === 'emoji') {
              imgUrl = $(this).attr('data-src')
            } else if ($(this).hasClass('name')) {
              name = $(this).text()
              code = ':' + $(this).text() + ':'
            }
          })

          emojiData.push({
            name,
            imgUrl,
            code,
            category
          });

        });
      })
      downloadImages();
      dataOutput();
    }).catch(function (e) {
      console.log(e);
    });

}

function dataOutput() {
  const jsonContent = JSON.stringify(emojiData);
  fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }
  });
}

function downloadImages() {
  const jsonContent = emojiData;
  const singleItemPercent = 100 / jsonContent.length;
  let currentValue = 0;
  let notPastFifty = true;

  console.log("Downloading images...");

  jsonContent.forEach((elment) => {

    img_url = url + elment.imgUrl

    imageName = saveFolder + elment.name + '.png'

    downloadImage(img_url, imageName);
  });

}


function downloadImage(url, title) {

  var download = function (url, filename, callback) {
    request.head(url, function (err, res, body) {
      request(url).pipe(fs.createWriteStream( filename)).on('close', callback);
    });
  };

  download(url, title, function () {
    process.stdout.write(".");
  });

}