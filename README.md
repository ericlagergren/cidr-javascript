<h1>Subnetting Calculator</h1>

<h2>What is it?</h2>
<p>A subnetting calculator. It will help you subnet networks with ease. It will take an input (either a submask, a CIDR notation, or a number of hosts, and an IP) and provide you with a wide range of outputs.</p>

<p>The calculator is available as a webapp for mobile phones. In particular, on iOS you can 'pin' it to your home menu and it'll function just like an app. It'll cache the source files
    <em>so you can use it offline</em>. It only takes ~50 kB of space, so it's incredibly small. It'll try to refresh the content via network connection every two times you open and close the app.</p>

<p>It'll work on nearly any browser except for old versions of IE (lte 8). I'd provide more support, but I'm assuming that anyone who would use this either 1) doesn't use IE lte 8, or 2) if they do, they can load it on a mobile device before they need to use it, as the calculator works offline.</p>

<h2 id="first">How do I use it?</h2>

It accepts four types of input: submask, CIDR prefix, hosts, and IP. There's the possible combinations:</p>

<ul style="list-style-type:disc">
    <li>Sumbask OR CIDR OR hosts</li>
    <li>Submask AND IP</li>
    <li>CIDR AND IP</li>
    <li>Hosts AND IP</li>
</ul>

<strong>Each input should follow this syntax:</strong>
<ul>
    <li>Submask:</li>
    <ul>
        <li>255.255.255.0</li>
    </ul>
    <li>CIDR:</li>
    <ul>
        <li>24</li>
    </ul>
    <li>Hosts:</li>
    <ul>
        <li>500</li>
    </ul>
    <li>IP:</li>
    <ul>
        <li>192.168.0.0</li>
    </ul>
</ul>

<p>The only punctuation needed is periods.</p>
<p>The calculator will reject invalid IPs like "192.256.00001.3" or "192.168.2.cat".</p>

<p>
    <strong>NOTE:</strong> If you wish to use calculate with hosts, but the number of hosts is <em>LESS</em> than 32, you'll need to check the "Use # of Hosts?" checkbox. The calculator will automatically assume that any value greater than 32 is a host value and less than and equal to 32 is CIDR. Therefore, in order to avoid the overlap I've put in the checkbox to make sure you get the correct results.
</p>

<h2>How do I use it on my website?</h2>
<p>It's simple: include the JavaScript file <a href="/src/js/master.js">"master.js"</a> on your website, and make sure you have the form/table HTML files <a href="/src/html/html.html">found here</a>.</p>

<h2>Can I use this on my own website? Or somewhere else?</h2>
<p>Yes, for the most part. The code is licensed under the Apache License, which you <a href="/license.txt">can find here</a>. For a tl;dr, you can refer to<a href="https://www.tldrlegal.com/l/apache2"> tldrlegal.com/l/apache2</a>
</p>

<h2>Any other inquiries</h2>
<p><a href="http://www.ericlagergren.com/contact">ericlagergren.com/contact</a>
</p>