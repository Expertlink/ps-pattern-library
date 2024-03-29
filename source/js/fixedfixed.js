/**
 * Note: There is an open issue on this script regarding its accuracy in
 * iOS8. To resolve issues in the meantime, we are using a fix proposed to
 * the repository in this pull request:
 * https://github.com/filamentgroup/fixed-fixed/pull/5
 */

/*! fixed-fixed - v0.1.0 - 2014-05-23
* Copyright (c) 2014 ; Licensed MIT */
/*! Fixedfixed: a CSS position:fixed qualifier. (c)2012 @scottjehl, Filament Group, Inc. Dual license: MIT and/or GPLv2 */
(function(w, undefined) {
    var htmlclass = "fixed-supported", el = w.document.createElement("div"), ua = w.navigator.userAgent, docEl = w.document.documentElement;
    // fix the test element
    el.style.position = "fixed";
    el.style.top = 0;
    // support test
    function checkFixed() {
        var scroll = "scrollTop" in w.document.body ? w.document.body.scrollTop : docEl.scrollTop;
        // only run test if there's a scroll we can compare
        if (scroll !== undefined && scroll > 0 && w.document.body) {
            w.document.body.insertBefore(el, w.document.body.firstChild);
            if (!el.getBoundingClientRect || el.getBoundingClientRect().top !== 0 && !ua.match(/OS 8_\d+(?:_\d+)? like Mac OS X/)) {
                // Fixed is not working or can't be tested
                docEl.className = docEl.className.replace(htmlclass, "");
            }
            // remove the test element
            w.document.body.removeChild(el);
            // unbind the handlers
            if (w.removeEventListener) {
                w.removeEventListener("scroll", checkFixed, false);
            } else {
                w.detachEvent("onscroll", checkFixed);
            }
        }
    }
    // if a particular UA is known to return false results with this feature test, try and avoid that UA here.
    if (// Android 2.1, 2.2, 2.5, and 2.6 Webkit
    !(ua.match(/Android 2\.[1256]/) && ua.indexOf("AppleWebKit") > -1) || // Opera Mobile less than version 11.0 (7458)
    !(ua.match(/Opera Mobi\/([0-9]+)/) && RegExp.$1 < 7458) || // Opera Mini
    !(w.operamini && {}.toString.call(w.operamini) === "[object OperaMini]") || // Firefox Mobile less than version 6
    !(ua.match(/Fennec\/([0-9]+)/) && RegExp.$1 < 6)) {
        //add the HTML class for now.
        docEl.className += " " + htmlclass;
        // bind to scroll event so we can test and potentially degrade
        if (w.addEventListener) {
            w.addEventListener("scroll", checkFixed, false);
        } else {
            w.attachEvent("onscroll", checkFixed);
        }
    }
    w.FixedFixed = checkFixed;
})(this);
