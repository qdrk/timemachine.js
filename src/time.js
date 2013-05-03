var SlidePanel = function (args) {
    var id = args.id;
    var msgs = args.msgs;
    var atta_elem = args.atta_elem;
    var pane_render = args.pane_render;

    // the number of pages
    var PANEL_COUNT = msgs.length;
    // the z-index
    var trzs = [];

    function render_panel() {
        var html = '';
        for (var i = 0; i < PANEL_COUNT; ++i) {
            // the first one got the highest z-index
            var z_idx = (PANEL_COUNT - i) * 10;
            html += '<div id="panel' + i + '" class="panel" style="z-index: ' + z_idx + ';">' 
                + pane_render(msgs[i]) + '</div>';
        }
        return html;
    }

    function render() {
        var html = '<div class="time-plane" id="' + id + '">';
        html += render_panel();
        html += '</div>';
        $('.time-inner', atta_elem).html(html);
    }

    function get_transy(i) {
        var avail_height = atta_elem.height();
        var k = (avail_height - 300) / 100;
        // the larger the container's height, the larger the difference between each pane
        var factor = 12 + k * 2;
        var offset = 30 + k * 4;
        // the more the pane is, the less the difference between each pane
        factor /= PANEL_COUNT / 8.0;
        offset += PANEL_COUNT * 8.0;
        return (PANEL_COUNT - i) * factor - offset;
    }

    function init() {
        for (var i = 0; i < PANEL_COUNT; ++i) {
            trzs[i] = -i * 50;
        }
        for (var i = 0; i < PANEL_COUNT; ++i) {
            var transz = trzs[i];
            var transy = get_transy(i);
            var paneli = $('#panel' + i);

            paneli.removeClass('panel-flyin');
            paneli.css({
                '-webkit-transform': 'translateZ(' + transz + 'px) translateY(' + transy + 'px)',
                '-webkit-transition': 'all 2s',
                '-moz-transform': 'translateZ(' + transz + 'px) translateY(' + transy + 'px)',
                '-moz-transition': 'all 2s',
                'opacity': '1'
            });
        }
    }

    var cur_idx = -1;
    var int_handle = 0;

    function push_front() {
        for (var i = 0; i < PANEL_COUNT - cur_idx - 1; ++i) {
            var transz = trzs[i];
            var transy = get_transy(i);
            var panel_idx = i + cur_idx + 1;
            $('#panel' + panel_idx).css({
                '-webkit-transform': 'translateZ(' + transz + 'px) translateY(' + transy + 'px)',
                '-moz-transform': 'translateZ(' + transz + 'px) translateY(' + transy + 'px)'
            });
        }
    }

    this.start = function () {
        int_handle = setInterval(function () {
            cur_idx += 1;

            if (cur_idx > PANEL_COUNT - 1) {
                clearInterval(int_handle);
                return;
            }

            $('#panel' + cur_idx).addClass('panel-flyin');
            push_front();

        }, 3000);
    };

    this.next = function () {
        cur_idx += 1;

        if (cur_idx > PANEL_COUNT - 1) {
            return;
        }

        $('#panel' + cur_idx).addClass('panel-flyin');
        push_front();
    }

    this.back = function () {
        cur_idx -= 1;

        if (cur_idx < 0) {
            return;
        }

        $('#panel' + cur_idx).removeClass('panel-flyin');
        push_front();
    }

    this.stop = function () {
        clearInterval(int_handle);
        cur_idx = -1;
        init_panel();
    };

    this.restart = function () {
        this.stop();
        setTimeout(function () {
            this.start();
        }, 1000);
    };

    this.hook_action = function () {
        var slider = this;
        $('#back').click(function () {
            console.log('back');
            slider.back();
        });

        $('#next').click(function () {
            console.log('next');
            slider.next();
        });
    }

    this.hook_action();

    render();
    init();

    $(window).resize(function () {
        push_front();
    });

};
