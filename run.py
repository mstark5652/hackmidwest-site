#!/usr/local/bin/python3

#
# Created by mstark on June. 08, 2018
#
# Copyright 2018 Michael Stark. All Rights Reserved.
#

import os, sys, argparse

from server.app import run


def parse_args(argv):
    """ parse args """

    parser = argparse.ArgumentParser()

    parser.add_argument("-d", "--debug", action="store_true")
    parser.add_argument("-p", "--port", type=int, default=5000)
    parser.add_argument("-s", "--secret", type=str,
        default="A0Zr98j/3yX R~XHH!jmN]LWX/,?RT")  # default is dev key

    return parser.parse_args(args=argv)


if __name__ == "__main__":
    argv = sys.argv[1:]
    options = parse_args(argv)
    run(port=options.port, debug=options.debug, secret=options.secret)