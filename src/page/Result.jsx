// import { useState, useRef } from 'react';
// import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
// import { motion } from 'framer-motion';
// import Header from './Header';

// export default function IntroAnalysisApp() {
//     const [step, setStep] = useState('upload'); // upload | processing | result
//     const [file, setFile] = useState(null);
//     const [preview, setPreview] = useState(null);
//     const [report, setReport] = useState(null);
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);

//     function handleFile(e) {
//         const f = e.target.files[0];
//         if (!f) return;
//         setFile(f);
//         const url = URL.createObjectURL(f);
//         setPreview(url);
//     }

//     const [showResult, setShowResult] = useState(false);



//     const dummyReport = {
//         profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
//         name: 'Jane Doe',
//         email: 'jane.doe@example.com',
//         linkedin: 'https://linkedin.com/in/janedoe',
//         github: 'https://github.com/janedoe',
//         visualScore: 85,
//         audioScore: 78,
//         postureScore: 82,
//         eyeContactScore: 74,
//         fillersScore: 68,
//         prosodyScore: 80,
//         overallScore: 78,
//         prosodyTimeline: new Array(40).fill(0).map((_, i) => ({ t: i, pitch: 80 + Math.sin(i / 4) * 6 + Math.random() * 6, energy: 0.5 + Math.abs(Math.sin(i / 5)) * 1.3 + Math.random() * 0.2 })),
//         fillersDetected: ['um', 'uh', 'like'],
//         sentiment: { positive: 6, neutral: 3, negative: 1 },
//         highlights: [
//             'Good confidence and clarity.',
//             'Moderate eye contact — can improve a bit.',
//             'Few filler words detected.',
//         ],
//     };

//     async function startAnalysis() {
//         if (!file) return alert('Please select a video first');
//         setStep('processing');

//         // Run a mock analysis locally (synchronous computations occur while app runs).
//         // In production: upload the file to your backend or call cloud ML APIs.
//         // const result = await runAnalysisMock(file, videoRef.current, canvasRef.current);
//         const formdata = new FormData()
//         formdata.append('video', file);
//         const result = await fetch(`${import.meta.env.VITE_BASE_URL}/upload_video`, {
//             method: "POST",
//             body: formdata,
//         })
//         const data = await result.json();
//         console.log("ddlljj", data);
//         // setReport(result);
//         setTimeout(() => {
//             setStep('result');
//         }, 1000)
//     }

//     return (
//         <>
//             <Header />
//             <div className="pt-20 min-h-screen bg-linear-to-br from-white to-slate-50 p-6">
//                 <div className="max-w-5xl mx-auto">
{/* <header className="mb-6">
    <h1 className="text-3xl font-extrabold text-[#1f6f99]">Introduction Video Analysis</h1>
    <p className="text-sm text-gray-600 mt-1">Upload an introduction video and get a multi-modal analysis report: visual, audio, posture, eye contact, fillers, sentiment, and prosody.</p>
</header> */}

// {step === 'upload' && (
//     <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-md p-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
//             <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                     Upload Your Introduction Video
//                 </label>

//                 <div
//                     className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#2a7397] transition cursor-pointer bg-slate-50"
//                     onClick={() => document.getElementById('videoUpload').click()}
//                 >
//                     <input
//                         id="videoUpload"
//                         type="file"
//                         accept="video/*"
//                         onChange={handleFile}
//                         className="hidden"
//                     />

//                     <div className="flex flex-col items-center justify-center space-y-2">
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="h-10 w-10 text-[#2a7397]"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={1.5}
//                                 d="M12 16v-8m0 0l-4 4m4-4l4 4m6 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2"
//                             />
//                         </svg>
//                         <p className="text-sm text-gray-600 font-medium">
//                             Click to upload or drag & drop your video here
//                         </p>
//                         {
//                             !file ?
//                                 <p className="text-xs text-gray-500">MP4, MOV, or AVI (max 30 sec)</p>
//                                 :
//                                 <p className="mt-2 text-sm text-gray-700">
//                                     <strong>Selected file:</strong> {file?.name}
//                                 </p>}
//                     </div>
//                 </div>

//                 <p className="text-xs text-gray-500 mt-3">
//                     Tip: For better facial and audio analysis, use a clear frontal shot and a quiet room.
//                 </p>

