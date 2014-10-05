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

/**
 * Performs all calculations, including writing to screen
 */
function performCalculations() {
    /**
     * Declare our variables. Doc = document prevents global lookup each time 
     *'document' is referenced
     * see http://jonraasch.com/blog/10-javascript-performance-boosting-tips-from-nicholas-zakas
     */
    var doc = document,
        submaskInput = doc.form["submask"].value,
        ipInput = doc.form["ip"].value,
        submask, base;
    /**
     * Thirty-two bits worth of a number
     *
     * @const 
     * @type {number}
     */
    var THIRTY_TWO_BITS = 4294967295;
    /**
     * Maximum number of "on" bits
     *
     * @const 
     * @type {number}
     */
    var MAX_BIT_VALUE = 32;

    /**
     * Maximum binary number 
     *
     * @const 
     * @type {number}
     */
    var MAX_BIT_BIN = 255;


    // Determine the type of input
    if (submaskInput <= MAX_BIT_VALUE) { // less than or equal to = cidr
        base = submaskInput;
        // parseInt because if it's CIDR notation then we need to convert 
        // the string input to an int
        submask = intToQdot(unpackInt(base));
    }
    if (4 === submaskInput.split(".").length) {
        // if you can split the input ip into four parts it's a submask
        base = getCidr(submaskInput);
        submask = submaskInput;
    }
    // greater than = host or checked checkbox
    if (doc.form["cb"].checked || submaskInput > MAX_BIT_VALUE) {
        base = getCidrFromHost(submaskInput);
        submask = intToQdot(unpackInt(base));
    }
    if ('undefined' === base || isNaN(base) || null === base) {
        // if base isn't valid then do nothing
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
     * @param {string} string to be validated
     * @param {string} type/name of error to be thrown
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
            if (itv_int != itv_arr[j] || itv_int < 0 || itv_int > MAX_BIT_BIN) {
                throwError();
            }
            itv_arr[j] = itv_int;
        }
    }

    // Validate both submask and IP
    validate(ipInput);
    validate(submask);

    /* UNDER CONSTRUCTION
    function numberOfSubnets(arg_list) {
        for (var i = 1; i < arg_list.length; i += 2) {
            if (arg_list[i - 1] !== "-s") {
                throwError();
            }
        }

        if (2 === arg_list.length) {
            // Assume that the user means number of evenly-distrubuted subnets
            hostsPer = arg_list[1];
        } else {

        }
    }

    numberOfSubnets(process.argv.slice(4));
    */

    /**
     * Converts an IP/Submask into 32 bit int
     *
     * @param {Array.<String>} a quad-dotted IPv4 address -> array
     * @return {number} a 32-bit integer representation of an IPv4 address
     */
    function qdotToInt(ip) {
        var x = 0;

        x += +ip[0] << 24 >>> 0;
        x += +ip[1] << 16 >>> 0;
        x += +ip[2] << 8 >>> 0;
        x += +ip[3] >>> 0;

        return x;
    }

    /**
     * Reverses function qdotToInt(ip)
     *
     * @param {number} a 32-bit integer representation of an IPv4 address
     * @return {string} a quad-dotted IPv4 address
     */
    function intToQdot(integer) {
        return [integer >> 24 & MAX_BIT_BIN, integer >> 16 & MAX_BIT_BIN, integer >> 8 & MAX_BIT_BIN, integer & MAX_BIT_BIN].join('.');
    }

    /**
     * Gets CIDR prefix from a {number} of hosts
     *
     * @param {number} int number of hosts
     * @return {number} if param isn't 0, return 32 - ceil(log2(input)), else 0
     */
    function getCidrFromHost(input) {
        // as long as the number of hosts isn't 0, find (log2(hosts)), round 
        // up, and subtract that from MAX_BIT_VALUE to find the correct CIDR
        return 0 !== input ? MAX_BIT_VALUE - Math.ceil(Math.log(input) / Math.log(2)) : 0;
    }

    /**
     * Unpacks 8 bit int
     *
     * @param {number} 8 bit int
     * @return {number} I actually don't know what to call this
     */
    function unpackInt(input) {
        return -1 << (MAX_BIT_VALUE - input);
    }

    /**
     * Gets CIDR prefix from quad-dotted submask
     * Counts number of bits
     *
     * @param {string} IPv4 address in string notation
     * @return {number} a short int
     */
    function getCidr(input) {

        var arr = input.split('.');

        /** 
         * Similar to:
         * arr = [192.168.0.1]
         * x =  192 << 8 | 168
         * x += 168 << 8 | x
         * x +=   0 << 8 | x
         * x +=   1 << 8 | x
         * return x
         *
         * @param {number} previous value in array
         * @param {number} next value in array
         * @return {number} sum of bitwise shifted numbers
         */
        var x = arr.reduce(function(previousValue, currentValue) {
            return (previousValue << 8 | currentValue) >>> 0;
        });

        /**
         * https://github.com/mikolalysenko/bit-twiddle/blob/master/twiddle.js#L63
         * https://github.com/mikolalysenko/bit-twiddle/blob/master/LICENSE
         */
        x -= (x >>> 1) & 0x55555555;
        x = (x & 0x33333333) + (x >>> 2 & 0x33333333);

        return ((x + (x >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
    }

    /**
     * Gets total number of usable hosts from on bits
     *
     * @param {number} int number of on bits
     * @return {number} int number of usable hosts
     */
    function fhosts(hv) {
        hv = hv || 0; // zero out hv
        if (hv >= 2) {
            // 2^(total bits - on bits) = off bits -2 because of nwork/bcast addrs
            hv = (Math.pow(2, (MAX_BIT_VALUE - hv))) - 2;
        }
        return hv;
    }

    /**
     * Gets number of subnets from on bits
     *
     * @param {number} int number of on bits
     * @return {number} int number of subnets
     */
    function fsubnets(base) {
        var mod_base = base % 8;
        return mod_base ? Math.pow(2, mod_base) : Math.pow(2, 8);
    }

    /**
     * Gets class of IPv4 address from arr[0]
     *
     * @param {Array.<Number>} is first (zero) element in array
     * @return {string|function(string): string} string containing class of address
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
        } else {
            // Is there anything else?
            throwError();
        }
    }

    /**
     * ANDs 32 bit representations of IP and submask to get network address
     *
     * @param {number} 32 bit representation of IP address
     * @param {number} 32 bit representation of submask
     * @return {number} 32 bit representation of IP address (network address)
     */
    function networkAddress(ip, sm) {
        return intToQdot(ip & sm);
    }

    /**
     * ORs 32 bit representations of IP and submask to get broadcast address
     *
     * @param {number} 32 bit representation of IP address
     * @param {number} 32 bit representation of submask
     * @return {number} 32 bit representation of IP address (broadcast address)
     */
    function broadcastAddress(ip, sm) {
        return intToQdot(ip | (~sm & THIRTY_TWO_BITS));
    }

    /**
     * Converts an int to its hex form
     *
     * @param {number} 32 bit int representation of a quad-dotted address
     * @return {string} hex value of address
     */
    function addressToHex(address) {
        return "0x" + address.toString(16).toUpperCase();
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

    var hosts = fhosts(base);
    var usable_hosts = 2 <= hosts ? hosts.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
    var _ip_32bit_int = qdotToInt(ipInputArray);
    var _sm_32bit_int = qdotToInt(submaskInputArray);
    var networkAddr = networkAddress(_ip_32bit_int, _sm_32bit_int);
    var broadcastAddr = broadcastAddress(_ip_32bit_int, _sm_32bit_int);
    var ipClass = findClass(ipInputArray[0]);
    var subnet = fsubnets(base);
    var wildcard = intToQdot(~_sm_32bit_int);
    var hexAddress = addressToHex(_ip_32bit_int);
    var hexMask = addressToHex(_sm_32bit_int);
    var naa = networkAddr.split('.');
    var baa = broadcastAddr.split('.');

    naa[3] = +naa[3] + 1;
    baa[3] = +baa[3] - 1;

    var netMin = naa.join('.');
    var netMax = baa.join('.');


    // CIDR
    doc.getElementById("tablecidr").innerHTML = base;
    // Submask
    doc.getElementById("tablesubmask").innerHTML = submask;
    // Submask -> binary
    doc.getElementById("tablebinary").innerHTML = onBits(base);
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
        doc.getElementById("tablebinary").innerHTML = error;
        doc.getElementById("tablenumhosts").innerHTML = error;
        doc.getElementById("tablenumsubnets").innerHTML = error;
        doc.getElementById("tablewildcardmask").innerHTML = error;
        doc.getElementById("tableipclass").innerHTML = error;
        doc.getElementById("tableiptohex").innerHTML = error;
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
                document.forms['form'].submit();
            }
        }
    };
};