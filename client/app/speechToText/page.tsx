"use client"; // Use client-side rendering for this component

import React, { useState, useEffect, useRef } from "react";

export default function SpeechToText() {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState("");
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // Check if the Web Speech API is supported
        const speechRecognitionSupported =
            "SpeechRecognition" in window ||
            "webkitSpeechRecognition" in window;

        if (!speechRecognitionSupported) {
            setError("Web Speech API is not supported by this browser.");
            return;
        }

        // Cast window to any to access SpeechRecognition
        const SpeechRecognition: any =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError("SpeechRecognition is not available.");
            return;
        }

        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            setIsListening(true);
            setError("");
        };

        recognition.onresult = (event: any) => {
            const speechToText = Array.from(event.results)
                .map((result: any) => result[0].transcript)
                .join(" ");
            setTranscript(speechToText);
        };

        recognition.onerror = (event: any) => {
            setError(`Error occurred in recognition: ${event.error}`);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        if (isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }

        return () => {
            recognition.stop();
        };
    }, [isListening]);

    const handleStartListening = () => {
        setIsListening(true);
    };

    const handleStopListening = () => {
        setIsListening(false);
    };

    const handlePlayAudio = () => {
        if (audioRef.current) {
            audioRef.current.play();
            handleStartListening();
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-lg font-semibold">Speech to Text</h1>
            {error && <p className="text-red-500">{error}</p>}
            <p className="border p-4 bg-gray-100 h-24">
                {transcript || "Start speaking..."}
            </p>
            <div className="mt-4">
                <button
                    onClick={handleStartListening}
                    disabled={isListening}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                >
                    Start Listening
                </button>
                <button
                    onClick={handleStopListening}
                    disabled={!isListening}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                    Stop Listening
                </button>
                <button
                    onClick={handlePlayAudio}
                    disabled={isListening}
                    className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                >
                    Play Audio and Transcribe
                </button>
            </div>
            <audio ref={audioRef} src="/audio.wav" preload="auto" />
        </div>
    );
}
