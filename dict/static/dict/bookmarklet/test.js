// =================== Before DOM ready ===================
(function(){

// Develop Version
loadResourceToGlobalVar('/static/dict/js/dict.bookmarklet.js','__G_BML__');
// Product Version
loadResourceToGlobalVar('/static/dict/pkg/dict_bookmarklet.min.js','__G_BML_MIN__');

function loadResourceToGlobalVar(url,varName){
    $.ajax({
        'url': url,
        'dataType' : 'text',
        'success': function(data){
            window[varName]=data;
        }
    });
}

})();



// =================== After DOM ready ===================
$(function(){
    var BML_PREFIX = 'javascript:';
    waitUntil("window.__G_BML__", afterDevelopVersionLoaded);
    waitUntil("window.__G_BML_MIN__", afterProductVersionLoaded);

    // Minimized version and released version
    function afterProductVersionLoaded(){
        var min = BML_PREFIX + __G_BML_MIN__
            .replace('dict/js/dict.ui.js','dict/pkg/dict_ui.min.js');
        var prod = min.replace('http://localhost:8000','//python-ok.appspot.com');

        // Refer to min version.
        $('#bookmarkletMin').attr('href',min);
        $('#bookmarkletProduct').attr('href',prod);
    }

    function afterDevelopVersionLoaded(){
        var $editor = $('#jsEditor');
        $editor.val(__G_BML__);
        $editor.change(updateDevelopLink);

        // Enable by default
        updateDevelopLink(toOneLine(__G_BML__));
        console.log("Default enable dict on this page.");
        eval(__G_BML__);
    }

    // Wait until condition var `==` true
    function waitUntil(condition, callback) {
        eval(' var result = (' + condition +')' );
        console.log('result = ' + result);
        if (result) {
            callback();
        } else {
            // Waiting
            setTimeout(function(){
                waitUntil(condition, callback);
            },100);
        }
    }

    // Develop link
    function updateDevelopLink(js) {
        // Notice: lowercase
        var isInit = (typeof js == 'string');
        js = isInit ? js : toOneLine($('#jsEditor').val());
        $('#bookmarklet').attr('href', BML_PREFIX + js);
        if (!isInit) {
            // Mark it as edited
            $('#bookmarklet').append("*");
        }
    }

    // Simple compress javascript.
    function toOneLine(jsSrc){
        // Remove javascript comment
        jsSrc = jsSrc.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '$1');
        // Remove blank line
        return jsSrc.replace(/(^|\n)\s*/g,'');
    }
});
