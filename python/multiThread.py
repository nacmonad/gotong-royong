import numpy as np
import cv2
import PiVideoStream
from multiprocessing import Process, Queue
import time

#from common import clock, draw_str, StatValue
#import video

class Canny_Process(Process):

    def __init__(self,frame_queue,output_queue):
        Process.__init__(self)
        self.frame_queue = frame_queue
        self.output_queue = output_queue
        self.stop = False
        #Initialize your face detectors here


    def get_frame(self):
        if not self.frame_queue.empty():
            return True, self.frame_queue.get()
        else:
            return False, None

    def stopProcess(self):
        self.stop = True

    def canny_frame(self,frame):
        # some intensive computation...
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 100)

        if self.output_queue.full():
            self.output_queue.get_nowait()
        self.output_queue.put(edges)

    def run(self):
        while not self.stop:
            ret, frame = self.get_frame()
            if ret:
                self.canny_frame(frame)


if __name__ == '__main__':

    frame_sum = 0
    init_time = time.time()



    def put_frame(frame):
        if Input_Queue.full():
            Input_Queue.get_nowait()
        Input_Queue.put(frame)

    def cap_read(cv2_cap):
        #ret, frame = cv2_cap.read()
        ret, frame = True, cv2_cap.read()
        if ret:
            put_frame(frame)

    #cap = cv2.VideoCapture(0)
    #set up rpithread
    cap = PiVideoStream.PiVideoStream().start()
    time.sleep(2)

    threadn = cv2.getNumberOfCPUs()

    threaded_mode = True

    process_list = []
    Input_Queue = Queue(maxsize = 5)
    Output_Queue = Queue(maxsize = 5)

    for x in range((threadn -1)):
        canny_process = Canny_Process(frame_queue = Input_Queue,output_queue = Output_Queue)
        canny_process.daemon = True
        canny_process.start()
        process_list.append(canny_process)

    ch = cv2.waitKey(1)
    cv2.namedWindow('Threaded Video', cv2.WINDOW_NORMAL)
    while True:
        print cap
        cap_read(cap)

        if not Output_Queue.empty():
            result = Output_Queue.get()
            cv2.imshow('Threaded Video', result)
            ch = cv2.waitKey(5)

        if ch == ord(' '):
            threaded_mode = not threaded_mode
        if ch == 27:
            break
    cv2.destroyAllWindows()
