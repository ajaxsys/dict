(function($){

// exec
$(function(){
    initNavi(); 
});

// for test
$.extend(window.__DICT__ ,  {
    'initNavi' : initNavi
});


function initNavi(){
    console.log("Initialize navi.");
    var $navi = $('<div style="position:fixed;top:0;left:0;z-index:2147483647;background-color:#EFEFEF;font-weight:bold;"><a href="#">ON</a></div>');
    $('a', $navi).click(function(){
        if ($(this).text()=='ON'){
            $(this).text('OFF');
            DICT_SERVICE=false;
            // For next start up
            $.closeWindow(DICT_ID);
        }
        else {
            $(this).text('ON');
            DICT_SERVICE=true;
        }
        return false;
    });
    $navi.appendTo('body');
    
}



})(jQuery);
