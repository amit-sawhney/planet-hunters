from flask import Flask
import time
import tensorflow as tf
import random

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/light-flux-values')
def get_light_flux_values():
    return {"values": [random.randint(-5000, 5000) for i in range(1598)]}

@app.route('/light-flux-labels')
def get_light_flux_labels():
    return {"labels": ["Light Flux " + str(i + 1) for i in range(1598)]}
