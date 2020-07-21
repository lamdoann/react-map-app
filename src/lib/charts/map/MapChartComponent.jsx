import React, { useEffect } from 'react';

import MapChart from './MapChart';

import './styles.scss';

function MapChartComponent(props) {
    useEffect(() => {
        let mapChart = null;
        if (!mapChart) {
            mapChart = new MapChart({
                data: props.data,
                parentId: props.id,
                margin: props.margin,
                dimension: {
                    width: props.width,
                    height: props.height,
                }
            });
        }
        
        mapChart.update(props.data);
    });

    return (
        <div className="map-chart" id={props.id} />
    );
}

export default MapChartComponent;
