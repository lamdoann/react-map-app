import React, { useState, useEffect } from 'react';

import * as MapEffect from '../../effects/map.effect';

import { MapChart } from '../../lib/charts';

function Map() {
    const [mapData, setMapData] = useState({ 
        games: [], 
        geo: { objects: { states: [] } } 
    });

    useEffect(() => {
        MapEffect.fetchMapData().then((mapData) => {
            setMapData(mapData);
        });
    }, []);

    return (
        <div>
            <MapChart
                id="map-chart-id"
                height={700}
                margin={{ 
                    top: 40, 
                    right: 40, 
                    bottom: 40, 
                    left: 40 
                }}
                data={mapData}
            />
        </div>
    );
}

export default Map;
