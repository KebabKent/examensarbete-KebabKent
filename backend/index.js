const express = require('express');
const express2 = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config()
var fs = require('fs');
const path = require('node:path');
// kommentar

var staticResource = '/home/kebabkent/Documents/crawling_react/public';
var file = require(staticResource + '/screenshot_list.json')
const crawler = require('./crawler.js')


const app = express();
app.use(cors())

app.get('/', async (req, res) => {
    OK = {}
    unclean = req.query.id
    console.log("\nUnclean " + unclean)
    route = unclean.split('/')[0]
    command = unclean.split('/')[1]

    switch (route) {
        case 'fileprint':
            console.log(file.screenshots)
            OK = file.screenshots
            break;

        case 'crawl':
            console.log(command)
            await crawler.scrape(command)
            OK = true
            break;

        case 'delete_img':
            fs.readFile(staticResource + '/screenshot_list.json', 'utf8', function readFileCallback(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    obj = JSON.parse(data);
                    obj.screenshots.splice(command.split('%')[0], 1)

                    fs.writeFile(staticResource + '/screenshot_list.json', JSON.stringify(obj), 'utf8', function (err) {
                        if (err) console.log('error', err);
                        console.log('json file successfully updated');
                    });

                    fs.unlink(`${path.join(staticResource, 'screenshots')}/${command.split('%')[1]}`, function (err) {
                        if (err) return console.log(err);
                        console.log('file deleted successfully');
                    });
                }
            });
            break;
    }

    res.status(200).json({ "message": OK })
})

app.listen(process.env.PORT, () => console.log("server listening on http://localhost:" + process.env.PORT))


// Second Port listener
const app2 = express2();
app2.use('/screenshots', express2.static(path.join(staticResource, 'screenshots')));
app2.listen(process.env.PORT2, () => {
    console.log(`Running server on http://localhost:${process.env.PORT2}/screenshots/`);
})
