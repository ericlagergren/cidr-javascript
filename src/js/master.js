/*jslint node: true */

/**
 * @preserve 
 * @copyright
 * Copyright 2014 Eric Lagergren
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";

/* THIS IS STUFF FOR MY STANDALONE APP */

// Prevents same-domain links from being opened outside my standalone app 
// (e.g. Safari, Google Chrome)

var doc = document;

if (window.navigator["standalone"]) {
    var noddy, remotes = false;
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

var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

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

/**
 * Performs all calculations, including writing to screen
 */
function performCalculations() {

    var submaskInput = doc.forms["valuebox"]["submask"].value;
    var submask;

    /**
     * @type {string}
     */
    var ipInput = doc.forms["valuebox"]["ip"].value;

    /**
     * @type {number}
     */
    var base;

    /**
     * Maximum number of "on" bits
     *
     * @const 
     * @type {number}
     */
    var BITS_MAX = 32;

    /**
     * Maximum octet number
     *
     * @const 
     * @type {number}
     */
    var OCTET_MAX = 255;


    // Determine the type of input
    // if less than or equal 32 then CIDR
    if (submaskInput <= BITS_MAX) {
        base = +submaskInput;
        submask = intToQdot(mask(base));
    }
    // if you can split the input into four parts it's a submask
    if (4 === submaskInput.split(".").length) {
        base = getCidr(submaskInput);
        submask = submaskInput;
    }
    // greater than max CIDR value or checked checkbox then # hosts
    if (doc.forms["valuebox"]["cb"].checked || submaskInput > BITS_MAX) {
        base = getCidrFromHost(submaskInput);
        submask = intToQdot(mask(base));
    }
    // no base entered default to using "default" submasks
    if (!base) {
        submask = defaultSubmask(+ipInput.split(".")[0])
        base = getCidr(submask)
    }
    // if base isn't valid then do nothing
    if (undefined === base || isNaN(base) || null === base) {
        return null;
    }

    /** 
     * Checks if base isNaN and throws error if true. Also will
     * convert base to int -- not necessary, but prevents JS from switching types
     */
    if (isNaN(base)) {throwError();}

    // Splits our inputs into arrays to use later
    var ipInputArray = ipInput.split(".");
    var submaskInputArray = submask.split(".");

    /**
     * Validates user inputs
     * 
     * @param {string} item_to_val string to be validated
     */
    function validate(item_to_val) {
        var itv_arr = item_to_val.split(".");
        // If the ip/submask isn't quad-dotted, it must be invalid
        // Or if it's an empty string it's also invalid
        if (4 !== itv_arr.length || "" === item_to_val) {
            throwError();
        }

        for (var j = 0; j < 4; j++) {
            var itv_int = +itv_arr[j];
            // If the specific element of the ip/submask can't be converted to
            // an integer without not equaling (using == not ===) the string
            // version, then it's invalid
            // 
            // If the integer element is < 0 or > 255 then it's invalid as well
            if (itv_int != itv_arr[j] || itv_int < 0 || itv_int > OCTET_MAX) {
                throwError();
            }
            //itv_arr[j] = itv_int;
        }
    }

    // Validate both submask and IP
    validate(ipInput);
    validate(submask);

    /**
     * Converts an IP/Submask into 32-bit int
     *
     * @param {Array<string>} ip a quad-dotted IPv4 address -> array
     * @return {number} a 32-bit integer representation of an IPv4 address
     */
    function qdotToInt(ip) {
        var i, x;
        for (x = 0, i = 0; i < 4; i++) {
            x<<=8;
            x += +ip[i];
        }

        return x>>>0;
    }

    /**
     * Reverses function qdotToInt(ip)
     *
     * @param {number} n a 32-bit integer representation of an IPv4 address
     * @return {string} a quad-dotted IPv4 address
     */
    function intToQdot(n) {
        return [n >>> 24, n >> 16 & OCTET_MAX, n >> 8 & OCTET_MAX, n & OCTET_MAX].join('.');
    }

    /**
     * Gets CIDR prefix from a {number} of hosts
     *
     * @param {number} n number of hosts
     * @return {number} if param isn't 0, return 32 - ceil(log2(input)), else 0
     */
    function getCidrFromHost(n) {
        // as long as the number of hosts isn't 0, find (log2(hosts)), round 
        // up, and subtract that from BITS_MAX to find the correct CIDR
        return 0 !== n ? BITS_MAX - Math.ceil(Math.log(n) / Math.log(2)) : 0;
    }

    /**
     * Finds mask
     *
     * @param {number} n CIDR or HOSTS
     * @return {number} masked of the above
     */
    function mask(n) {
        return -1 << (BITS_MAX - n);
    }

    /**
     * Gets CIDR prefix from quad-dotted submask
     * Counts number of bits
     *
     * @param {string} submask in string notation
     * @return {number} a short int
     */
    function getCidr(submask) {

        var arr = submask.split('.');

        var i,
            x = +arr[0] << 8 | +arr[1];
        for (i = 1; i < 4; i++) {
            x += +arr[i] << 8 | x
        }
         
        // count bits
        // https://github.com/mikolalysenko/bit-twiddle/blob/master/twiddle.js#L63
        x -= (x >>> 1) & 0x55555555;
        x = (x & 0x33333333) + (x >>> 2 & 0x33333333);
        return ((x + (x >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
    }

    /**
     * Gets total number of usable hosts from on bits
     *
     * @param {number} hv number of on bits
     * @return {number} number of usable hosts
     */
    function fhosts(hv) {
        hv = hv || 0; // zero out hv
        if (hv >= 2) {
            // 2^(total bits - on bits) = off bits -2 because of nwork/bcast addrs
            hv = (Math.pow(2, (BITS_MAX - hv))) - 2;
        }
        return hv;
    }

    /**
     * Gets number of subnets from on bits
     *
     * @param {number} base number of on bits
     * @return {number} number of subnets
     */
    function fsubnets(base) {
        var mod_base = base % 8;
        return mod_base ? Math.pow(2, mod_base) : Math.pow(2, 8);
    }

    /**
     * Gets default submask from an IPv4 address
     * @param {number} ip is 0th element in IPv4 address array
     * @return {string} string containing default mask
     */
     function defaultSubmask(ip) {
        if (ip < 128) {
            return "255.0.0.0";
        }
        if (ip < 192) {
            return "255.255.0.0";
        }
        if (ip < 224) {
            return "255.255.255.0";
        }
        if (ip < 256) {
            return "255.255.255.255";
        }
        if (!ip || ip < 0 || 'undefined' === typeof ip || isNaN(ip)) {
            throwError();
            // unreachable
            return "";
        } else {
            throwError();
            // unreachable
            return "";
        }
     }

    /**
     * Gets class of IPv4 address from arr[0]
     *
     * @param {number} ip is first (zero) element in array
     * @return {string} string containing class of address
     */
    function findClass(ip) {
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
        if (!ip || ip < 0 || 'undefined' === typeof ip || isNaN(ip)) {
            throwError();

            // unreachable
            return "";
        } else {
            // Is there anything else?
            throwError();
            // unreachable
            return "";
        }
    }

    /**
     * ANDs 32-bit representations of IP and submask to get network address
     *
     * @param {number} ip 32-bit representation of IP address
     * @param {number} sm 32-bit representation of submask
     * @return {string} quad-dotted repr. of IPv4 address (network address)
     */
    function networkAddress(ip, sm) {
        return intToQdot(ip & sm);
    }

    /**
     * ORs 32-bit representations of IP and submask to get broadcast address
     *
     * @param {number} ip 32-bit representation of IPv4 address
     * @param {number} sm 32-bit representation of submask
     * @return {string} quad-dotted repr. of IPv4 address (broadcast address)
     */
    function broadcastAddress(ip, sm) {
        return intToQdot(ip | ~sm);
    }

    /**
     * Converts an int to its hex form
     *
     * @param {number} address 32-bit int representation of a quad-dotted address
     * @return {string} hex value of address
     */
    function addressToHex(address) {
        return "0x" + address.toString(16).toUpperCase();
    }

    /**
     * Provides the visual binary representation of the on and off bits in
     * an an IPv4 address' submask
     *
     * @param {number} bits our 'base' var
     * @return {string} visual binary rep. of on/off bits
     */
    function onBits(bits) {
        var one = "1",
            zero = "0",
            i = "",
            v = "";

        while (i.length < bits) {
            i += one;
        }

        while (v.length < (BITS_MAX - bits)) {
            v += zero;
        }

        var binarystring = i + v;

        // .{8} means find 8 of any characters, and we repeat this 3 times 
        // because we need to insert 3 periods. See: http://regexr.com/3943q
        return binarystring.replace(/(.{8})(.{8})(.{8})/g, "$1.$2.$3.");
    }

    /**
     * Provites visual binary representation of an IPv4 address
     *
     * @param {Array<string>} ip quad-dotted IPv4 address
     * @return {string} visual binary rep. of IPv4 address
     */
     function ipToBin(ip) {
        var binstr = "",
            seg = "",
            zero = "0";

        for (var i = 0; i < 4; i++) {
            var t = "";

            seg = (+ip[i]).toString(2)
            while (seg.length < 8) {
                seg = zero + seg;
            }

            binstr += seg;
        }

        return binstr.replace(/(.{8})(.{8})(.{8})/g, "$1.$2.$3.");
     }

    var ipBase = (ipInput);
    var hosts = fhosts(base);
    var usable_hosts = 2 <= hosts ? hosts.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
    var _ip32 = qdotToInt(ipInputArray);
    var _sm32 = qdotToInt(submaskInputArray);
    var networkAddr = networkAddress(_ip32, _sm32);
    var broadcastAddr = broadcastAddress(_ip32, _sm32);
    var ipClass = findClass(+ipInputArray[0]);
    var subnet = fsubnets(base);
    var wildcard = intToQdot(~_sm32);
    var hexAddress = addressToHex(_ip32);
    //var hexMask = addressToHex(_sm32);
    var naa = networkAddr.split('.');
    var baa = broadcastAddr.split('.');

    naa[3] = (+naa[3] + 1).toString();
    baa[3] = (+baa[3] - 1).toString();

    var netMin = naa.join('.');
    var netMax = baa.join('.');


    // CIDR
    doc.getElementById("tablecidr").innerHTML = base;
    // Submask
    doc.getElementById("tablesubmask").innerHTML = submask;
    // Submask -> binary
    doc.getElementById("tablebinarysub").innerHTML = onBits(base);
    // # of hosts
    doc.getElementById("tablenumhosts").innerHTML = usable_hosts;
    // # of subnets
    doc.getElementById("tablenumsubnets").innerHTML = subnet;
    // Wildcard mask
    doc.getElementById("tablewildcardmask").innerHTML = wildcard;
    // IP class
    doc.getElementById("tableipclass").innerHTML = ipClass;
    // IP -> hex
    doc.getElementById("tableiptohex").innerHTML = hexAddress;
    // IP -> binary
    doc.getElementById("tablebinaryip").innerHTML = ipToBin(ipInputArray);
    // Network ID
    doc.getElementById("tablenetworkid").innerHTML = networkAddr;
    // Broadcast Address
    doc.getElementById("tablebroadcastaddress").innerHTML = broadcastAddr;
    // Network ranges
    doc.getElementById("tablenetworkrange").innerHTML = netMin + " - " + netMax;

    function throwError() {
        var error = "Invalid IP/Submask entered.",
            doc = document;

        doc.getElementById("tablecidr").innerHTML = error;
        doc.getElementById("tablesubmask").innerHTML = error;
        doc.getElementById("tablebinarysub").innerHTML = error;
        doc.getElementById("tablenumhosts").innerHTML = error;
        doc.getElementById("tablenumsubnets").innerHTML = error;
        doc.getElementById("tablewildcardmask").innerHTML = error;
        doc.getElementById("tableipclass").innerHTML = error;
        doc.getElementById("tableiptohex").innerHTML = error;
        doc.getElementById("tablebinaryip").innerHTML = error;
        doc.getElementById("tablenetworkid").innerHTML = error;
        doc.getElementById("tablebroadcastaddress").innerHTML = error;
        doc.getElementById("tablenetworkrange").innerHTML = error;

        throw new Error('Invalid IP/Submask entered');
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
                document.forms['valuebox'].submit();
            }
        }
    };
};