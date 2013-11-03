void((function(){
    if (!window.__dict_loaded__) {
        var ui=document.createElement('script');
        ui.setAttribute('src',
            '//python-ok.appspot.com/static/dict/js/dict.ui.js?_'+new Date().getTime());
        appendTag(ui);
    }
    function appendTag(node) {
        var tag = get1stTag('head','body');
        if (tag){
            tag.appendChild(node);
        } else {
            alert('Not support!');
        }
    }
    function get1stTag() {
        var result;
        for (var i = 0; i < arguments.length; i++) {
            var name=arguments[i],
                tags=document.getElementsByTagName(name);
            if (tags.length>0) {
                result = tags[0];
                break;
            }
        }
        return result || document.documentElement.childNodes[0];
    }
})());