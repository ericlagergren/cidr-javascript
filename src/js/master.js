/*jshint bitwise: false*/
/*
Copyright 2014 Eric Lagergren

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/* 

I use object['property'] because if I don't, Google's Closure Compiler will 
convert the non-ECMA properties (like 'standalone') into variables and break
my app.

*/

/* THIS IS STUFF FOR MY STANDALONE APP */

"use strict"; // Just because. It keeps me from doing stupid things with my code

// Prevents same-domain links from being opened outside my standalone app 
// (e.g. Safari, Google Chrome)

if (window.navigator["standalone"]) {
    var noddy, remotes = false,
        doc = document;
    doc.addEventListener("click", function(event) {
        noddy = event.target;
        while (noddy.nodeName !== "A" && noddy.nodeName !== "HTML") {
            noddy = noddy.parentNode;
        }
        if (noddy.href.indexOf("http") !== -1 && (noddy.href.indexOf(doc.location.host) !== -1 || remotes)) {
            event.preventDefault();
            doc.location.href = noddy.href;
        }
    }, false);
}

// Tests useragent to see if the client using an iPad, iPhone, or iPod and 
// toggles the 'Download app' notice

var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent),
    doc = document;

if (!iOS || window.navigator["standalone"]) {
    doc.getElementById("iphoneinstall").classList.toggle("hidden");
} else {
    doc.getElementsByTagName("body")[0].setAttribute("style", "margin-top:40px;");
    doc.getElementsByTagName("body")[0].classList.toggle("no-touch");
}

// Per Apple, it swaps cache on page reload

function updateSite(event) {
    window.applicationCache.swapCache();
}
window.applicationCache.addEventListener('updateready', updateSite, false);

/* THIS DOES THE ACTUAL COMPUTATIONS */

