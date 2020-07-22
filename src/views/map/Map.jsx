import React, { useState, useEffect } from 'react';

import * as MapEffect from '../../effects/map.effect';

import { MapChart } from '../../lib/charts';

import './styles.scss';

const DEFAUTL_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRjeukJGxqPfW0mtYudNih4gQH2uQdQCWYNcFfo9Ecvxcl3PYOvGxmSTVzJ6L4hFFnSIfI8XuY51Ygj/pub?gid=1829641480&single=true&output=csv';

function Map() {
    const [isLoading, setIsLoading] = useState(false);
    const [url, setUrl] = useState(DEFAUTL_URL);
    const [games, setGames] = useState([]);
    const [geo, setGeo] = useState({ 
        objects: { states: [], countries: [] } 
    });

    useEffect(() => {
        MapEffect.fetchMapData().then((mapData) => {
            setGeo(mapData);
        });
    }, []);

    const handleLoad = async () => {
        try {
            setIsLoading(true);
            const games = await MapEffect.fetchGames(url);
            setGames(games);
        } catch (err) {

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <form className="map-form">
                <div>
                    <label htmlFor="url">
                        Add game url:
                    </label>
                    <input 
                        type="text"
                        placehoder="input game url"
                        value={url} 
                        onChange={(e) => setUrl(e.target.value)} 
                    />
                </div>
                <button 
                    type="button" 
                    onClick={handleLoad}
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Load'}
                </button>
            </form>
            <MapChart
                id="map-chart-id"
                height={610}
                width={975}
                margin={{ 
                    top: 0, 
                    right: 0, 
                    bottom: 0, 
                    left: 0 
                }}
                data={{
                    geo,
                    games
                }}
            />
        </div>
    );
}

export default Map;
