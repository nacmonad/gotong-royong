import sys
import numpy as np
import cv2
import time
import zbarlight
import pyautogui
import bodyDetector
import idleDetector
from PIL import Image
import PiVideoStream

import threading
from multiprocessing import Queue

#use inputargs to set detection mode
#hog detector
hog = cv2.HOGDescriptor()
hog.setSVMDetector( cv2.HOGDescriptor_getDefaultPeopleDetector() )

#facial detection params
#face_cascade = cv2.CascadeClassifier('/home/pi/opencv/data/haarcascades/haarcascade_frontalface_default.xml')

#idle detector in main thread
idle_detector = idleDetector.idleDetector()

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
            calculate_reward(oldQR, elapsed)
        userSignedIn = False
        oldQR = ''

def detectQR(gray):
    global oldQR
    global userSignedIn
    global startTime
    codes = str(zbarlight.scan_codes('qrcode', Image.fromarray(gray)))

    if(codes != 'None'):
        if(codes != oldQR):
            #start recording as well
            print "QR DETECTED!"
            oldQR = codes
            userSignedIn = True
            startTime = time.time()

def downSample(gray, maxWidth):
    r = maxWidth / float(gray.shape[1])
    dim = (maxWidth, int(gray.shape[0] * r))
    return cv2.resize(gray, dim, interpolation = cv2.INTER_AREA), r

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

def calculate_reward(oldQR, elapsed):
    print(oldQR + ' ' + str(elapsed))
    sys.stdout.flush()

def pipelineThread(proc_q, return_q, body_detector):

    global oldQR
    global userSignedIn
    oldQR = "None"
    userSignedIn = False

    print "hello process pipeline"
    while(True):
        if(not proc_q.empty()):
            proc_frame = proc_q.get()
            #1) gray_scale it!
            gray = cv2.cvtColor(proc_frame, cv2.COLOR_BGR2GRAY)
            #2) downsample it!
            ds,r = downSample(gray, 250)
            #3) spawn thread to detectQR from original gray (better rez, can switch to ds for more speed)
            if(not userSignedIn):
                threading.Thread(target=detectQR, args=(gray,), name="QRDetectThread").start()
            else:
                #threading.Thread(target=body_detector.detect, args=(ds,))
                #print threading.enumerate()
                cv2.putText(proc_frame, oldQR, (10,440),  cv2.FONT_HERSHEY_SIMPLEX, 1,(255,255,255),2,cv2.LINE_AA)
                #ds = ds.reshape((ds.shape[0]*ds.shape[1]),3)
                found,w=hog.detectMultiScale(ds, winStride=(8,8), padding=(32,32), scale=1.05)
                #found = map(lambda x:x/r,found)

                #resize bounds for original frame
                found = (1/r) * np.array(found)
                if type(w) is np.ndarray:
                    draw_detections(proc_frame,found.astype(int))
                idle_detector.checkFrame(w)
                if(idle_detector.idleFrameCount > 20):
                    pyautogui.click(400, 400)
                    idle_detector.reset()


            #add to return queue
            return_q.put(proc_frame)
            #proc_q.task_done()


def main():
    #global oldQR
    #global userSignedIn
    #global out
    node_name = 'Kineticoin Node'
    #set up rpi capture thread
    proc_q = Queue()
    return_q = Queue()

    cap_thread = PiVideoStream.PiVideoStream().start()
    body_detector = bodyDetector.bodyDetector()
    time.sleep(2)
    #process pipeline thread

    process_thread = threading.Thread(target=pipelineThread, args=(proc_q,return_q, body_detector),)
    process_thread.setDaemon(True)
    process_thread.start()

    #lock = threading.Lock()

    while(True):
        ret, frame = True, cap_thread.read()
        proc_q.put(frame)
        (w,h,d) = frame.shape
        cv2.namedWindow(node_name)
        cv2.moveWindow(node_name, 50, 50)
        cv2.setMouseCallback(node_name, on_mouse)
        #userSignedIn = True

        if(ret):
            try:
                #print proc_q.qsize(), return_q.qsize()
                cv2.imshow(node_name, return_q.get() )
            except Exception as err:
                print(err)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap_thread.stop()
    #process_thread.stop()
    cv2.destroyAllWindows()


#program starts here

global oldQR
global userSignedIn

oldQR = ''
userSignedIn = False

if(__name__ == "__main__"):
    main()
