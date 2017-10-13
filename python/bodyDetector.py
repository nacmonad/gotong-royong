import cv2

class bodyDetector:
    def __init__(self):
        self.hog = cv2.HOGDescriptor()
        self.hog.setSVMDetector( cv2.HOGDescriptor_getDefaultPeopleDetector() )
    def detect(self, ds):
        return hog.detectMultiScale(ds, winStride=(8,8), padding=(32,32), scale=1.05)
