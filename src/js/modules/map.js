import L from 'leaflet';

let map;

const bounds = {
    'america': L.latLngBounds(L.latLng(49.112152, -127.143063), L.latLng(20.714286, -70.209896))
}

export default {
    init: function() {
        this.createMap();
    },

    createMap: function() {
        map = L.map('uit-visual__map', {
            center: bounds.america.getCenter(),
            maxBounds: bounds.america,
            maxBoundsViscosity: 1.0,
            zoom: 2,
            zoomSnap: 0,
            renderer: L.canvas()
        });

        map.fitBounds(bounds.america);

        // map.dragging.disable();
        // map.touchZoom.disable();
        // map.doubleClickZoom.disable();
        // map.scrollWheelZoom.disable();
        // map.boxZoom.disable();
        // map.keyboard.disable();

        console.log('{{ path }}/assets/america.png');

        let america = L.imageOverlay('{{ path }}/assets/america.png', bounds.america);
            america.addTo(map);
    }
}
