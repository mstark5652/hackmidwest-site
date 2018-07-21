#!/usr/bin/python

#
# Created by mstark on June. 29, 2017
#
# Copyright 2017 Intouch Solutions. All Rights Reserved.
#
""" Custom Exception Classes """


class InvalidUsage(Exception):
    """ Exception to throw when api needs to send back and error. """
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        result = dict(self.payload or ())
        result['message'] = self.message
        return result


class BadRequest(Exception):
    """ Exception to throw when api needs to send back and error. """
    status_code = 400

    def __init__(self, message=None, payload=None):
        Exception.__init__(self)
        self.message = message
        self.payload = payload

    def to_dict(self):
        result = dict(self.payload or ())
        if self.message is not None:
            result['message'] = self.message
        return result


class UnauthorizedException(Exception):

    status_code = 401
    message = "Unauthorized"

    def __init__(self, payload=None):
        Exception.__init__(self)
        self.payload = payload

    def to_dict(self):
        result = dict(self.payload or ())
        result['message'] = self.message
        return result