function performCalculations() {
    // Declare our variables. Doc = document prevents global lookup each time 
    // 'document' is referenced
    // see http://jonraasch.com/blog/10-javascript-performance-boosting-tips-from-nicholas-zakas
    var doc = document,
        submaskInput = doc.form["submask"].value,
        ipInput = doc.form["ip"].value,
        submask, base, index, theBigString, netFinal, netInit;
    // Declare constants*
    var THIRTY_TWO_BITS = 4294967295,
        MAX_BIT_VALUE = 32,
        MAX_BIT_BIN = 255;



    // Determine the type of input
    if (submaskInput <= MAX_BIT_VALUE) { // less than or equal to = cidr
        base = submaskInput;
        // parseInt because if it's CIDR notation then we need to convert 
        // the string input to an int
        submask = getSubmask(parseInt(submaskInput, 10));
    }
    if (4 === submaskInput.split(".").length) {
        // if you can split the input ip into four parts it's a submask
        base = getCidr(submaskInput);
        submask = submaskInput;
    }
    // greater than = host or checked checkbox
    if (doc.form["cb"].checked || submaskInput > MAX_BIT_VALUE) {
        base = getCidrFromHost(submaskInput);
        submask = getSubmask(base);
    }
    if ('undefined' === base || isNaN(base) || null === base) {
        // if base isn't valid then do nothing
        return null;
    }

    // Splits our inputs into arrays

    var ipInputArray = ipInput.split("."),
        submaskInputArray = submask.split(".");

    // Converts an IP/Submask into 32 bit int
    function ipToInt(ip) {
        var x = 0;

        x += +ip[3] << 24 >>> 0;
        x += +ip[2] << 16 >>> 0;
        x += +ip[1] << 8 >>> 0;
        x += +ip[0] >>> 0;

        return x;
    }

    // Reverses the previous functions
    function intToIp(integer) {

        var arr = [24, 16, 8, 0];

        var x = arr.map(function(n) {
            return integer >> n & 0xFF;
        }).reverse().join('.');

        return x;
    }

    function getCidrFromHost(input) {
        // as long as the number of hosts isn't 0, find (log2(hosts)), round 
        // up, and subtract that from MAX_BIT_VALUE to find the correct CIDR
        if (0 !== input) {
            input = (MAX_BIT_VALUE - (Math.ceil((Math.log(input)) / (Math.log(2)))));
        }
        return input;
    }

    function getSubmask(input) {
        var mask = ~0 << (MAX_BIT_VALUE - input);
        return [mask >> 24 & MAX_BIT_BIN,
            mask >> 16 & MAX_BIT_BIN,
            mask >> 8 & MAX_BIT_BIN,
            mask & MAX_BIT_BIN
        ].join('.');
    }

    // Inverse of submask
    function getWildcard(input) {
        var mask = ~ (~0 << (MAX_BIT_VALUE - input));
        return [mask >> 24 & MAX_BIT_BIN,
            mask >> 16 & MAX_BIT_BIN,
            mask >> 8 & MAX_BIT_BIN,
            mask & MAX_BIT_BIN
        ].join('.');
    }

    function getCidr(input) {
        var arr = input.split('.');

        // Similar to:
        // arr = [192.168.0.1]
        // x =  192 << 8 | 168
        // x += 168 << 8 | x
        // x +=   0 << 8 | x
        // x +=   1 << 8 | x
        // return x
        var x = arr.reduce(function(previousValue, currentValue, index, array) {
            return (previousValue << 8 | currentValue) >>> 0;
        });

        // https://github.com/mikolalysenko/bit-twiddle/blob/master/twiddle.js#L63
        // https://github.com/mikolalysenko/bit-twiddle/blob/master/LICENSE
        x -= (x >>> 1) & 0x55555555;
        x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);

        return ((x + (x >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
    }

    function calculateHosts(hv) {
        hv = hv || 0; // zero out hv
        if (hv >= 2) {
            hv = (Math.pow(2, (MAX_BIT_VALUE - hv)));
            // 2^(total bits - on bits) = off bits
        }
        return hv;
    }

    function calculateSubnets(base) {
        var mod_base = base % 8;
        return mod_base ? Math.pow(2, mod_base) : Math.pow(2, 8);
    }

    function onBits(bits) {
        var one = "1",
            two = "0",
            i = "",
            v = "";

        while (i.length < bits) {
            i += one;
        }

        while (v.length < (MAX_BIT_VALUE - bits)) {
            v += two;
        }

        var binarystring = i + v;

        // .{8} means find 8 of any characters, and we repeat this 3 times 
        // because we need to insert 3 periods. See: http://regexr.com/3943q
        return binarystring.replace(/(.{8})(.{8})(.{8})/g, "$1.$2.$3.");
    }

    function findClass(ip) {
        if (4 === ipInputArray.length) {
            if (!ip || ip < 0 || 'undefined' === typeof ip) {
                return "No Valid IP Entered";
            }
            if (ip < 128) {
                return "Class A";
            }
            if (ip < 192) {
                return "Class B";
            }
            if (ip < 224) {
                return "Class C";
            }
            if (ip < 240) {
                return "Class D";
            }
            if (ip < 256) {
                return "Class E";
            }
        } else {
            return "No Valid IP Entered";
        }
    }

    function networkAddress(ip, sm) {
        var x = ip & sm;

        return intToIp(x);
    }

    function broadcastAddress(ip, sm) {
        var x = ip | (~sm & THIRTY_TWO_BITS);

        return intToIp(x);
    }

    // Parse the ipInputArray's segments as integers, and then adding '00' 
    // padding (because JS is weird) and converting them to a base-16 string,
    // and then removing the prefixed '00's.

    var hexIp = ipInputArray.map(function(x) {
        var x = +x;
        return ("00" + x.toString(16)).substr(-2);
    }).join('');

    var wildcard = getWildcard(base);

    var hosts = calculateHosts(base),
        usable_hosts = (hosts - 2) > 0 ? (hosts - 2).toString().replace(
            /\B(?=(\d{3})+(?!\d))/g, ",") : 0;

    var networkAddr = networkAddress(ipToInt(ipInputArray), ipToInt(submaskInputArray)),
        broadcastAddr = broadcastAddress(ipToInt(ipInputArray), ipToInt(submaskInputArray)),
        naa = networkAddr.split('.'),
        baa = broadcastAddr.split('.');

    naa[3] = +naa[3] + 1;
    baa[3] = +baa[3] - 1;
    var usable_range = naa.join('.') + " - " + baa.join('.');


    // CIDR
    doc.getElementById("tablecidr").innerHTML = base;
    // Submask
    doc.getElementById("tablesubmask").innerHTML = submask;
    // Submask -> binary
    doc.getElementById("tablebinary").innerHTML = onBits(base);
    // # of hosts
    doc.getElementById("tablenumhosts").innerHTML = hosts.toString().replace(
        /\B(?=(\d{3})+(?!\d))/g, ",") + " (" + usable_hosts + " usable)";
    // # of subnets
    doc.getElementById("tablenumsubnets").innerHTML = calculateSubnets(base);
    // Wildcard mask
    doc.getElementById("tablewildcardmask").innerHTML = wildcard;
    // IP class
    doc.getElementById("tableipclass").innerHTML = findClass(ipInputArray[0]);
    // IP -> hex
    doc.getElementById("tableiptohex").innerHTML = "0x" + hexIp.toUpperCase();
    // Network ID
    doc.getElementById("tablenetworkid").innerHTML = networkAddr;
    // Broadcast Address
    doc.getElementById("tablebroadcastaddress").innerHTML = broadcastAddr;
    // Network ranges
    doc.getElementById("tablenetworkrange").innerHTML = usable_range;

    function throwError() {
        var error = "No Valid IP Entered",
            doc = document;
        // IP class
        doc.getElementById("tableipclass").innerHTML = error;
        // IP -> hex
        doc.getElementById("tableiptohex").innerHTML = error;
        // Network ID
        doc.getElementById("tablenetworkid").innerHTML = error;
        // Broadcast Address
        doc.getElementById("tablebroadcastaddress").innerHTML = error;
        // Network ranges
        doc.getElementById("tablenetworkrange").innerHTML = error;

    }

    if (4 !== ipInput.split(".").length || "" === ipInput) {
        throwError();
    }

    for (var j = 0; j < 4; j++) {
        var iptoint = parseInt(ipInputArray[j], 10);
        if (iptoint != ipInputArray[j] || iptoint < 0 || iptoint > MAX_BIT_BIN) {
            throwError();
        }
        ipInputArray[j] = iptoint;
    }

}
window.onload = function() {
    document.getElementsByTagName("form")[0].onsubmit = function(evt) {
        evt.preventDefault();
        performCalculations();
        window.scrollTo(0, document.body.scrollHeight);
    };
    document.onkeypress = function keypressed(e) {
        var keyCode = (window.event) ? e.which : e.keyCode;
        if (keyCode == 13) {
            if (performCalculations()) {
                document.forms['form'].submit();
            }
        }
    };
};