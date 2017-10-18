import sys
import numpy as np
import cv2
import time
import zbarlight
#import bodyDetector
import idleDetector
from PIL import Image
import PiVideoStream

import threading
from multiprocessing import Queue

#use inputargs to set detection mode
#hog detector
#hog = cv2.HOGDescriptor()
#hog.setSVMDetector( cv2.HOGDescriptor_getDefaultPeopleDetector() )

#facial detection params
face_cascade = cv2.CascadeClassifier('/home/pi/opencv/data/haarcascades/haarcascade_frontalface_default.xml')

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
        idle_detector.reset()

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

def downSample(gray, maxWidth):
    r = maxWidth / float(gray.shape[1])
    dim = (maxWidth, int(gray.shape[0] * r))
    return cv2.resize(gray, dim, interpolation = cv2.INTER_AREA), r

def genFacesFrame(img, gray):

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    if len(faces) == 0:
        idle_detector.increment()
    else:
        idle_detector.reset()
    for (x,y,w,h) in faces:
        cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
        roi_gray = gray[y:y+h, x:x+w]
        roi_color = img[y:y+h, x:x+w]

    return img

def calculate_reward(oldQR, elapsed):
    print(oldQR + ' ' + str(elapsed))
    sys.stdout.flush()

def pipelineThread(proc_q, return_q):

    global oldQR
    global userSignedIn
    oldQR = "None"
    userSignedIn = False
    COUNT_LIMIT = 120

    while(True):
        if(not proc_q.empty()):
            proc_frame = proc_q.get()
	    (h,w,d) = proc_frame.shape
            
	    #flip it vertically
            #proc_frame = cv2.flip(proc_frame,0)
	    #proc_frame = cv2.flip(proc_frame,0)
	    # gray_scale it!
            gray = cv2.cvtColor(proc_frame, cv2.COLOR_BGR2GRAY)

            if(not userSignedIn):
                proc_frame = cv2.flip(proc_frame,0)
                detectQR(gray)
            else:
                #downsample and feed through processing pipeline
                #ds,r = downSample(gray, 250)

                #found,w=hog.detectMultiScale(ds, winStride=(8,8), padding=(32,32), scale=1.05)
                proc_frame = genFacesFrame(proc_frame, gray)
                proc_frame = cv2.flip(proc_frame,0)
                cv2.putText(proc_frame, oldQR, (10,h-20),  cv2.FONT_HERSHEY_SIMPLEX, 0.7,(255,255,255),2,cv2.LINE_AA)

                if(idle_detector.idleFrameCount > COUNT_LIMIT):
                    on_mouse(cv2.EVENT_LBUTTONDOWN, 0, 0, (), ())
                    idle_detector.reset()

            #proc_frame = cv2.flip(proc_frame, 0)
            #add to return queue
            return_q.put(proc_frame)
            #proc_q.task_done()


def main():
    #window setup
    node_name = 'Kineticoin Node'
    cv2.namedWindow(node_name)
    cv2.moveWindow(node_name, 50, 50)
    cv2.setMouseCallback(node_name, on_mouse)

    #set up rpi capture thread
    proc_q = Queue()  #process queue
    return_q = Queue() #return queue

    #start capture thread with PiVideoStream
    cap_thread = PiVideoStream.PiVideoStream().start()
    #body_detector = bodyDetector.bodyDetector()
    time.sleep(2)

    #process pipeline thread loop uses queue
    process_thread = threading.Thread(target=pipelineThread, args=(proc_q,return_q,),)
    process_thread.setDaemon(True)
    process_thread.start()

    lock = threading.Lock()

    while(True):
        #this lock neccessary to not throw errors when accessing PiVideoStream thread
        lock.acquire()
        ret, frame = True, cap_thread.read()
        lock.release()

        proc_q.put(frame)
        #userSignedIn = True

        if(len(frame) > 0):
            try:
                cv2.imshow(node_name, return_q.get() )
                #print proc_q.qsize(), return_q.qsize()
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
