import * as d3 from 'd3';

export const fetchMapData = async () => {
    try {
        const games = await d3.csv('/resources/game.csv');
        const geo = await d3.json('/resources/geo.json');

        return {
            games,
            geo
        };
    } catch (err) {
        throw err;
    }
}