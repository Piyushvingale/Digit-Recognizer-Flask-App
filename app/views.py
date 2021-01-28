from app import app
from flask import request, render_template
import os
from PIL import Image
from binascii import a2b_base64
from skimage.measure import compare_ssim
import numpy as np
from skimage import io, color
from keras.models import load_model
import matplotlib as mt
import cv2

model = load_model('app/static/model/model.h5')

app.config['INITIAL_FILE_UPLOADS'] = 'app/static/image'

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == 'GET':
        return render_template("index.html")
    if request.method == 'POST':
        canvas_image = request.form['save_image']
       	
        binary_data = a2b_base64(canvas_image[22:])
        fd = open(os.path.join(app.config['INITIAL_FILE_UPLOADS'], 'image.png'), 'wb')
        fd.write(binary_data)
        fd.close()

        image = Image.open(os.path.join(app.config['INITIAL_FILE_UPLOADS'], 'image.png'))#.convert('LA')
        image = image.resize((28,28))
        
        image.save(os.path.join(app.config['INITIAL_FILE_UPLOADS'], 'image.png'))
        image = io.imread(os.path.join(app.config['INITIAL_FILE_UPLOADS'], 'image.png'))
        
        image = color.rgb2gray(color.rgba2rgb(image))
        image = color.rgb2gray(image)
        mt.image.imsave(os.path.join(app.config['INITIAL_FILE_UPLOADS'], 'grayimage.png'), image)
        image = np.array(image)
        image.shape = (1,784)
        result = np.around(model.predict(image)[0])
        max1 = max(result)
        pred = np.where(result == max1)[0][0]

        return str(pred)

if __name__ == '__main__':
    app.run(debug=True)
