import map from '../modules/map.js';
import chart from '../modules/chart.js';

let scrollTop, windowHeight;

let hasChart = false;
let currentSlide = {};

export default {
    init: function() {
        this.bindings();
        this.onScroll();
    },

    bindings: function() {
        $('body').one('chart-injected',  function() {
            hasChart = true;
        }.bind(this));

        $(window).scroll(function() {
            this.onScroll();
        }.bind(this));

        $(window).resize(function() {
            this.updateValues();
            this.onScroll();
            map.resize();
            chart.resize();
        }.bind(this));
    },

    onScroll: function() {
        this.updateValues();
        this.setClassesFor('.uit-slides--header');
        if (hasChart) {
            this.setClassesFor('.uit-slides--chart');
        }
    },

    updateValues: function() {
        scrollTop = $(window).scrollTop();
    },

    setClassesFor: function(container) {
        var $container = $(container),
            containerHeight = $container.height(true),
            containerPosition = $container.offset().top,
            nextPosition = $container.next().offset().top,
            $visuals = $(container).find('.uit-visuals'),
            visualsHeight = $visuals.height(),
            $slides = $container.find('.uit-slide'),
            numberOfSlides = $slides.length,
            visualName = container.replace('.uit-slides--', '');

        if (scrollTop + visualsHeight > nextPosition) {
            $visuals.removeClass('is-fixed').addClass('is-end is--' + (numberOfSlides - 1));
        } else if (scrollTop > containerPosition) {
            let whatSlide;

            $slides.each(function(i, el) {
                if (scrollTop > $(el).offset().top - this.percentageOfHeight(40)) {
                    whatSlide = i;
                }
            }.bind(this));

            if (visualName === 'header') {
                map.trigger(whatSlide)
            } else if (visualName === 'chart') {
                chart.trigger(whatSlide);
            }

            if (!currentSlide[visualName]) {
                currentSlide[visualName] = null;
            }

            if (currentSlide[visualName] !== whatSlide) {
                currentSlide[visualName] = whatSlide;
                $visuals.removeClass('is-end is-fixed is--0 is--1 is--2 is--3').addClass('is-fixed is--' + whatSlide);
            }
        } else {
            $visuals.removeClass('is-fixed');
        }
    },

    percentageOfHeight: function(percentage) {
        const windowHeight = $(window).height();
        return windowHeight / 100 * percentage;
    }
}
