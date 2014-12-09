#jslint node: true 

###*
@preserve
@copyright
Copyright 2014 Eric Lagergren

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
###

# THIS IS STUFF FOR MY STANDALONE APP 

# Prevents same-domain links from being opened outside my standalone app 
# (e.g. Safari, Google Chrome)

# Tests useragent to see if the client using an iPad, iPhone, or iPod and 
# toggles the 'Download app' notice

# Per Apple, it swaps cache on page reload
updateSite = (event) ->
  window.applicationCache.swapCache()
  return

# THIS DOES THE ACTUAL COMPUTATIONS 

###*
Performs all calculations, including writing to screen
###
performCalculations = ->
  
  ###*
  Declare our variables. doc = document prevents global lookup each time
  'document' is referenced
  see http://jonraasch.com/blog/10-javascript-performance-boosting-tips-from-nicholas-zakas
  ###
  
  ###*
  Thirty-two bits worth of a number
  
  @const
  @type {number}
  ###
  
  ###*
  Maximum number of "on" bits
  
  @const
  @type {number}
  ###
  
  ###*
  Maximum binary number
  
  @const
  @type {number}
  ###
  
  # Determine the type of input
  # less than or equal to = cidr
  
  # if you can split the input into four parts it's a submask
  
  # greater than = host or checked checkbox
  
  # if base isn't valid then do nothing
  
  ###*
  Checks if base isNaN and throws error if true. Also will
  convert base to int -- not necessary, but prevents JS from switching types
  ###
  
  # Splits our inputs into arrays to use later
  
  ###*
  Validates user inputs
  
  @param {string} item_to_val string to be validated
  ###
  validate = (item_to_val) ->
    itv_arr = item_to_val.split(".")
    
    # If the ip/submask isn't quad-dotted, it must be invalid
    # Or if it's an empty string it's also invalid
    throwError()  if 4 isnt itv_arr.length or "" is item_to_val
    j = 0

    while j < 4
      itv_int = +itv_arr[j]
      
      # If the specific element of the ip/submask can't be converted to
      # an integer without not equaling (using == not ===) the string
      # version, then it's invalid
      # 
      # If the integer element is < 0 or > 255 then it's invalid as well
      throwError()  if itv_int isnt itv_arr[j] or itv_int < 0 or itv_int > MAX_BIT_BIN
      itv_arr[j] = itv_int
      j++
    return
  
  # Validate both submask and IP
  
  # UNDER CONSTRUCTION
  #    function numberOfSubnets(arg_list) {
  #        for (var i = 1; i < arg_list.length; i += 2) {
  #            if (arg_list[i - 1] !== "-s") {
  #                throwError();
  #            }
  #        }
  #
  #        if (2 === arg_list.length) {
  #            // Assume that the user means number of evenly-distrubuted subnets
  #            hostsPer = arg_list[1];
  #        } else {
  #
  #        }
  #    }
  #
  #    numberOfSubnets(process.argv.slice(4));
  #    
  
  ###*
  Converts an IP/Submask into 32-bit int
  
  @param {Array.<String>} ip a quad-dotted IPv4 address -> array
  @return {number} a 32-bit integer representation of an IPv4 address
  ###
  qdotToInt = (ip) ->
    x = 0
    x += +ip[0] << 24 >>> 0
    x += +ip[1] << 16 >>> 0
    x += +ip[2] << 8 >>> 0
    x += +ip[3] >>> 0
    x
  
  ###*
  Reverses function qdotToInt(ip)
  
  @param {number} integer a 32-bit integer representation of an IPv4 address
  @return {string} a quad-dotted IPv4 address
  ###
  intToQdot = (integer) ->
    [
      integer >> 24 & MAX_BIT_BIN
      integer >> 16 & MAX_BIT_BIN
      integer >> 8 & MAX_BIT_BIN
      integer & MAX_BIT_BIN
    ].join "."
  
  ###*
  Gets CIDR prefix from a {number} of hosts
  
  @param {number} input int number of hosts
  @return {number} if param isn't 0, return 32 - ceil(log2(input)), else 0
  ###
  getCidrFromHost = (input) ->
    
    # as long as the number of hosts isn't 0, find (log2(hosts)), round 
    # up, and subtract that from MAX_BIT_VALUE to find the correct CIDR
    (if 0 isnt input then MAX_BIT_VALUE - Math.ceil(Math.log(input) / Math.log(2)) else 0)
  
  ###*
  Unpacks 8-bit int
  
  @param {number} input 8-bit int
  @return {number} I actually don't know what to call this
  ###
  unpackInt = (input) ->
    -1 << (MAX_BIT_VALUE - input)
  
  ###*
  Gets CIDR prefix from quad-dotted submask
  Counts number of bits
  
  @param {string} input IPv4 address in string notation
  @return {number} a short int
  ###
  getCidr = (input) ->
    arr = input.split(".")
    
    ###*
    Similar to:
    arr = [192.168.0.1]
    x =  192 << 8 | 168
    x += 168 << 8 | x
    x +=   0 << 8 | x
    x +=   1 << 8 | x
    return x
    
    @param {number} previous value in array
    @param {number} next value in array
    @return {number} sum of bitwise shifted numbers
    ###
    x = arr.reduce((previousValue, currentValue) ->
      (previousValue << 8 | currentValue) >>> 0
    )
    
    ###*
    https://github.com/mikolalysenko/bit-twiddle/blob/master/twiddle.js#L63
    https://github.com/mikolalysenko/bit-twiddle/blob/master/LICENSE
    ###
    x -= (x >>> 1) & 0x55555555
    x = (x & 0x33333333) + (x >>> 2 & 0x33333333)
    ((x + (x >>> 4) & 0xf0f0f0f) * 0x1010101) >>> 24
  
  ###*
  Gets total number of usable hosts from on bits
  
  @param {number} hv int number of on bits
  @return {number} int number of usable hosts
  ###
  fhosts = (hv) ->
    hv = hv or 0 # zero out hv
    
    # 2^(total bits - on bits) = off bits -2 because of nwork/bcast addrs
    hv = (Math.pow(2, (MAX_BIT_VALUE - hv))) - 2  if hv >= 2
    hv
  
  ###*
  Gets number of subnets from on bits
  
  @param {number} base int number of on bits
  @return {number} int number of subnets
  ###
  fsubnets = (base) ->
    mod_base = base % 8
    (if mod_base then Math.pow(2, mod_base) else Math.pow(2, 8))
  
  ###*
  Gets default submask from an IPv4 address
  @param {Array.<Number>} ip is 0th element in IPv4 address array
  @return {string|function(string): string} string containing default mask
  ###
  defaultSubmask = (ip) ->
    return "255.0.0.0"  if ip < 128
    return "255.255.0.0"  if ip < 192
    return "255.255.255.0"  if ip < 224
    return "255.255.255.255"  if ip < 256
    if not ip or ip < 0 or "undefined" is typeof ip or isNaN(ip)
      throwError()
    else
      throwError()
    return
  
  ###*
  Gets class of IPv4 address from arr[0]
  
  @param {Array.<Number>} ip is first (zero) element in array
  @return {string|function(string): string} string containing class of address
  ###
  findClass = (ip) ->
    return "Class A"  if ip < 128
    return "Class B"  if ip < 192
    return "Class C"  if ip < 224
    return "Class D"  if ip < 240
    return "Class E"  if ip < 256
    if not ip or ip < 0 or "undefined" is typeof ip or isNaN(ip)
      throwError()
    else
      
      # Is there anything else?
      throwError()
    return
  
  ###*
  ANDs 32-bit representations of IP and submask to get network address
  
  @param {number} ip 32-bit representation of IP address
  @param {number} sm 32-bit representation of submask
  @return {number} 32-bit representation of IP address (network address)
  ###
  networkAddress = (ip, sm) ->
    intToQdot ip & sm
  
  ###*
  ORs 32-bit representations of IP and submask to get broadcast address
  
  @param {number} ip 32-bit representation of IP address
  @param {number} sm 32-bit representation of submask
  @return {number} 32-bit representation of IP address (broadcast address)
  ###
  broadcastAddress = (ip, sm) ->
    intToQdot ip | (~sm & THIRTY_TWO_BITS)
  
  ###*
  Converts an int to its hex form
  
  @param {number} address 32-bit int representation of a quad-dotted address
  @return {string} hex value of address
  ###
  addressToHex = (address) ->
    "0x" + address.toString(16).toUpperCase()
  
  ###*
  Provides the visual binary representation of the on and off bits in
  an an IPv4 address' submask
  
  @param {number} bits our 'base' var
  @return {string} visual binary rep. of on/off bits
  ###
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
    error = "Invalid IP/Submask entered."
    doc = document
    doc.getElementById("tablecidr").innerHTML = error
    doc.getElementById("tablesubmask").innerHTML = error
    doc.getElementById("tablebinary").innerHTML = error
    doc.getElementById("tablenumhosts").innerHTML = error
    doc.getElementById("tablenumsubnets").innerHTML = error
    doc.getElementById("tablewildcardmask").innerHTML = error
    doc.getElementById("tableipclass").innerHTML = error
    doc.getElementById("tableiptohex").innerHTML = error
    doc.getElementById("tablenetworkid").innerHTML = error
    doc.getElementById("tablebroadcastaddress").innerHTML = error
    doc.getElementById("tablenetworkrange").innerHTML = error
    throw new Error("Invalid IP/Submask entered")
    return
  submaskInput = doc.form["submask"].value
  ipInput = doc.form["ip"].value
  submask = undefined
  base = undefined
  THIRTY_TWO_BITS = 4294967295
  MAX_BIT_VALUE = 32
  MAX_BIT_BIN = 255
  if submaskInput <= MAX_BIT_VALUE
    base = submaskInput
    submask = intToQdot(unpackInt(base))
  if 4 is submaskInput.split(".").length
    base = getCidr(submaskInput)
    submask = submaskInput
  if doc.form["cb"].checked or submaskInput > MAX_BIT_VALUE
    base = getCidrFromHost(submaskInput)
    submask = intToQdot(unpackInt(base))
  unless base
    submask = defaultSubmask(+ipInput.split(".")[0])
    base = getCidr(submask)
  return null  if "undefined" is base or isNaN(base) or null is base
  throwError()  if isNaN(base)
  ipInputArray = ipInput.split(".")
  submaskInputArray = submask.split(".")
  validate ipInput
  validate submask
  hosts = fhosts(base)
  usable_hosts = (if 2 <= hosts then hosts.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") else 0)
  _ip_32bit_int = qdotToInt(ipInputArray)
  _sm_32bit_int = qdotToInt(submaskInputArray)
  networkAddr = networkAddress(_ip_32bit_int, _sm_32bit_int)
  broadcastAddr = broadcastAddress(_ip_32bit_int, _sm_32bit_int)
  ipClass = findClass(ipInputArray[0])
  subnet = fsubnets(base)
  wildcard = intToQdot(~_sm_32bit_int)
  hexAddress = addressToHex(_ip_32bit_int)
  hexMask = addressToHex(_sm_32bit_int)
  naa = networkAddr.split(".")
  baa = broadcastAddr.split(".")
  naa[3] = +naa[3] + 1
  baa[3] = +baa[3] - 1
  netMin = naa.join(".")
  netMax = baa.join(".")
  doc.getElementById("tablecidr").innerHTML = base
  doc.getElementById("tablesubmask").innerHTML = submask
  doc.getElementById("tablebinary").innerHTML = onBits(base)
  doc.getElementById("tablenumhosts").innerHTML = usable_hosts
  doc.getElementById("tablenumsubnets").innerHTML = subnet
  doc.getElementById("tablewildcardmask").innerHTML = wildcard
  doc.getElementById("tableipclass").innerHTML = ipClass
  doc.getElementById("tableiptohex").innerHTML = hexAddress
  doc.getElementById("tablenetworkid").innerHTML = networkAddr
  doc.getElementById("tablebroadcastaddress").innerHTML = broadcastAddr
  doc.getElementById("tablenetworkrange").innerHTML = netMin + " - " + netMax
  return
"use strict"
doc = document
if window.navigator["standalone"]
  noddy = undefined
  remotes = false
  doc.addEventListener "click", ((event) ->
    noddy = event.target
    noddy = noddy.parentNode  while noddy.nodeName isnt "A" and noddy.nodeName isnt "HTML"
    if noddy.href.indexOf("http") isnt -1 and (noddy.href.indexOf(doc.location.host) isnt -1 or remotes)
      event.preventDefault()
      doc.location.href = noddy.href
    return
  ), false
iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
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