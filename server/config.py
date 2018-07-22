#
#


class AppConfig(object):

    def __init__(self):
        self.cloudinary_name = "dvuixyf9j"
        self.cloudinary_key = "266881285298756"
        self.cloudinary_secret = "d3MejyIXJQEezXr7xM075CpSD7Q"
        self.twilio_id = ""
        self.twilio_key = ""
        self.twilio_number = ""

        self.nexosis_key = ""

        self.load_box_auth()

    def load_box_auth():
        self.box_id = ""
        self.box_key = ""
        self.box_auth = ""
        self.box_pass = ""
