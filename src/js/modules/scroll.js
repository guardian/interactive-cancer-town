import 'intersection-observer';
import scrollama from 'scrollama';
import map from '../modules/map.js';

let currentSlide = 0;

export default {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        // scrollama for individual steps
        let scroller = scrollama();

        scroller.setup({
            step: '.uit-slide',
            offset: 0.2,
            progress: true,
            order: true
        })
        .onStepProgress(this.onSlideProgress);

        // scrollama for entire block
        let visualsScroller = scrollama();

        visualsScroller.setup({
            step: '.uit-slides',
            offset: 1,
            progress: true
        })
        .onStepProgress(this.onHeaderProgress);

        $(window).resize(function() {
            scroller.resize();
            visualsScroller.resize();
        }.bind(this));
    },

    onSlideProgress: function(obj) {
        if (currentSlide !== obj.index) {
            currentSlide = obj.index;
            if (obj.index === 3) {
                $('.uit-visual__map').addClass('is-done');
            } else {
                $('.uit-visual__map').removeClass('is-done');
                map.trigger(obj.index);
            }
        }
    },

    onHeaderProgress: function(obj) {
        if (obj.progress >= 1) {
            $('.uit-visuals').addClass('is-end');
        } else {
            $('.uit-visuals').removeClass('is-end');
        }
    }
}
