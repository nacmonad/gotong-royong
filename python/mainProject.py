import cv2
import pyaudio
import wave
import threading
import time
import subprocess
import os
import capture

def main():
    print "Hello main!"
    capture.start_video_recording("adflkj.avi")


if __name__ == "__main__":
    main()
