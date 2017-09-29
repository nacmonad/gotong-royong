import sys
import cv2
import threading
import time
import subprocess
import os
import zbarlight
from PIL import Image

#facial detection params
face_cascade = cv2.CascadeClassifier('/home/nacmonad/Downloads/OpenCV/data/haarcascades/haarcascade_frontalface_default.xml')


class VideoCapture():
    # Video class based on openCV
    def __init__(self):

        self.open = True
        self.device_index = 0
        self.fps = 16               # fps should be the minimum constant rate at which the camera can
        self.fourcc = "x264"       # capture images (with no decrease in speed over time; testing is required)
        self.frameSize = (640,480) # video formats and sizes also depend and vary according to the camera used
        self.video_filename = "temp_video.avi"
        self.video_cap = cv2.VideoCapture(self.device_index)
        self.video_writer = cv2.VideoWriter_fourcc(*self.fourcc)
        self.video_out = None
        self.start_time = time.time()  #Video cpature instantiion
        self.startTime = None #recording start time
        self.endTime = None #recording end time
        self.userSignedIn = False
        self.code = None
        self.oldQR = None

    def on_mouse(self, event,x,y,flags,params):
        # get mouse click
        if event == cv2.EVENT_LBUTTONDOWN:
            #print "click"
            if self.userSignedIn:
                self.endTime = time.time()
                elapsed = self.endTime - self.startTime
                #release and reset video output
                self.video_out.release()
                self.video_out = None
                print "file written"
                #calculate_reward(oldQR, elapsed)
            self.userSignedIn = False
            self.oldQR = None

    def detectQR(self, frame):
        image = Image.open('./grayscale.png')
        image.load()
        self.code = str(zbarlight.scan_codes('qrcode', image))

        if(self.code != 'None'):
            self.startTime = time.time()
            if(self.code != self.oldQR):
                #new user is signed in, start recording
                self.oldQR = self.code
                self.userSignedIn = True
                self.startTime = time.time()
                #change self.video_filename here
            if self.video_out is None:
                print("file created")
                self.video_out = cv2.VideoWriter(self.video_filename, self.video_writer, self.fps, self.frameSize)


    def genFacesFrame(self, img):
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        cv2.imwrite('./grayscale.png', gray)

        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        for (x,y,w,h) in faces:
            cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
            roi_gray = gray[y:y+h, x:x+w]
            roi_color = img[y:y+h, x:x+w]
        return img

    def run(self):
        cv2.namedWindow('KinetiCoin')
        cv2.setMouseCallback('KinetiCoin', self.on_mouse)

        while(self.open==True):
            start = time.time()
            ret, frame = self.video_cap.read()
            (w,h,d) = frame.shape

            if (ret==True):
                #downsample before facial recognition?
                self.detectQR(frame)

                #draw address if signed in
                if(self.userSignedIn):
                    cv2.putText(frame, self.oldQR, (10,440),  cv2.FONT_HERSHEY_SIMPLEX, 1,(255,255,255),2,cv2.LINE_AA)

                frame = self.genFacesFrame(frame)
                cv2.imshow('KinetiCoin', frame)

            else:
                break
            if cv2.waitKey(1) & 0xFF == ord('q'):
                self.stop()
                break


        # When everything done, release the capture
        self.video_cap.release()
        cv2.destroyAllWindows()

    # Finishes the video recording therefore the thread too
    def stop(self):

        if self.open==True:
            self.open=False
            self.video_out.release()
            self.video_cap.release()
            cv2.destroyAllWindows()

        else:
            pass

    # Launches the video recording function using a thread
    def start(self):
        video_thread = threading.Thread(target=self.run)
        video_thread.start()
