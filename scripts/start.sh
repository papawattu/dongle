#!/bin/bash
socat -d -d pty,raw,echo=0,link=/dev/ttyS0 tcp-l:2222,reuseaddr &
./espruino main.min.js
