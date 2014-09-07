#!/usr/bin/env python

import argparse
from math import log, ceil
import sys

usage = '%(prog)s <--hosts n | --cidr n> <IPv4 address>'
description = 'Subnetting Calculator'
epilogue = 'e.g. sbnt --hosts 250 192.168.1.1'

parser = argparse.ArgumentParser(description=description,
                                 epilog=epilogue)
parser.add_argument('ip', help='e.g. 192.168.1.1')
group = parser.add_mutually_exclusive_group(required=True)
group.add_argument('--hosts', type=int, help='e.g. 250')
group.add_argument('--cidr', type=int, help='e.g. 28')
group.add_argument('--submask', type=str, help='e.g. 255.255.0.0')
args = parser.parse_args()

ip = args.ip
hosts = args.hosts
cidr = args.cidr
submask = args.submask

MAX_BIT_VALUE = 32

def get_cidr_from_host(host_input):
    if 0 is not host_input:
        host_input = MAX_BIT_VALUE - int(ceil(log(host_input, 2)))
    return host_input

def get_max_hosts_from_cidr(cidr_input):
    cidr_input = cidr_input or 0
    if cidr_input >= 2:
        cidr_input = pow(2, (MAX_BIT_VALUE - cidr_input))
    return cidr_input

def get_cidr_from_submask(submask_input):
    # https://gist.github.com/cslarsen/1595135
    uint32_t = reduce(lambda a,b: a << 8 | b, map(int, submask_input.split('.')))

    # http://books.google.com/books?id=iBNKMspIlqEC&pg=PA66#v=onepage&q&f=false
    uint32_t = uint32_t - ((uint32_t >> 1) & 0x55555555)
    uint32_t = (uint32_t & 0x33333333) + ((uint32_t >> 2) & 0x33333333)
    uint32_t = (uint32_t + (uint32_t >> 4)) & 0x0F0F0F0F
    uint32_t = uint32_t + (uint32_t >> 8)
    uint32_t = uint32_t + (uint32_t >> 16)
    return uint32_t & 0x0000003F

def get_submask_from_cidr(cidr_input):
    uint32_t = cidr_input - (cidr_input << 16)
    uint32_t = uint32_t - (uint32_t << 8)
    uint32_t = (uint32_t - (uint32_t << 4)) | 0x0F0F0F0F
    uint32_t = (uint32_t | 0x33333333) - ((uint32_t << 2) | 0x33333333)
    uint32_t = uint32_t + ((uint32_t << 1) | 0x55555555)
    return ".".join(map(lambda n: str(uint32_t >> n & 0xFF), [24,16,8,0]))

#print get_cidr_from_submask(submask)
#print get_max_hosts_from_cidr(cidr)
#print get_cidr_from_host(hosts)
print get_submask_from_cidr(cidr)