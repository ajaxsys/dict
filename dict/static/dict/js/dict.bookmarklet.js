void((function(win,doc){
    var D=win.__DICT__;
    if (!D.loaded) {
        var ui=document.createElement('script');
        ui.setAttribute('src',
            'http://localhost:8000/static/dict/pkg/dict_ui_dev.js?_'+new Date().getTime());
        D.appendTag(ui);
    }
})(window,document));
