#jshint bitwise: false

#
#Copyright 2014 Eric Lagergren
#
#Licensed under the Apache License, Version 2.0 (the "License");
#you may not use this file except in compliance with the License.
#You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
#Unless required by applicable law or agreed to in writing, software
#distributed under the License is distributed on an "AS IS" BASIS,
#WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#See the License for the specific language governing permissions and
#limitations under the License.
#

# 
#
#I use object['property'] because if I don't, Google's Closure Compiler will 
#convert the non-ECMA properties (like 'standalone') into variables and break
#my app.
#
#

# THIS IS STUFF FOR MY STANDALONE APP 
# Just because. It keeps me from doing stupid things with my code

# Prevents same-domain links from being opened outside my standalone app 
# (e.g. Safari, Google Chrome)

# Tests useragent to see if the client using an iPad, iPhone, or iPod and 
# toggles the 'Download app' notice

# Per Apple, it swaps cache on page reload
updateSite = (event) ->
  window.applicationCache.swapCache()
  return

# THIS DOES THE ACTUAL COMPUTATIONS 
performCalculations = ->
  
  # Declare our variables. Doc = document prevents global lookup each time 
  # 'document' is referenced
  # see http://jonraasch.com/blog/10-javascript-performance-boosting-tips-from-nicholas-zakas
  
  # Declare constants*
  
  # Determine the type of input
  # less than or equal to = cidr
  
  # parseInt because if it's CIDR notation then we need to convert 
  # the string input to an int
  
  # if you can split the input ip into four parts it's a submask
  
  # greater than = host or checked checkbox
  
  # if base isn't valid then do nothing
  
  # Splits our inputs into arrays
  ipToInt = (ip) ->
    x = 0
    x += +ip[3] << 24 >>> 0
    x += +ip[2] << 16 >>> 0
    x += +ip[1] << 8 >>> 0
    x += +ip[0] >>> 0
    x
  intToIp = (integer) ->
    arr = [
      24
      16
      8
      0
    ]
    x = arr.map((n) ->
      integer >> n & 0xff
    ).reverse().join(".")
    x
  getCidrFromHost = (input) ->
    
    # as long as the number of hosts isn't 0, find (log2(hosts)), round 
    # up, and subtract that from MAX_BIT_VALUE to find the correct CIDR
    input = (MAX_BIT_VALUE - (Math.ceil((Math.log(input)) / (Math.log(2)))))  if 0 isnt input
    input
  getSubmask = (input) ->
    mask = ~0 << (MAX_BIT_VALUE - input)
    [
      mask >> 24 & MAX_BIT_BIN
      mask >> 16 & MAX_BIT_BIN
      mask >> 8 & MAX_BIT_BIN
      mask & MAX_BIT_BIN
    ].join "."
  getWildcard = (input) ->
    mask = ~(~0 << (MAX_BIT_VALUE - input))
    [
      mask >> 24 & MAX_BIT_BIN
      mask >> 16 & MAX_BIT_BIN
      mask >> 8 & MAX_BIT_BIN
      mask & MAX_BIT_BIN
    ].join "."
  getCidr = (input) ->
    arr = input.split(".")
    
    # Similar to:
    # arr = [192.168.0.1]
    # x =  192 << 8 | 168
    # x += 168 << 8 | x
    # x +=   0 << 8 | x
    # x +=   1 << 8 | x
    # return x
    x = arr.reduce((previousValue, currentValue, index, array) ->
      (previousValue << 8 | currentValue) >>> 0
    )
    
    # https://github.com/mikolalysenko/bit-twiddle/blob/master/twiddle.js#L63
    # https://github.com/mikolalysenko/bit-twiddle/blob/master/LICENSE
    x -= (x >>> 1) & 0x55555555
    x = (x & 0x33333333) + ((x >>> 2) & 0x33333333)
    ((x + (x >>> 4) & 0xf0f0f0f) * 0x1010101) >>> 24
  calculateHosts = (hv) ->
    hv = hv or 0 # zero out hv
    hv = (Math.pow(2, (MAX_BIT_VALUE - hv)))  if hv >= 2
    
    # 2^(total bits - on bits) = off bits
    hv
  
  #
  #
  #    The below function does this:
  #
  #        If there's no var index, which is the index of the first octect !== 
  #        "255", then the value we're subtracting from the input (CIDR) is 0. 
  #        If there IS, and it's less than 3, then we take 2, raise it to the 
  #        power of index + 2 and subtract that from the input. If both are false, 
  #        then the value is 24.
  #
  #        We return what is essentially (but not exactly) Math.floor (~~) of 
  #        2 to the power of the input mins the value we previously found. 
  #        That equals the amount of subnets.
  #
  #    
  calculateSubnets = (base) ->
    
    #var valToSubtractFromInput = !index ? 0 : index < 3 ? Math.pow(2, index + 2) : 24;
    #        return~~ Math.pow(2, (input - valToSubtractFromInput)) + " subnets";
    mod_base = base % 8
    (if mod_base then Math.pow(2, mod_base) else Math.pow(2, 8))
  onBits = (bits) ->
    one = "1"
    two = "0"
    i = ""
    v = ""
    i += one  while i.length < bits
    v += two  while v.length < (MAX_BIT_VALUE - bits)
    binarystring = i + v
    
    # .{8} means find 8 of any characters, and we repeat this 3 times 
    # because we need to insert 3 periods. See: http://regexr.com/3943q
    binarystring.replace /(.{8})(.{8})(.{8})/g, "$1.$2.$3."
  findClass = (ip) ->
    if 4 is ipInputArray.length
      return "No Valid IP Entered"  if not ip or ip < 0 or "undefined" is typeof ip
      return "Class A"  if ip < 128
      return "Class B"  if ip < 192
      return "Class C"  if ip < 224
      return "Class D"  if ip < 240
      "Class E"  if ip < 256
    else
      "No Valid IP Entered"
  networkAddress = (ip, sm) ->
    x = ip & sm
    intToIp x
  broadcastAddress = (ip, sm) ->
    x = ip | (~sm & THIRTY_TWO_BITS)
    intToIp x
  
  # Parse the ipInputArray's segments as integers, and then adding '00' 
  # padding (because JS is weird) and converting them to a base-16 string,
  # and then removing the prefixed '00's.
  
  # CIDR
  
  # Submask
  
  # Submask -> binary
  
  # # of hosts
  
  # # of subnets
  
  # Wildcard mask
  
  # IP class
  
  # IP -> hex
  
  # Network ID
  
  # Broadcast Address
  
  # Network ranges
  throwError = ->
    error = "No Valid IP Entered"
    doc = document
    
    # IP class
    doc.getElementById("tableipclass").innerHTML = error
    
    # IP -> hex
    doc.getElementById("tableiptohex").innerHTML = error
    
    # Network ID
    doc.getElementById("tablenetworkid").innerHTML = error
    
    # Broadcast Address
    doc.getElementById("tablebroadcastaddress").innerHTML = error
    
    # Network ranges
    doc.getElementById("tablenetworkrange").innerHTML = error
    return
  doc = document
  submaskInput = doc.form["submask"].value
  ipInput = doc.form["ip"].value
  submask = undefined
  base = undefined
  index = undefined
  theBigString = undefined
  netFinal = undefined
  netInit = undefined
  THIRTY_TWO_BITS = 4294967295
  MAX_BIT_VALUE = 32
  MAX_BIT_BIN = 255
  if submaskInput <= MAX_BIT_VALUE
    base = submaskInput
    submask = getSubmask(parseInt(submaskInput, 10))
  if 4 is submaskInput.split(".").length
    base = getCidr(submaskInput)
    submask = submaskInput
  if doc.form["cb"].checked or submaskInput > MAX_BIT_VALUE
    base = getCidrFromHost(submaskInput)
    submask = getSubmask(base)
  return null  if "undefined" is base or isNaN(base) or null is base
  ipInputArray = ipInput.split(".")
  submaskInputArray = submask.split(".")
  hexIp = ipInputArray.map((x) ->
    x = +x
    ("00" + x.toString(16)).substr -2
  ).join("")
  wildcard = getWildcard(base)
  hosts = calculateHosts(base)
  usable_hosts = (if (hosts - 2) > 0 then (hosts - 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") else 0)
  networkAddr = networkAddress(ipToInt(ipInputArray), ipToInt(submaskInputArray))
  broadcastAddr = broadcastAddress(ipToInt(ipInputArray), ipToInt(submaskInputArray))
  naa = networkAddr.split(".")
  baa = broadcastAddr.split(".")
  naa[3] = +naa[3] + 1
  baa[3] = +baa[3] - 1
  usable_range = naa.join(".") + " - " + baa.join(".")
  doc.getElementById("tablecidr").innerHTML = base
  doc.getElementById("tablesubmask").innerHTML = submask
  doc.getElementById("tablebinary").innerHTML = onBits(base)
  doc.getElementById("tablenumhosts").innerHTML = hosts.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " (" + usable_hosts + " usable)"
  doc.getElementById("tablenumsubnets").innerHTML = calculateSubnets(base)
  doc.getElementById("tablewildcardmask").innerHTML = wildcard
  doc.getElementById("tableipclass").innerHTML = findClass(ipInputArray[0])
  doc.getElementById("tableiptohex").innerHTML = "0x" + hexIp.toUpperCase()
  doc.getElementById("tablenetworkid").innerHTML = networkAddr
  doc.getElementById("tablebroadcastaddress").innerHTML = broadcastAddr
  doc.getElementById("tablenetworkrange").innerHTML = usable_range
  throwError()  if 4 isnt ipInput.split(".").length or "" is ipInput
  j = 0

  while j < 4
    iptoint = parseInt(ipInputArray[j], 10)
    throwError()  if iptoint isnt ipInputArray[j] or iptoint < 0 or iptoint > MAX_BIT_BIN
    ipInputArray[j] = iptoint
    j++
  return
"use strict"
if window.navigator["standalone"]
  noddy = undefined
  remotes = false
  doc = document
  doc.addEventListener "click", ((event) ->
    noddy = event.target
    noddy = noddy.parentNode  while noddy.nodeName isnt "A" and noddy.nodeName isnt "HTML"
    if noddy.href.indexOf("http") isnt -1 and (noddy.href.indexOf(doc.location.host) isnt -1 or remotes)
      event.preventDefault()
      doc.location.href = noddy.href
    return
  ), false
iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
doc = document
if not iOS or window.navigator["standalone"]
  doc.getElementById("iphoneinstall").classList.toggle "hidden"
else
  doc.getElementsByTagName("body")[0].setAttribute "style", "margin-top:40px;"
  doc.getElementsByTagName("body")[0].classList.toggle "no-touch"
window.applicationCache.addEventListener "updateready", updateSite, false
window.onload = ->
  document.getElementsByTagName("form")[0].onsubmit = (evt) ->
    evt.preventDefault()
    performCalculations()
    window.scrollTo 0, document.body.scrollHeight
    return

  document.onkeypress = keypressed = (e) ->
    keyCode = (if (window.event) then e.which else e.keyCode)
    document.forms["form"].submit()  if performCalculations()  if keyCode is 13
    return

  return