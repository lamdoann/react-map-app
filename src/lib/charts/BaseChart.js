import * as d3 from 'd3';

const DEFAULT_MARGIN = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
};

class BaseChart {
    timeout = null;
    DEBOUNCE_TIME = 500;

    constructor({ data, parentId, dimension, margin = DEFAULT_MARGIN }) {
        this.data = data;
        this.parentId = parentId;
        this.margin = margin;
        this.dimension = dimension;
        this.parentEl = document.getElementById(parentId);

        window.addEventListener('resize', this.handleOnResize);
    }

    update(data) {
        this.data = data;
        this.parentEl = this.parentEl || document.getElementById(this.parentId);

        const dimension = this.getDimension();
        this.width = dimension.width;
        this.height = dimension.height;
        this.innerWidth = this.width - this.margin.left - this.margin.right;
        this.innerHeight = this.height - this.margin.top - this.margin.bottom;

        this.svg = this.getSvg();
        this.rootGroup = this.getGroup();

        this.draw();
    }

    /**
     * Abstract method
     */
    draw() {

    }

    remove(cb) {
        window.removeEventListener('resize', this.handleOnResize);
        
        if (typeof cb === 'function') {
            cb();
        }
    }

    getSvg() {
        let svg = d3.select(this.parentEl).select('svg');
        
        if (svg.empty()) {
            svg = d3.select(this.parentEl).append('svg');
        }

        svg
            .attr('width', this.width)
            .attr('height', this.height)

        return svg;
    }

    getGroup() {
        let group = this.svg.select('g');

        if (group.empty()) {
            group = this.svg.append('g');
        }

        return group.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    }

    getDimension() {
        let width = this.dimension.width || this.parentEl.offsetWidth;
        let height = this.dimension.height || this.parentEl.offsetHeight;

        return {
            width,
            height
        };
    }

    handleOnResize = () => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.update(this.data);
        }, this.DEBOUNCE_TIME);
    }

    createElement(elementTag, className, parent) {
        let element = parent.select(`${elementTag}.${className}`);

        if (element.empty()) {
            element = parent.append(elementTag);
        }

        return element.attr('class', className);
    }

}

export default BaseChart;