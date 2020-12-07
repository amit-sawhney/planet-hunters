from flask import Flask
import time
import tensorflow as tf
import pandas as pd 
import numpy as np
import keras
from keras.models import load_model
import random
import json
from flask import request

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

model = load_model('functional_exo_model.h5')

@app.route('/predict-values', methods=['POST'])
def predict_values():
    post_info = json.loads(str(request.get_data())[2:len(str(request.get_data())) - 1])
    values = np.array(post_info['values'])
    predict = np.array([[values]])
    x = model.predict(predict)
    sig = sigmoid(x)

    if sig > .5:
        return {"predict": True}
    else:
        return {"predict": False}
        


def sigmoid(x = 0):
    return 1 / (1 + np.exp(-x))