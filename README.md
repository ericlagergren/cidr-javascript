<h1>Subnetting Calculator</h1>

<h2>What is it?</h2>
<p>A subnetting calculator. It will help you subnet networks with ease. It will take an input (either a submask, a CIDR notation, a number of hosts, and/or an IP) and provide you with a wide range of outputs.</p>

<p>The calculator is available as a webapp for mobile phones. In particular, on iOS you can 'pin' it to your home menu and it'll function just like an app. It'll cache the source files
    <em>so you can use it offline</em>. It only takes ~50 kB of space, so it's incredibly small. It'll try to refresh the content via network connection every two times you open and close the app.</p>

<p>It'll work on nearly any browser except for old versions of IE (lte 8). I'd provide more support, but I'm assuming that anyone who would use this either 1) doesn't use IE lte 8, or 2) if they do, they can load it on a mobile device before they need to use it, as the calculator works offline.</p>

<h2 id="first">How do I use it?</h2>

<p>It accepts four types of input: submask, CIDR prefix, hosts, and IP.</p>

<strong>Each input should follow this general syntax:</strong>
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
    <li>IPv4 Address:</li>
    <ul>
        <li>192.168.0.0</li>
    </ul>
</ul>

<p>The only punctuation needed is periods.</p>
<p>The calculator will reject invalid IPs like "192.256.999.3" or "192.168.2.cat".</p>
<p>Calculator currently doesn't support addresses like "192.168.1.1/24", but typing the "24", hitting TAB, and then typing "192.168.1.1" shouldn't be *too* hard, should it?</p>
<p>Hexidecimal numbers *should* work, but not octal (because 013 is converted to 13).</p>

<p>
    <strong>NOTE:</strong> If you wish to use calculate with hosts, but the number of hosts is <em>LESS</em> than 32, you'll need to check the "Use # of Hosts?" checkbox. The calculator will automatically assume that any value greater than 32 is a host value and less than and equal to 32 is CIDR. Therefore, in order to avoid the overlap I've put in the checkbox to make sure you get the correct results.
</p>

<h2>How do I use it on my website?</h2>
<p>It's simple: include the JavaScript file <a href="/src/js/master.js">"master.js"</a> on your website, and make sure you have the form/table HTML files <a href="/src/html/html.html">found here</a>.</p>

<h2>Can I use this on my own website? Or somewhere else?</h2>
<p>Yes. The code's previous GPLv3 has been removed and is now under CC BY-SA 4.0.
<br />
<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
</p>

<h2>Any other inquiries</h2>
<p><a href="http://www.ericlagergren.com/contact">ericlagergren.com/contact</a>
</p>