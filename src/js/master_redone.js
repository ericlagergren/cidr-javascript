/* COPYRIGHT 2014 ERIC LAGERGREN  LICENSED UNDER THE MIT LICENSE */
/* LICENSE CAN BE FOUND http://opensource.org/licenses/MIT OR subnetting.ericlagergren.com/license.txt */

function val() {
    var array = ["0.0.0.0:0", "128.0.0.0:1", "192.0.0.0:2", "224.0.0.0:3", "240.0.0.0:4", "248.0.0.0:5", "252.0.0.0:6", "254.0.0.0:7", "255.0.0.0:8", "255.128.0.0:9", "255.192.0.0:10", "255.224.0.0:11", "255.240.0.0:12", "255.248.0.0:13", "255.252.0.0:14", "255.254.0.0:15", "255.255.0.0:16", "255.255.128.0:17", "255.255.192.0:18", "255.255.224.0:19", "255.255.240.0:20", "255.255.248.0:21", "255.255.252.0:22", "255.255.254.0:23", "255.255.255.0:24", "255.255.255.128:25", "255.255.255.192:26", "255.255.255.224:27", "255.255.255.240:28", "255.255.255.248:29", "255.255.255.252:30", "255.255.255.254:31", "255.255.255.255:32"],
        submaskInput = document.form.submask.value,
        ipInput = document.form.ip.value.split("."),
        hostInput = document.form.numhost.value,
        submaskArray, submask, cidr, submaskSplit, index, theBigString, hostsOutput, subnetsOutput, classOutput, netInit, netBeta, netFinal, bcastIdOutput, wildcardOutput, tablecidr, tablenumhosts, netrange;

    function getPair(arr, search) {
        var rtn = arr.filter(function(v, i) {
            return new RegExp("\\b" + search + "\\b").test(v)
        })[0];
        return rtn ? rtn.split(":") : -1
    }
    submaskArray = getPair(array, submaskInput);
    submask = submaskArray[0];
    cidr = submaskArray[1];
    submaskSplit = submask.split(".");
    for (var i = 0; i < submaskSplit.length; i++) {
        if (submaskSplit[i] !== "255") {
            index = i;
            break
        }
    }

    function getNetworkRange(cider) {
        var init, network, broadcast, modResult = cider % 8;
        if (modResult) {
            init = (Math.pow(2, (8 - modResult)));
            network = ((Math.floor(ipInput[index] / init)) * init);
            broadcast = (network + (init - 1))
        } else if (cider === 32 || cider === 31) {
            network = "N/A";
            broadcast = "N/A";
        } else {
            init = 128;
            network = ((Math.floor(ipInput[index] / init)) * init);
            broadcast = "255"
        }
        return [network, broadcast]
    }

    function placeRangeCorrectly(network, broadcast) {
        var networkString, broadcastString, networkStringInitial = "",
            broadcastStringInitial = "";
        for (var i = 0; i < index; i++) {
            networkStringInitial += ipInput[i] + ".";
            broadcastStringInitial += ipInput[i] + "."
        }
        networkString = networkStringInitial + network;
        broadcastString = broadcastStringInitial + broadcast;
        if (index === 0) {
            networkString += ".0.0.0";
            broadcastString += ".255.255.255"
        }
        if (index === 1) {
            networkString += ".0.0";
            broadcastString += ".255.255"
        }
        if (index === 2) {
            networkString += ".0";
            broadcastString += ".255"
        }
        return theBigString = [networkString, broadcastString]
    }

    function calculateSubnets(input) {
        var valToSubtractFromInput = !index ? 0 : index < 3 ? Math.pow(2, index + 2) : 24;
        return~~ Math.pow(2, (input - valToSubtractFromInput)) + " subnets"
    }

    function findClass(ip) {
        if (!ip || ip < 0) {
            return "No IP Entered"
        }
        if (ip < 128) {
            return "Class A"
        }
        if (ip < 192) {
            return "Class B"
        }
        if (ip < 224) {
            return "Class C"
        }
        if (ip < 240) {
            return "Class D"
        }
        if (ip < 256) {
            return "Class E"
        }
    }

    function calculateHosts(hv) {
        hv = hv || 0;
        if (hv >= 2) {
            hv = (Math.pow(2, (32 - hv)) - 2)
        }
        return hv
    }

    function submaskFromHosts(numhosts) {
        if (numhosts !== 0) {
            var numhosts = (32 - (Math.ceil((Math.log(numhosts - 2))/(Math.log(2)))));
        }
        return numhosts;
    }

    hostsOutput = calculateHosts(cidr);
    subnetsOutput = calculateSubnets(cidr);
    classOutput = findClass(ipInput[0]);
    netInit = getNetworkRange(parseInt(cidr, 10));
    netBeta = placeRangeCorrectly(netInit[0], netInit[1]);
    netFinal = netBeta[0];
    bcastIdOutput = netBeta[1];
    wildcardOutput = submaskSplit.map(function(v) {
        return 255 - v
    }).join(".");

    function datRangeYo() {
        var networkOctet = theBigString[0].split("."),
            broadcastOctet = theBigString[1].split("."),
            firstUsable = (parseInt(networkOctet[3], 10) + 1),
            lastUsable = (parseInt(broadcastOctet[3], 10) - 1),
            fullUsableRange = networkOctet.slice(0, -1).join(".") + "." + firstUsable + " - " + broadcastOctet.slice(0, -1).join(".") + "." + lastUsable;
        return fullUsableRange
    }

    function onBits(bits) {
        var c = "1",
          d = "0";
        for (var i = ""; i.length < bits;) {
            i += c
        }
        for (var v = ""; v.length < (32 - bits);) {
          v += d
        }
        return i + v
    }

    tablecidr = document.getElementById("tablecidr");
    tablecidr.innerHTML = cidr;
    tablenumhosts = document.getElementById("tablenumhosts");
    tablenumhosts.innerHTML = hostsOutput + " hosts " + "(" + (hostsOutput - 2) + " usable)";
    tablebinary = document.getElementById("tablebinary");
    tablebinary.innerHTML = onBits(cidr);
    document.getElementById("tablesubmask").innerHTML = submask;
    document.getElementById("tableipclass").innerHTML = classOutput;
    document.getElementById("tablenetworkid").innerHTML = netFinal;
    document.getElementById("tablebroadcastaddress").innerHTML = bcastIdOutput;
    document.getElementById("tablenumsubnets").innerHTML = subnetsOutput;
    document.getElementById("tablewildcardmask").innerHTML = wildcardOutput;
    document.getElementById("tablenetworkrange").innerHTML = datRangeYo();
    netrange = datRangeYo();
    document.getElementById("hidden").innerHTML = "cidr number: " + cidr + " submask: " + submask + " class: " + classOutput + " hosts: " + hostsOutput + " usable hosts: " + (hostsOutput - 2) + " network id " + netFinal + " broadcast address: " + bcastIdOutput + " subnets: " + subnetsOutput + " wildcard: " + wildcardOutput + " network range: " + netrange;
    cfh = submaskFromHosts(hostInput);
    smfh = getPair(array, cfh)[0];
    document.getElementById("tablesubmaskforhosts").innerHTML = cfh + " / " + smfh; 

    tablecidr.innerHTML = "/" + tablecidr.innerHTML;
    tablenumhosts.innerHTML = tablenumhosts.innerHTML.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    tablebinary.innerHTML = tablebinary.innerHTML.replace(/\B(?=(\d{8})+(?!\d))/g, ".")
}

function downloadInnerHtml() {
    var elHtml = document.getElementById("hidden").innerHTML,
        link = document.createElement("a"),
        mimeType = "text/plain";
    link.setAttribute("download", "subnetting.txt");
    link.setAttribute("href", "data:" + mimeType + ";charset=utf-8," + encodeURIComponent(elHtml));
    link.click()
}
window.onload = function() {
    document.getElementsByTagName("form")[0].onsubmit = function(evt) {
        evt.preventDefault();
        val()
    };
    document.getElementById("download").onclick = function(evt) {
        evt.preventDefault();
        downloadInnerHtml()
    }
};