//                 <div className="mt-4 flex gap-3">
//                     <button
//                         className="px-4 py-2 bg-[#2a7397] text-white rounded-lg disabled:opacity-50"
//                         onClick={startAnalysis}
//                         disabled={!file}
//                     >
//                         Analyze
//                     </button>
//                     <button
//                         className="px-4 py-2 border border-gray-200 rounded-lg"
//                         onClick={() => {
//                             setFile(null);
//                             setPreview(null);
//                         }}
//                     >
//                         Reset
//                     </button>
//                 </div>
//             </div>

//             <div className="bg-slate-50 rounded-lg mt-[-33px] p-3 flex flex-col items-center">
//                 <p className="text-xs text-gray-600">Preview</p>
//                 {preview ? (
//                     <video ref={videoRef} src={preview} controls className="w-full h-32 mt-2 rounded" />
//                 ) : (
//                     <div className="w-full h-32 rounded bg-white/60 flex items-center justify-center text-gray-400 mt-2">
//                         No file selected
//                     </div>
//                 )}
//             </div>
//         </div>


//         {/* invisible canvas for frame capture */}
//         <canvas ref={canvasRef} style={{ display: 'none' }} />
//     </motion.div>
// )}

//                     {step === 'processing' && (
//                         <div className="bg-white rounded-2xl shadow p-8 text-center">
//                             <h2 className="text-xl font-semibold">Processing your video</h2>
//                             <p className="text-sm text-gray-600 mt-2">The app is analyzing audio, frames and posture — this is a demo analysis done locally in your browser.</p>
//                             <div className="mt-6">
//                                 <div className="inline-block px-4 py-2 rounded-full bg-[#e6f2fb] text-[#0f5678]">Running analysis</div>
//                             </div>
//                         </div>
//                     )}

//                     {step === 'result' && (
//                         <ResultPage report={dummyReport} onBack={() => [setStep('upload'),
//                         setFile(null),
//                         setPreview(null)]
//                         } />)}

//                     <footer className="text-xs text-gray-500 mt-8">Built by ebench team @2025.</footer>
//                 </div>
//             </div>
//         </>

//     );
// }

// function ResultPage({ report, onBack }) {
//     const radarData = [
//         { subject: 'Visual', A: report.visualScore },
//         { subject: 'Audio', A: report.audioScore },
//         { subject: 'Posture', A: report.postureScore },
//         { subject: 'Eye Contact', A: report.eyeContactScore },
//         { subject: 'Fillers', A: report.fillersScore },
//         { subject: 'Prosody', A: report.prosodyScore }
//     ];

//     const barData = [
//         { name: 'Visual', score: report.visualScore },
//         { name: 'Audio', score: report.audioScore },
//         { name: 'Posture', score: report.postureScore },
//         { name: 'Eye', score: report.eyeContactScore },
//         { name: 'Fillers', score: report.fillersScore },
//         { name: 'Prosody', score: report.prosodyScore }
//     ];

//     const pieData = [
//         { name: 'Positive', value: report.sentiment.positive },
//         { name: 'Neutral', value: report.sentiment.neutral },
//         { name: 'Negative', value: report.sentiment.negative }
//     ];

//     const COLORS = ['#2a9d8f', '#f4a261', '#e76f51'];

//     return (
//         <div className="bg-white rounded-2xl shadow p-6 space-y-6">
//             <div className="flex items-start justify-between">
//                 <div className="flex items-center gap-4">
//                     <img src={report.profileImage} alt="profile" className="w-20 h-20 rounded-full object-cover border" />
//                     <div>
//                         <h3 className="text-xl font-semibold">{report.name}</h3>
//                         <p className="text-sm text-gray-600">{report.email} • <a className="text-indigo-600" href={report.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> • <a className="text-indigo-600" href={report.github} target="_blank" rel="noreferrer">GitHub</a></p>
//                     </div>
//                 </div>

//                 <div className="text-right">
//                     <div className="text-sm text-gray-500">Overall score</div>
//                     <div className="text-3xl font-bold text-[#2a7397]">{report.overallScore} / 100</div>
//                     <div className="text-xs text-gray-500">Based on combined scores</div>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="col-span-2 bg-slate-50 rounded-lg p-4">
//                     <h4 className="font-semibold mb-2">Multi-modal scores</h4>
//                     <div className="flex gap-6">
//                         <RadarChart cx={150} cy={120} outerRadius={80} width={300} height={240} data={radarData}>
//                             <PolarGrid />
//                             <PolarAngleAxis dataKey="subject" />
//                             <PolarRadiusAxis angle={30} domain={[0, 100]} />
//                             <Radar name="Scores" dataKey="A" stroke="#2a7397" fill="#2a7397" fillOpacity={0.35} />
//                         </RadarChart>

