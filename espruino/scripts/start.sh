#!/bin/bash
socat -d -d pty,raw,echo=0,link=/dev/ttyS0 tcp-l:2222,reuseaddr,fork &
sleep 10
./espruino main.min.js 

