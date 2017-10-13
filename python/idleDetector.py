import numpy

class idleDetector():
    def __init__(self):
        self.idleFrameCount = 0

    def checkFrame(self, value):
        if type(value) is tuple:
            self.idleFrameCount += 1
        if type(value) is numpy.ndarray:
            self.idleFrameCount = 0
        #print self.idleFrameCount

    def increment(self):
        self.idleFrameCount += 1
    def reset(self):
        self.idleFrameCount = 0
