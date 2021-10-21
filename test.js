const Epub = require("epub-gen");
const option = {
    title: 'bruh', // *Required, title of the book.
    author: "ddl", // *Required, name of the author.
    publisher: "ddlwebscraper", // optional
    content: [
        {
            data: '<p>Hello world</p>'
        }

    ]
};
// const fileName = 'test'
new Epub(option, `./test/${fileName}.epub`);
// save to db
// delete file