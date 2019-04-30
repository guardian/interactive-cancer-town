import * as d3 from 'd3';

let width, height, svg, ctx, projection, zoom, scale, translate, placeNames, currentLayer = 0;

let layers = [
    {
        url: '{{ path }}/assets/america.svg',
        coords: [[-127.867851146563, 47.89786873427608],[-74.26175764877926, 23.16732698168454]],
        fillScale: .8
    },
    {
        url: '{{ path }}/assets/louisiana.svg',
        coords: [[-94.13945383090473, 33.287156474194146],[-88.91863607235484, 28.785983009532934]],
        fillScale: .8
    },
    {
        coords: [[-90.7498, 30.2383], [-90.2012, 29.8341]],
        fillScale: 1.5
    },
    {
        coords: [[-90.7498, 30.2383], [-90.2012, 29.8341]],
        fillScale: 2
    }
];

let states = [
    {
        text: 'Louisiana',
        coords: [-91.081339, 25.877374],
        layer: 0
    },
    {
        text: 'Louisiana',
        coords: [-92.881339, 32.077374],
        layer: 1
    },
    {
        text: 'Mississippi',
        coords: [-90.006281, 31.945074],
        layer: 1
    },
    {
        text: 'Arkansas',
        coords: [-92.552641, 33.307679],
        layer: 1
    },
    {
        text: 'Alabama',
        coords: [-87.766593, 31.812917],
        layer: 1
    },
    {
        text: 'Texas',
        coords: [-95.109551, 31.473760],
        layer: 1
    }
]

let places = [
    {
        text: 'Reserve',
        coords: [-90.523362, 30.056484],
        layer: 2
    },
    {
        text: 'New Orleans',
        coords: [-90.0715, 29.9511],
        layer: 1
    },
    {
        text: 'Baton Rouge',
        coords: [-91.1871, 30.4515],
        layer: 1
    }
]

let images = [
    {
        url: '{{ path }}/assets/state-outlines.svg',
        coords: [[-127.867851146563, 47.89786873427608],[-74.26175764877926, 23.16732698168454]],
        layer: 1
    }
]

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
        zoom = d3.zoom().scaleExtent([0, 1000]).on('zoom', function() {
            var transform = d3.event.transform;
            g.attr('transform', transform);
            placeLabels.attr('style', 'font-size: ' + (16 / transform.k) + 'px');
            placeLabels.select('circle').attr('r', 4 / transform.k);
            placeLabels.select('text').attr('y', -10 / transform.k);
            stateLabels.attr('style', 'font-size: ' + (24 / transform.k) + 'px');
        }.bind(this));

        var g = svg.append('g');

        g.selectAll('uit-visuals__map-image--additional')
            .data(images)
            .enter()
            .append('svg:image')
            .attr('xlink:href', function(d) { return d.url })
            .attr('class', function(d, i) { return 'uit-visuals__map-image uit-visuals__map-image--additional uit-visuals__map-image--' + d.layer})
            .attr('x', function(d) { return projection(d.coords[0])[0] })
            .attr('y', function(d) { return projection(d.coords[0])[1] })
            .attr('width', function(d) { return projection(d.coords[1])[0] - projection(d.coords[0])[0] })
            .attr('height', function(d) { return projection(d.coords[1])[1] - projection(d.coords[0])[1] });

        g.selectAll('.uit-visuals__map-image--base')
            .data(layers)
            .enter()
            .filter(function(d) { return d.url !== undefined; })
            .append('svg:image')
            .attr('xlink:href', function(d) { return d.url })
            .attr('class', function(d, i) { return 'uit-visuals__map-image uit-visuals__map-image--base uit-visuals__map-image--' + i})
            .attr('x', function(d) { return projection(d.coords[0])[0] })
            .attr('y', function(d) { return projection(d.coords[0])[1] })
            .attr('width', function(d) { return projection(d.coords[1])[0] - projection(d.coords[0])[0] })
            .attr('height', function(d) { return projection(d.coords[1])[1] - projection(d.coords[0])[1] });

        var placeLabels = g.selectAll('.uit-visual__map-label')
            .data(places)
            .enter()
            .append('g')
            .attr('class', function(d) { return 'uit-visual__map-label uit-visual__map-label--' + d.text.toLowerCase() + ' uit-visual__map-label--' + d.layer })
            .attr('transform', function(d) { return `translate(${projection(d.coords)[0]}, ${projection(d.coords)[1]})` })

        placeLabels.append('circle')
            .attr('x', 0)
            .attr('y', 0)
            .attr('r', 4);

        placeLabels.append('svg:text')
            .attr('x', 0)
            .attr('y', 0)
            .text(function(d) { return d.text });

        var stateLabels = g.selectAll('.uit-visual__map-state')
            .data(states)
            .enter()
            .append('text')
            .attr('class', function(d) { return 'uit-visual__map-state uit-visual__map-state--' + d.text.toLowerCase() + ' uit-visual__map-state--' + d.layer })
            .attr('x', function(d) { return projection(d.coords)[0] })
            .attr('y', function(d) { return projection(d.coords)[1] })
            .text(function(d) { return d.text })

        this.zoomTo(layers[currentLayer], true);
    },

    zoomTo: function(layer, instant = false) {
        const coords = layer.coords,
            dx = projection(coords[1])[0] - projection(coords[0])[0],
            dy = projection(coords[1])[1] - projection(coords[0])[1],
            x = (projection(coords[0])[0] + projection(coords[1])[0]) / 2,
            y = (projection(coords[0])[1] + projection(coords[1])[1]) / 2,
            scale = Math.max(0.2, Math.min(1000, layer.fillScale / Math.max(dx / width, dy / height))),
            translate = [width / 2 - scale * x, height / 2 - scale * y],
            duration = instant? 0 : 750;

        svg.transition()
            .duration(duration)
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale))
    },

    trigger: function(layer) {
        currentLayer = layer;
        this.zoomTo(layers[layer]);
    },

    resize: function() {
        $('.uit-visual__map svg').remove();
        this.createMap();
    }
}
