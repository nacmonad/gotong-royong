import sys
import cv2
import pyaudio
import wave
import threading
import time
import subprocess
import os

import zbar
import zbarlight
from PIL import Image

#facial detection params
face_cascade = cv2.CascadeClassifier('/home/nacmonad/Downloads/OpenCV/data/haarcascades/haarcascade_frontalface_default.xml')


class VideoRecorder():

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
                    self.video_out.write(frame)
                    cv2.putText(frame, self.oldQR, (10,440),  cv2.FONT_HERSHEY_SIMPLEX, 1,(255,255,255),2,cv2.LINE_AA)

                frame = self.genFacesFrame(frame)
                cv2.imshow('KinetiCoin', frame)

            else:
                break
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
            end = time.time()
            fps = 1 / (end-start)
            #print fps

        # When everything done, release the capture
        self.video_cap.release()
        cv2.destroyAllWindows()

    def record(self, frame):
        self.video_out.write(frame)
        #time.sleep(0.06)


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
        video_thread = threading.Thread(target=self.record)
        video_thread.start()

class AudioRecorder():
    # Audio class based on pyAudio and Wave
    def __init__(self):
        self.open = True
        self.rate = 44100
        self.frames_per_buffer = 1024
        self.channels = 2
        self.format = pyaudio.paInt16
        self.audio_filename = "temp_audio.wav"
        self.audio = pyaudio.PyAudio()
        self.stream = self.audio.open(format=self.format,
                                      channels=self.channels,
                                      rate=self.rate,
                                      input=True,
                                      frames_per_buffer = self.frames_per_buffer)
        self.audio_frames = []


    # Audio starts being recorded
    def record(self):
        self.stream.start_stream()
        while(self.open == True):
            data = self.stream.read(self.frames_per_buffer)
            self.audio_frames.append(data)
            if self.open==False:
                break

    # Finishes the audio recording therefore the thread too
    def stop(self):

        if self.open==True:
            self.open = False
            self.stream.stop_stream()
            self.stream.close()
            self.audio.terminate()

            waveFile = wave.open(self.audio_filename, 'wb')
            waveFile.setnchannels(self.channels)
            waveFile.setsampwidth(self.audio.get_sample_size(self.format))
            waveFile.setframerate(self.rate)
            waveFile.writeframes(b''.join(self.audio_frames))
            waveFile.close()

        pass

    # Launches the audio recording function using a thread
    def start(self):
        audio_thread = threading.Thread(target=self.record)
        audio_thread.start()

def start_AVrecording(filename):

    global video_thread
    global audio_thread

    video_thread = VideoRecorder()
    audio_thread = AudioRecorder()

    audio_thread.start()
    video_thread.start()

    return filename

def start_video_recording(filename):

    global video_thread

    video_thread = VideoRecorder()
    video_thread.start()

    return filename


def start_audio_recording(filename):

    global audio_thread

    audio_thread = AudioRecorder()
    audio_thread.start()

    return filename


def stop_AVrecording(filename):

    audio_thread.stop()
    frame_counts = video_thread.frame_counts
    elapsed_time = time.time() - video_thread.start_time
    recorded_fps = frame_counts / elapsed_time
    print "total frames " + str(frame_counts)
    print "elapsed time " + str(elapsed_time)
    print "recorded fps " + str(recorded_fps)
    video_thread.stop()

    # Makes sure the threads have finished
    while threading.active_count() > 1:
        time.sleep(1)


#    Merging audio and video signal

    if abs(recorded_fps - 6) >= 0.01:    # If the fps rate was higher/lower than expected, re-encode it to the expected

        print "Re-encoding"
        cmd = "ffmpeg -r " + str(recorded_fps) + " -i temp_video.avi -pix_fmt yuv420p -r 6 temp_video2.avi"
        subprocess.call(cmd, shell=True)

        print "Muxing"
        cmd = "ffmpeg -ac 2 -channel_layout stereo -i temp_audio.wav -i temp_video2.avi -pix_fmt yuv420p " + filename + ".avi"
        subprocess.call(cmd, shell=True)

    else:

        print "Normal recording\nMuxing"
        cmd = "ffmpeg -ac 2 -channel_layout stereo -i temp_audio.wav -i temp_video.avi -pix_fmt yuv420p " + filename + ".avi"
        subprocess.call(cmd, shell=True)

        print ".."




# Required and wanted processing of final files
def file_manager(filename):

    local_path = os.getcwd()

    if os.path.exists(str(local_path) + "/temp_audio.wav"):
        os.remove(str(local_path) + "/temp_audio.wav")

    if os.path.exists(str(local_path) + "/temp_video.avi"):
        os.remove(str(local_path) + "/temp_video.avi")

    if os.path.exists(str(local_path) + "/temp_video2.avi"):
        os.remove(str(local_path) + "/temp_video2.avi")

    if os.path.exists(str(local_path) + "/" + filename + ".avi"):
        os.remove(str(local_path) + "/" + filename + ".avi")
