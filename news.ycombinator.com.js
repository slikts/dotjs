(function($) {
    function highlight_scores() {
        if (window.location.pathname == '/item') {
            // Do nothing in comment pages
            return;
        }
        var $scores = $('span[id^=score]');
        var max_score = 0;
        var all_scores = [];
        var score_sum = 0;
        $scores.each(function() {
            var $this = $(this);
            var score = parseInt($this.text(), 10);
            $this.data('score', score);
            max_score = Math.max(max_score, score);
            all_scores.push(score);
            score_sum += score;
        });
        if (!all_scores.length) {
            // No scores found
            return;
        }
        var median_score = all_scores[Math.round(all_scores.length / 2)];
        var average_score = Math.round(score_sum / all_scores.length);
//        console.log('median', median_score)
//        console.log('average', average_score)
//        console.log('length', all_scores.length)
        $scores.each(function() {
            var $this = $(this);
            var score = $this.data('score');
            var opacity = (score / max_score + score / median_score) / 2;
            var color = 'rgba(255, 0, 0, ' + opacity + ')';
            var $row = $this.closest('tr');
            $row.add($row.prev()).css({
                'background-color': color
            });
        });
    };
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
    autoload_next();
})(jQuery);