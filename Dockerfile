FROM alpine:latest
# use the CDN mirror from gilderlabs since its much faster
RUN apk add --no-cache openrc socat python alpine-sdk git
RUN git clone https://github.com/espruino/Espruino.git
WORKDIR Espruino
COPY lib/main.min.js .
RUN make &&\
# Tell openrc its running inside a container, till now that has meant LXC
    sed -i 's/#rc_sys=""/rc_sys="lxc"/g' /etc/rc.conf &&\
# Tell openrc loopback and net are already there, since docker handles the networking
    echo 'rc_provide="loopback net"' >> /etc/rc.conf &&\
# no need for loggers
    sed -i 's/^#\(rc_logger="YES"\)$/\1/' /etc/rc.conf &&\
# can't get ttys unless you run the container in privileged mode
    sed -i '/tty/d' /etc/inittab &&\
# can't set hostname since docker sets it
    sed -i 's/hostname $opts/# hostname $opts/g' /etc/init.d/hostname &&\
# can't mount tmpfs since not privileged
    sed -i 's/mount -t tmpfs/# mount -t tmpfs/g' /lib/rc/sh/init.sh &&\
# can't do cgroups
    sed -i 's/cgroup_add_service /# cgroup_add_service /g' /lib/rc/sh/openrc-run.sh
COPY socat.start /etc/local.d/socat.start
COPY espruino.start /etc/local.d/espruino.start
RUN sed -i 's/\r//' /etc/local.d/socat.start /etc/local.d/espruino.start
RUN chmod +x /etc/local.d/socat.start /etc/local.d/espruino.start /Espruino/espruino
RUN rc-update add local default
CMD ["/sbin/init"]
EXPOSE 2222
