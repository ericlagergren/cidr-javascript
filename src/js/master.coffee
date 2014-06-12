###
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
###

###
THIS IS AN UNTESTED COFFESCRIPT PORT OF MY VANILLA JAVASCRIPT FILE.
I COMPILED IT WITH http://js2coffee.org/ AND DO NOT GUARENTEE THAT IT WORKS CORRECTLY IF CONVERTED BACK TO JAVASCRIPT
###

updateSite = (event) ->
  window.applicationCache.swapCache()
  return
val = ->
  
  # Determine the type of input
  # less than or equal to = cidr
  
  # if you can split the input ip into four parts it's a submask
  # greater than = host
  getCidrFromHost = (input) ->
    input = (32 - (Math.ceil((Math.log(input)) / (Math.log(2)))))  if input isnt 0
    input
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
    "255.255.255.255"  if input is 32
  getCidr = (input) ->
    return 0  if input is "0.0.0.0"
    return 1  if input is "128.0.0.0"
    return 2  if input is "192.0.0.0"
    return 3  if input is "224.0.0.0"
    return 4  if input is "240.0.0.0"
    return 5  if input is "248.0.0.0"
    return 6  if input is "252.0.0.0"
    return 7  if input is "254.0.0.0"
    return 8  if input is "255.0.0.0"
    return 9  if input is "255.128.0.0"
    return 10  if input is "255.192.0.0"
    return 11  if input is "255.224.0.0"
    return 12  if input is "255.240.0.0"
    return 13  if input is "255.248.0.0"
    return 14  if input is "255.252.0.0"
    return 15  if input is "255.254.0.0"
    return 16  if input is "255.255.0.0"
    return 17  if input is "255.255.128.0"
    return 18  if input is "255.255.192.0"
    return 19  if input is "255.255.224.0"
    return 20  if input is "255.255.240.0"
    return 21  if input is "255.255.248.0"
    return 22  if input is "255.255.252.0"
    return 23  if input is "255.255.254.0"
    return 24  if input is "255.255.255.0"
    return 25  if input is "255.255.255.128"
    return 26  if input is "255.255.255.192"
    return 27  if input is "255.255.255.224"
    return 28  if input is "255.255.255.240"
    return 29  if input is "255.255.255.248"
    return 30  if input is "255.255.255.252"
    return 31  if input is "255.255.255.254"
    32  if input is "255.255.255.255"
  calculateHosts = (hv) ->
    hv = hv or 0 # zero out hv
    hv = (Math.pow(2, (32 - hv)))  if hv >= 2
    
    # 2^(total bits - on bits) = off bits
    hv
  calculateSubnets = (input) ->
    
    # this is black magic >:)
    valToSubtractFromInput = (if not index then 0 else (if index < 3 then Math.pow(2, index + 2) else 24))
    ~~Math.pow(2, (input - valToSubtractFromInput)) + " subnets"
  onBits = (bits) ->
    one = "1"
    two = "0"
    i = ""

    while i.length < bits
      i += one
    v = ""

    while v.length < (32 - bits)
      v += two
    binarystring = i + v
    binarystring.replace /\B(?=(\d{8})+(?!\d))/g, "."
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
    else if cider is 32 or cider is 31
      network = "N/A"
      broadcast = "N/A"
    else
      init = 128
      network = ((Math.floor(ipInputArray[index] / init)) * init)
      broadcast = "255"
    [
      network
      broadcast
    ]
  getEnds = (input) ->
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
    fullUsableRange
  
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
  submaskInput = doc.form.submask.value
  ipInput = doc.form.ip.value
  submask = undefined
  base = undefined
  ssl = undefined
  index = undefined
  theBigString = undefined
  netInit = undefined
  netFinal = undefined
  if submaskInput <= 32
    base = submaskInput
    submask = getSubmask(parseInt(submaskInput, 10))
  if submaskInput.split(".").length is 4
    base = getCidr(submaskInput)
    submask = submaskInput
  if submaskInput > 32
    base = getCidrFromHost(submaskInput)
    submask = getSubmask(base)
  return null  if base is "undefined" or isNaN(base) or base is null
  ipInputArray = ipInput.split(".")
  submaskInputArray = submask.split(".")
  ssl = submaskInputArray.length
  i = 0

  while i < ssl
    if submaskInputArray[i] isnt "255"
      index = i
      break
    i++
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
  usable_hosts = (hosts - 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
if "standalone" of window.navigator and window.navigator.standalone
  noddy = undefined
  remotes = false
  document.addEventListener "click", ((event) ->
    noddy = event.target
    noddy = noddy.parentNode  while noddy.nodeName isnt "A" and noddy.nodeName isnt "HTML"
    if "href" of noddy and noddy.href.indexOf("http") isnt -1 and (noddy.href.indexOf(document.location.host) isnt -1 or remotes)
      event.preventDefault()
      document.location.href = noddy.href
    return
  ), false
window.applicationCache.addEventListener "updateready", updateSite, false
window.onload = ->
  document.getElementsByTagName("form")[0].onsubmit = (evt) ->
    evt.preventDefault()
    val()
    window.scrollTo 0, document.body.scrollHeight
    return

  return