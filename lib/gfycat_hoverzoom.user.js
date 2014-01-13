// ==UserScript==
// @name        gfycat hoverzoom
// @namespace   Koneke,11nov2013,ubershmekel,jan2014
// @description Shows gfycat links on hover
// @include     http://*.reddit.com/*
// @version     2
// @grant       none
// ==/UserScript==
$(function() {
var vidDiv = document.createElement('div');
var jqVidDiv = $(vidDiv);
var vidElem = undefined;
var hoverFunc = function (href) {
    return function () {
        //console.log('hovering in ' + href);
        var curHref = vidDiv.getAttribute('vidlink');
        if (curHref != href) {
            vidDiv.setAttribute('vidlink', href);
            if (vidElem !== undefined) {
                vidElem.remove();
            }
            vidElem = createVideoElem(href);
            jqVidDiv.append(vidElem)
        }
        vidDiv.style.display = 'block'
    }
};
function createVideoElem(href) {

    /*
    var normUrl = href.replace('www.', '').replace('gfycat.com/', '').replace('http://', '').replace('.gif', '');
    var gfyimg = $('<img class="gfyitem" data-id="' + normUrl + '" />');
    console.log('<img class="gfyitem" data-id="' + normUrl + '" />');
    var f = new gfyObject(gfyimg.get(0));
    f.init();
    return gfyimg;
    
    /*
    var normUrl = href.replace('www.', '').replace('gfycat.com/', 'gfycat.com/iframe/');
    console.log(normUrl);
    return $('<iframe style="width:100%;" src="' + normUrl + '"></iframe>');
    */
    
    var vidElem = document.createElement('video');
    vidElem.autoplay = true;
    vidElem.loop = true;
    vidElem.controls = false;
    // I'm not sure there's a reason I have to use 3 video sources, why can't 
    // I have a simpler API gfycat? Is it a CDN thing?
    ['fat', 'zippy', 'giant'].forEach(function(sizeName) {
        source = document.createElement('source');
        var src = href.replace('www.', '').replace('gfycat', sizeName + '.gfycat') + '.webm';
        console.log(src);
        source.src = src;
        vidElem.appendChild(source);
    });
    return vidElem;
}
/*var resizeDivToIframe = function(iframeId) {
    $(jqiframe).load(function() {
        setTimeout(iResize, 50);
        // Safari and Opera need a kick-start.
        //var iSource = document.getElementById('your-iframe-id').src;
        //document.getElementById('your-iframe-id').src = '';
        //document.getElementById('your-iframe-id').src = iSource;
    });
    function iResize() {
    
        var iframeSize = document.getElementById('your-iframe-id').contentWindow.document.body.offsetHeight;
        jqiframe.style.height = iframeSize + 'px';
    }
}*/
function main() {

    (function(d, t) {
        var g = d.createElement(t),
            s = d.getElementsByTagName(t)[0];
        g.src = 'http://assets.gfycat.com/js/gfyajax-0.517d.js';
        s.parentNode.insertBefore(g, s);
    }(document, 'script'));

    var gfyAnchors = [];
    var anchors = document.getElementsByTagName('a');

    for (var i = 0; i < anchors.length; i++) {
        if (anchors[i].hostname.indexOf('gfycat.com') != -1) {
            gfyAnchors.push(anchors[i])
        }
    }
    jqVidDiv.css({
        'position': 'absolute',
        'z-index': '99999',
        'left': '0',
        'top': '0',
        'display': 'none'
    });
    //gfyAnchors[0].parentNode.appendChild(vidDiv);
    $('body').append(jqVidDiv);
    $('body').mousemove(function (ev) {
        // +5 because otherwise the video obscures the element you're hovering over
        // and a blinking video hovering in and out loop occurs.
        jqVidDiv.css({
            left: ev.pageX + 5,
            top: ev.pageY + 5
        })
    });
    for (var i = 0; i < gfyAnchors.length; i++) {
        var anchor = gfyAnchors[i];
        var jqanch = $(anchor);
        jqanch.mouseenter(hoverFunc(anchor.href));
        jqanch.mouseleave(function () {
            //console.log('hovering out');
            vidDiv.style.display = 'none'
        });
    }
}

main();

});