//                         <BarChart width={360} height={240} data={barData}>
//                             <XAxis dataKey="name" />
//                             <YAxis />
//                             <Tooltip />
//                             <Bar dataKey="score" fill="#2a7397" />
//                         </BarChart>
//                     </div>
//                 </div>

//                 <div className="bg-slate-50 rounded-lg p-4">
//                     <h4 className="font-semibold mb-2">Sentiment</h4>
//                     <PieChart width={240} height={200}>
//                         <Pie dataKey="value" data={pieData} cx={120} cy={100} outerRadius={60} label>
//                             {pieData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                         </Pie>
//                         <Tooltip />
//                     </PieChart>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-slate-50 rounded-lg p-4">
//                     <h4 className="font-semibold mb-2">Prosody (Pitch / Energy)</h4>
//                     <LineChart width={450} height={240} data={report.prosodyTimeline}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="t" />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Line type="monotone" dataKey="pitch" stroke="#8884d8" dot={false} />
//                         <Line type="monotone" dataKey="energy" stroke="#82ca9d" dot={false} />
//                     </LineChart>
//                 </div>

//                 <div className="bg-slate-50 rounded-lg p-4">
//                     <h4 className="font-semibold mb-2">Detected issues & highlights</h4>
//                     <ul className="list-disc pl-5 text-sm">
//                         {report.highlights.map((h, i) => <li key={i}>{h}</li>)}
//                     </ul>

//                     <div className="mt-4">
//                         <h5 className="font-semibold">Fillers detected</h5>
//                         <p className="text-sm text-gray-700">{report.fillersDetected.join(', ')}</p>
//                     </div>
//                 </div>
//             </div>

//             <div className="flex justify-between items-center">
//                 <div>
//                     <button className="px-4 py-2 rounded bg-[#2a7397] text-white mr-3">Download PDF</button>
//                     <button className="px-4 py-2 rounded border" onClick={onBack}>Back</button>
//                 </div>
//                 <div className="text-xs text-gray-500">This is a frontend demo using dummy data.</div>
//             </div>
//         </div>
//     );
// }


//========================================================
// import { useState, useRef, useEffect } from "react";
// import Webcam from "react-webcam";
// import { motion } from "framer-motion";
// import Header from "./Header";

// export default function IntroVideoSection() {
//     const [mode, setMode] = useState("upload"); // "upload" | "record"
//     const [file, setFile] = useState(null);
//     const [preview, setPreview] = useState(null);
//     const [snapshot, setSnapshot] = useState(null);
//     const [recordedChunks, setRecordedChunks] = useState([]);
//     const [capturing, setCapturing] = useState(false);
//     const [time, setTime] = useState(0);

//     const webcamRef = useRef(null);
//     const mediaRecorderRef = useRef(null);
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);

//     // ⏱ Track Recording Time
//     useEffect(() => {
//         let timer;
//         if (capturing) {
//             timer = setInterval(() => setTime((t) => t + 1), 1000);
//         } else {
//             clearInterval(timer);
//         }
//         return () => clearInterval(timer);
//     }, [capturing]);

//     // 📂 File Upload Handler
//     const handleFileUpload = (e) => {
//         const f = e.target.files[0];
//         if (!f) return;
//         setFile(f);
//         setPreview(URL.createObjectURL(f));
//     };

//     // 🎬 Start Recording
//     const startRecording = () => {
//         setRecordedChunks([]);
//         setTime(0);
//         setCapturing(true);

//         const stream = webcamRef.current.stream;
//         const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
//         mediaRecorderRef.current = mediaRecorder;

//         mediaRecorder.ondataavailable = (e) => {
//             if (e.data.size > 0) setRecordedChunks((prev) => [...prev, e.data]);
//         };

//         mediaRecorder.start();
//     };

//     // ⏹ Stop Recording
//     const stopRecording = () => {
//         mediaRecorderRef.current.stop();
//         setCapturing(false);
//         const imageSrc = webcamRef.current.getScreenshot();
//         setSnapshot(imageSrc);
//     };

