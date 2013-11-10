(function($){

// exec
// $(function(){
//     initNavi(); 
// });

initNavi(); 

// for test
$.extend(window.__DICT__ ,  {
    'initNavi' : initNavi,
    'DICT_SERVICE': true, // ON/OFF switch
});
var DICT = window.__DICT__;

function initNavi(){
    console.log("Initialize navi.");
    var on='\u2602',off='\u2604',
        $navi = $('<div style="position:fixed;top:0;left:0;z-index:2147483647;font-weight:bold;font-size:16px;">' +
                    '<a href="#" style="text-shadow: 0 0 2px #999;color:blue;font-family:Times, serif;text-decoration:none;">'+on+'</a></div>');
    $('a', $navi).click(function(){
        if ($(this).text()===on){
            $(this).text(off);
            DICT.DICT_SERVICE=false;
            // For next start up
            $.closeWindow(DICT.DICT_ID);
        }
        else {
            $(this).text(on);
            DICT.DICT_SERVICE=true;
        }
        return false;
    });

    $(function(){
        $navi.prependTo('body');
    });
    
}



})(jQuery);
