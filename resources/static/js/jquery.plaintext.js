/*
 * jQuery Replace with self text Plugin v0.1
 * https://github.com/ajaxsys/jquery-plain-text
 *
 * Copyright 2013 Fang Dehui
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals.
        factory(jQuery);
    }
})(function ($) {

$.fn.plaintext = function(option) {
    option = option || {};
    // Usage: options defined here
    var defaultOption = {
        'on' : 'mouseenter',
        'off': 'mouseleave',
        'delay' : 2000,
        'color' : '#EF0FFF',
        'bgcolor' : '#FFF'
    }
    // Merge to default option
    $.extend(defaultOption, option);
    // main
    obj2Text($(this),defaultOption);
}

var TIMER = "__link_timmer__",
    TAG_TO_TEXT_CLASS="__tag_to_text_class__";

function obj2Text($obj, option) {
    // Link to Text
    //$obj.on('mouseover', function(e){
    $obj.on(option.on, function(e){
        var $tag2Txt = $(this);
        console.log("Active Link 2 Text:", $tag2Txt.prop('tagName'));
        // Already contain obj2text childrens
        if ($('.'+TAG_TO_TEXT_CLASS, $tag2Txt).length > 0){
            console.log('Ingnore this obj2txt');
            return;
        }
        // Already mouse overed
        if ($tag2Txt.data(TIMER)) {
            // Clear the timer before
            clearTimeout($tag2Txt.data(TIMER));
            $tag2Txt.data(TIMER, null);
        }
        var timer = setTimeout(function(){
            if ($tag2Txt.data(TIMER)) {
                // Support img/a tag
                var text;
                if ($tag2Txt.prop('tagName').toLowerCase()=='a'){
                    text = $tag2Txt.text();
                } else if ($tag2Txt.prop('tagName').toLowerCase()=='select'){
                    text = $('option:selected',$tag2Txt).text();
                } else if ($tag2Txt.prop('tagName').toLowerCase()=='img'){
                    text = $tag2Txt.prop('alt') || $tag2Txt.prop('title');
                }
                console.log("Text changed to:", text);
                if (!text) {
                    // No text, do nothing.
                    return;
                }

                // Must clone with event. Or `on` event will lost.
                var $tag2TxtOrigin = $tag2Txt.clone(true);
                var $replace = $('<span>');
                $replace.addClass(TAG_TO_TEXT_CLASS)
                    .css('backgroundColor',option.bgColor)
                    .css('color',option.color).text(" "+text+" ");// Add spaces for dblclick
                // Link to Text
                $tag2Txt.replaceWith($replace);
                // Text to Link
                //$replace.one('mouseout',function(){
                $replace.one(option.off,function(){
                    $replace.replaceWith($tag2TxtOrigin);
                });
            }
        }, option.delay);
        $tag2Txt.data(TIMER, timer);
        // For img in a link: <a...><img...></a>
        e.stopPropagation();
        return false;
    //}).on('mouseout', function(){
    }).on(option.off, function(){
        console.log("DisActive Link 2 Text:",$(this).prop('tagName'));
        $(this).data(TIMER,null);
    });
}


});

