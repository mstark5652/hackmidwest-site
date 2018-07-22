from config import AppConfig



def upload_cloudinary(filepath="/static/images/EM_computer.jpg"):
    appConfig = AppConfig()

    import cloudinary
    import cloudinary.uploader
    import cloudinary.api
    cloudinary.config(
        cloud_name=appConfig.cloudinary_name,
        api_key=appConfig.cloudinary_key,
        api_secret=appConfig.cloudinary_secret)
    cloudinary.uploader.upload(filepath)

def upload_box(filepath="/static/images/DF_flood.jpg"):
    from boxsdk import JWTAuth
    from boxsdk import Client

    appConfig = AppConfig()

    # Configure JWT auth object
    sdk = JWTAuth(
        client_id=appConfig.box_id,
        client_secret=appConfig.box_key,
        # enterprise_id="YOUR APP ENTERPRISE ID",
        jwt_key_id=appConfig.box_auth,
        rsa_private_key_file_sys_path="./.box_config.json",
        rsa_private_key_passphrase=appConfig.box_pass)
