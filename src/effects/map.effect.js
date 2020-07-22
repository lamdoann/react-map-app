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
        const dateParser = d3.timeParse('%m/%d/%y %H:%M');
        let games = await new Promise((resolve, reject) => {
            let _games = [];
            csv()
                .fromString(data)
                .subscribe((json) => {
                    if (json.creation_time) {
                        const creation_time = dateParser(json.creation_time);
                        json.creation_time = creation_time;
                    } else {
                        json.creation_time = new Date();
                    }
                    _games.push(json); 
                })
                .on('done', () => {
                    resolve(_games);
                });
        });

        games = games.sort((a, b) => a.creation_time - b.creation_time);

        return games || [];
    } catch (err) {
        throw err;
    }
}