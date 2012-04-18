(function($) {
    function highlight_scores() {
        if (window.location.pathname == '/item') {
            // Do nothing in comment pages
            return;
        }
        var $scores = $('span[id^=score]');
        var max_score = 0;
        var all_scores = [];
        $scores.each(function() {
            var $this = $(this);
            var score = parseInt($this.text(), 10);
            $this.data('score', score);
            max_score = Math.max(max_score, score);
            all_scores.push(score);
        });
        if (!all_scores.length) {
            // No scores found
            return;
        }
        var median_score = all_scores[Math.round(all_scores.length / 2)];
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

    function setup_link() {
        var $link = $('a[href^="/x"]');
        $link.click(function() {
            $.ajax({
                url: $link.attr('href'),
                dataType: 'html',
                success: function(data) {
                    var $rows = $('<div>').html(data).find('a[id^=up_]:first').closest('tbody').children('tr');
                    $link.closest('tr').prev().remove().end().replaceWith($rows);
                    highlight_scores();
                    setup_link();
                }
            });
            return false;
        });
    }
    setup_link();
})(jQuery);