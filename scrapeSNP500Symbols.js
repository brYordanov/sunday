const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies';

async function scrapeStocks() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const symbols = [];
    const filePath = path.join(__dirname, 'backend', 'scraped-s&p500stocks.json');

    $('table.wikitable tbody tr td:first-child a').each((_, element) => {
      symbols.push($(element).text().trim());
    });

    fs.writeFileSync(filePath, JSON.stringify(symbols, null, 2));
    console.log('Stock symbols saved to ./backend/s&p500stocks.json');
  } catch (error) {
    console.error('Error scraping:', error.message);
  }
}

scrapeStocks();