//     // 💾 Save Recorded Video
//     const saveRecording = () => {
//         const blob = new Blob(recordedChunks, { type: "video/webm" });
//         const videoFile = new File([blob], "intro_video.webm", { type: "video/webm" });
//         setFile(videoFile);
//         setPreview(URL.createObjectURL(blob));
//     };

//     // 🔄 Reset
//     const reset = () => {
//         setFile(null);
//         setPreview(null);
//         setSnapshot(null);
//         setRecordedChunks([]);
//         setTime(0);
//     };

//     return (
//         <>
//             <Header />
//             <div className="pt-20 bg-[#ffffff] min-h-screen">
//                 <motion.div
//                     initial={{ opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className=" rounded-2xl shadow-md p-6 max-w-6xl mx-auto bg-linear-to-br from-white to-slate-50 "
//                 >
//                     <header className="mb-6">
//                         <h1 className="text-3xl font-extrabold text-[#1f6f99]">Introduction Video Analysis</h1>
//                         <p className="text-sm text-gray-600 mt-1">Upload an introduction video and get a multi-modal analysis report: visual, audio, posture, eye contact, fillers, sentiment, and prosody.</p>
//                     </header>
//                     {/* Mode Toggle */}
//                     <div className="flex gap-3 mb-6">
//                         <button
//                             onClick={() => setMode("upload")}
//                             className={`px-4 py-2 rounded-lg ${mode === "upload" ? "bg-[#2a7397] text-white" : "bg-slate-100"
//                                 }`}
//                         >
//                             Upload Video
//                         </button>
//                         <button
//                             onClick={() => setMode("record")}
//                             className={`px-4 py-2 rounded-lg ${mode === "record" ? "bg-[#2a7397] text-white" : "bg-slate-100"
//                                 }`}
//                         >
//                             Record Video
//                         </button>
//                     </div>

//                     {/* -------------------- UPLOAD MODE -------------------- */}
//                     {mode === "upload" && (
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
//                             <div className="md:col-span-2">
//                                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                                     Upload Your Introduction Video
//                                 </label>

//                                 <div
//                                     className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#2a7397] transition cursor-pointer bg-slate-50"
//                                     onClick={() => document.getElementById("videoUpload").click()}
//                                 >
//                                     <input
//                                         id="videoUpload"
//                                         type="file"
//                                         accept="video/*"
//                                         onChange={handleFileUpload}
//                                         className="hidden"
//                                     />

//                                     <div className="flex flex-col items-center justify-center space-y-2">
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             className="h-10 w-10 text-[#2a7397]"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke="currentColor"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={1.5}
//                                                 d="M12 16v-8m0 0l-4 4m4-4l4 4m6 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2"
//                                             />
//                                         </svg>
//                                         <p className="text-sm text-gray-600 font-medium">
//                                             Click to upload or drag & drop your video here
//                                         </p>
//                                         {!file ? (
//                                             <p className="text-xs text-gray-500">MP4, MOV, or AVI (max 30 sec)</p>
//                                         ) : (
//                                             <p className="mt-2 text-sm text-gray-700">
//                                                 <strong>Selected file:</strong> {file?.name}
//                                             </p>
//                                         )}
//                                     </div>
//                                 </div>

//                                 <p className="text-xs text-gray-500 mt-3">
//                                     Tip: For better facial and audio analysis, use a clear frontal shot and a quiet room.
//                                 </p>

//                                 <div className="mt-4 flex gap-3">
//                                     <button
//                                         className="px-4 py-2 bg-[#2a7397] text-white rounded-lg disabled:opacity-50"
//                                         disabled={!file}
//                                     >
//                                         Analyze
//                                     </button>
//                                     <button
//                                         className="px-4 py-2 border border-gray-200 rounded-lg"
//                                         onClick={reset}
//                                     >
//                                         Reset
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Preview Area */}
//                             <div className="bg-slate-50 rounded-lg mt-[-33px] p-3 flex flex-col items-center">
//                                 <p className="text-xs text-gray-600">Preview</p>
//                                 {preview ? (
//                                     <video ref={videoRef} src={preview} controls className="w-full h-32 mt-2 rounded" />
//                                 ) : (
//                                     <div className="w-full h-32 rounded bg-white/60 flex items-center justify-center text-gray-400 mt-2">
//                                         No file selected
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     )}

