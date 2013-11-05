(function($){
/*jshint -W020 */

window.__DICT__ = window.__DICT__ || {};

// for test
$.extend(window.__DICT__ ,  {
    DICT_ID : '__dict_window_id__',

});
var DICT = window.__DICT__;


// TODO
var options = {};
var settings = {};

var DICT_RELEASED = DICT.IS_RELEASED,
    LB_SERVERS = ['a','b','c','d','e','f','g','h','i','j','k','ll','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

var DICT_ID = DICT.DICT_ID,
    DICT_JID = '#__dict_window_id__',
    DICT_URL = DICT_RELEASED?'/static/dict/proxy-min.html##key#':'/static/dict/proxy.html##key#',
    DICT_ISFIXED = "position_is_fixed";

var _thisIP,
    _lastSearchWord;

console = window.console || {'log':function(){}};
console.log('Loading ui resource...');
DICT.loadResource($, host()+'/static/dict/pkg/dict_ui.min.css', 'css');

registSelectWord($);
registLinkToText($);

$( window ).resize(function() {
    resetPositionWhenOverflow($(DICT_JID));
});

// (function($){
//     setTimeout(function(){
//         if ($ && ($ instanceof Function) && ($('<a>') instanceof jQuery)) {
//             // emove all jQuery variables from the global scope (including jQuery itself).
//             window.__dict_jquery__ = $.noConflict(true);
//             console.log("Rescover old jquery, from " + window.__dict_jquery__ + " - " + window.__dict_jquery__.fn.jQuery + " to:" + $.fn.jQuery);
//         }
//     },5000);
// })(window.jQuery);

function registSelectWord($) {
    //$.newWindow();
    $(document).on('mouseup.dict','body *:not('+DICT_JID+')',function(){
        console.log('start it');
        if ($(DICT_JID).find(this).length === 0) {
            // Not element of dict window
        
            if (!DICT.DICT_SERVICE){
                return;
            } else {
                var text = $.trim(getSelectionText());
                if (text != _lastSearchWord && isWord(text) ){
                        _lastSearchWord = text;
                        createOrUpdateWindow($(this), text);
                }
            }
            return false;
        }
        // WARN: Do not `return false` here. If so, other mouseup be affected.
    });
}

function registLinkToText($) {
    $('body a, body img, body select').plaintext();
}

function createOrUpdateWindow($obj, text) {

    /* Window move to selected word.
    var offset = $obj.position(),
        textWidthHeight = getTextWH(text,$obj),
        left = offset.left + textWidthHeight.width,
        top  = offset.top  + textWidthHeight.height;
    */
    var $dict = $(DICT_JID);
    
    if ($dict.length === 0) {
        createNewWindow(text);
        // Fixed this win as default
        $(DICT_JID).css('position','fixed');
        /* If window move to selected word
         $(DICT_JID).data(DICT_ISFIXED, true);*/
    } else {
        /* If window move to selected word
        console.log($dict.data(DICT_ISFIXED));
        if ($dict.data(DICT_ISFIXED) != true){
            $.moveWindow(DICT_ID, left, top);
        }*/
        // Update
        $.updateWindowTitle(DICT_ID, text);
    }
    var frameURL = host(text) + DICT_URL;
    // Update iframe, need encodeURI for cross encoding of page.
    $.updateWindowContent(DICT_ID, '<iframe src="'+frameURL.replace('#key#',encodeURIComponent(text))+
                '" style="overflow-x: hidden;width: 100%;height:100%;border:0px;"></iframe>');
}

function createNewWindow(title){
    var winSize = getWindowSizeFromCookie(),
        left = $(window).width()-winSize.width,
        top = $(window).height()-winSize.height-41;

    console.log("Win width: ", winSize.width, " height: ", winSize.height, " Top: ", top, " left: ", left);
    // Fix too large in rkt pages. assume max is 1920*1080
    if (top > 780) top = 0;
    if (left > 1620) left = 1620;

    // Create
    $.newWindow({
        'id': DICT_ID,
        'posx': left>0 ? left:0,
        'posy': top >0 ? top :0,
        'title':title,
        'type':'iframe',
        'width': winSize.width,
        'height': winSize.height,
        'onDragEnd': function(){
            // Fix bugs of window flyaway.
            resetPositionWhenOverflow($(DICT_JID));
        },
        'onResizeEnd': setWindowSizeToCookie,
        'onWindowClose': function(){
            _lastSearchWord='';
        }
    });
}

function resetPositionWhenOverflow($win){
    // Parameter check
    if (!$win || $win.length<=0){
        return;
    }
    var MARGIN=300;
    var W=$win.position().left+MARGIN,
        H=$win.position().top+MARGIN,
        MAX_W=$(window).width(),
        MAX_H=$(window).height(),
        isWOver = (W > MAX_W) ,
        isHOver = (H > MAX_H) ;
    console.log("W:", W," H:",H,'MAX_W:',MAX_W,' MAX_H:',MAX_H,'isWOver:',isWOver,' isHOVer:',isHOver);
    if (isWOver||isHOver) {
        var width = isWOver?(MAX_W-MARGIN):W ,
            height= isHOver?(MAX_H-MARGIN):H ;
        if (width<0) width=0;
        if (height<0) height=0;
            $.moveWindow(DICT_ID,width,height);
    }
}



// Without any symbol
var WORD_REGEX = /^[^!"#$&'\(\)=~\^\\\|@`\{\}\[\];:,\.\/\?、。「」（）！]+$/,
    WORD_MAX_LENGTH = 50;  
function isWord(text){
    // Selected words in one line, 
    return text !== '' && text.indexOf('\n')===-1 
       //&& (/^[a-zA-Z0-9%_\-\+\s]+$/.test(text) || /^[^a-zA-Z]+$/.test(text))
       && text.length < WORD_MAX_LENGTH
       && WORD_REGEX.test(text);
}

/////////////////////////////////////////////////////

function setWindowSizeToCookie(){
    var $win = $(DICT_JID);
    var opt = DICT.getOptionFromCookie();
    opt.ui.width = $win.width();
    opt.ui.height = $win.height();
    DICT.setOptionToCookie(opt);
}

function getWindowSizeFromCookie(){
    var opt= DICT.getOptionFromCookie();
    return opt.ui;
}

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function host(lbKey){
    var local_ips = ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://172.106.72.78:8000'],
        dev_ip = 'http://127.0.0.1:8000',
        //rls_single = '//dict-admin.appspot.com',
        //rls_lb = '//dict-x.appspot.com';
        rls_single = '//python-ok.appspot.com',
        rls_lb = '//python-ok.appspot.com' ;

    // Dynamic IP
    if (DICT_RELEASED && lbKey) {
        // Load Balance
            var code = lbKey.charCodeAt(0),
                key = LB_SERVERS[ code % LB_SERVERS.length ];
            var release_ip = rls_lb.replace('x',key);
            console.log('Using release load balance:', release_ip);
            return release_ip;
    }

    // Static IP
    // First time only
    if (_thisIP)
        return _thisIP;

    // 0 release
    if (DICT_RELEASED){
        console.log('Using release single ip:', rls_single);
        _thisIP = rls_single;
        return rls_single;
    }

    var url = window.location.href,
        matcher,
        ip;
    // 1 local test (http only)
    for (var i in local_ips){
        ip = local_ips[i];
        matcher = url.indexOf(ip);
        if (matcher===0){
            console.log('Using local ip:', ip);
            _thisIP = ip;
            return ip;
        }
    }

    // 2 Intranet test(http only)
    var intrRegxp = /^http(|s):(\/\/[^\/\.]+?)\/.*$/;
    matcher = intrRegxp.exec(url);
    if ( matcher ){
        ip = matcher[1];
        console.log('Use intranet ip:', ip);
        _thisIP = ip;
        return ip;
    }

    // 3 test as a bookmarklet in other sites(http only)
    console.log("Using develop IP. ",dev_ip);
    _thisIP = dev_ip;
    return dev_ip;
}

})(jQuery);
