import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';

const ICE_SERVERS = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:global.stun.twilio.com:3478'
      ],
    },
  ],
};

export const useWebRTC = (roomId, username) => {
  const socket = useSocket();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({}); 
  const [participants, setParticipants] = useState({}); // { socketId: username }
  const [mediaStatus, setMediaStatus] = useState({ micOn: true, videoOn: true });
  const peersRef = useRef({}); 
  const localStreamRef = useRef(null); 
  const iceCandidateQueues = useRef({}); // Queue for ICE candidates before remote description is set
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const initLocalStream = useCallback(async () => {
    try {
      console.log("Initializing local stream...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      localStreamRef.current = stream;
      setMediaStatus({
        micOn: stream.getAudioTracks()[0]?.enabled ?? false,
        videoOn: stream.getVideoTracks()[0]?.enabled ?? false
      });
      return stream;
    } catch (err) {
      console.warn("Could not get both video and audio. Trying video only...", err);
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setLocalStream(videoStream);
        localStreamRef.current = videoStream;
        setMediaStatus(prev => ({ ...prev, videoOn: true, micOn: false }));
        return videoStream;
      } catch (err2) {
        console.error("Error accessing media devices entirely.", err2);
        const emptyStream = new MediaStream();
        setLocalStream(emptyStream);
        localStreamRef.current = emptyStream;
        setMediaStatus({ micOn: false, videoOn: false });
        return emptyStream;
      }
    }
  }, []);

  const closePeer = useCallback((id) => {
    if (peersRef.current[id]) {
      peersRef.current[id].close();
      delete peersRef.current[id];
    }
    setRemoteStreams((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    setParticipants((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  }, []);

  const createPeer = useCallback((id, peerUsername, isInitiator) => {
    console.log(`Creating peer for ${peerUsername} (${id}), initiator: ${isInitiator}`);
    const peer = new RTCPeerConnection(ICE_SERVERS);
    peersRef.current[id] = peer;
    iceCandidateQueues.current[id] = iceCandidateQueues.current[id] || [];

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peer.addTrack(track, localStreamRef.current);
      });
    }

    peer.onnegotiationneeded = async () => {
      try {
        if (peer.signalingState !== "stable") return;
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit('offer', {
          target: id,
          sdp: peer.localDescription,
          username: username
        });
      } catch (err) {
        console.error("Negotiation needed error:", err);
      }
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          target: id,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      console.log(`Received remote track (${event.track.kind}) from ${peerUsername}`);
      setRemoteStreams((prev) => ({
        ...prev,
        [id]: { stream: event.streams[0], username: peerUsername },
      }));
    };

    peer.onconnectionstatechange = () => {
      if (peer.connectionState === 'disconnected' || peer.connectionState === 'failed' || peer.connectionState === 'closed') {
        closePeer(id);
      }
    };

    if (isInitiator) {
      peer.createOffer().then(offer => {
        return peer.setLocalDescription(offer);
      }).then(() => {
        socket.emit('offer', {
          target: id,
          sdp: peer.localDescription,
          username: username
        });
      }).catch(err => console.error("Error creating initial offer", err));
    }

    return peer;
  }, [socket, username, closePeer]);

  useEffect(() => {
    if (!socket || !roomId) return;

    let isMounted = true;

    const setupRoom = async () => {
      await initLocalStream();
      if (!isMounted) return;
      socket.emit('join-room', { roomId, username });
    };

    setupRoom();

    const handleRoomUsers = (users) => {
      const parts = {};
      users.forEach(user => {
        parts[user.id] = user.username;
        createPeer(user.id, user.username, true);
      });
      setParticipants(parts);
    };

    const handleUserJoined = ({ id, username: newUsername }) => {
      setParticipants(prev => ({ ...prev, [id]: newUsername }));
    };

    const handleOffer = async ({ caller, sdp, username: callerUsername }) => {
      let peer = peersRef.current[caller];
      if (!peer) {
        peer = createPeer(caller, callerUsername, false);
      }
      
      try {
        await peer.setRemoteDescription(new RTCSessionDescription(sdp));
        const queue = iceCandidateQueues.current[caller] || [];
        for (const candidate of queue) {
          try { await peer.addIceCandidate(new RTCIceCandidate(candidate)); } catch(e){}
        }
        iceCandidateQueues.current[caller] = [];

        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit('answer', {
          target: caller,
          sdp: peer.localDescription,
        });
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    };

    const handleAnswer = async ({ caller, sdp }) => {
      const peer = peersRef.current[caller];
      if (peer) {
        try {
          await peer.setRemoteDescription(new RTCSessionDescription(sdp));
          const queue = iceCandidateQueues.current[caller] || [];
          for (const candidate of queue) {
            try { await peer.addIceCandidate(new RTCIceCandidate(candidate)); } catch(e){}
          }
          iceCandidateQueues.current[caller] = [];
        } catch (err) {
          console.error("Error setting remote description from answer:", err);
        }
      }
    };

    const handleIceCandidate = async ({ caller, candidate }) => {
      const peer = peersRef.current[caller];
      if (peer) {
        if (!peer.remoteDescription) {
          iceCandidateQueues.current[caller].push(candidate);
        } else {
          try {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {}
        }
      }
    };

    const handleUserLeft = ({ id, username: leftUsername }) => {
      closePeer(id);
    };

    socket.on('room-users', handleRoomUsers);
    socket.on('user-joined', handleUserJoined);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('user-left', handleUserLeft);

    return () => {
      isMounted = false;
      socket.off('room-users', handleRoomUsers);
      socket.off('user-joined', handleUserJoined);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('user-left', handleUserLeft);
      Object.keys(peersRef.current).forEach(id => closePeer(id));
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [socket, roomId, username, createPeer, initLocalStream, closePeer]);

  const toggleMediaTrack = async (type) => {
    if (!localStreamRef.current) {
      await initLocalStream();
      if (!localStreamRef.current) return false;
    }

    let track = type === 'video' 
      ? localStreamRef.current.getVideoTracks()[0]
      : localStreamRef.current.getAudioTracks()[0];
    
    if (!track) {
      try {
        const constraints = type === 'video' ? { video: true } : { audio: true };
        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        const newTrack = type === 'video' ? newStream.getVideoTracks()[0] : newStream.getAudioTracks()[0];
        
        if (newTrack) {
          localStreamRef.current.addTrack(newTrack);
          newTrack.enabled = true;
          Object.values(peersRef.current).forEach(peer => {
            peer.addTrack(newTrack, localStreamRef.current);
          });
          setMediaStatus(prev => ({
            ...prev,
            [type === 'video' ? 'videoOn' : 'micOn']: true
          }));
          setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
          return true;
        }
      } catch (err) {
        console.error(`Failed to acquire ${type} track:`, err);
        alert(`Could not access ${type}. Please check your browser permissions and device connection.`);
        return false;
      }
    }

    if (track) {
      track.enabled = !track.enabled;
      setMediaStatus(prev => ({
        ...prev,
        [type === 'video' ? 'videoOn' : 'micOn']: track.enabled
      }));
      return track.enabled;
    }
    return false;
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        Object.values(peersRef.current).forEach(peer => {
          const videoSender = peer.getSenders().find(s => s.track && s.track.kind === 'video');
          if (videoSender) {
            videoSender.replaceTrack(screenTrack);
          } else {
             peer.addTrack(screenTrack, screenStream);
          }
        });

        if (localStreamRef.current) {
          const localVideoTrack = localStreamRef.current.getVideoTracks()[0];
          if (localVideoTrack) {
            localStreamRef.current.removeTrack(localVideoTrack);
          }
          localStreamRef.current.addTrack(screenTrack);
          setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
        }

        setIsScreenSharing(true);
        screenTrack.onended = () => stopScreenShare(screenTrack);
      } catch (err) {
        console.error("Error sharing screen:", err);
      }
    } else {
      const currentVideoTrack = localStreamRef.current?.getVideoTracks().find(t => t.label.includes('screen') || t.kind === 'video');
      stopScreenShare(currentVideoTrack);
    }
  };

  const stopScreenShare = async (screenTrackToStop) => {
    try {
      if (screenTrackToStop) screenTrackToStop.stop();
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const cameraTrack = cameraStream.getVideoTracks()[0];

      Object.values(peersRef.current).forEach(peer => {
        const videoSender = peer.getSenders().find(s => s.track && s.track.kind === 'video');
        if (videoSender) {
          videoSender.replaceTrack(cameraTrack);
        }
      });

      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach(t => {
          t.stop();
          localStreamRef.current.removeTrack(t);
        });
        localStreamRef.current.addTrack(cameraTrack);
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
      }
      setIsScreenSharing(false);
    } catch(err) {
      console.error("Failed to restore camera:", err);
      setIsScreenSharing(false);
    }
  };

  return {
    localStream,
    remoteStreams,
    participants,
    mediaStatus,
    toggleMediaTrack,
    toggleScreenShare,
    isScreenSharing
  };
};
