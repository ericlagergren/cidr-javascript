function val() {
    (function() {
        var b = document.getElementsByClassName("ugh");
        for (var a in b) {
            if (b.hasOwnProperty(a)) {
                b[a].className = "meow"
            }
        }
    }());
    (function() {
        var c = document.cidrform.cidr.value,
            a = document.getElementById("ij"),
            b = document.getElementById("sm");
        if (c === "/0" || c == 0) {
            a.innerHTML = "0.0.0.0";
            b.innerHTML = 0
        }
        if (c === "/1" || c == 1) {
            a.innerHTML = "128.0.0.0";
            b.innerHTML = 1
        }
        if (c === "/2" || c == 2) {
            a.innerHTML = "192.0.0.0";
            b.innerHTML = 2
        }
        if (c === "/3" || c == 3) {
            a.innerHTML = "224.0.0.0";
            b.innerHTML = 3
        }
        if (c === "/4" || c == 4) {
            a.innerHTML = "240.0.0.0";
            b.innerHTML = 4
        }
        if (c === "/5" || c == 5) {
            a.innerHTML = "248.0.0.0";
            b.innerHTML = 5
        }
        if (c === "/6" || c == 6) {
            a.innerHTML = "252.0.0.0";
            b.innerHTML = 8
        }
        if (c === "/7" || c == 7) {
            a.innerHTML = "254.0.0.0";
            b.innerHTML = 7
        }
        if (c === "/8" || c == 8) {
            a.innerHTML = "255.0.0.0";
            b.innerHTML = 8
        }
        if (c === "/9" || c == 9) {
            a.innerHTML = "255.128.0.0";
            b.innerHTML = 9
        }
        if (c === "/10" || c == 10) {
            a.innerHTML = "255.192.0.0";
            b.innerHTML = 10
        }
        if (c === "/11" || c == 11) {
            a.innerHTML = "255.224.0.0";
            b.innerHTML = 11
        }
        if (c === "/12" || c == 12) {
            a.innerHTML = "255.240.0.0";
            b.innerHTML = 12
        }
        if (c === "/13" || c == 13) {
            a.innerHTML = "255.248.0.0";
            b.innerHTML = 13
        }
        if (c === "/14" || c == 14) {
            a.innerHTML = "255.252.0.0";
            b.innerHTML = 14
        }
        if (c === "/15" || c == 15) {
            a.innerHTML = "255.254.0.0";
            b.innerHTML = 15
        }
        if (c === "/16" || c == 16) {
            a.innerHTML = "255.255.0.0";
            b.innerHTML = 16
        }
        if (c === "/17" || c == 17) {
            a.innerHTML = "255.255.128.0";
            b.innerHTML = 17
        }
        if (c === "/18" || c == 18) {
            a.innerHTML = "255.255.192.0";
            b.innerHTML = 18
        }
        if (c === "/19" || c == 19) {
            a.innerHTML = "255.255.224.0";
            b.innerHTML = 19
        }
        if (c === "/20" || c == 20) {
            a.innerHTML = "255.255.240.0";
            b.innerHTML = 20
        }
        if (c === "/21" || c == 21) {
            a.innerHTML = "255.255.248.0";
            b.innerHTML = 21
        }
        if (c === "/22" || c == 22) {
            a.innerHTML = "255.255.252.0";
            b.innerHTML = 22
        }
        if (c === "/23" || c == 23) {
            a.innerHTML = "255.255.254.0";
            b.innerHTML = 23
        }
        if (c === "/24" || c == 24) {
            a.innerHTML = "255.255.255.0";
            b.innerHTML = 24
        }
        if (c === "/25" || c == 25) {
            a.innerHTML = "255.255.255.128";
            b.innerHTML = 25
        }
        if (c === "/26" || c == 26) {
            a.innerHTML = "255.255.255.192";
            b.innerHTML = 26
        }
        if (c === "/27" || c == 27) {
            a.innerHTML = "255.255.255.224";
            b.innerHTML = 27
        }
        if (c === "/28" || c == 28) {
            a.innerHTML = "255.255.255.240";
            b.innerHTML = 28
        }
        if (c === "/29" || c == 29) {
            a.innerHTML = "255.255.255.248";
            b.innerHTML = 29
        }
        if (c === "/30" || c == 30) {
            a.innerHTML = "255.255.255.252";
            b.innerHTML = 30
        }
        if (c === "/31" || c == 31) {
            a.innerHTML = "255.255.255.254";
            b.innerHTML = 31
        }
        if (c === "/32" || c == 32) {
            a.innerHTML = "255.255.255.255";
            b.innerHTML = 32
        }
    }());
    (function() {
        var c = document.cidrform.submask.value,
            b = document.getElementById("sm"),
            a = document.getElementById("ij");
        if (c == "0.0.0.0") {
            b.innerHTML = 0;
            a.innerHTML = c
        }
        if (c == "128.0.0.0") {
            b.innerHTML = 1;
            a.innerHTML = c
        }
        if (c == "192.0.0.0") {
            b.innerHTML = 2;
            a.innerHTML = c
        }
        if (c == "224.0.0.0") {
            b.innerHTML = 3;
            a.innerHTML = c
        }
        if (c == "240.0.0.0") {
            b.innerHTML = 4;
            a.innerHTML = c
        }
        if (c == "248.0.0.0") {
            b.innerHTML = 5;
            a.innerHTML = c
        }
        if (c == "252.0.0.0") {
            b.innerHTML = 8;
            a.innerHTML = c
        }
        if (c == "254.0.0.0") {
            b.innerHTML = 7;
            a.innerHTML = c
        }
        if (c == "255.0.0.0") {
            b.innerHTML = 8;
            a.innerHTML = c
        }
        if (c == "255.128.0.0") {
            b.innerHTML = 9;
            a.innerHTML = c
        }
        if (c == "255.192.0.0") {
            b.innerHTML = 10;
            a.innerHTML = c
        }
        if (c == "255.224.0.0") {
            b.innerHTML = 11;
            a.innerHTML = c
        }
        if (c == "255.240.0.0") {
            b.innerHTML = 12;
            a.innerHTML = c
        }
        if (c == "255.248.0.0") {
            b.innerHTML = 13;
            a.innerHTML = c
        }
        if (c == "255.252.0.0") {
            b.innerHTML = 14;
            a.innerHTML = c
        }
        if (c == "255.254.0.0") {
            b.innerHTML = 15;
            a.innerHTML = c
        }
        if (c == "255.255.0.0") {
            b.innerHTML = 16;
            a.innerHTML = c
        }
        if (c == "255.255.128.0") {
            b.innerHTML = 17;
            a.innerHTML = c
        }
        if (c == "255.255.192.0") {
            b.innerHTML = 18;
            a.innerHTML = c
        }
        if (c == "255.255.224.0") {
            b.innerHTML = 19;
            a.innerHTML = c
        }
        if (c == "255.255.240.0") {
            b.innerHTML = 20;
            a.innerHTML = c
        }
        if (c == "255.255.248.0") {
            b.innerHTML = 21;
            a.innerHTML = c
        }
        if (c == "255.255.252.0") {
            b.innerHTML = 22;
            a.innerHTML = c
        }
        if (c == "255.255.254.0") {
            b.innerHTML = 23;
            a.innerHTML = c
        }
        if (c == "255.255.255.0") {
            b.innerHTML = 24;
            a.innerHTML = c
        }
        if (c == "255.255.255.128") {
            b.innerHTML = 25;
            a.innerHTML = c
        }
        if (c == "255.255.255.192") {
            b.innerHTML = 26;
            a.innerHTML = c
        }
        if (c == "255.255.255.224") {
            b.innerHTML = 27;
            a.innerHTML = c
        }
        if (c == "255.255.255.240") {
            b.innerHTML = 28;
            a.innerHTML = c
        }
        if (c == "255.255.255.248") {
            b.innerHTML = 29;
            a.innerHTML = c
        }
        if (c == "255.255.255.252") {
            b.innerHTML = 30;
            a.innerHTML = c
        }
        if (c == "255.255.255.254") {
            b.innerHTML = 31;
            a.innerHTML = c
        }
        if (c == "255.255.255.255") {
            b.innerHTML = 32;
            a.innerHTML = c
        }
    }());
    (function() {
        var c = document.getElementById("sm").innerHTML,
            a = document.getElementById("ah"),
            b = " hosts";
        (c >= 2) ? a.innerHTML = (Math.pow(2, (32 - c)) - 2) + b : a.innerHTML = 0 + b
    }());
    (function() {
        var b = document.cidrform.ip.value.split("."),
            b = parseInt(b[0]),
            a = document.getElementById("ab");
        if ((b >= 0) && (b < 128)) {
            a.innerHTML = "Class A"
        }
        if ((b >= 128) && (b < 192)) {
            a.innerHTML = "Class B"
        }
        if ((b >= 192) && (b < 224)) {
            a.innerHTML = "Class C"
        }
        if ((b >= 224) && (b < 240)) {
            a.innerHTML = "Class D"
        }
        if ((b >= 240) && (b < 256)) {
            a.innerHTML = "Class E"
        }
    }());
    (function() {
        var h = document.cidrform.ip.value,
            q = document.getElementById("cd"),
            B = document.getElementById("ef"),
            z = document.getElementById("gh"),
            r = document.getElementById("sm").innerHTML,
            n = document.getElementById("ij").innerHTML;
        var a = h.split("."),
            t = n.split("."),
            j = a[0],
            y = a[1],
            d = a[2],
            f = a[3],
            C = t[0],
            D = t[1],
            o = t[2],
            b = t[3];
        for (var A = 0; A < t.length; A++) {
            if (t[A] != "255") {
                var m = t[A];
                break
            }
        }
        if (m == t[0]) {
            if (r % 8 == 0) {
                var F = 128,
                    x = (Math.floor(a[0] / F)),
                    e = x * F,
                    l = F - 1,
                    c = e + l;
                q.innerHTML = e + "0.0.0";
                B.innerHTML = c + "255.255.255";
                z.innerHTML = (Math.floor(Math.pow(2, r))) + " subnets"
            }
            if (r % 8 !== 0) {
                var v = r % 8,
                    E = 8 - v,
                    F = (Math.pow(2, E)),
                    l = F - 1,
                    x = (Math.floor(a[0] / F)),
                    e = x * F,
                    c = e + l;
                q.innerHTML = e + "." + a[1] + "." + a[2] + "." + a[3];
                B.innerHTML = c + "." + a[1] + "." + a[2] + "." + a[3];
                z.innerHTML = (Math.floor(Math.pow(2, r))) + " subnets"
            }
            var m = null
        }
        if (m == t[1]) {
            if (r % 8 == 0) {
                var F = 128,
                    x = (Math.floor(a[1] / F)),
                    e = x * F,
                    l = F - 1,
                    c = e + l;
                q.innerHTML = a[0] + "." + e + ".0.0";
                B.innerHTML = a[0] + "." + c + ".255.255";
                z.innerHTML = (Math.floor(Math.pow(2, (r - 8)))) + " subnets"
            }
            if (r % 8 !== 0) {
                var v = r % 8,
                    E = 8 - v,
                    F = (Math.pow(2, E)),
                    l = F - 1,
                    x = (Math.floor(a[1] / F)),
                    e = x * F,
                    c = e + l;
                q.innerHTML = a[0] + "." + e + "." + a[2] + "." + a[3];
                B.innerHTML = a[0] + "." + c + "." + a[2] + "." + a[3];
                z.innerHTML = (Math.floor(Math.pow(2, (r - 8)))) + " subnets"
            }
            var m = null
        }
        if (m == t[2]) {
            if (r % 8 == 0) {
                var F = 128,
                    x = (Math.floor(a[2] / F)),
                    e = x * F,
                    l = F - 1,
                    c = e + l;
                q.innerHTML = a[0] + "." + a[1] + e + ".0";
                B.innerHTML = a[0] + "." + a[1] + c + ".255";
                z.innerHTML = (Math.floor(Math.pow(2, (r - 16)))) + " subnets"
            }
            if (r % 8 !== 0) {
                var v = r % 8,
                    E = 8 - v,
                    F = (Math.pow(2, E)),
                    l = F - 1,
                    x = (Math.floor(a[2] / F)),
                    e = x * F,
                    c = e + l;
                q.innerHTML = a[0] + "." + a[1] + "." + e + ".0";
                B.innerHTML = a[0] + "." + a[1] + "." + c + ".255";
                z.innerHTML = (Math.floor(Math.pow(2, (r - 16)))) + " subnets"
            }
            var m = null
        }
        if (m == t[3]) {
            if (r % 8 == 0) {
                var F = 128,
                    x = (Math.floor(a[3] / F)),
                    e = x * F,
                    l = F - 1,
                    c = e + l;
                q.innerHTML = a[0] + "." + a[1] + a[2] + ".0";
                B.innerHTML = a[0] + "." + a[1] + a[2] + ".255";
                z.innerHTML = (Math.floor(Math.pow(2, (r - 24)))) + " subnets"
            }
            if (r % 8 !== 0) {
                var v = r % 8,
                    E = 8 - v,
                    F = (Math.pow(2, E)),
                    l = F - 1,
                    x = (Math.floor(a[3] / F)),
                    e = x * F,
                    c = e + l;
                q.innerHTML = a[0] + "." + a[1] + "." + a[2] + "." + e;
                B.innerHTML = a[0] + "." + a[1] + "." + a[2] + "." + c;
                z.innerHTML = (Math.floor(Math.pow(2, (r - 24)))) + " subnets"
            }
            var m = null
        }
    }());
    (function() {
        var a = document.getElementById("gh");
        if (a.innerHTML == "0 subnets") {
            a.innerHTML = "1 subnets"
        }
    }());
    (function() {
        var a = document.getElementById("sm");
        document.getElementById("sm").innerHTML = "/" + a.innerHTML
    }())
};