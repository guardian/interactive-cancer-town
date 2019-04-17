import * as d3 from 'd3';

let width, height, svg, ctx, projection, zoom, scale, translate, annotations;

let labels = [
    {
        text: 'Louisiana 51',
        coords: [-92.081339, 31.177374],
        layer: 0
    },
    {
        text: 'Reserve',
        coords: [-90.554791, 30.061910],
        layer: 2
    },
    {
        text: 'New Orleans',
        coords: [-90.0715, 29.9511],
        layer: 1
    }
]

let layers = [
    {
        url: '{{ path }}/assets/america.svg',
        coords: [[-127.867851146563, 47.89786873427608],[-74.26175764877926, 23.16732698168454]],
        fillScale: .9
    },
    {
        url: '{{ path }}/assets/louisiana.png',
        coords: [[-94.03945383090473, 33.087156474194146],[-89.01863607235484, 28.985983009532934]],
        fillScale: .8
    },
    {
        url: '{{ path }}/assets/reserve.svg',
        coords: [[-90.7498, 30.2383], [-90.2012, 29.8341]],
        fillScale: 1
    }
];

export default {
    init: function() {
        this.createMap();
    },

    createMap: function() {
        width = $('.uit-visual__map').width();
        height = $('.uit-visual__map').height();
        svg = d3.select('#uit-visual__map')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        projection = d3.geoAlbers().translate([width / 2, height / 2]);
        zoom = d3.zoom().scaleExtent([1, 1000]).on('zoom', function() {
            var transform = d3.event.transform;
            g.attr('transform', transform);
            annotations.attr('style', 'font-size: ' + (16 / transform.k) + 'px');
        }.bind(this));

        var g = svg.append('g');

        var images = g.selectAll('image')
            .data(layers)
            .enter()
            .append('svg:image')
            .attr('xlink:href', function(d) { return d.url })
            .attr('class', function(d, i) { return 'uit-visuals__map-image uit-visuals__map-image--' + i})
            .attr('x', function(d) { return projection(d.coords[0])[0] })
            .attr('y', function(d) { return projection(d.coords[0])[1] })
            .attr('width', function(d) { return projection(d.coords[1])[0] - projection(d.coords[0])[0] })
            .attr('height', function(d) { return projection(d.coords[1])[1] - projection(d.coords[0])[1] });

        annotations = g.selectAll('text')
            .data(labels)
            .enter()
            .append('svg:text')
            .attr('class', function(d) { return 'uit-visual__map-label uit-visual__map-label--' + d.layer })
            .attr('x', function(d) { return projection(d.coords)[0] })
            .attr('y', function(d) { return projection(d.coords)[1] })
            .text(function(d) { return d.text });

        this.zoomTo(layers[0], true);
    },

    zoomTo: function(layer, instant = false) {
        const coords = layer.coords,
            dx = projection(coords[1])[0] - projection(coords[0])[0],
            dy = projection(coords[1])[1] - projection(coords[0])[1],
            x = (projection(coords[0])[0] + projection(coords[1])[0]) / 2,
            y = (projection(coords[0])[1] + projection(coords[1])[1]) / 2,
            scale = Math.max(1, Math.min(1000, layer.fillScale / Math.max(dx / width, dy / height))),
            translate = [width / 2 - scale * x, height / 2 - scale * y],
            duration = instant? 0 : 750;

        svg.transition()
            .duration(duration)
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale))
    },

    trigger: function(layer) {
        this.zoomTo(layers[layer]);
    },

    resize: function() {
        $('.uit-visual__map svg').remove();
        this.createMap();
    }
}
