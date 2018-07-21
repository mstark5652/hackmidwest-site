#
# Created by mstark on June. 29, 2017
#
# Copyright 2017 Intouch Solutions. All Rights Reserved.
#

import os, sys, uuid, hashlib, time, re, json
import requests

def create_guid():
    """ Creates new unique identifier """
    return str(uuid.uuid4().hex)


def datetime_str():
    """ return current datetime in formatted string """
    return time.strftime("%m_%d_%YT%H-%M-%S", time.localtime())


def sha512(value, salt):
    """ hash value with sha 512 """
    return str(hashlib.sha512(value + salt).hexdigest())


def slow_hash_compare(first_hash, second_hash):
    """ 
        Slow hash compare to prevent timing attacks.
        Mostly used for authentication and password comparison
    """

    org_bytes = list(bytes(first_hash))
    new_bytes = list(bytes(sha512(second_hash, _salt)))

    # print(org_bytes)
    # print(new_bytes)

    org_len = len(org_bytes)
    new_len = len(new_bytes)

    diff = org_len ^ new_len

    length = org_len if org_len < new_len else new_len

    for x in xrange(0, length):
        diff |= ord(org_bytes[x]) ^ ord(new_bytes[x])

    return diff == 0


def normalize_word(s):
    """ Cleans and normalizes given text. """

    if s is None or len(s) == 0:
        return ""
    s = s.lower()

    # replace ips
    s = re.sub(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', ' _ip_ ', s)
    # isolate punctuation
    s = re.sub(r'([\'\"\.\(\)\!\?\-\\\/\,])', r' \1 ', s)
    # Remove some special characters
    s = re.sub(r'([\;\:\|•«\n])', ' ', s)

    # Replace numbers and symbols with language
    s = s.replace('&', ' and ')
    s = s.replace('@', ' at ')
    s = s.replace('0', ' zero ')
    s = s.replace('1', ' one ')
    s = s.replace('2', ' two ')
    s = s.replace('3', ' three ')
    s = s.replace('4', ' four ')
    s = s.replace('5', ' five ')
    s = s.replace('6', ' six ')
    s = s.replace('7', ' seven ')
    s = s.replace('8', ' eight ')
    s = s.replace('9', ' nine ')

    s = s.strip()

    return s

def web_get(url):
    r = requests.get(url)
    if r.status_code >= 200 and r.status_code < 300:
        return r.json()
    else:
        raise Exception()

def web_post(url, headers, body):
    print("Post to: ")
    print(url)
    print("Body")
    print(json.dumps(body))
    r = requests.post(url, data=json.dumps(body), headers=headers)
    if r.status_code >= 200 and r.status_code < 300:
        print("web_post request successful")
    return r
