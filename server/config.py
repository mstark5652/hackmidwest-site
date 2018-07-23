#
#


class AppConfig(object):

    def __init__(self):
        self.cloudinary_name = ""
        self.cloudinary_key = ""
        self.cloudinary_secret = ""
        self.twilio_id = ""
        self.twilio_key = ""
        self.twilio_number = ""

        self.nexosis_key = ""

        self.elastic_user = ""
        self.elastic_pw = ""

        self.load_box_auth()

    def load_box_auth():
        self.box_id = ""
        self.box_key = ""
        self.box_auth = ""
        self.box_pass = ""
