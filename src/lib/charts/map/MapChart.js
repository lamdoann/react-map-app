import * as d3 from 'd3';
import * as topojson from 'topojson-client';

import BaseChart from '../BaseChart';
import Tooltip from '../tooltip/Tooltip';

class MapChart extends BaseChart {
    constructor(props) {
        super(props);
        this.tooltip = new Tooltip();
    }

    draw() {
        super.draw();

        this.zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', this.zoomed);

        this.svg
            .attr('viewBox', [0, 0, this.width, this.height])
            .on('click', this.reset);

        this.path = d3.geoPath();
        this.geoGroup = this.createElement('g', 'geo-group', this.rootGroup);
        this.dotGroup = this.createElement('g', 'dot-group', this.rootGroup);

        this.drawGeo();
        this.drawDots();

        this.svg.call(this.zoom);
    }

    drawGeo() {
        const features = topojson.feature(this.data.geo, this.data.geo.objects.states).features || [];

        const paths = this.geoGroup.selectAll('path').data(features);
        const enterPaths = paths.enter().append('path');
        const mergePaths = paths.merge(enterPaths);

        mergePaths
            .attr('d', this.path)
            .on('click', this.handleClick)

        paths.exit().remove();
    }

    handleClick = (data) => {
        const [[x0, y0], [x1, y1]] = this.path.bounds(data);
        d3.event.stopPropagation();
        this.svg.transition().duration(750).call(
            this.zoom.transform,
            d3.zoomIdentity
                .translate(this.width / 2, this.height / 2)
                .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / this.width, (y1 - y0) / this.height)))
                .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
            d3.mouse(this.svg.node())
        );
    }

    drawDots() {
        const projection = d3.geoAlbersUsa()
            .translate([this.width / 2, this.height / 2])
            .scale(1280);

        const gamesData = this.data.games
            .filter((game) => game.lat !== 'NULL' || game.lon !== 'NULL' )
            .map((game) => {
                const coordinates = projection([+game.lon, +game.lat]);
                const origin = game;
                return {
                    origin,
                    coordinates
                };
            })
            .filter((game) => game.coordinates !== null);

        const dots = this.dotGroup.selectAll('circle').data(gamesData);
        const enterDots = dots.enter().append('circle');
        const mergeDots = dots.merge(enterDots);

        mergeDots
            .attr("transform", d => `translate(${d.coordinates})`)
            .attr('r', 0)
            .attr('fill-opacity', 1)
            .attr('stroke-opacity', 0)
            .transition()
            .delay((_, i) => 50 * i)
            .duration(500)
            .attr('r', 1.5)
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 1);

        mergeDots.on('mouseover', (d) => {
                const html = `
                    <div>
                        <p>
                            <b>GAME ID:</b> ${d.origin.game_id}
                        </p>
                        <p>
                            <b>HOME vs AWAY:</b> ${d.origin.home_team} - ${d.origin.away_team}
                        </p>
                    </div>
                `;
                const position = {
                    x: d3.event.clientX,
                    y: d3.event.clientY
                };

                this.tooltip.renderHTML(html, position);
            })
            .on('mouseout', (d) => {
                this.tooltip.hide();
            })

        dots.exit().remove();
    }

    zoomed = () => {
        this.rootGroup.attr('transform', d3.event.transform);
        this.rootGroup.attr('stroke-width', 1 / d3.event.transform.k);
    }

    reset = () => {
        this.svg.transition().duration(750).call(
            this.zoom.transform,
            d3.zoomIdentity,
            d3.zoomTransform(this.svg.node()).invert([this.width / 2, this.height / 2])
        );
    }
}

export default MapChart;
