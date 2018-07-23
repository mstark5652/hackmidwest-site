#
#

import os, sys


class AppConfig(object):

    def __init__(self):
        self.cloudinary_name = ""
        self.cloudinary_key = ""
        self.cloudinary_secret = ""
        self.twilio_id = os.environ['TWILIO_ID'] if 'TWILIO_ID' in os.environ else ''
        self.twilio_key = os.environ['TWILIO_KEY'] if 'TWILIO_KEY' in os.environ else ''
        self.twilio_number = os.environ['TWILIO_NUMBER'] if 'TWILIO_NUMBER' in os.environ else ''

        self.okta_key = os.environ['OKTA_KEY'] if 'OKTA_KEY' in os.environ else ''

        self.nexosis_key = ""

        self.elastic_user = ""
        self.elastic_pw = ""

        self.box_id = ""
        self.box_key = ""
        self.box_auth = ""
        self.box_pass = ""
