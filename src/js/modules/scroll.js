import 'intersection-observer';
import scrollama from 'scrollama';

export default {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        // scrollama for individual steps
        let scroller = scrollama();

        scroller.setup({
            step: '.uit-slide',
            offset: 0.4,
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
        $('.has-passed').removeClass('has-passed');

        const scale = obj.progress / 3 + 1;

        if (obj.index === 0 || obj.index === 1) {
            $('.uit-visual--' + obj.index).attr('style', 'transform: scale(' + scale + ')');
        }

        if (obj.index === 1) {
            $('.uit-visual--0').addClass('has-passed');
        }

        if (obj.index === 2) {
            $('.uit-visual--0, .uit-visual--1').addClass('has-passed');
        }

        // fix visuals to absolute
    },

    onHeaderProgress: function(obj) {
        if (obj.progress >= 1) {
            $('.uit-visuals').addClass('is-end');
        } else {
            $('.uit-visuals').removeClass('is-end');
        }
    }
}