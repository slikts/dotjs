(function($) {
    var $scores = $('span[id^=score]');
    var max_score = 0;
    var style_text = 'td.subtext, span.comhead, td.title { \n\
        color: rgba(0, 0, 0, .5);\n\
    }\n\
    td.subtext a:link, td.title a:link, \n\
    td.subtext a:visited, td.title a:visited {\n\
        color: rgba(0, 0, 0, .8);\n\
    }\n\
    td.subtext a:visited, td.title a:visited {\n\
        text-decoration: line-through !important;\n\
    }';
    $('<style>').text(style_text).appendTo('head')
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
