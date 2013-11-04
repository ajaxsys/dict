void((function(win,doc){

function get1stTag() {
    var result;
    for (var i = 0; i < arguments.length; i++) {
        var tag=arguments[i],
            tags=doc.getElementsByTagName(tag);
        if (tags.length>0) {
            result = tags[0];
            break;
        }
    }
    return result || doc.documentElement.childNodes[0];
}

// for test & hook
win.__DICT__ = win.__DICT__ || {};
__DICT__.appendTag = function (node) {
    var tag = get1stTag('head','body');
    if (tag){
        tag.appendChild(node);
    } else {
        var url = 'http://dict-admin.appspot.com';
        alert('Sorry, Not support for your browser. More details, visit: '+url);
        window.open(url);
    }
};

})(window,document));

void((function(win,doc){
    var D=win.__DICT__;
    if (!D.loaded) {
        var ui=document.createElement('script');
        ui.setAttribute('src',
            'http://localhost:8000/static/dict/pkg/dict_ui_dev.js?_'+new Date().getTime());
        D.appendTag(ui);
    }
})(window,document));
