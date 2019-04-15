import * as d3 from 'd3';

let width, height, svg, ctx, projection, path, zoom, scale, translate, g;

let layers = [
    {
        url: '{{ path }}/assets/america.png',
        coords: [[-127.867851146563, 47.89786873427608],[-74.11175764877926, 23.52732698168454]]
    },
    {
        url: '{{ path }}/assets/louisiana.png',
        coords: [[-94.03945383090473, 33.087156474194146],[-89.01863607235484, 28.985983009532934]]
    },
    {
        url: '{{ path }}/assets/louisiana.png',
        coords: [[-91.247849, 30.608970], [-89.294753, 29.430020]]
    }
]

const stateData = {
  "AL": {
    "value": 43.3141
  },
  "AK": {
    "value": 14.9542
  },
  "AZ": {
    "value": 38.2166
  },
  "AR": {
    "value": 36.0183
  },
  "CA": {
    "value": 35.527
  },
  "CO": {
    "value": 26.3978
  },
  "CT": {
    "value": 25.0476
  },
  "DE": {
    "value": 30.615
  },
  "DC": {
    "value": 39.5726
  },
  "FL": {
    "value": 32.8792
  },
  "GA": {
    "value": 42.1609
  },
  "HI": {
    "value": 13.6698
  },
  "ID": {
    "value": 24.3263
  },
  "IL": {
    "value": 32.6554
  },
  "IN": {
    "value": 25.9481
  },
  "IA": {
    "value": 21.6351
  },
  "KS": {
    "value": 26.8783
  },
  "KY": {
    "value": 31.2131
  },
  "LA": {
    "value": 51.648
  },
  "ME": {
    "value": 20.0844
  },
  "MD": {
    "value": 31.6135
  },
  "MA": {
    "value": 25.7188
  },
  "MI": {
    "value": 23.8277
  },
  "MN": {
    "value": 23.5993
  },
  "MS": {
    "value": 39.072
  },
  "MO": {
    "value": 31.8409
  },
  "MT": {
    "value": 17.8726
  },
  "NE": {
    "value": 22.3663
  },
  "NV": {
    "value": 33.3039
  },
  "NH": {
    "value": 23.2884
  },
  "NJ": {
    "value": 31.146
  },
  "NM": {
    "value": 24.2145
  },
  "NY": {
    "value": 31.8118
  },
  "NC": {
    "value": 33.6537
  },
  "ND": {
    "value": 17.6079
  },
  "OH": {
    "value": 25.7013
  },
  "OK": {
    "value": 32.9178
  },
  "OR": {
    "value": 30.5239
  },
  "PA": {
    "value": 31.6845
  },
  "RI": {
    "value": 24.7988
  },
  "SC": {
    "value": 37.6342
  },
  "SD": {
    "value": 18.1174
  },
  "TN": {
    "value": 34.5724
  },
  "TX": {
    "value": 35.0226
  },
  "UT": {
    "value": 23.3947
  },
  "VT": {
    "value": 20.2823
  },
  "VA": {
    "value": 30.4528
  },
  "WA": {
    "value": 33.4239
  },
  "WV": {
    "value": 30.4442
  },
  "WI": {
    "value": 20.9548
  },
  "WY": {
    "value": 14.6291
  },
  "PR": {
    "value": 20.5118
  },
  "VI": {
    "value": 10.6939
  }
}
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
        path = d3.geoPath().projection(projection);
        zoom = d3.zoom().scaleExtent([1, 1000]).on('zoom', function() {
            var transform = d3.event.transform;
            g.attr('transform', transform);
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

        this.zoomTo(layers[0].coords, true);

        d3.json('{{ path }}/assets/json.json')
            .then(function(us, error) {

                console.log(us);

                var color = d3.scaleThreshold()
                    .domain([20, 30, 40, 50, 60])
                    .range(["#ffe6ec", "#ffb3b9", "#ff8087", "#ff4c54", "#ff1921"]);

                g.selectAll('path')
                    .data(us.features)
                    .enter()
                    .append('path')
                    .attr('d', path)
                    .attr('class', 'uit-visuals__feature')
                    .style('fill', function(d) {
                        // return color(stateData[d.properties.postal].value)
                        return 'pink'
                    })
                    .on("click", function(e) {
                        // console.log(e);
                        // console.log(path);
                        // console.log(path(e));
                        // console.log(path.bounds(e));
                        // console.log(projection.invert(path.bounds(e)[0]));
                        // console.log(projection.invert(path.bounds(e)[1]));
                        console.log(d3.selectAll('.uit-visuals__feature'));

                        var allBounds = [];

                        var allPaths = d3.selectAll('.uit-visuals__feature').each(function(d) {
                            if (d.properties.name !== 'Puerto Rico' && d.properties.name !== 'Alaska' && d.properties.name !== 'Hawaii') {
                            console.log(d.properties.name);
                            allBounds.push(path.bounds(d))
                            }
                        });

                        var bound0 = d3.min(allBounds, function(d) {
                            return d[0][0]
                        });
                        var bound1 = d3.min(allBounds, function(d) {
                            return d[0][1]
                        });
                        var bound2 = d3.max(allBounds, function(d) {
                            return d[1][0]
                        });
                        var bound3 = d3.max(allBounds, function(d) {
                            return d[1][1]
                        });

                        console.log(bound0, bound1, bound2, bound3);

                        console.log(projection.invert([bound0, bound1]));
                        console.log(projection.invert([bound2, bound3]));

                    });
            });
    },

    zoomTo: function(coords, instant = false) {
        const dx = projection(coords[1])[0] - projection(coords[0])[0],
            dy = projection(coords[1])[1] - projection(coords[0])[1],
            x = (projection(coords[0])[0] + projection(coords[1])[0]) / 2,
            y = (projection(coords[0])[1] + projection(coords[1])[1]) / 2,
            scale = Math.max(1, Math.min(1000, 1 / Math.max(dx / width, dy / height))),
            translate = [width / 2 - scale * x, height / 2 - scale * y],
            duration = instant? 0 : 750;

        svg.transition()
            .duration(duration)
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale))
    },

    trigger: function(layer) {
        this.zoomTo(layers[layer].coords);
    },

    resize: function() {
        $('.uit-visual__map').empty();
        this.createMap();
    }
}
