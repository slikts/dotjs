(function($) {
    if (window.location.pathname == '/item') {
        return;
    }
    var $scores = $('span[id^=score]');
    var max_score = 0;
    $scores.each(function() {
        var $this = $(this);
        var score = parseInt($this.text(), 10);
        $this.data('score', score);
        max_score = Math.max(max_score, score);
    });
    $scores.each(function() {
        var $this = $(this);
        var opacity = ($this.data('score') / max_score) * 0.8;
        var color = 'rgba(255, 0, 0, ' + opacity + ')';
        var $row = $this.closest('tr');
        $row.add($row.prev()).css({'background-color': color });
    });
})(jQuery);
