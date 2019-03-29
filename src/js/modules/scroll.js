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
        })
    },

    setValues: function() {
        windowHeight = $(window).height();
    },

    onScroll: function() {
        scrollTop = $(window).scrollTop();
        this.checkVisualisation();
    },

    checkVisualisation: function() {
        if (scrollTop + windowHeight > $('.uit-header').offset().top) {
            $('.uit-visuals').addClass('is-end');
        } else {
            $('.uit-visuals').removeClass('is-end');
        }
    }
};
