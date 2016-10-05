var p_sel = ".rich-text p:visible, .rich-text blockquote:visible, " +
            ".rich-text h1:visible, .rich-text h2:visible, .rich-text h3:visible, " +
            ".rich-text h4:visible, .rich-text h5:visible, .rich-text h6:visible";
var img_iframe_sel = ".rich-text iframe:visible, .rich-text img:visible";
var sections_sel = ".site-wrapper:visible, .site-footer:visible, .site-header:visible, .page-container .article-header:visible, "+
                    "header.article-header:visible, .page-container section:visible, article section:visible, "+
                    ".page-container section article:visible, article section .story:visible";
var ad_sel = ".vmp-ad:visible, .motherboard-ad:visible"
	
function captureRenderedElements() { 	
	$jq = window.jQuery;
    // text elements
    var elems = $jq(p_sel).map(function() {
    	var offset = $jq(this).offset();
    	return {t: offset.top, l: offset.left, h: $jq(this).height(), w: $jq(this).width(),
    			type: $jq(this).prop('tagName'),
    			txt: $jq(this).text().replace(/(\r\n|\n|\r)/gm," ").replace("\t", " ").trim()
    		}
    }).toArray().filter(function(x) { return (x.txt.length > 0);});
    // images/videos
    elems.push.apply(elems, $jq(img_iframe_sel).map(function() {
    	var offset = $jq(this).offset();
    	return {t: offset.top, l: offset.left, h: $jq(this).height(), w: $jq(this).width(),
    			src: $jq(this).attr("src"), type: $jq(this).prop('tagName')
    		}
    }).toArray().filter(function(x) { return (x.src.length > 0);}));
    // sort elements by top position then left position
    elems.sort(mysortfunction);
    // append major page sections as elements
    elems.push.apply(elems, $jq(sections_sel).map(function() {
    	var offset = $jq(this).offset();
    	return {t: offset.top, l: offset.left, h: $jq(this).height(), w: $jq(this).width(),
    			type: $jq(this).prop('tagName'), cls: $jq(this).attr("class"), 
    			outerHTML: $jq(this).prop('outerHTML')
    		}
    }).toArray().filter(function(x) { return (x.outerHTML.length > 0);}));
    // append ad elements
    elems.push.apply(elems, $jq(ad_sel).map(function() {
        var offset = $jq(this).offset();
        return {t: offset.top, l: offset.left, h: $jq(this).height(), w: $jq(this).width(),
                ad_loc: $jq(this).attr("data-ref")
            }
    }).toArray().filter(function(x) { return (x.h > 0 && x.w > 0);}));

    chrome.runtime.sendMessage({msg: "postRenderedPageElements", data: elems, url: window.location.href}, function() { });
};

// captures rendered elements when page's ready
$(document).ready(function() {
	console.log("rendered page tracking loaded");
	captureRenderedElements();
});

// captures rendered elements after page resize ended
var rtime;
var timeout = false;
var delta = 1000;
$(window).resize(function() {
    rtime = new Date();
    if (timeout === false) {
        timeout = true;
        setTimeout(resizeend, delta);
    }
});

function resizeend() {
    if (new Date() - rtime < delta) {
        setTimeout(resizeend, delta);
    } else {
        timeout = false;
        // done resizing
        captureRenderedElements();
    }               
}

// helper function for sorting array by multiple keys
function mysortfunction(a, b) {
  if (a.t < b.t) return -1;
  if (a.t > b.t) return 1;
  if (a.l < b.l) return -1;
  if (b.l > b.l) return 1;
  return 0;
}