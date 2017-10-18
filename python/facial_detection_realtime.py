import os
import sys
import numpy as np
import cv2
import time
import zbarlight
from PIL import Image
import PiVideoStream
import idleDetector
import pyautogui
import threading

dir_path = os.path.dirname(os.path.realpath(__file__))
#facial detection params
face_cascade = cv2.CascadeClassifier('/home/pi/opencv/data/haarcascades/haarcascade_frontalface_default.xml')
vs = PiVideoStream.PiVideoStream().start()
time.sleep(2)
out = None
idle_detector = idleDetector.idleDetector()

                    #if type(w) is np.ndarray:
                    #    draw_detections(frame,found.astype(int))
                    #idle_detector.checkFrame(w)
def genFacesFrame(img, gray):

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    if len(faces) == 0:
        idle_detector.increment()
    for (x,y,w,h) in faces:
        cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
        roi_gray = gray[y:y+h, x:x+w]
        roi_color = img[y:y+h, x:x+w]

    return img

def detectQR(gray):
    global oldQR
    global userSignedIn
    global startTime

    codes = str(zbarlight.scan_codes('qrcode', Image.fromarray(gray)))

    if(codes != 'None'):
        if(codes != oldQR):
            oldQR = codes
            userSignedIn = True
            startTime = time.time()

def on_mouse(event,x,y,flags,params):
    global oldQR
    global userSignedIn
    global startTime
    global endTime
    global out

    # get mouse click
    if event == cv2.EVENT_LBUTTONDOWN:
        #print "click"
        if userSignedIn:
            endTime = time.time()
            elapsed = endTime - startTime
            #release and reset video output
            #out.release()
            #out = None

            calculate_reward(oldQR, elapsed)
        userSignedIn = False
        oldQR = ''

def calculate_reward(oldQR, elapsed):
    print(oldQR + ' ' + str(elapsed))
    sys.stdout.flush()

def downSample(gray, maxWidth):
    r = maxWidth / gray.shape[1]
    dim = (maxWidth, int(gray.shape[0] * r))
    return cv2.resize(gray, dim, interpolation = cv2.INTER_AREA)

def main():
    global oldQR
    global userSignedIn
    global out
    lock = threading.Lock()
    #EVENT LOOP
    while(True):
        lock.acquire()
        ret, frame = True, vs.read()
        lock.release()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        #downsample hereq
        (w,h,d) = frame.shape
        cv2.namedWindow('frame')
        cv2.setMouseCallback('frame', on_mouse)
        cv2.moveWindow('frame', 100, 100)
        if(ret):
            try:
                if(userSignedIn):
                    #ds = downSample(gray, 250)
                    frame = genFacesFrame(frame, gray)
                    cv2.putText(frame, oldQR, (10,440),  cv2.FONT_HERSHEY_SIMPLEX, 1,(255,255,255),2,cv2.LINE_AA)
                else:
                    detectQR(gray)

                if(idle_detector.idleFrameCount > 60):
                    pyautogui.click(400, 400)
                    idle_detector.reset()

                cv2.imshow('frame', frame )

            except Exception as err:
                print(err)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    vs.stop()
    cv2.destroyAllWindows()

global oldQR
global userSignedIn

oldQR = ''
userSignedIn = False
main()



# REFERENCES
# Haar Cascades
# http://docs.opencv.org/trunk/d7/d8b/tutorial_py_face_detection.html
# http://docs.opencv.org/trunk/dc/d88/tutorial_traincascade.html
