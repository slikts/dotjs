(function($) {
    function highlight_points() {
        var all_points = [];
        var all_comments = [];
        var $points = $('span.points').each(function() {
            var $this = $(this);
            var points = parseInt($this.text(), 10);
            $this.data('points', points);
            all_points.push(points);

            var $li = $this.closest('li');
            var $comments = $li.find('span.comments');
            $this.data('$li', $li);
            var comments = parseInt($comments.text(), 10);
            $this.data('comments', comments);
            all_comments.push(comments);
        });

        if (!all_points.length) {
            return;
        }
        all_points.sort(function(a, b) {
            return a - b;
        });
        all_comments.sort(function(a, b) {
            return a - b;
        });

        function get_median(list) {
            return list[Math.round((list.length - 1) / 2)];
        }

        var median_points = get_median(all_points);
        var max_points = all_points[all_points.length - 1];
        var max_points_opacity = max_points / median_points;
        
        var median_comments = get_median(all_comments);
        var max_comments = all_comments[all_comments.length - 1];
        var max_comments_opacity = max_comments / median_comments;

        $points.each(function() {
            var $this = $(this);
            var points = $this.data('points');
            var comments = $this.data('comments');
            var $li = $this.data('$li');
            var opacity = points / median_points / max_points_opacity;
            var blue = Math.round(comments / median_comments / max_comments_opacity * 255);
            $li.css({
                'background-color': 'rgba(' + [255, 0, blue, opacity].join(',') +')'
            });
        });
    }
    var scheduled = 0;
    function schedule_highlight() {
        if (scheduled) {
            return;
        }
        scheduled = 1;
        window.setTimeout(function() {
            scheduled = 0;
            highlight_points();
        }, 1);
    }
    schedule_highlight();

    $('ul.entries')[0].addEventListener('DOMSubtreeModified', function() {
        schedule_highlight();
    });
})(jQuery);