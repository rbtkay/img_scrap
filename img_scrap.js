const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');
const { exit } = require('process');

/**
 * download the image from the uri to the filename
 * @param {String} uri 
 * @param {String} filename 
 */
function download(uri, filename) {
    return new Promise((resolve, reject) => {
        request.head(uri, function (err, res, body) {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve);
        });
    });
}

/**
 * get the image uri corresponding to the pokemon's name
 * @param {String} pokemon 
 */
function getImgUrl(pokemon) {
    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(
            `https://bulbapedia.bulbagarden.net/wiki/${pokemon}_(Pok%C3%A9mon)`
        );
        const imageUrl = await page.evaluate(
            () => document.querySelector('.image img').src
        );

        browser.close();

        resolve(imageUrl);
    });
}



const main = async () => {
    const pokemon = 'Spectrier';
    const imageUrl = await getImgUrl(pokemon);

	// download the image to the script's directory
	await download(imageUrl, `./${pokemon.toLowerCase()}.png`);

    exit();
};

main();