//                     {/* -------------------- RECORD MODE -------------------- */}
//                     {mode === "record" && (
//                         <div className="bg-slate-50 rounded-lg p-4 text-center">
//                             <Webcam
//                                 ref={webcamRef}
//                                 audio
//                                 screenshotFormat="image/jpeg"
//                                 className="rounded-lg  w-full h-64 "
//                             />

//                             {capturing && (
//                                 <p className="mt-3 text-[#2a7397] font-semibold">Recording: {time}s</p>
//                             )}

//                             <div className="mt-4 flex justify-center gap-3">
//                                 {!capturing ? (
//                                     <button
//                                         onClick={startRecording}
//                                         className="px-6 py-2 bg-[#2a7397] text-white rounded-lg"
//                                     >
//                                         Start Recording
//                                     </button>
//                                 ) : (
//                                     <button
//                                         onClick={stopRecording}
//                                         className="px-6 py-2 bg-red-600 text-white rounded-lg"
//                                     >
//                                         Stop
//                                     </button>
//                                 )}

//                                 {recordedChunks.length > 0 && (
//                                     <button
//                                         onClick={saveRecording}
//                                         className="px-6 py-2 bg-green-600 text-white rounded-lg"
//                                     >
//                                         Save Recording
//                                     </button>
//                                 )}

//                                 <button onClick={reset} className="px-4 py-2 border rounded-lg">
//                                     Reset
//                                 </button>
//                             </div>

//                             {preview && (
//                                 <div className="mt-4">
//                                     <p className="text-sm text-gray-600">Recorded Preview:</p>
//                                     <video src={preview} controls className="w-full rounded-lg mt-2" />
//                                 </div>
//                             )}

//                             {snapshot && (
//                                 <div className="mt-4">
//                                     <p className="text-sm text-gray-600 mb-1">Snapshot:</p>
//                                     <img
//                                         src={snapshot}
//                                         alt="snapshot"
//                                         className="w-32 h-32 object-cover rounded-lg shadow"
//                                     />
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     <canvas ref={canvasRef} style={{ display: "none" }} />
//                 </motion.div>
//             </div>

//         </>

//     );
// }


// updated code
// import React, { useState, useRef, useEffect } from "react";
// import Webcam from "react-webcam";
// import { motion } from "framer-motion";
// import Header from "./Header";

// export default function IntroVideoSection() {
//     const [mode, setMode] = useState("upload"); // upload | record
//     const [file, setFile] = useState(null);
//     const [preview, setPreview] = useState(null);
//     const [snapshot, setSnapshot] = useState(null);
//     const [recordedChunks, setRecordedChunks] = useState([]);
//     const [capturing, setCapturing] = useState(false);
//     const [time, setTime] = useState(0);
//     const [showModal, setShowModal] = useState(false);

//     const webcamRef = useRef(null);
//     const mediaRecorderRef = useRef(null); //32451 ==> 32514
//     const videoRef = useRef(null);

//     // Timer ⏱
//     useEffect(() => {
//         let timer;
//         if (capturing) timer = setInterval(() => setTime((t) => t + 1), 1000);
//         else clearInterval(timer);
//         return () => clearInterval(timer);
//     }, [capturing]);

//     // File upload
//     const handleFileUpload = (e) => {
//         const f = e.target.files[0];
//         if (!f) return;
//         setFile(f);
//         setPreview(URL.createObjectURL(f));
//     };

//     // Start recording 🎥
//     const startRecording = () => {
//         setRecordedChunks([]);
//         setTime(0);
//         setCapturing(true);

//         const stream = webcamRef.current.stream;
//         const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
//         mediaRecorderRef.current = mediaRecorder;

//         mediaRecorder.ondataavailable = (e) => {
//             if (e.data.size > 0) setRecordedChunks((prev) => [...prev, e.data]);
//         };

//         mediaRecorder.start();
//     };

//     // Stop recording 🟥
//     const stopRecording = () => {
//         mediaRecorderRef.current.stop();
//         setCapturing(false);

//         const imageSrc = webcamRef.current.getScreenshot();
//         setSnapshot(imageSrc);

//         // open modal after recording
//         setTimeout(() => setShowModal(true), 500);
//     };

