import * as d3 from 'd3';

let width, height, canvas, ctx, projection, path, zoom;

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

        projection = d3.geoMercator()
            .scale(0.95)
            .translate([width / 2, height / 2]);

        path = d3.geoPath()
            .projection(projection);

        const initialScaleCenter = this.calculateScaleCenter(layers[0]);

        console.log(initialScaleCenter);

        projection.scale(initialScaleCenter.scale)
            .center(initialScaleCenter.center)
            .translate([width / 2, height / 2]);


        canvas = d3.select('.uit-visual__map')
            .append('canvas')
            .attr('width', width)
            .attr('height', height);

        ctx = canvas.node().getContext('2d');

        var images = layers.map(layer => this.loadImage(layer.url));

        Promise.all(images)
            .then(images => {
                images.forEach((image, i) => {
                    layers[i].image = image;
                })
                this.draw();
            })
            .catch(e => {
                console.log(e);
            });
    },

    loadImage: function(url) {
        return new Promise((fulfill, reject) => {
            let image = new Image();
            image.onload = () => fulfill(image);
            image.src = url;
        });
    },

    draw: function() {
        ctx.clearRect(0, 0, width, height);

        layers.forEach(layer => {
            var dimensions = {
                x1: projection(layer.coords[0])[0],
                y1: projection(layer.coords[0])[1],
                x2: projection(layer.coords[1])[0],
                y2: projection(layer.coords[1])[1]
            }

            ctx.drawImage(layer.image, dimensions.x1, dimensions.y1, dimensions.x2 - dimensions.x1, dimensions.y2 - dimensions.y1);
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
    }
}
