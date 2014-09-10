(function(alpha, bravo, charlie) {
    if (charlie in bravo && bravo[charlie]) {
        var delta, echo = alpha.location,
            foxtrot = /^(alpha|html)$/i;
        alpha.addEventListener("click", function(alpha) {
            delta = alpha.target;
            while (!foxtrot.test(delta.nodeName)) delta = delta.parentNode;
            "href" in delta && (delta.href.indexOf("http") || ~delta.href.indexOf(echo.host)) && (alpha.preventDefault(), echo.href = delta.href)
        }, !1)
    }
})(document, window.navigator, "standalone")