//     // Save recording ✅
//     const saveRecording = () => {
//         const blob = new Blob(recordedChunks, { type: "video/webm" });
//         const videoFile = new File([blob], "intro_video.webm", { type: "video/webm" });
//         setFile(videoFile);
//         setPreview(URL.createObjectURL(blob));
//         setShowModal(false);
//     };

//     const reset = () => {
//         setFile(null);
//         setPreview(null);
//         setSnapshot(null);
//         setRecordedChunks([]);
//         setTime(0);
//         setShowModal(false);
//     };

//     return (
//         <>
//             <Header />
//             <div className="pt-20 bg-white min-h-screen">
//                 <motion.div
//                     initial={{ opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="rounded-2xl shadow-md p-6 max-w-6xl mx-auto bg-linear-to-br from-white to-slate-50"
//                 >
//                     <header className="mb-6">
//                         <h1 className="text-3xl font-extrabold text-[#1f6f99]">
//                             Introduction Video Analysis
//                         </h1>
//                         <p className="text-sm text-gray-600 mt-1">
//                             Upload or record your introduction video for analysis.
//                         </p>
//                     </header>

//                     {/* Toggle */}
//                     <div className="flex gap-3 mb-6">
//                         <button
//                             onClick={() => setMode("upload")}
//                             className={`px-4 py-2 rounded-lg ${mode === "upload"
//                                     ? "bg-[#2a7397] text-white"
//                                     : "bg-slate-100 text-gray-700"
//                                 }`}
//                         >
//                             Upload Video
//                         </button>
//                         <button
//                             onClick={() => setMode("record")}
//                             className={`px-4 py-2 rounded-lg ${mode === "record"
//                                     ? "bg-[#2a7397] text-white"
//                                     : "bg-slate-100 text-gray-700"
//                                 }`}
//                         >
//                             Record Video
//                         </button>
//                     </div>

//                     {/* ---------- UPLOAD ---------- */}
//                     {mode === "upload" && (
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
//                             <div className="md:col-span-2">
//                                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                                     Upload Your Introduction Video
//                                 </label>

//                                 <div
//                                     className="relative border-2 p-6 border-dashed border-gray-300 rounded-lg  text-center hover:border-[#2a7397] transition cursor-pointer bg-slate-50"
//                                     onClick={() => document.getElementById("videoUpload").click()}
//                                 >
//                                     <input
//                                         id="videoUpload"
//                                         type="file"
//                                         accept="video/*"
//                                         onChange={handleFileUpload}
//                                         className="hidden"
//                                     />
//                                     <p className="text-sm text-gray-600 p-6 font-medium">
//                                         Click to upload or drag & drop your video here
//                                     </p>
//                                     {file && (
//                                         <p className="mt-2 text-sm text-gray-700">
//                                             <strong>Selected file:</strong> {file?.name}
//                                         </p>
//                                     )}
//                                 </div>

//                                 <div className="mt-4 flex gap-3">
//                                     <button
//                                         className="px-4 py-2 bg-[#2a7397] text-white rounded-lg disabled:opacity-50"
//                                         disabled={!file}
//                                     >
//                                         Analyze
//                                     </button>
//                                     <button
//                                         className="px-4 py-2 border border-gray-200 rounded-lg"
//                                         onClick={reset}
//                                     >
//                                         Reset
//                                     </button>
//                                 </div>
//                             </div>

//                             <div className="bg-slate-50 rounded-lg p-3 flex flex-col items-center">
//                                 <p className="text-xs text-gray-600">Preview</p>
//                                 {preview ? (
//                                     <video
//                                         ref={videoRef}
//                                         src={preview}
//                                         controls
//                                         className="w-full h-32 mt-2 rounded"
//                                     />
//                                 ) : (
//                                     <div className="w-full h-32 bg-white/60 flex items-center justify-center text-gray-400 mt-2 rounded">
//                                         No file selected
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     )}

//                     {/* ---------- RECORD ---------- */}
//                     {mode === "record" && (
//                         <div className="bg-slate-50 rounded-lg p-4 text-center">
//                             <Webcam
//                                 ref={webcamRef}
//                                 audio
//                                 screenshotFormat="image/jpeg"
//                                 className="rounded-lg w-full h-64"
//                             />
//                             {capturing && (
//                                 <p className="mt-3 text-[#2a7397] font-semibold">Recording: {time}s</p>
//                             )}
//                             <div className="mt-4 flex justify-center gap-3">
//                                 {!capturing ? (
//                                     <button
//                                         onClick={startRecording}
//                                         className="px-6 py-2 bg-[#2a7397] text-white rounded-lg"
//                                     >
//                                         Start Recording
//                                     </button>
//                                 ) : (
//                                     <button
//                                         onClick={stopRecording}
//                                         className="px-6 py-2 bg-red-600 text-white rounded-lg"
//                                     >
//                                         Stop
//                                     </button>
//                                 )}
//                                 <button onClick={reset} className="px-4 py-2 border rounded-lg">
//                                     Reset
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </motion.div>

