import React, { useRef, useEffect, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import "./Meet.css"

export default function InterviewerMeet() {
  const meetRef = useRef(null);
  const webcamRef = useRef(null);
  const { id } = useParams();
  const [socket, setSocket] = useState(null);
  const [away, setAway] = useState(false);
  const [outOfTab, setOutOfTab] = useState(false);
  

  function randomID(len) {
    let result = "";
    if (result) return result;
    var chars =
        "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
      maxPos = chars.length,
      i;
    len = len || 5;
    for (i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  }
  useEffect(() => {
    const roomID = id;
    const appID = 1842355862;
    const serverSecret = "f7994352e134f4ae2e8f4c3589316b37";
    const userID = "Garv Goel";

    const generateKitToken = async () => {
      const timestamp = Date.now();
      const kitToken = await ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        randomID(5),
        userID
      );
      return kitToken;
    };

    const initializeZegoSDK = async () => {
      const kitToken = await generateKitToken();
      const zc = ZegoUIKitPrebuilt.create(kitToken);
      zc.joinRoom({
        container: meetRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        showScreenSharingButton: true,
        turnOnMicrophoneWhenJoining: true,
      });
    };

    initializeZegoSDK();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:8080");
    setSocket(socket);
    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
      socket.emit("connect-room", { roomID: id });
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.io server");
    });
    socket.on("look-away", () => {
      setAway(true);
    });
    socket.on("look-back", () => {
      setAway(false);
    });
    socket.on("out-of-tab", () => {
      setOutOfTab(true);
    });
    socket.on("back-in-tab", () => {
      setOutOfTab(false);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <div className="NotificationFlex">
        <div className={`Notification ${away?"": "collapsed"}`} id="away-from-screen">
          <h1>Candidate is Looking Away From Screen</h1>
        </div>
        <div className={`Notification ${outOfTab?"": "collapsed"}`} id="away-from-tab">
          <h1>Candidate is out of the meet tab</h1>
        </div>
      </div>
      <Webcam
        style={{ visibility: "hidden", position: "absolute" }}
        ref={webcamRef}
      />
    </div>
  );
}
