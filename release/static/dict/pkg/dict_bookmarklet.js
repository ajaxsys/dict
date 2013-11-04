void((function(){

function get1stTag() {
    var result;
    for (var i = 0; i < arguments.length; i++) {
        var tag=arguments[i],
            tags=document.getElementsByTagName(tag);
        if (tags.length>0) {
            result = tags[0];
            break;
        }
    }
    return result || document.documentElement.childNodes[0];
}

// for test & hook
window.__DICT__ = window.__DICT__ || {};
window.__DICT__.appendTag = function (node) {
    var tag = get1stTag('head','body');
    if (tag){
        tag.appendChild(node);
    } else {
        alert('Not support!')
    }
};

})());

void((function(){
    var D=window.__DICT__;
    if (D) {
        var ui=document.createElement('script');
        ui.setAttribute('src',
            'http://localhost:8000/static/dict/pkg/dict_ui_dev.js?_'+new Date().getTime());
        D.appendTag(ui);
    }
})());
