import sys
import numpy as np
import cv2
import time
import zbarlight
import idleDetector
from PIL import Image
import PiVideoStream
import pyautogui

#hog detector
hog = cv2.HOGDescriptor()
hog.setSVMDetector( cv2.HOGDescriptor_getDefaultPeopleDetector() )

#set up rpithread
vs = PiVideoStream.PiVideoStream().start()
time.sleep(2)

#idle detector
idle_detector = idleDetector.idleDetector()

def detectQR(gray):
    global oldQR
    global userSignedIn
    global startTime
    global out
    codes = str(zbarlight.scan_codes('qrcode', Image.fromarray(gray)))

    if(codes != 'None'):
        if(codes != oldQR):
            #start recording as well
            oldQR = codes
            userSignedIn = True
            startTime = time.time()


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

def downSample(gray, maxWidth):
    r = maxWidth / gray.shape[1]
    dim = (maxWidth, int(gray.shape[0] * r))
    return cv2.resize(gray, dim, interpolation = cv2.INTER_AREA)

def main():
    global oldQR
    global userSignedIn
    global out
    
    #EVENT LOOP
    while(True):
        ret, frame = True, vs.read()
        (w,h,d) = frame.shape
        cv2.namedWindow('frame')
        cv2.moveWindow('frame', 50, 50)
        cv2.setMouseCallback('frame', on_mouse)
        #userSignedIn = True
        if(ret):
            try:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                detectQR(frame)

                if(userSignedIn):
                    cv2.putText(frame, oldQR, (10,440),  cv2.FONT_HERSHEY_SIMPLEX, 1,(255,255,255),2,cv2.LINE_AA)

                    ds = downSample(gray, 250)
                    #ds = ds.reshape((ds.shape[0]*ds.shape[1]),3)
                    found,w=hog.detectMultiScale(ds, winStride=(8,8), padding=(32,32), scale=1.05)
                    #found = map(lambda x:x/r,found)
                    found = (1/r) * np.array(found)
                    if type(w) is np.ndarray:
                        draw_detections(frame,found.astype(int))
                    idle_detector.checkFrame(w)
                    if(idle_detector.idleFrameCount > 20):
                        pyautogui.click(400, 400)
                        idle_detector.reset()
                #else:
                #    time.sleep(0.07)
                cv2.imshow('frame', frame )


            except Exception as err:
                print(err)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    vs.stop()
    cv2.destroyAllWindows()


#program starts here

global oldQR
global userSignedIn

oldQR = ''
userSignedIn = False
main()
