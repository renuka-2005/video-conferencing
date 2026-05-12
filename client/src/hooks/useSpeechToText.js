import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechToText = (onResult) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const onResultRef = useRef(onResult);
  const restartTimeoutRef = useRef(null);

  // Update ref when onResult changes
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  // Sync state with ref
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // Initialize recognition object
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // Set to a standard language, can be changed to 'hi-IN' if needed

    recognition.onstart = () => {
      console.log("Speech recognition started");
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // We prioritize final transcript, but show interim for real-time feel
      const resultText = finalTranscript || interimTranscript;
      if (resultText && onResultRef.current) {
        onResultRef.current(resultText);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      console.log("Speech recognition ended. isListening:", isListeningRef.current);
      
      // Auto-restart logic with a small delay to prevent infinite fast loops
      if (isListeningRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = setTimeout(() => {
          if (isListeningRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
              console.log("Speech recognition restarted");
            } catch (err) {
              console.warn("Failed to restart recognition:", err);
            }
          }
        }, 1000);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      clearTimeout(restartTimeoutRef.current);
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        try {
          recognitionRef.current.stop();
        } catch (e) {}
        recognitionRef.current = null;
      }
    };
  }, []);

  // Control listening state based on toggle
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        // Ignore "already started" errors
        if (err.error !== 'already-started') {
          console.warn("Recognition start error:", err);
        }
      }
    } else {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn("Recognition stop error:", err);
      }
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    setIsListening(prev => !prev);
  }, []);

  return { isListening, toggleListening };
};
