import * as d3 from 'd3';

let width, height, canvas, ctx, projection;

let layers = [
    {
        url: '{{ path }}/assets/america.png',
        coords: [[49.112152, -127.143063],[20.714286, -70.209896]]
    },
    {
        url: '{{ path }}/assets/louisiana.png',
        coords: [[33.505597, -94.819785],[28.514333, -88.349533]]
    },
    {
        url: '{{ path }}/assets/louisiana.png',
        coords: [[30.608970, -91.247849], [29.430020, -89.294753]]
    }
]

export default {
    init: function() {
        this.createMap();
    },

    createMap: function() {
        width = $('.uit-visual__map').width();
        height = $('.uit-visual__map').height();

        projection = d3.geoAlbersUsa()
            .scale(1)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath()
            .projection(projection);

        const zoom = d3.zoom()
            .scaleExtent([1, 8]);

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
            ctx.drawImage(layer.image, projection(layer.coords[0]), projection(layer.coords[1]));
        });

    }
}
