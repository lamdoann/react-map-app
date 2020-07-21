import * as d3 from 'd3';

class Tooltip {
    constructor() {
        this.node = this.getNode();
    }

    renderHTML(html, position) {
        this.node
            .style('left', (position.x + 16) + 'px')
            .style('top', (position.y - 16) + 'px')
            .html(html);

        this.show();
    }

    show() {
        this.node.style('opacity', 1);
    }
    
    hide () {
        this.node.style('opacity', 0);
    };

    destroy () {
        if (this.node) {
            this.node.remove();
        }
    };

    getNode() {
        if (!this.node) {
            this.node = this.initNode();
            document.body.appendChild(this.node);
        }

        return d3.select(this.node);
    }

    initNode() {
        let tooltipEl = document.querySelector('.chart-tooltip');
        
        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
        }

        const div = d3.select(tooltipEl);

        div
            .attr('class', 'chart-tooltip')
            .style('position', 'fixed')
            .style('display', 'inline')
            .style('opacity', 0)
            .style('z-index', 9999)
            .style('pointer-events', 'none')
            .style('box-sizing', 'border-box')
            .style('padding', '12px 16px')
            .style('border-radius', '4px')
            .style('background-color', '#ffffff')
            .style('box-shadow', '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)');
    
        return div.node();
    }
}

export default Tooltip;
