const fs = require('fs');
const path = require('path');

// Read Traditional Chinese transcript
const transcript = fs.readFileSync('/Users/allen/clawd/data/gooaye/EP631_tw.txt', 'utf-8');

// Create episode data
const episodes = [
    {
        episode: "EP631",
        title: "飛到太空游泳 繞著月亮潛入地球",
        date: "2026-01-28",
        transcript: transcript
    }
];

// Write to JSON
fs.writeFileSync(
    path.join(__dirname, 'data/episodes.json'),
    JSON.stringify(episodes, null, 2),
    'utf-8'
);

console.log('Updated episodes.json with Traditional Chinese');
