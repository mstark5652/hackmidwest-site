#!/usr/local/bin/python3

#
# Created by mstark on July 19, 2018
#
# Copyright 2018 Michael Stark. All Rights Reserved.
#

import os, sys, json, threading

from okta import UsersClient
from okta.models.user import User
from twilio.rest import Client

from threading import Lock
from flask import Flask, request, redirect, session, jsonify, render_template
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect

from .util.util import create_guid, web_get, web_post
from .util.Exception import InvalidUsage, BadRequest, UnauthorizedException

DOMAIN = "http://62eba3a7.ngrok.io"
NAMESPACE = "/heremapsapi"

TWILIO_NUMBER = "+19132707424"
TWILIO_ACCOUNT = "AC982d6db5b7489f809342ed2e26d8b97b"
TWILIO_TOKEN = "bab19841b68a213739f6fe8d6e256269"

async_mode = None

app = Flask(__name__)
app.config.from_object(__name__)

socketio = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()





@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def main(path):
    """ Only entry point for front end since it is a single page app """


    return render_template('index.html', async_mode=socketio.async_mode)


#
# Rest Routes
#

@app.route('/api/marker', methods=['GET'])
def create_marker():
    lat = request.args.get('lat')
    lng = request.args.get('lng')

    if lat is None or lng is None:
        raise BadRequest()

    center = True if request.args.get('center') == "1" else False

    # marker_args = {
    #     'id': None,
    #     'lat': lat,
    #     'lng': lng,
    #     'center': center
    # }
    # marker_thread = threading.Thread(target=send_marker, args=marker_args)
    # marker_thread.start()
    marker = send_marker(id=None, lat=lat, lng=lng, center=center)
    # session['marker-' + marker.id] = jsonify(marker)

    res = { "status": "ok" }
    return jsonify(res)

@app.route('/api/message', methods=['GET'])
def create_message():
    message = request.args.get('message')

    send_message(message=message)
    if 'messages' in session:
        session['messages'].append(message)
    else:
        session['messages'] = []
        session['messages'].append(message)

    res = { "status": "ok" }
    return jsonify(res)



@app.route('/api/job', methods=['GET'])
def create_job():
    """
        Example: /api/job?id=3&first=Dwayne&last=Johnson&lat=39.1337107&lng=-94.6594942&job=Dwyane''s%20house%20is%20flooding!
    """
    id = request.args.get('id')
    first = request.args.get('first')
    last = request.args.get('last')
    job = request.args.get('job')
    lat = request.args.get('lat')
    lng = request.args.get('lng')

    send_marker(id=id, lat=lat, lng=lng)
    msg = "{job} Tap here to respond.".format(job=job)
    send_message(message=msg)

    users = get_okta_users()
    for user in users:
        if 'phone' in user and user['phone'] is not None and len(user['phone']) > 0 and user['phone'].startswith('+'):
            sms = "Hey {user}, {job} Tap here {domain}?response={id}&user={user} to respond.".format(
                job=job, domain=DOMAIN, id=id, user=user['first'])
            send_sms(message=sms, number=user['phone'])

    res = {"status": "ok"}
    return jsonify(res)


@app.route('/api/user', methods=['GET'])
def create_user():
    print("/api/user args")
    print(request.args)

    first = request.args.get('first')
    last = request.args.get('last')
    phone = request.args.get('phone')
    if not phone.startswith('+'):
        phone = '+' + phone.strip()

    create_okta_user(first, last, phone)

    send_message(message="{first} just joined The Neighborhood.".format(first=first))

    res = {"status": "ok"}
    return jsonify(res)

@app.route('/api/users', methods=['GET'])
def fetch_users():
    users = get_okta_users()
    return jsonify(users)




# body = request.get_json()
#     if body is None:
#         raise BadRequest()



#
# Socket Connections
#

# Incoming

@socketio.on('connect', namespace=NAMESPACE)
def socket_connect():
    print('Client connected')
    emit('connected', { 'data': 'Connected' })

@socketio.on('disconnect', namespace=NAMESPACE)
def socket_disconnect():
    print('Client disconnected')

# Outgoing

def background_thread():
    """Example of how to send server generated events to clients."""
    count = 0
    while True:
        socketio.sleep(0.3)
        count += 1
        socketio.emit('my_response',
                      {'data': 'Server generated event', 'count': count},
                      namespace='/test')

def load_markers():
    socketio.sleep(0.3)
    if session is not None:
        for item in session:
            if item.startswith('marker-'):
                marker = json.loads(session[item])
                send_marker(id=marker.id, lat=marker.lat, lng=marker.lng, center=marker.center)


def send_marker(id, lat, lng, center=False, src=""):
    """ Emit marker coords to clients. """
    marker = {
        'id': create_guid() if id is None else id,
        'lat': lat,
        'lng': lng,
        'center': center
    }
    socketio.sleep(0.3)
    socketio.emit('marker', { 'lat': lat, 'lng': lng, 'center': center, 'src': src }, namespace=NAMESPACE)
    return marker

def send_message(message):
    """ """
    socketio.sleep(0.3)
    socketio.emit('add-message', {'id': create_guid(), 'message': message}, namespace=NAMESPACE)

def send_sms(message, number):
    print("Sending text message:")

    client = Client(TWILIO_ACCOUNT, TWILIO_TOKEN)

    message = client.messages.create(body=message, from_=TWILIO_NUMBER, to=number)


def create_okta_user(first, last, phone):
    print("creating okta user {first}, {last}, {phone}".format(
        first=first, last=last, phone=phone))

    usersClient = UsersClient("https://dev-589997.oktapreview.com",
                              "005_3xKHhWyuyoa4sm2tt5eVdngW0Z4KAS6H7HYAsm")
    user_email = create_guid() + '@email.com'
    user = User(
        login=user_email,
        email=user_email,
        firstName=first,
        lastName=last,
        mobilePhone=phone)

    user = usersClient.create_user(user, activate=True)


def get_okta_users():
    usersClient = UsersClient("https://dev-589997.oktapreview.com",
                              "005_3xKHhWyuyoa4sm2tt5eVdngW0Z4KAS6H7HYAsm")
    users = usersClient.get_users()
    print("Okta User count {}".format(len(users)))
    res = []
    for user in users:
        res.append({
            'first': user.profile.firstName,
            'last': user.profile.lastName,
            'phone': user.profile.mobilePhone
        })
    return res

#
# Error Handling
#

@app.errorhandler(Exception)
def handle_error(error):
    """ Default error handler """
    print(error)
    error = error or {}
    if type(error) is object:
        response = jsonify(error)
    else:
        response = {}
    # if 'status_code' in error:
    #     response['status_code'] = error.status_code
    return jsonify({'error': 'Error'})


#
#
#

def run(port=5000, debug=False, secret=None):
    """ """
    print('Running server on port ' + str(port))
    if secret is not None:
        app.secret_key = secret
    app.run(port=port, debug=debug)
