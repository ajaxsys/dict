(function($){

// NOTICE: As a bookmarklet, Dict always load when dom ready!!
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
    //var on='\u2602',off='\u2604',
    //var on='☂',off='☄',
    var on=' O ',off=' X ',
        titleOn='SecondScreen Service ON',titleOff='SecondScreen Service OFF',
        $navi = $('<div style="position:fixed;top:0;left:0;z-index:2147483647;font-weight:bold;font-size:16px;">' +
                    '<a href="#" style="text-shadow: 0 0 2px #999;color:blue;font-family:serif;text-decoration:none;" title="'+titleOn+'">'+on+'</a></div>');
        console.log(on,off);
    $('a', $navi).click(function(){
        if ($(this).text()===on){
            $(this).attr('title',titleOff).text(off);
            DICT.DICT_SERVICE=false;
            // For next start up
            $.closeWindow(DICT.DICT_ID);
            //$(document).off('mouseenter.plaintext').off('mouseleave.plaintext');
        }
        else {
            $(this).attr('title',titleOn).text(on);
            DICT.DICT_SERVICE=true;
            //$(document).on('mouseenter.plaintext').on('mouseleave.plaintext');
        }
        return false;
    });

    $navi.appendTo('body');// Prepend lose to other max z-index.
    
}



})(jQuery);