//                 {/* ---------- MODAL PREVIEW ---------- */}
//                 {showModal && (
//                     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full">
//                             <h2 className="text-lg font-semibold mb-3">Preview Your Recording</h2>
//                             <video
//                                 src={URL.createObjectURL(new Blob(recordedChunks, { type: "video/webm" }))}
//                                 controls
//                                 className="w-full rounded-lg mb-4"
//                             />
//                             <div className="flex justify-end gap-3">
//                                 <button
//                                     onClick={reset}
//                                     className="px-4 py-2 border border-gray-300 rounded-lg"
//                                 >
//                                     Reset
//                                 </button>
//                                 <button
//                                     onClick={saveRecording}
//                                     className="px-4 py-2 bg-[#2a7397] text-white rounded-lg"
//                                 >
//                                     Upload
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </>

//     );
// }

// new

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function ProfilePage() {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl p-8 relative overflow-hidden"
                >
                    {/* Decorative Background */}
                    <div className="absolute top-0 left-0 w-60 h-60 rounded-full blur-3xl opacity-30 animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-60 h-60  rounded-full blur-3xl opacity-30 animate-pulse" />

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Left Section: User Profile */}
                        <div className="flex flex-col items-center md:items-start">
                            <motion.img
                                src="https://via.placeholder.com/150"
                                alt="Profile"
                                className="w-36 h-36 rounded-full border-4 border-[#286a94] shadow-lg mb-4"
                                whileHover={{ scale: 1.05 }}
                            />
                            <h2 className="text-3xl font-bold text-[#286a94] mb-1">
                                Abhishek Yadav
                            </h2>
                            <p className="text-gray-600 mb-4">
                                MERN Stack Developer | 2+ years experience
                            </p>

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-gray-700 shadow-inner w-full">
                                <h3 className="text-[#286a94] font-semibold mb-2">
                                    Profile Details
                                </h3>
                                <ul className="space-y-1">
                                    <li><strong>Email:</strong> abhishek@example.com</li>
                                    <li><strong>Phone:</strong> +91 9876543210</li>
                                    <li><strong>City:</strong> Delhi, India</li>
                                    <li><strong>Member Since:</strong> March 2023</li>
                                </ul>
                            </div>
                        </div>

                        {/* Right Section: Test Description */}
                        <div className="flex flex-col justify-center space-y-4">
                            <motion.h2
                                className="text-2xl font-bold text-[#286a94]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                🧩 Introduction Test Overview
                            </motion.h2>
                            <p className="text-gray-700 leading-relaxed">
                                In this test, you’ll record a short video introducing yourself.
                                Talk about your background, skills, and interests. This helps us
                                understand your communication style and personality better.
                            </p>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-gray-50 border rounded-xl p-4">
                                    <h4 className="text-[#286a94] font-semibold mb-1">📋 Duration</h4>
                                    <p>60 seconds</p>
                                </div>
                                <div className="bg-gray-50 border rounded-xl p-4">
                                    <h4 className="text-[#286a94] font-semibold mb-1">🎯 Objective</h4>
                                    <p>Self Introduction</p>
                                </div>
                                <div className="bg-gray-50 border rounded-xl p-4">
                                    <h4 className="text-[#286a94] font-semibold mb-1">🎥 Camera</h4>
                                    <p>Required (Video + Audio)</p>
                                </div>
                                <div className="bg-gray-50 border rounded-xl p-4">
                                    <h4 className="text-[#286a94] font-semibold mb-1">💾 Format</h4>
                                    <p>MP4 Upload</p>
                                </div>
                            </div>

                            <motion.button
                                onClick={() => navigate("/record")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-[#286a94] hover:bg-[#5992b6] text-white font-semibold py-3 px-6 rounded-xl shadow-lg mt-6"
                            >
                                🚀 Start Your Introduction Test
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>

    );
}

