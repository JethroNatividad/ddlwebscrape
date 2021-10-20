const request = require('request');
var fs = require('fs');
const cheerio = require('cheerio');

function writeToFile(filename, content) {
    var stream = fs.createWriteStream(fileName)
    stream.once('open', function () {
        stream.end(content.html());
    });
}
function getHtml(url, cb) {
    request(url, function (err, res, body) {
        const $ = cheerio.load(body)
        const content = $('.entry-content')
        const nextUrl = content.children('p').first().find('a:eq(2)').attr('href')
        var fileName = './' + $('.entry-title').text().replace(/\s+/g, '').replace(',') + '.html';

        cb({ content: content.html(), fileName, nextUrl })
    })
}

getHtml('https://www.divinedaolibrary.com/martial-peak-chapter-2000-fraud/', (content, fileName, nextUrl) => {
    if (nextUrl === 'https://www.divinedaolibrary.com/martial-peak-chapter-2003-golden-crystal-grass/') return
    writeToFile(fileName, content)
    getHtml(nextUrl)
})

