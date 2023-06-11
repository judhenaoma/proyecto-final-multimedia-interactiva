from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from uvicorn import run
from fingerCountingModule import FingerCounter
import cv2
import os
import time
import handTrackingModule as htm

def getNumber(ar):
    s=""
    for i in ar:
       s+=str(ar[i]);
    if(s=="00000"):
        return (0)
    elif(s=="01000"):
        return(1)
    elif(s=="01100"):
        return(2) 
    elif(s=="01110"):
        return(3)
    elif(s=="01111"):
        return(4)
    elif(s=="11111"):
        return(5) 
    elif(s=="01001"):
        return(6)
    elif(s=="01011"):
        return(7)      

app = FastAPI()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print("Accepting connection...")
    await websocket.accept()
    while True:
        try:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message text was: {data}")

            wcam,hcam=640,480
            cap=cv2.VideoCapture(0)
            cap.set(3,wcam)
            cap.set(4,hcam)
            pTime=0
            detector = htm.handDetector(detectionCon=0.75)
            while True:
                success,img=cap.read()
                img = detector.findHands(img, draw=True )
                lmList=detector.findPosition(img,draw=False)
                tipId=[4,8,12,16,20]
                if(len(lmList)!=0):
                    fingers=[]
                    if(lmList[tipId[0]][1]>lmList[tipId[0]-1][1]):
                            fingers.append(1)
                    else :
                            fingers.append(0)
                    for id in range(1,len(tipId)):
                        
                        if(lmList[tipId[id]][2]<lmList[tipId[id]-2][2]):
                            fingers.append(1)
                        
                        else :
                            fingers.append(0)
                    
                    cv2.rectangle(img,(20,255),(170,425),(0,255,0),cv2.FILLED)   
                    num_f = getNumber(fingers)
                    await websocket.send_text(str(num_f))
                    cv2.putText(img,str(num_f),(45,375),cv2.FONT_HERSHEY_PLAIN, 10,(255,0,0),20)  
                    
                cTime=time.time()
                fps=1/(cTime-pTime)
                pTime=cTime
                cv2.putText(img, f'FPS: {int(fps)}',(400,70),cv2.FONT_HERSHEY_COMPLEX,1,(255,255,0),3)
                cv2.imshow("image",img)
                # time.sleep(2)
                if(cv2.waitKey(1) & 0xFF== ord('q')):
                    break
        except WebSocketDisconnect:
            break
