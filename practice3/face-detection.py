import numpy as np
import cv2

#load the xml files for face detection into the program
face_cascade = cv2.CascadeClassifier('data/haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier('data/haarcascade_eye.xml')
smile_cascade = cv2.CascadeClassifier('data/haarcascade_smile.xml')

#read the image for furthur editing
image = cv2.imread('input/face-tmp.jpg')

#convert the RBG image to gray scale image
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

#identify the face using haar-based classifiers
faces = face_cascade.detectMultiScale(gray_image, 1.01, 5)

#iteration through the faces array and draw a rectangle
for(x, y, w, h) in faces:
    cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), 2)

    roi_gray = gray_image[y:y + h, x:x + w]
    roi_color = image[y:y + h, x:x + w]
    
    smiles = smile_cascade.detectMultiScale(roi_gray , 1.8, 20)
    for (sx, sy, sw, sh) in smiles:
        cv2.rectangle(roi_color, (sx, sy), (sx + sw, sy + sh), (255, 0, 0), 2) 

    eyes = eye_cascade.detectMultiScale(roi_gray)
    for (ex, ey, ew, eh) in eyes:
        cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2) 

#show the final image after detection
cv2.imshow('image', image)
cv2.waitKey(0)
cv2.destroyAllWindows()