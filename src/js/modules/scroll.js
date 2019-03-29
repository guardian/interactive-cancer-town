let scrollTop, windowHeight;

export default {
    init: function() {
        this.bindings();
        this.setValues();
        this.onScroll();
    },

    bindings: function() {
        $(window).scroll(function() {
            this.onScroll();
        }.bind(this));

        $(window).resize(function() {
            this.setValues();
            this.onScroll();
        }.bind(this))
    },

    setValues: function() {
        windowHeight = $(window).height();
    },

    onScroll: function() {
        scrollTop = $(window).scrollTop();
        this.positionVisualisation();
        this.setVisualisation();
    },

    positionVisualisation: function() {
        if (scrollTop + windowHeight > $('.uit-header').offset().top) {
            $('.uit-visuals').addClass('is-end');
        } else {
            $('.uit-visuals').removeClass('is-end');
        }
    },

    setVisualisation: function() {
        const activeSlide = this.getActiveSlide();
        $('.uit-slides').removeClass('is-0 is-1 is-2').addClass('is-' + activeSlide);
    },

    getActiveSlide: function() {
        let activeSlide = 0;
        $('.uit-slide').each(function(i, el) {
            if ($(el).offset().top < scrollTop + (windowHeight * 0.5)) {
                activeSlide = i;
            }
        }.bind(this));

        return activeSlide;
    }
};
