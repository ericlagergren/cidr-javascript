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

I use object['property'] because if I don't, Google's Closure Compiler will convert the non-ECMA properties (like 'standalone') into variables and break my app 

*/

/* THIS IS STUFF FOR MY STANDALONE APP */

"use strict"; // Just because. It keeps me from doing stupid things with my code

// Prevents same-domain links from being opened outside my standalone app (e.g. Safari)

if (window.navigator["standalone"]) {
	var noddy, remotes = false, doc = document;
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

// Tests useragent to see if the client using an iPad, iPhone, or iPod and togges the 'Download app' notice

var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent),
	doc = document;

if (!iOS || window.navigator["standalone"]) {
	doc.getElementById("iphoneinstall").classList.toggle("hidden");
}
else {
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
	// Declare our variables. Doc = document prevents global lookup each time 'document' is referenced
	var doc = document,
		submaskInput = doc.form["submask"].value,
		ipInput = doc.form["ip"].value,
		maxBitValue = 32,
		submask, base, index, theBigString, netFinal, netInit;

	// Determine the type of input
	if (submaskInput <= maxBitValue) { // less than or equal to = cidr
		base = submaskInput;
		// parseInt because if it's CIDR notation then we need to convert the string input to an int
		submask = getSubmask(parseInt(submaskInput, 10));
	}
	if (submaskInput.split(".").length === 4) {
		// if you can split the input ip into four parts it's a submask
		base = getCidr(submaskInput);
		submask = submaskInput;
	}
	if (doc.form["cb"].checked || submaskInput > maxBitValue) { // greater than = host or checked checkbox
		base = getCidrFromHost(submaskInput);
		submask = getSubmask(base);
	}
	if (base === 'undefined' || isNaN(base) || base === null) {
		// if base isn't valid then do nothing
		return null;
	}

	// Splits our inputs into arrays

	var ipInputArray = ipInput.split("."),
		submaskInputArray = submask.split(".");

	function getCidrFromHost(input) {
		// as long as the number of hosts isn't 0, find (log2(hosts)), round up, and subtract that from maxBitValue to find the correct CIDR
		if (input !== 0) {
			input = (maxBitValue - (Math.ceil((Math.log(input)) / (Math.log(2)))));
		}
		return input;
	}

	/* TO-DO: SEE IF THIS AND ITS SIBLING FUNCTION WILL PERFORM FASTER AS LOOPS */

	function getSubmask(input) {
		if (input === 0) {return "0.0.0.0";}
		if (input === 1) {return "128.0.0.0";}
		if (input === 2) {return "192.0.0.0";}
		if (input === 3) {return "224.0.0.0";}
		if (input === 4) {return "240.0.0.0";}
		if (input === 5) {return "248.0.0.0";}
		if (input === 6) {return "252.0.0.0";}
		if (input === 7) {return "254.0.0.0";}
		if (input === 8) {return "255.0.0.0";}
		if (input === 9) {return "255.128.0.0";}
		if (input === 10) {return "255.192.0.0";}
		if (input === 11) {return "255.224.0.0";}
		if (input === 12) {return "255.240.0.0";}
		if (input === 13) {return "255.248.0.0";}
		if (input === 14) {return "255.252.0.0";}
		if (input === 15) {return "255.254.0.0";}
		if (input === 16) {return "255.255.0.0";}
		if (input === 17) {return "255.255.128.0";}
		if (input === 18) {return "255.255.192.0";}
		if (input === 19) {return "255.255.224.0";}
		if (input === 20) {return "255.255.240.0";}
		if (input === 21) {return "255.255.248.0";}
		if (input === 22) {return "255.255.252.0";}
		if (input === 23) {return "255.255.254.0";}
		if (input === 24) {return "255.255.255.0";}
		if (input === 25) {return "255.255.255.128";}
		if (input === 26) {return "255.255.255.192";}
		if (input === 27) {return "255.255.255.224";}
		if (input === 28) {return "255.255.255.240";}
		if (input === 29) {return "255.255.255.248";}
		if (input === 30) {return "255.255.255.252";}
		if (input === 31) {return "255.255.255.254";}
		if (input === maxBitValue) {return "255.255.255.255";}
	}

	function getCidr(input) {
		if (input === "0.0.0.0") {return 0;}
		if (input === "128.0.0.0") {return 1;}
		if (input === "192.0.0.0") {return 2;}
		if (input === "224.0.0.0") {return 3;}
		if (input === "240.0.0.0") {return 4;}
		if (input === "248.0.0.0") {return 5;}
		if (input === "252.0.0.0") {return 6;}
		if (input === "254.0.0.0") {return 7;}
		if (input === "255.0.0.0") {return 8;}
		if (input === "255.128.0.0") {return 9;}
		if (input === "255.192.0.0") {return 10;}
		if (input === "255.224.0.0") {return 11;}
		if (input === "255.240.0.0") {return 12;}
		if (input === "255.248.0.0") {return 13;}
		if (input === "255.252.0.0") {return 14;}
		if (input === "255.254.0.0") {return 15;}
		if (input === "255.255.0.0") {return 16;}
		if (input === "255.255.128.0") {return 17;}
		if (input === "255.255.192.0") {return 18;}
		if (input === "255.255.224.0") {return 19;}
		if (input === "255.255.240.0") {return 20;}
		if (input === "255.255.248.0") {return 21;}
		if (input === "255.255.252.0") {return 22;}
		if (input === "255.255.254.0") {return 23;}
		if (input === "255.255.255.0") {return 24;}
		if (input === "255.255.255.128") {return 25;}
		if (input === "255.255.255.192") {return 26;}
		if (input === "255.255.255.224") {return 27;}
		if (input === "255.255.255.240") {return 28;}
		if (input === "255.255.255.248") {return 29;}
		if (input === "255.255.255.252") {return 30;}
		if (input === "255.255.255.254") {return 31;}
		if (input === "255.255.255.255") {return maxBitValue;}
	}

	function calculateHosts(hv) {
		hv = hv || 0; // zero out hv
		if (hv >= 2) {
			hv = (Math.pow(2, (maxBitValue - hv)));
			// 2^(total bits - on bits) = off bits
		}
		return hv;
	}

	/*

	The below function does this:

		If there's no var index, which is the index of the first octect !== "255", then the value we're subtracting from the input (CIDR) is 0. If there IS, and it's less than 3, then we take 2, raise it to the power of index + 2 and subtract that from the input. If both are false, then the value is 24.

		We return what is essentially (but not exactly) Math.floor (~~) of 2 to the power of the input - the value we previously found. That = the amount of subnets

	*/

	function calculateSubnets(input) {
		var valToSubtractFromInput = !index ? 0 : index < 3 ? Math.pow(2, index + 2) : 24;
		return~~ Math.pow(2, (input - valToSubtractFromInput)) + " subnets";
	}

	// I commented out the following function for posterity and replaced it with the function onBits(bits) that uses while instead and a different regex
	// For -> while is a speed boost (albeit a very small one) and the new regex is more efficient

	/*function onBits(bits) {
		// Turns the CIDR into 1s and 0s
		var one = "1",
			two = "0";

		// Adds "1"s or "0"s until we've added as many as there are bits (CIDR)
		for (var i = ""; i.length < bits;) {
			i += one;
		}
		// Same, but in reverse so we can count the off bits
		for (var v = ""; v.length < (maxBitValue - bits);) {
			v += two;
		}
		var binarystring = i + v;
		// Inserts a period after every 8th character
		return binarystring.replace(/\B(?=(\d{8})+(?!\d))/g, ".");
	}*/

	function onBits(bits) {
		var one = "1",
			two = "0",
			i = "",
			v = "";

		while (i.length < bits) {
			i += one;
		}

		while (v.length < (maxBitValue - bits)) {
			v += two;
		}

		var binarystring = i + v;

		// .{8} means find 8 of any characters, and we repeat this 3 times because we need to insert 3 periods. See: http://regexr.com/3943q
		return binarystring.replace(/(.{8})(.{8})(.{8})/g, "$1.$2.$3.");
	}

	function findClass(ip) {
		if (ipInputArray.length === 4) {
			if (!ip || ip < 0 || typeof ip === 'undefined') {
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

	for (var j = 0; j < submaskInputArray.length; j++) {
		// finds the first octet not equal to 255
		if (submaskInputArray[j] !== "255") {
			index = j;
			break;
		}
	}

	function getNetworkRange(cider) {
		var init, network, broadcast, modResult = cider % 8;
		if (modResult) {
			init = (Math.pow(2, (8 - modResult)));
			network = ((Math.floor(ipInputArray[index] / init)) * init);
			broadcast = (network + (init - 1));
		} else {
			init = 128;
			network = ((Math.floor(ipInputArray[index] / init)) * init);
			broadcast = "255";
		}
		return [network, broadcast];
	}

	function getEnds() {
		var netInit = getNetworkRange(base),
			netFinal = placeRangeCorrectly(netInit[0], netInit[1]);
		return netFinal;
	}

	function placeRangeCorrectly(network, broadcast) {
		var networkString, broadcastString, networkStringInitial = "",
			broadcastStringInitial = "";
		for (var i = 0; i < index; i++) {
			networkStringInitial += ipInputArray[i] + ".";
			broadcastStringInitial += ipInputArray[i] + ".";
		}
		networkString = networkStringInitial + network;
		broadcastString = broadcastStringInitial + broadcast;
		if (index === 0) {
			networkString += ".0.0.0";
			broadcastString += ".255.255.255";
		}
		if (index === 1) {
			networkString += ".0.0";
			broadcastString += ".255.255";
		}
		if (index === 2) {
			networkString += ".0";
			broadcastString += ".255";
		}
		if (!index) {
			networkString = ipInput;
			broadcastString = ipInput;
		}
		return theBigString = [networkString, broadcastString];
	}

	function datRangeYo() {
		var networkOctet = theBigString[0].split("."),
			broadcastOctet = theBigString[1].split("."),
			firstUsable = (parseInt(networkOctet[3], 10) + 1),
			lastUsable = (parseInt(broadcastOctet[3], 10) - 1),
			fullUsableRange = networkOctet.slice(0, -1).join(".") + "." + firstUsable + " - " + broadcastOctet.slice(0, -1).join(".") + "." + lastUsable;
			if(!index) {
				fullUsableRange = ipInput + " - " + ipInput;
			}
		return fullUsableRange;
	}

	// The first two `var`s convert the IP to hex by parsing the ipInputArray's segments as integers, and then adding '00' padding (because JS) and converting them to a base-16 string, and then removing the prefixed '00's.

	var ipiptoint = ipInputArray.map(function(x) {
		return parseInt(x, 10);
	});
	var iptohex = ipiptoint.map(function(v) {
		return ("00" + v.toString(16)).substr(-2);
	}).join(".");
	var wildcard = submaskInputArray.map(function(v) {
		return 255 - v;
	}).join(".");
	var hosts = calculateHosts(base),
		usable_hosts = (hosts - 2) > 0 ? (hosts - 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;

	// CIDR
	doc.getElementById("tablecidr").innerHTML = base;
	// Submask
	doc.getElementById("tablesubmask").innerHTML = submask;
	// Submask -> binary
	doc.getElementById("tablebinary").innerHTML = onBits(base);
	// # of hosts
	doc.getElementById("tablenumhosts").innerHTML = hosts.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " (" + usable_hosts + " usable)";
	// # of subnets
	doc.getElementById("tablenumsubnets").innerHTML = calculateSubnets(base);
	// Wildcard mask
	doc.getElementById("tablewildcardmask").innerHTML = wildcard;
	// IP class
	doc.getElementById("tableipclass").innerHTML = findClass(ipInputArray[0]);
	// IP -> hex
	doc.getElementById("tableiptohex").innerHTML = iptohex.toUpperCase();
	// Network ID
	doc.getElementById("tablenetworkid").innerHTML = getEnds()[0];
	// Broadcast Address
	doc.getElementById("tablebroadcastaddress").innerHTML = getEnds()[1];
	// Network ranges
	doc.getElementById("tablenetworkrange").innerHTML = datRangeYo();

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

	if (ipInput.split(".").length !== 4 || ipInput === "") {
		throwError();
	}
	for (var i = 0; i < 4; i++) {
		var iptoint = parseInt(ipInputArray[i], 10);
		if (iptoint != ipInputArray[i] || iptoint < 0 || iptoint > 255) {
			throwError();
		}
		ipInputArray[i] = iptoint;
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