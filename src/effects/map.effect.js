import * as d3 from 'd3';
import axios from 'axios';
import csv from 'csvtojson';

export const fetchMapData = async () => {
    try {
        const geo = await d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json');
        return geo;
    } catch (err) {
        throw err;
    }
}

export const fetchGames = async (url) => {
    try {
        const response = await axios.get(url);
        const data = response.data;
        const games = await new Promise((resolve, reject) => {
            let _games = [];
            csv()
                .fromString(data)
                .subscribe((json) => {
                    _games.push(json); 
                })
                .on('done', () => {
                    resolve(_games);
                });
        });

        return games || [];
    } catch (err) {
        throw err;
    }
}