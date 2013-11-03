;(function(){
// AMD
$.cookie.json = true;
var COOKIE_NAME='__DICT_OPTIONS__';
var $types,$result,$searchBox;

// onload
console.log(window.location.href);
$(function(){
    // init outter var here for loaded context
    $types = $('#__dict_types__');
    $result = $('#__explain_wrapper__');
    $searchBox = $('#__search__');

    updateOptionMenu(getOptionFromCookie().dict.dict_type);
    reloadWhenDictOptionChanged();

    $(window).on('hashchange', function(e){
        var origEvent = e.originalEvent;
        console.log('Going to: ', origEvent.newURL , ' from: ' , origEvent.oldURL);
        doQuery();
    });
    doQuery();
    registSearchKey();
});

function registSearchKey(){
    var $searchForm = $('#__search_form__');
    $searchForm.submit(function(){
        doQuery($searchBox.val());
        return false;
    });
    $searchBox.mouseover(function(){
        $(this).select();
    });
}

function getSelectedDict(){
    return $('li.active>a',$types).attr('value');
}

function doQuery(query, type){
    // Get from caller
    query = query || getUrlHashValue();
    type = type || getSelectedDict();

    var word = decodeURIComponent(query);
    console.log("Do search :", query, ' -> ', word, '|', type);

    if (query && type && isNotKey(word)) {
        // http://localhost:8000/dict/en2jp/Hello/
        var url = '/dict/'+type+'/'+query+'/',
            startTime = new Date().getTime();
            $loading = $('<div id="__loading__">').append('loading '+word);

        console.log('Ajax load: ', url);
        $.ajax(url, {
            beforeSend: function(){
                $result.empty().append($loading);
                $searchBox.val(word);
            },
            success: function(data){
                formatResult(data,type)
            },
            error: function(){
                $result.html('loading error: '+word);
            },
            complete: function(){
                var tm = new Date().getTime()-startTime;
                console.log("Used time:" , tm);
            },
            dataType: 'text'
        });

        // others
        $('#__debugSelf__').attr('href', window.location.href);
        $('#__debugAjax__').attr('href', url);
    } else {
        console.log("Invalid obj:", query);
    }
}

function formatResult(data, type){
    // Load from direct link
    //console.log(data);
    data = $('<div>').append(data);

    var src = $('div#src', data).text();
    // format to proxy page
    //console.log("Source from proxy server:",src);
    var $explain = $.formatDict(src, type);
    if ($explain) {
        $explain.hide()
        $result.append($explain);
        // wait css init
        setTimeout(function(){
            // enhance UI
            //$(document).scrollTop( $result.offset().top );
            $('html,body').animate({scrollTop: $result.offset().top},'fast');
            // shwo contents
            $loading.hide();
            $explain.show();
        },200);
    }
}

function reloadWhenDictOptionChanged(){
    //$types.change(saveDictVal2Cookies);
    var $opt_lnks = $('a',$types);
    $opt_lnks.click(function(){
        var $this_opt = $(this).parent();
        if ($this_opt.hasClass('active')) {
            return; // No changed
        }
        var new_dict=$(this).attr('value');
        // reset menu
        updateOptionMenu(new_dict);
        // Save to cookie
        saveDictVal2Cookies(new_dict);
        // Reload dict
        doQuery($searchBox.val(), new_dict);
    });
}

function updateOptionMenu(val) {
    if (!val) return;
    $('li',$types).each(function(){
        var $lnk = $('a', this);
        if (val == $lnk.attr('value')){
            $(this).addClass('active');
            // Update header text
            $('#__dict_selected__ > span').text($lnk.text());
        } else {
            $(this).removeClass('active');
        }
    });
}

function saveDictVal2Cookies(val){
    var opt = getOptionFromCookie();
    opt.dict.dict_type = val;
    setOptionToCookie(opt);
}

/////////////////// COMMONS /////////////////////////
function getOptionFromCookie(){
    var target = $.cookie(COOKIE_NAME) || {};
    var default_opt={'dict':{'dict_type':'weblios'},'ui':{'width':400,'height':300}};
    $.extend(default_opt,target);
    console.log("Cookie read:" , JSON.stringify(default_opt) );
    return default_opt;
}

function setOptionToCookie(opt) {
    $.cookie.json = true;
    $.cookie(COOKIE_NAME, opt , { expires: 365, path: '/' });
    console.log("Cookie saved:" , JSON.stringify($.cookie(COOKIE_NAME)) );
}

/////////////////// Utils ///////////////////////////

function isNotKey(word){
    return word.indexOf('__') !== 0;
}

function getUrlHashValue() {
    var vals = window.location.href.split('#');
    if (vals.length > 1)
        return vals[1];
    else
        return '';
}
function searchToObject() {
  var pairs = window.location.search.substring(1).split("&"),
    obj = {},
    pair,
    i;

  for ( i in pairs ) {
    if ( pairs[i] === "" ) continue;

    pair = pairs[i].split("=");
    obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
  }

  return obj;
}

// END OF AMD
})();
