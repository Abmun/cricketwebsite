// utils/generateSitemap.js
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const News = require('../models/News');
const Player = require('../models/Player');
const Team = require('../models/Team');

async function generateSitemap() {
  try {
    const smStream = new SitemapStream({ hostname: 'https://cricanalyzer.com' });
    const writeStream = createWriteStream('./public/sitemap.xml');
    
    smStream.pipe(writeStream);
    
    // Add static pages
    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    smStream.write({ url: '/news', changefreq: 'hourly', priority: 0.9 });
    smStream.write({ url: '/matches', changefreq: 'hourly', priority: 0.9 });
    
    // Add news pages
    const news = await News.find().select('slug updatedAt');
    news.forEach(item => {
      smStream.write({
        url: `/news/${item.slug}`,
        lastmod: item.updatedAt,
        changefreq: 'daily',
        priority: 0.8
      });
    });
    
    // Add player pages
    const players = await Player.find().select('slug updatedAt');
    players.forEach(player => {
      smStream.write({
        url: `/players/${player.slug}`,
        lastmod: player.updatedAt,
        changefreq: 'weekly',
        priority: 0.7
      });
    });
    
    // Add team pages
    const teams = await Team.find().select('slug updatedAt');
    teams.forEach(team => {
      smStream.write({
        url: `/teams/${team.slug}`,
        lastmod: team.updatedAt,
        changefreq: 'weekly',
        priority: 0.7
      });
    });
    
    smStream.end();
    
    console.log('Sitemap generated successfully');
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }
}

module.exports = generateSitemap;