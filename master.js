/*function val() {
// Array variables

var array = ["0.0.0.0:0", "128.0.0.0:1", "192.0.0.0:2", "224.0.0.0:3", "240.0.0.0:4", "248.0.0.0:5", "252.0.0.0:6", "254.0.0.0:7", "255.0.0.0:8", "255.128.0.0:9", "255.192.0.0:10", "255.224.0.0:11", "255.240.0.0:12", "255.248.0.0:13", "255.252.0.0:14", "255.254.0.0:15", "255.255.0.0:16", "255.255.128.0:17", "255.255.192.0:18", "255.255.224.0:19", "255.255.240.0:20", "255.255.248.0:21", "255.255.252.0:22", "255.255.254.0:23", "255.255.255.0:24", "255.255.255.128:25", "255.255.255.192:26", "255.255.255.224:27", "255.255.255.240:28", "255.255.255.248:29", "255.255.255.252:30", "255.255.255.254:31", "255.255.255.255:32"];

//var submask = ["0.0.0.0", "128.0.0.0", "192.0.0.0", "224.0.0.0", "240.0.0.0", "248.0.0.0", "252.0.0.0", "254.0.0.0", "255.0.0.0", "255.128.0.0", "255.192.0.0", "255.224.0.0", "255.240.0.0", "255.248.0.0", "255.252.0.0", "255.254.0.0", "255.255.0.0", "255.255.128.0", "255.255.192.0", "255.255.224.0", "255.255.240.0", "255.255.248.0", "255.255.252.0", "255.255.254.0", "255.255.255.0", "255.255.255.128", "255.255.255.192", "255.255.255.224", "255.255.255.240", "255.255.255.248", "255.255.255.252", "255.255.255.254", "255.255.255.255"],
    //cidr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 31];

// User input variables
var submaskInput = document.form.submask.value,
	ipInput = document.form.ip.value.split(".");

function getPair(arr, search) {
    var rtn = arr.filter(function (v, i) {
        return new RegExp("\\b" + search + "\\b").test(v);
    })[0];
    return rtn ? rtn.split(':') : -1;
}

var submaskArray = getPair(array, submaskInput),
	submask = submaskArray[0];
	cidr = submaskArray[1],
	submaskSplit = submask.split(".");

function getPosition() {
	for (var i = 0; i < submaskSplit.length; i++) {
		if (submaskSplit[i] !== "255") {
			var position = submaskSplit[i];
			//alert(position);
			//alert(submaskSplit.indexOf(position));
			index = submaskSplit.indexOf(position);
		break;
		return index;
		}
	}
}
getPosition();

function getNetworkRange(cider) {
	if (cider % 8 !== 0) {
		var init = (Math.pow(2, (8 - (cider % 8)))),
			network = ((Math.floor(ipInput[index] / init)) * init);
		var broadcast = (network + (init - 1)),
			networkbroadcast = [network, broadcast];
		return networkbroadcast
	} 
	else {
		var init = 128,
			network = ((Math.floor(ipInput[index] / init)) * init);
		var broadcast = "255",
			networkbroadcast = [network, broadcast];
		return networkbroadcast;
	}
}

function placeRangeCorrectly(network, broadcast) {
	if (index === 0) {
		var networkString = network + ".0.0.0",
			broadcastString = broadcast + ".255.255.255",
			position = null;
			theBigString = [networkString, broadcastString];
		return theBigString;
	}
	if (index === 1) {
		var networkString = ipInput[0] + "." + network + ".0.0",
			broadcastString = ipInput[0] + "." + broadcast + ".255.255",
			position = null;
			theBigString = [networkString, broadcastString];
		return theBigString;
	}
	if (index === 2) {
		var networkString = ipInput[0] + "." + ipInput[1] + "." + network + ".0",
			broadcastString = ipInput[0] + "." + ipInput[1] + "." + broadcast + ".255",
			position = null;
			theBigString = [networkString, broadcastString];
		return theBigString;
	}
	if (index === 3) {
		var networkString = ipInput[0] + "." + ipInput[1] + "." + ipInput[2] + "." + network,
			broadcastString = ipInput[0] + "." + ipInput[1] + "." + ipInput[2] + "." + broadcast,
			position = null;
			theBigString = [networkString, broadcastString];
		return theBigString;
	}
}


// input backwards because I'm weird
function calculateSubnets(tupni) {
	if (index === 0) {return (Math.floor(Math.pow(2, tupni))) + " subnets"}
	if (index === 1) {return (Math.floor(Math.pow(2, (tupni - 8)))) + " subnets"}
	if (index === 2) {return (Math.floor(Math.pow(2, (tupni - 16)))) + " subnets"}
	if (index === 3) {return (Math.floor(Math.pow(2, (tupni - 24)))) + " subnets"}
}


function findClass(ip) {
	if (!ip) return "No IP Entered";
	if ((ip >= 0) && (ip < 128)) return "Class A";
    if ((ip >= 128) && (ip < 192)) return "Class B";
    if ((ip >= 192) && (ip < 224)) return "Class C";
    if ((ip >= 224) && (ip < 240)) return "Class D";
    if ((ip >= 240) && (ip < 256)) return "Class E";
}

function getWildcard(suomi) {
	var wildcardInit = [(255 - submaskSplit[0]), (255 - submaskSplit[1]), (255 - submaskSplit[2]), (255 - submaskSplit[3])];
	wildcardArray = wildcardInit.join(".");
	return wildcardArray;
}

// hv = host value aka cidr #
function calculateHosts(hv) {
	hv = hv || 0; // default it to zero
	if (hv >= 2) {
		hv = (Math.pow(2, (32 - hv)) - 2);
	}
	return hv;
}

// TO DO:
/*function reverseHosts(rhv) {
	hv = hv || 0;
	if (hv <= 65534) {
		hv = (Math.pow(n, ((32 - hv)/hv)) -2)
	}
}*//*

// Output variables
var hostsOutput = calculateHosts(cidr),
	subnetsOutput = calculateSubnets(cidr);
var classOutput = findClass(ipInput[0]);

// More Output variables
var netInit = getNetworkRange(parseInt(cidr, 10));
var netBeta = placeRangeCorrectly(netInit[0], netInit[1]),
	netFinal = netBeta[0];
var bcastIdOutput = netBeta[1];
var wildcardOutput = getWildcard(submask);

function datRangeYo() {
	var splitDatUno = theBigString[0].split("."),
		splitDatDos = theBigString[1].split(".");
	var iDontKnowSpanish = (parseInt(splitDatUno[3], 10) + 1),
		pardonTheHorribleVariableNames = (parseInt(splitDatDos[3], 10) - 1);
	joinThemStringz = splitDatUno[0] + "." + splitDatUno[1] + "." + splitDatUno[2] + "." + iDontKnowSpanish + " - " + splitDatDos[0] + "." + splitDatDos[1] + "." + splitDatDos[2] + "." + pardonTheHorribleVariableNames;
	return joinThemStringz

}
datRangeYo();

/*document.form.cidrop.innerHTML = cidr;
document.form.submaskop.innerHTML = submask;
document.form.classop.innerHTML = classOutput;
document.form.hostsop.innerHTML = hostsOutput + " hosts "+ "(" + (hostsOutput - 2) + " usable)";
document.form.netidop.innerHTML = netFinal;
document.form.bcastidop.innerHTML = bcastIdOutput;
document.form.subnetsop.innerHTML = subnetsOutput;
document.form.wildcardop.innerHTML = wildcardOutput;
document.form.datrangeyo.innerHTML = datRangeYo();*//*

document.getElementById("tablecidr").innerHTML = cidr;
document.getElementById("tablesubmask").innerHTML = submask;
document.getElementById("tableipclass").innerHTML = classOutput;
document.getElementById("tablenumhosts").innerHTML = hostsOutput + " hosts "+ "(" + (hostsOutput - 2) + " usable)";
document.getElementById("tablenetworkid").innerHTML = netFinal;
document.getElementById("tablebroadcastaddress").innerHTML = bcastIdOutput;
document.getElementById("tablenumsubnets").innerHTML = subnetsOutput;
document.getElementById("tablewildcardmask").innerHTML = wildcardOutput;
document.getElementById("tablenetworkrange").innerHTML = datRangeYo();

var netrange = datRangeYo();

document.getElementById("hidden").innerHTML = "cidr number: " + cidr + " submask: " + submask + " class: " + classOutput + " hosts: " + hostsOutput + " usable hosts: " + (hostsOutput - 2) + " network id " + netFinal + " broadcast address: " + bcastIdOutput + " subnets: " + subnetsOutput + " wildcard: " + wildcardOutput + " network range: " + netrange;


// Automagically runs at end to do stuff
function addPunctuation() {
	var add_slash = document.getElementById("tablecidr"),
		hosts_commas = document.getElementById("tablenumhosts");

		add_slash.innerHTML = "/" + add_slash.innerHTML;
		hosts_commas.innerHTML = hosts_commas.innerHTML.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
addPunctuation();

}

function downloadInnerHtml() {
    var elHtml = document.getElementById("hidden").innerHTML;
    var link = document.createElement('a');
    mimeType = 'text/plain';

    link.setAttribute('download', "subnetting.txt");
    link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
    link.click(); 
}*/