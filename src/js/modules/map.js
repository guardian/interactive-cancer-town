import * as d3 from 'd3';

let width, height, canvas, ctx, projection, zoom, scale, translate;

let layers = [
    {
        url: '{{ path }}/assets/america.png',
        coords: [[-127.143063, 49.112152],[-70.209896, 20.714286]]
    },
    {
        url: '{{ path }}/assets/louisiana.png',
        coords: [[-94.819785, 33.505597],[-88.349533, 28.514333]]
    },
    {
        url: '{{ path }}/assets/louisiana.png',
        coords: [[-91.247849, 30.608970], [-89.294753, 29.430020]]
    }
]

export default {
    init: function() {
        this.createMap();
    },

    createMap: function() {
        width = $('.uit-visual__map').width();
        height = $('.uit-visual__map').height();
        canvas = d3.select('#uit-visual__map')
            .append('canvas')
            .attr('width', width)
            .attr('height', height);

        ctx = canvas.node().getContext('2d');
        projection = d3.geoMercator().translate([width / 2, height / 2]).scale(.95);

        const initialScaleCenter = this.calculateScaleCenter(layers[0]);

        projection.scale(initialScaleCenter.scale)
                    .center(initialScaleCenter.center)
                    .translate([width / 2, height / 2]);

        const images = layers.map(layer => this.loadImage(layer.url));

        Promise.all(images)
            .then(images => {
                images.forEach((image, i) => {
                    layers[i].image = image;
                    layers[i].x = projection(layers[i].coords[0])[0];
                    layers[i].y = projection(layers[i].coords[0])[1];
                    layers[i].width = projection(layers[i].coords[1])[0] - layers[i].x;
                    layers[i].height = projection(layers[i].coords[1])[1] - layers[i].y;
                });
                zoom = d3.zoom().scaleExtent([1, Infinity]).on('zoom', this.zoomed);
                // this.zoomTo(layers[0].coords);
            })
            .catch(e => {
                console.log(e);
            });
    },

    calculateScaleCenter: function(layer) {
        const scale = 0.95 / Math.max(
            (projection(layer.coords[1])[0] - projection(layer.coords[0])[0]) / width,
            (projection(layer.coords[1])[1] - projection(layer.coords[0])[1]) / height
        );

        const center = [
            (layer.coords[1][0] + layer.coords[0][0]) / 2,
            (layer.coords[1][1] + layer.coords[0][1]) / 2
        ];

        return {
            'scale': scale,
            'center': center
        }
    },

    loadImage: function(url) {
        return new Promise((fulfill, reject) => {
            let image = new Image();
            image.onload = () => fulfill(image);
            image.src = url;
        });
    },

    zoomed: function() {
        console.log('zoom');
        var transform = d3.event.transform;
        ctx.save();
        ctx.clearRect(0, 0, width, height);
        ctx.translate(transform.x, transform.y);
        ctx.scale(transform.k, transform.k);

        layers.forEach((layer, i) => {
            ctx.drawImage(layer.image, layer.x, layer.y, layer.width, layer.height);
        });
        ctx.restore();
    },

    zoomTo: function(coords) {
        const dx = coords[1][0] - coords[0][0],
            dy = coords[1][1] - coords[0][1],
            x = (coords[0][0] + coords[1][0]) / 2,
            y = (coords[0][1] + coords[1][1]) / 2,
            scale = Math.max(1, Math.min(Infinity, 0.9 / Math.max(dx / width, dy / height))),
            translate = [width / 2 - scale * x, height / 2 - scale * y];

        canvas.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale))
    },

    trigger: function(layer) {
        this.zoomTo(layers[layer].coords);
    },

    draw: function() {
        ctx.clearRect(0, 0, width, height);
        layers.forEach(layer => {
            ctx.drawImage(layer.image, layer.x, layer.y, layer.width, layer.height);
        });
    }
}
