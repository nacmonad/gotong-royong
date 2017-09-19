import sys
import numpy as np
import cv2
import time
import zbar
import zbarlight
from PIL import Image
from sklearn.cluster import KMeans

#facial detection params
face_cascade = cv2.CascadeClassifier('/home/nacmonad/Downloads/OpenCV/data/haarcascades/haarcascade_frontalface_default.xml')

#set up webcam
cap = cv2.VideoCapture(0)
out = None

def genFacesFrame(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cv2.imwrite('./grayscale.png', gray)

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    for (x,y,w,h) in faces:
        cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
        roi_gray = gray[y:y+h, x:x+w]
        roi_color = img[y:y+h, x:x+w]
    return img

def detectQR(frame):
    global oldQR
    global userSignedIn
    global startTime
    global out

    image = Image.open('./grayscale.png')
    image.load()
    codes = str(zbarlight.scan_codes('qrcode', image))

    if(codes != 'None'):
        if(codes != oldQR):
            oldQR = codes
            #print("New wallet address detected -- perform away!")
            #start recording as well
            userSignedIn = True
            startTime = time.time()
        if out is None:
            print("file created")
            out = cv2.VideoWriter('./videos/' + oldQR + str(time.time()).split('.')[0] + '.avi', cv2.VideoWriter_fourcc(*'x264'), 20.0, (640,480))

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
            out.release()
            out = None

            calculate_reward(oldQR, elapsed)
        userSignedIn = False
        oldQR = ''

def calculate_reward(oldQR, elapsed):
    print(oldQR + ' ' + str(elapsed))
    sys.stdout.flush()


def main():
    global oldQR
    global userSignedIn
    global out

    #EVENT LOOP
    while(True):
        #Capture Frame
        ret, frame = cap.read()
        (w,h,d) = frame.shape
        cv2.namedWindow('frame')
        cv2.setMouseCallback('frame', on_mouse)
        start = time.time()
        if(ret):
            try:
                detectQR(frame)
                if out is not None:
                    print "framewrite"
                    out.write(frame)
                frame = genFacesFrame(frame)

                if(userSignedIn):
                    cv2.putText(frame, oldQR, (10,440),  cv2.FONT_HERSHEY_SIMPLEX, 1,(255,255,255),2,cv2.LINE_AA)

                cv2.imshow('frame', frame )
                end = time.time()
                diff = end-start
                fps = 1/diff
                print fps

            except Exception as err:
                print(err)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # When everything done, release the capture
    cap.release()
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
