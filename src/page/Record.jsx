import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function RecordPage() {
    const videoRef = useRef(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recording, setRecording] = useState(false);
    const [videoURL, setVideoURL] = useState(null);
    const [timer, setTimer] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        async function enableCamera() {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            videoRef.current.srcObject = stream;
            const recorder = new MediaRecorder(stream);
            let chunks = [];
            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: "video/mp4" });
                setVideoURL(URL.createObjectURL(blob));
            };
            setMediaRecorder(recorder);
        }
        enableCamera();
    }, []);

    const startRecording = () => {
        setRecording(true);
        setTimer(0);
        mediaRecorder.start();
        const interval = setInterval(() => {
            setTimer((t) => {
                if (t >= 60) {
                    clearInterval(interval);
                    stopRecording();
                }
                return t + 1;
            });
        }, 1000);
    };

    const stopRecording = () => {
        setRecording(false);
        mediaRecorder.stop();
    };

    const uploadVideo = () => {
        setTimeout(() => navigate("/success"), 1200);
    };

   

    return (
        <>
            <Header />
            <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg text-center"
                >
                    <h2 className="text-2xl font-bold text-[#286a94]  mb-2">
                        🎤 Introduction Test Recording
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Please ensure proper lighting and speak clearly. The timer will automatically stop at 60 seconds.
                    </p>

                    {/* Camera Frame */}
                    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border-4 border-blue-400 shadow-lg">
                        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                        {recording && (
                            <motion.div
                                className="absolute top-3 left-3 bg-red-600 rounded-full w-4 h-4"
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            />
                        )}
                    </div>

                    {/* Timer + Actions */}
                    <div className="mt-5 text-gray-700 font-semibold">
                        {recording ? `Recording... ${timer}s` : videoURL ? "Preview your video below." : "Ready to start."}
                    </div>

                    {videoURL && (
                        <motion.video
                            src={videoURL}
                            controls
                            className="w-full mt-4 rounded-xl border border-blue-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        />
                    )}

                    <div className="mt-6 flex gap-3 justify-center">
                        {!recording ? (
                            <motion.button
                                onClick={startRecording}
                                whileHover={{ scale: 1.05 }}
                                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow-lg"
                            >
                                ▶️ Start Recording
                            </motion.button>
                        ) : (
                            <motion.button
                                onClick={stopRecording}
                                whileHover={{ scale: 1.05 }}
                                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl shadow-lg"
                            >
                                ⏹ Stop
                            </motion.button>
                        )}
                        {videoURL && (
                            <motion.button
                                onClick={uploadVideo}
                                whileHover={{ scale: 1.05 }}
                                className="bg-[#286a94] hover:bg-[#356583] text-white px-5 py-2 rounded-xl shadow-lg"
                            >
                                ⬆️ Upload Video
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </div>
        </>

    );
}
