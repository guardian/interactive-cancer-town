import 'intersection-observer';
import scrollama from 'scrollama';
import map from '../modules/map.js';
import chart from '../modules/chart.js';

let currentSlide = 0;

export default {
    init: function() {
        this.createTracking('.uit-slides--header');

        $('body').one('chart-injected',  function() {
            this.createTracking('.uit-slides--chart')
        }.bind(this));
    },

    createTracking: function(parent) {
        let scroller = scrollama();

        scroller.setup({
            step: parent + ' .uit-slide',
            offset: 0.2,
            progress: true,
            order: true
        })
        .onStepProgress(this.onSlideProgress);

        // scrollama for entire block
        let visualsScroller = scrollama();

        visualsScroller.setup({
            step: parent,
            offset: parent === '.uit-slides--header' ? 1 : 0,
            progress: true
        })
        .onStepProgress(this.onHeaderProgress);

        $(window).resize(function() {
            scroller.resize();
            visualsScroller.resize();
            map.resize();
        }.bind(this));
    },

    onSlideProgress: function(obj) {
        if (currentSlide !== obj.index) {
            currentSlide = obj.index;

            const $parent = $(obj.element).parent();

            $parent.find('.uit-visuals').removeClass('is--0 is--1 is--2 is--3').addClass('is--' + currentSlide);

            if ($parent.hasClass('uit-slides--header')) {
                if (obj.index === 3) {
                    $parent.find('.uit-visual__map').addClass('is-done');
                } else {
                    $parent.find('.uit-visual__map').removeClass('is-done');
                    map.trigger(obj.index);
                }
            } else {
                chart.trigger(obj.index);
            }

        }
    },

    onHeaderProgress: function(obj) {
        const $parent = $(obj.element);

        $parent.find('.uit-visuals').removeClass('is-end is-fixed');

        if (obj.progress >= 1 || $parent.next().offset().top - $parent.find('.uit-visuals').outerHeight(true) < $(window).scrollTop()) {
            $parent.find('.uit-visuals').addClass('is-end');
        } else if (obj.progress > 0) {
            $parent.find('.uit-visuals').addClass('is-fixed');
        }
    }
}
