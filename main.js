const axios = require('axios')
var fs = require('fs');
const Epub = require("epub-gen");
const cheerio = require('cheerio');

function writeToFile(fileName, content) {
    var stream = fs.createWriteStream(fileName)
    stream.once('open', function () {
        stream.end(content);
    });
}
async function getHtml(url) {
    const res = await axios.get(url)
    const $ = cheerio.load(res.data)
    const content = $('.entry-content')
    const nextUrl = content.children('p').first().find('a:eq(2)').attr('href')
    const fileName = $('.entry-title').text().replace(/\s+/g, '').replace(',', '-')
    console.log(nextUrl)

    // remove first 3 p and last 3 p
    content.find('p').first().remove();
    content.find('p').last().remove();
    // remove images

    content.find('script').remove();
    content.find('img').remove();
    const option = {
        title: $('.entry-title').text(), // *Required, title of the book.
        author: "ddl", // *Required, name of the author.
        publisher: "ddlwebscraper", // optional
        cover: './cover.jpg',
        content: [
            {
                data: content.html()
            }

        ]
    };

    // latest

    if (nextUrl === '#' || nextUrl === 'https://www.patreon.com/Martialpeak') {
        // writeToFile(`./bin/${fileName}.html`, content.html())
        new Epub(option, `./bin/${fileName}.epub`);
        // wait for 10 mins, re fetch same url, next url again
        console.log('not next')
        setTimeout(function () {
            getHtml(url)
        }, 600000);
    } else {
        console.log('NEXT')
        // make new file
        // writeToFile(`./bin/${fileName}.html`, content.html())
        new Epub(option, `./bin/${fileName}.epub`);
        getHtml(nextUrl)
    }

}
getHtml('https://www.divinedaolibrary.com/martial-peak-chapter-2039-encountering-the-wood-spirit-again/')




