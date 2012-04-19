(function($) {
    function numerical_sort(a, b) {
        return a - b;
    }
    function get_median(list) {
        return list[Math.round((list.length - 1) / 2)];
    }
    
    function highlight_scores() {
        if (window.location.pathname === '/item') {
            // Do nothing in comment pages
            return;
        }
        var $scores = $('span[id^=score]');
        var all_scores = [];
        var all_comments = [];
        $scores.each(function() {
            var $score = $(this);
            var score = $score.data('score');
            if (score === undefined) {
                score = parseInt($score.text(), 10);
                $score.data('score', score);
                $score.css({
                    'color': '#000',
                    'font-size': '15px'
                });
            }
            all_scores.push(score);
            
            var comments = $score.data('comments');
            if (comments === undefined) {
                var $comments = $score.closest('tr').find('a[href^=item]');
                comments = parseInt($comments.text(), 10);
                $score.data('comments', comments);
            }
            all_comments.push(comments);
        });
        if (!all_scores.length) {
            // No scores found
            return;
        }
        
        all_scores.sort(numerical_sort);
        var median_score = get_median(all_scores);
        var max_score = all_scores[all_scores.length - 1];
        var max_score_opacity = max_score / median_score;
        
        all_comments.sort(numerical_sort);
        var median_comments = get_median(all_comments);
        var max_comments = all_comments[all_comments.length - 1];
        var max_comments_opacity = max_comments / median_comments;

        $scores.each(function() {
            var $this = $(this);
            var score = $this.data('score');
            var opacity = score / median_score / max_score_opacity;
            $this.text(score);
            var comments = $this.data('comments');
            var blue = Math.round(comments / median_comments / max_comments_opacity * 255);
            var color = 'rgba(' + [255, 0, blue, opacity].join(',') + ')';
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
