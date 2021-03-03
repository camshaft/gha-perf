ARG ubuntu=latest

# ubuntu doesn't have a static glibc build so copy it from fedora
FROM fedora:latest AS glibc

RUN \
  set -e; \
  dnf install glibc-static -y;

FROM ubuntu:${ubuntu}

ENV DEBIAN_FRONTEND=noninteractive

RUN \
  set -e; \
  apt-get update; \
  apt-get install -y build-essential wget tar flex bison libelf-dev libdwarf-dev libdw-dev libdw1 systemtap-sdt-dev libssl-dev liblzma-dev libzstd-dev libcap-dev libnuma-dev libbabeltrace-dev libunwind-dev libbfd-dev binutils-dev zlib1g-dev libiberty-dev libbabeltrace-ctf-dev libaudit-dev libbz2-dev gawk;

COPY --from=glibc /usr/lib64/libc.a /usr/lib/

ARG version=5.6

RUN \
  set -e; \
  wget https://github.com/torvalds/linux/archive/v${version}.tar.gz; \
  tar -xf v${version}.tar.gz; \
  rm v${version}.tar.gz; \
  mv linux-${version} linux-src; \
  cd linux-src; \
  EXTRA_CFLAGS="-I/usr/include/elfutils -I/usr/include/x86_64-linux-gnu -I/usr/include -fPIE" \
    LDFLAGS="-static -L/usr/lib/x86_64-linux-gnu -L/usr/lib" \
    make -C tools/perf; \
  mv tools/perf/perf /usr/local/bin; \
  cd /; \
  rm -rf linux-src;

RUN \
  set -e; \
  /usr/local/bin/perf version --build-options; \
  check() { \
    /usr/local/bin/perf version --build-options \
    | grep "[[:space:]]$1:" \
    | grep on > /dev/null; \
  }; \
  check dwarf; \
  check glibc; \
  check libelf; \
  check libnuma; \
  check libcrypto; \
  check libunwind; \
  check zlib; \
  check lzma; \
  check get_cpuid; \
  check bpf; \
  echo "ok"
