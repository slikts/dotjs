(function($) {
    function highlight_scores() {
        if (window.location.pathname === '/item') {
            // Do nothing in comment pages
            return;
        }
        var $scores = $('span[id^=score]');
        var all_scores = [];
        $scores.each(function() {
            var $this = $(this);
            var score = $this.data('score');
            if (score === undefined) {
                score = parseInt($this.text(), 10);
                $this.data('score', score);
                $this.css({
                    'color': '#000',
                    'font-size': '15px'
                });
            }
            all_scores.push(score);
        });
        if (!all_scores.length) {
            // No scores found
            return;
        }
        // Sort scores numerically
        all_scores.sort(function(a, b) { return a - b; });
        var median_score = all_scores[Math.round(all_scores.length / 2)];
        var max_score = all_scores[all_scores.length - 1];
        var max_score_opacity = max_score / median_score;

        $scores.each(function() {
            var $this = $(this);
            var score = $this.data('score');
            var opacity = score / median_score / max_score_opacity;
            $this.text(score);
            var color = 'rgba(' + [255, 0, 0, opacity].join(',') + ')';
            var $row = $this.closest('tr');
            $row.add($row.prev()).css({
                'background-color': color
            });
        });
    }
    highlight_scores();

    function load_next(callback) {
        var $this = $(this);
        $.ajax({
            url: $this.attr('href'),
            dataType: 'html',
            success: function(data) {
                var $rows = $('<div>').html(data).find('a[id^=up_]:first').closest('tbody').children('tr');
                $this.closest('tr').prev().remove().end().replaceWith($rows);
                highlight_scores();
                setup_link();
                if (callback) {
                    callback();
                }
            }
        });
        // Disable link
        $this.removeAttr('href');
        return false;
    }

    var $link = null;
    function setup_link() {
        $link = $('a[href^="/x"]').click(load_next);
    }
    setup_link();

    var autoload = 3;
    function autoload_next() {
        if (autoload--) {
            load_next.bind($link)(autoload_next);
        }
    }
    if (autoload) {
        autoload_next();
    }
})(jQuery);
