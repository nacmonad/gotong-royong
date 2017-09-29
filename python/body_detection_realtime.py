import sys
import numpy as np
import cv2
import time
import zbarlight
import idleDetector
from PIL import Image
from sklearn.cluster import KMeans
import pyautogui



grayscaleFile = '/home/nacmonad/Documents/Dapps/gotong-royong-cv/graybody.png'

#hog detector
hog = cv2.HOGDescriptor()
hog.setSVMDetector( cv2.HOGDescriptor_getDefaultPeopleDetector() )

#set up webcam
cap = cv2.VideoCapture(0)

#idle detector
idle_detector = idleDetector.idleDetector()

def detectQR(frame):
    global oldQR
    global userSignedIn
    global startTime

    image = Image.open(grayscaleFile)
    image.load()
    codes = str(zbarlight.scan_codes('qrcode', image))

    if(codes != 'None'):
        if(codes != oldQR):
            oldQR = codes
            #print("New wallet address detected -- perform away!")
            #start recording as well
            userSignedIn = True
            startTime = time.time()
        #if out is None:
        #    print("file created")
        #    out = cv2.VideoWriter('./videos/' + oldQR + str(time.time()).split('.')[0] + '.avi', cv2.VideoWriter_fourcc(*'x264'), 20.0, (640,480))


def inside(r, q):
    rx, ry, rw, rh = r
    qx, qy, qw, qh = q
    return rx > qx and ry > qy and rx + rw < qx + qw and ry + rh < qy + qh


def draw_detections(img, rects, thickness = 1):
    for x, y, w, h in rects:
        # the HOG detector returns slightly larger rectangles than the real objects.
        # so we slightly shrink the rectangles to get a nicer output.
        pad_w, pad_h = int(0.15*w), int(0.05*h)
        cv2.rectangle(img, (x+pad_w, y+pad_h), (x+w-pad_w, y+h-pad_h), (0, 255, 0), thickness)

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

        if(ret):
            try:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                cv2.imwrite(grayscaleFile, gray)
                detectQR(frame)


                if(userSignedIn):
                    cv2.putText(frame, oldQR, (10,440),  cv2.FONT_HERSHEY_SIMPLEX, 1,(255,255,255),2,cv2.LINE_AA)

                    #r = 50.0 / frame.shape[1]
                    #dim = (50, int(frame.shape[0] * r))
                    #ds = cv2.resize(frame, dim, interpolation = cv2.INTER_AREA)
                    #ds = ds.reshape((ds.shape[0]*ds.shape[1]),3)

                    found,w=hog.detectMultiScale(frame, winStride=(8,8), padding=(32,32), scale=1.05)
                    draw_detections(frame,found)
                    idle_detector.checkFrame(w)
                    if(idle_detector.idleFrameCount > 20):
                        pyautogui.click(100, 100)

                cv2.imshow('frame', frame )


            except Exception as err:
                print(err)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # When everything done, release the capture
    cap.release()
    cv2.destroyAllWindows()


#program starts here

global oldQR
global userSignedIn

oldQR = ''
userSignedIn = False
main()
