function val() {
    var e = document.cidrform.submask.value,
        t = document.getElementById("write");
    if (e == "0.0.0.0") t.innerHTML = "/0";
    if (e == "128.0.0.0") t.innerHTML = "/1";
    if (e == "192.0.0.0") t.innerHTML = "/2";
    if (e == "224.0.0.0") t.innerHTML = "/3";
    if (e == "240.0.0.0") t.innerHTML = "/4";
    if (e == "248.0.0.0") t.innerHTML = "/5";
    if (e == "252.0.0.0") t.innerHTML = "/6";
    if (e == "254.0.0.0") t.innerHTML = "/7";
    if (e == "255.0.0.0") t.innerHTML = "/8";
    if (e == "255.128.0.0") t.innerHTML = "/9";
    if (e == "255.192.0.0") t.innerHTML = "/10";
    if (e == "255.224.0.0") t.innerHTML = "/11";
    if (e == "255.240.0.0") t.innerHTML = "/12";
    if (e == "255.248.0.0") t.innerHTML = "/13";
    if (e == "255.252.0.0") t.innerHTML = "/14";
    if (e == "255.254.0.0") t.innerHTML = "/15";
    if (e == "255.255.0.0") t.innerHTML = "/16";
    if (e == "255.255.128.0") t.innerHTML = "/17";
    if (e == "255.255.192.0") t.innerHTML = "/18";
    if (e == "255.255.224.0") t.innerHTML = "/19";
    if (e == "255.255.240.0") t.innerHTML = "/20";
    if (e == "255.255.248.0") t.innerHTML = "/21";
    if (e == "255.255.252.0") t.innerHTML = "/22";
    if (e == "255.255.254.0") t.innerHTML = "/23";
    if (e == "255.255.255.0") t.innerHTML = "/24";
    if (e == "255.255.255.128") t.innerHTML = "/25";
    if (e == "255.255.255.192") t.innerHTML = "/26";
    if (e == "255.255.255.224") t.innerHTML = "/27";
    if (e == "255.255.255.240") t.innerHTML = "/28";
    if (e == "255.255.255.248") t.innerHTML = "/29";
    if (e == "255.255.255.252") t.innerHTML = "/30";
    if (e == "255.255.255.254") t.innerHTML = "/31";
    if (e == "255.255.255.255") t.innerHTML = "/32"
}