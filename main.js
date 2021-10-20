const axios = require('axios')
var fs = require('fs');
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
    var fileName = './' + $('.entry-title').text().replace(/\s+/g, '').replace(',', '-') + '.html';
    return {
        content: content.html(), fileName, nextUrl
    }
}

async function main() {
    try {
        const res = await getHtml('https://www.divinedaolibrary.com/martial-peak-chapter-2000-fraud/')
        console.log(res)

    } catch (error) {
        console.log(error)
    }
}
main()
// getHtml('https://www.divinedaolibrary.com/martial-peak-chapter-2000-fraud/', (res) => {
//     if (res.nextUrl === 'https://www.divinedaolibrary.com/martial-peak-chapter-2003-golden-crystal-grass/') return
//     console.log
//     writeToFile(res.fileName, res.content)
//     getHtml(res.nextUrl)
// })

