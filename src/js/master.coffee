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
  
  # Determine the type of input
  # less than or equal to = cidr
  
  # parseInt because if it's CIDR notation then we need to convert 
  # the string input to an int
  
  # if you can split the input ip into four parts it's a submask
  
  # greater than = host or checked checkbox
  
  # if base isn't valid then do nothing
  
  # Splits our inputs into arrays
  getCidrFromHost = (input) ->
    
    # as long as the number of hosts isn't 0, find (log2(hosts)), round 
    # up, and subtract that from MAX_BIT_VALUE to find the correct CIDR
    input = (MAX_BIT_VALUE - (Math.ceil((Math.log(input)) / (Math.log(2)))))  if input isnt 0
    input
  
  # TO-DO: SEE IF THIS AND ITS SIBLING FUNCTION WILL PERFORM FASTER AS LOOPS 
  
  # check out yoda conditions as well 
  getSubmask = (input) ->
    return "0.0.0.0"  if input is 0
    return "128.0.0.0"  if input is 1
    return "192.0.0.0"  if input is 2
    return "224.0.0.0"  if input is 3
    return "240.0.0.0"  if input is 4
    return "248.0.0.0"  if input is 5
    return "252.0.0.0"  if input is 6
    return "254.0.0.0"  if input is 7
    return "255.0.0.0"  if input is 8
    return "255.128.0.0"  if input is 9
    return "255.192.0.0"  if input is 10
    return "255.224.0.0"  if input is 11
    return "255.240.0.0"  if input is 12
    return "255.248.0.0"  if input is 13
    return "255.252.0.0"  if input is 14
    return "255.254.0.0"  if input is 15
    return "255.255.0.0"  if input is 16
    return "255.255.128.0"  if input is 17
    return "255.255.192.0"  if input is 18
    return "255.255.224.0"  if input is 19
    return "255.255.240.0"  if input is 20
    return "255.255.248.0"  if input is 21
    return "255.255.252.0"  if input is 22
    return "255.255.254.0"  if input is 23
    return "255.255.255.0"  if input is 24
    return "255.255.255.128"  if input is 25
    return "255.255.255.192"  if input is 26
    return "255.255.255.224"  if input is 27
    return "255.255.255.240"  if input is 28
    return "255.255.255.248"  if input is 29
    return "255.255.255.252"  if input is 30
    return "255.255.255.254"  if input is 31
    "255.255.255.255"  if input is MAX_BIT_VALUE
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
    x = x - ((x >>> 1) & 0x55555555)
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
  calculateSubnets = (input) ->
    valToSubtractFromInput = (if not index then 0 else (if index < 3 then Math.pow(2, index + 2) else 24))
    ~~Math.pow(2, (input - valToSubtractFromInput)) + " subnets"
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
    if ipInputArray.length is 4
      return "No Valid IP Entered"  if not ip or ip < 0 or typeof ip is "undefined"
      return "Class A"  if ip < 128
      return "Class B"  if ip < 192
      return "Class C"  if ip < 224
      return "Class D"  if ip < 240
      "Class E"  if ip < 256
    else
      "No Valid IP Entered"
  
  # finds the first octet not equal to 255
  getNetworkRange = (cider) ->
    init = undefined
    network = undefined
    broadcast = undefined
    modResult = cider % 8
    if modResult
      init = (Math.pow(2, (8 - modResult)))
      network = ((Math.floor(ipInputArray[index] / init)) * init)
      broadcast = (network + (init - 1))
    else
      init = 128
      network = ((Math.floor(ipInputArray[index] / init)) * init)
      broadcast = "255"
    [
      network
      broadcast
    ]
  getEnds = ->
    netInit = getNetworkRange(base)
    netFinal = placeRangeCorrectly(netInit[0], netInit[1])
    netFinal
  placeRangeCorrectly = (network, broadcast) ->
    networkString = undefined
    broadcastString = undefined
    networkStringInitial = ""
    broadcastStringInitial = ""
    i = 0

    while i < index
      networkStringInitial += ipInputArray[i] + "."
      broadcastStringInitial += ipInputArray[i] + "."
      i++
    networkString = networkStringInitial + network
    broadcastString = broadcastStringInitial + broadcast
    if index is 0
      networkString += ".0.0.0"
      broadcastString += ".255.255.255"
    if index is 1
      networkString += ".0.0"
      broadcastString += ".255.255"
    if index is 2
      networkString += ".0"
      broadcastString += ".255"
    unless index
      networkString = ipInput
      broadcastString = ipInput
    theBigString = [
      networkString
      broadcastString
    ]
  datRangeYo = ->
    networkOctet = theBigString[0].split(".")
    broadcastOctet = theBigString[1].split(".")
    firstUsable = (parseInt(networkOctet[3], 10) + 1)
    lastUsable = (parseInt(broadcastOctet[3], 10) - 1)
    fullUsableRange = networkOctet.slice(0, -1).join(".") + "." + firstUsable + " - " + broadcastOctet.slice(0, -1).join(".") + "." + lastUsable
    fullUsableRange = ipInput + " - " + ipInput  unless index
    fullUsableRange
  
  # The first two `var`s convert the IP to hex by parsing the 
  # ipInputArray's segments as integers, and then adding '00' padding 
  # (because JS) and converting them to a base-16 string, and then removing 
  # the prefixed '00's.
  
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
  MAX_BIT_VALUE = 32
  submask = undefined
  base = undefined
  index = undefined
  theBigString = undefined
  netFinal = undefined
  netInit = undefined
  if submaskInput <= MAX_BIT_VALUE
    base = submaskInput
    submask = getSubmask(parseInt(submaskInput, 10))
  if submaskInput.split(".").length is 4
    base = getCidr(submaskInput)
    submask = submaskInput
  if doc.form["cb"].checked or submaskInput > MAX_BIT_VALUE
    base = getCidrFromHost(submaskInput)
    submask = getSubmask(base)
  return null  if base is "undefined" or isNaN(base) or base is null
  ipInputArray = ipInput.split(".")
  submaskInputArray = submask.split(".")
  j = 0

  while j < submaskInputArray.length
    if submaskInputArray[j] isnt "255"
      index = j
      break
    j++
  ipiptoint = ipInputArray.map((x) ->
    parseInt x, 10
  )
  iptohex = ipiptoint.map((v) ->
    ("00" + v.toString(16)).substr -2
  ).join(".")
  wildcard = submaskInputArray.map((v) ->
    255 - v
  ).join(".")
  hosts = calculateHosts(base)
  usable_hosts = (if (hosts - 2) > 0 then (hosts - 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") else 0)
  doc.getElementById("tablecidr").innerHTML = base
  doc.getElementById("tablesubmask").innerHTML = submask
  doc.getElementById("tablebinary").innerHTML = onBits(base)
  doc.getElementById("tablenumhosts").innerHTML = hosts.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " (" + usable_hosts + " usable)"
  doc.getElementById("tablenumsubnets").innerHTML = calculateSubnets(base)
  doc.getElementById("tablewildcardmask").innerHTML = wildcard
  doc.getElementById("tableipclass").innerHTML = findClass(ipInputArray[0])
  doc.getElementById("tableiptohex").innerHTML = iptohex.toUpperCase()
  doc.getElementById("tablenetworkid").innerHTML = getEnds()[0]
  doc.getElementById("tablebroadcastaddress").innerHTML = getEnds()[1]
  doc.getElementById("tablenetworkrange").innerHTML = datRangeYo()
  throwError()  if ipInput.split(".").length isnt 4 or ipInput is ""
  i = 0

  while i < 4
    iptoint = parseInt(ipInputArray[i], 10)
    throwError()  if iptoint isnt ipInputArray[i] or iptoint < 0 or iptoint > 255
    ipInputArray[i] = iptoint
    i++
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