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
    try {
        const res = await axios.get(url)
        const $ = cheerio.load(res.data)
        const content = $('.entry-content')
        const nextUrl = content.children('p').first().find('a:eq(2)').attr('href')
        const fileName = $('.entry-title').text().replace(/\s+/g, '').replace(',', '-')


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
            cover: 'https://www.divinedaolibrary.com/wp-content/uploads/2017/02/i228072.jpg',
            content: [
                {
                    data: content.html()
                }

            ]
        };

        // latest

        if (nextUrl === '#' || 'https://www.patreon.com/Martialpeak') {
            // writeToFile(`./bin/${fileName}.html`, content.html())
            new Epub(option, `./bin/${fileName}.epub`);
            // wait for 10 mins, re fetch same url, next url again
            setTimeout(function () {
                getHtml(url)
            }, 600000);
        } else {
            // make new file
            // writeToFile(`./bin/${fileName}.html`, content.html())
            new Epub(option, `./bin/${fileName}.epub`);
            getHtml(nextUrl)
        }
    } catch (error) {
        console.log(error);
    }
}
getHtml('https://www.divinedaolibrary.com/martial-peak-chapter-2416-we-have-already-pledged-our-lives-to-one-another/')




