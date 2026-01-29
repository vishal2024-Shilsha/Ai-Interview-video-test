import { useState, useRef, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDownloadCandidateResultMutation, useViewResultByUserIdQuery } from '../redux/services/vendorApi';
import PageLoader from '../libs/PageLoader';
import { base } from '../redux/services/api';

export default function IntroAnalysisApp() {
    const [step, setStep] = useState('result'); // upload | processing | result
    // const [file, setFile] = useState(null);
    // const [preview, setPreview] = useState(null);
    // const [report, setReport] = useState(null);
    // const videoRef = useRef(null);
    // const canvasRef = useRef(null);
    const [searchParams] = useSearchParams();
    const candidateId = searchParams.get("candidateId");
    const resultId = searchParams.get("resultId");
    // console.log("ppp")
    const { data, isLoading } = useViewResultByUserIdQuery({ candidateId, resultId })
    console.log("jojo", data);

    // function handleFile(e) {
    //     const f = e.target.files[0];
    //     if (!f) return;
    //     setFile(f);
    //     const url = URL.createObjectURL(f);
    //     setPreview(url);
    // }

    const navigate = useNavigate()
    // const [showResult, setShowResult] = useState(false);
    const [dummyReport, setDummyReport] = useState(null);

    const [downloadPdf, { isLoading: downloadLoading, isError: dowloadError }] = useDownloadCandidateResultMutation();

    function mapApiResultToReport(api) {
        const clamp = (val) => Math.max(0, Math.min(100, Math.round(val * 100)));

        return {
            profileImage: 'https://randomuser.me/api/portraits/men/44.jpg', // fallback / static
            name: `${api?.first_name} ${api.last_name}`,
            email: api.email,
            mobile: '+91' + api?.mobile,
            country_of_residence: api?.country_of_residence,
            candidate_id: api?.candidate_id,
            // Visual
            visualScore: clamp(
                (api.eye_contact + api.posture_score + api.gaze_score + api.smile_score) / 4
            ),
            postureScore: clamp(api.posture_score),
            eyeContactScore: clamp(api.eye_contact),

            // Audio
            audioScore: clamp(api.audio_confidence),
            fillersScore: clamp(1 - api.filler_density),
            prosodyScore: clamp(
                (api.metrics_json.audio.prosody.pitch_std > 0 ? 0.7 : 0.5) +
                (api.metrics_json.audio.prosody.energy_std > 0 ? 0.3 : 0.2)
            ),

            // Overall
            overallScore: clamp(api.final_score),
            transcript: api?.transcript,

            // Prosody timeline (synthetic but consistent)
            prosodyTimeline: Array.from({ length: 40 }).map((_, i) => ({
                t: i,
                pitch:
                    api.prosody_pitch_mean +
                    Math.sin(i / 4) * api.prosody_pitch_std * 0.01,
                energy:
                    api.prosody_energy_mean +
                    Math.abs(Math.sin(i / 5)) * api.prosody_energy_std * 0.05,
            })),

            // Fillers
            fillersDetected: Object.entries(
                api.metrics_json.audio.fillers.by_word
            )
                .filter(([, count]) => count > 0)
                .map(([word]) => word),

            // Sentiment mapping
            sentiment: {
                positive: api.sentiment >= 0.6 ? 6 : 3,
                neutral: api.sentiment >= 0.4 && api.sentiment < 0.6 ? 5 : 3,
                negative: api.sentiment < 0.4 ? 4 : 1,
            },

            highlights: [
                api.eye_contact > 0.8 && 'Excellent eye contact',
                api.audio_confidence > 0.9 && 'Strong vocal confidence',
                api.filler_density === 0 && 'No filler words detected',
                api.posture_score > 0.8 && 'Good posture maintained',
            ].filter(Boolean),
        };
    }


    useEffect(() => {
        if (data) {
            const mappedReport = mapApiResultToReport(data);
            setDummyReport(mappedReport);
        }
    }, [data])

    const [pdfLoader, setPdfLoader] = useState(false);
    const downloadPDF = async () => {
        let resultId = data?.result_id
        try {
            setPdfLoader(true)
            const response = await fetch(`${base}/vendor/result/download?result_id=${resultId}&format=pdf`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'), // your auth header
                },
            });

            if (!response.ok) throw new Error('Download failed');

            // Create blob from binary response
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `candidate_result_${resultId}.pdf`;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
        } finally {
            setPdfLoader(false)
        }
    };


    // function downloadClickHandler() {
    //     console.log("jijij", data?.result_id)
    //     if (!data?.result_id) {
    //         return toast.error("Result Id not exist ")
    //     }

    //     try {
    //         const result = downloadPdf({ resultId: data?.result_id }).unwrap();



    //         // Extract filename from headers
    //         const headers = result.meta?.response?.headers;
    //         let filename = `result.pdf`;

    //         const contentDisposition = headers?.get('content-disposition');
    //         if (contentDisposition) {
    //             const match = contentDisposition.match(/filename=(.+)/);
    //             if (match) filename = match[1];
    //         }

    //         // Download
    //         const url = URL.createObjectURL(result.data);
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.download = filename;
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);

    //         window.URL.revokeObjectURL(url);

    //     } catch (err) {
    //         console.log("ere", err)
    //         toast.error(err?.message ?? "Internal Server Error")
    //     }
    // }



    if (isLoading || !dummyReport) {
        return <PageLoader />
    }

    // const dummyReport = {
    //     profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    //     name: 'Jane Doe',
    //     email: 'jane.doe@example.com',
    //     linkedin: 'https://linkedin.com/in/janedoe',
    //     github: 'https://github.com/janedoe',
    //     visualScore: 85,
    //     audioScore: 78,
    //     postureScore: 82,
    //     eyeContactScore: 74,
    //     fillersScore: 68,
    //     prosodyScore: 80,
    //     overallScore: 78,
    //     prosodyTimeline: new Array(40).fill(0).map((_, i) => ({ t: i, pitch: 80 + Math.sin(i / 4) * 6 + Math.random() * 6, energy: 0.5 + Math.abs(Math.sin(i / 5)) * 1.3 + Math.random() * 0.2 })),
    //     fillersDetected: ['um', 'uh', 'like'],
    //     sentiment: { positive: 6, neutral: 3, negative: 1 },
    //     highlights: [
    //         'Good confidence and clarity.',
    //         'Moderate eye contact — can improve a bit.',
    //         'Few filler words detected.',
    //     ],
    // };

    // async function startAnalysis() {
    //     if (!file) return alert('Please select a video first');
    //     setStep('processing');

    //     // Run a mock analysis locally (synchronous computations occur while app runs).
    //     // In production: upload the file to your backend or call cloud ML APIs.
    //     // const result = await runAnalysisMock(file, videoRef.current, canvasRef.current);
    //     const formdata = new FormData()
    //     formdata.append('video', file);
    //     const result = await fetch(`${import.meta.env.VITE_BASE_URL}/upload_video`, {
    //         method: "POST",
    //         body: formdata,
    //     })
    //     const data = await result.json();
    //     // console.log("ddlljj", data); 
    //     // setReport(result);
    //     setTimeout(() => {
    //         setStep('result');
    //     }, 1000)
    // }

    console.log("dummyReport", dummyReport)

    return (
        <>
            <div className=" bg-linear-to-br from-white to-slate-50 p-6">
                <div className="max-w-5xl mx-auto">
                    {/* <header className="mb-6">
    <h1 className="text-3xl font-extrabold text-[#1f6f99]">Introduction Video Analysis</h1>
    <p className="text-sm text-gray-600 mt-1">Upload an introduction video and get a multi-modal analysis report: visual, audio, posture, eye contact, fillers, sentiment, and prosody.</p>
</header> */}



                    {step === 'result' && (
                        <ResultPage report={dummyReport} pdfLoader={pdfLoader} downloadClickHandler={downloadPDF} onBack={() => navigate(-1)} />)}

                    <footer className="text-xs text-gray-500 mt-8">Built by ebench team @2025.</footer>
                </div>
            </div>
        </>

    );
}

function ResultPage({ report, onBack, pdfLoader, downloadClickHandler }) {
    if (!report) {
        return;
    }
    const radarData = [
        { subject: 'Visual', A: report?.visualScore },
        { subject: 'Audio', A: report?.audioScore },
        { subject: 'Posture', A: report?.postureScore },
        { subject: 'Eye Contact', A: report?.eyeContactScore },
        { subject: 'Fillers', A: report?.fillersScore },
        { subject: 'Prosody', A: report?.prosodyScore }
    ];

    const barData = [
        { name: 'Visual', score: report.visualScore },
        { name: 'Audio', score: report.audioScore },
        { name: 'Posture', score: report.postureScore },
        { name: 'Eye', score: report.eyeContactScore },
        { name: 'Fillers', score: report.fillersScore },
        { name: 'Prosody', score: report.prosodyScore }
    ];

    const pieData = [
        { name: 'Positive', value: report.sentiment.positive },
        { name: 'Neutral', value: report.sentiment.neutral },
        { name: 'Negative', value: report.sentiment.negative }
    ];

    const COLORS = ['#2a9d8f', '#f4a261', '#e76f51'];
    const [showId, setShowId] = useState(false);

    const renderLabel = ({ cx, cy, midAngle, outerRadius, name, value }) => {
        // Calculate position for label **outside the slice**
        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 23; // distance from slice
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        // Only show label if value > 0
        if (value <= 0) return null;

        return (
            <text
                x={x}
                y={y}
                fill="#6B7280"
                fontSize="11"
                textAnchor={x > cx ? "start" : "end"} // left/right based on side
                dominantBaseline="central"
            >
                {name}
            </text>
        );
    };

    return (
        <>
            {/* <div className='pb-4 font-semibold text-xl text-[#2559b3] '>Candidate Result Details :-</div> */}
            <div className="bg-white rounded-2xl shadow p-6 space-y-6">
                <div className="flex items-start gap-10">
                    {/* Left: Photo */}
                    <div className="shrink-0">
                        <img
                            src={report.profileImage}
                            alt="profile"
                            className="w-32 h-32 rounded-full object-cover shadow-md "
                        />
                    </div>

                    {/* Right: Details */}
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-3">
                            {report.name}
                        </h3>

                        {/* Labeled fields */}
                        <div className="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
                            <div>
                                <span className="text-gray-400 block">Email</span>
                                <span className="text-gray-700">{report.email}</span>
                            </div>

                            <div>
                                <span className="text-gray-400 block">Mobile</span>
                                <span className="text-gray-700">{report.mobile}</span>
                            </div>

                            <div>
                                <span className="text-gray-400 block">Country</span>
                                <span className="text-gray-700">
                                    {report?.country_of_residence}
                                </span>
                            </div>



                            <div>
                                <span className="text-gray-400 block">Candidate ID</span>

                                {/* Checkbox */}
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={showId}
                                        onChange={() => setShowId(!showId)}
                                    />
                                    Show Candidate ID
                                </label>

                                {/* Conditionally show ID */}
                                {showId && (
                                    <span className="text-gray-700 text-xs mt-1">
                                        {report?.candidate_id}
                                    </span>
                                )}
                            </div>


                            <div>
                                <span className="text-gray-400 block">Overall Score</span>
                                <span className="text-gray-700">
                                    {report.overallScore} / 100
                                </span>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-2 bg-slate-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Multi-modal scores</h4>
                        <div className="flex gap-6">
                            <RadarChart cx={150} cy={120} outerRadius={80} width={300} height={240} data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar name="Scores" dataKey="A" stroke="#2a7397" fill="#2a7397" fillOpacity={0.35} />
                            </RadarChart>

                            <BarChart width={360} height={240} data={barData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="score" fill="#2a7397" />
                            </BarChart>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Sentiment</h4>
                        {/* <PieChart width={240} height={200}>
                            <Pie dataKey="value" data={pieData} cx={120} cy={100} outerRadius={60} label>
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart> */}
                        <PieChart width={240} height={200}>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                cx={120}
                                cy={100}
                                outerRadius={60}
                                label={renderLabel} // custom label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>


                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Prosody (Pitch / Energy)</h4>
                        <LineChart width={450} height={240} data={report.prosodyTimeline}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="t" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="pitch" stroke="#8884d8" dot={false} />
                            <Line type="monotone" dataKey="energy" stroke="#82ca9d" dot={false} />
                        </LineChart>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Detected issues & highlights</h4>
                        <ul className="list-disc pl-5 text-sm">
                            {report.highlights.map((h, i) => <li key={i}>{h}</li>)}
                        </ul>

                        <div className="mt-4">
                            <h5 className="font-semibold">Transcript Details</h5>
                            <p className="text-sm text-gray-700">{report?.transcript ?? 'N/A'}</p>
                            {/* <p className="text-sm text-gray-700">{report.fillersDetected.join(', ')}</p> */}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div>
                        <button className="px-4 py-2 rounded bg-[#2a7397] text-white mr-3" onClick={downloadClickHandler}>{pdfLoader ? 'Downloading' : 'Download PDF'} </button>
                        <button className="px-4 py-2 rounded border" onClick={onBack}>Back</button>
                    </div>
                </div>
            </div>
        </>

    );
}


//  {step === 'upload' && (
//                         <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-md p-6">
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
//                                 <div className="md:col-span-2">
//                                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                                         Upload Your Introduction Video
//                                     </label>

//                                     <div
//                                         className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#2a7397] transition cursor-pointer bg-slate-50"
//                                         onClick={() => document.getElementById('videoUpload').click()}
//                                     >
//                                         <input
//                                             id="videoUpload"
//                                             type="file"
//                                             accept="video/*"
//                                             onChange={handleFile}
//                                             className="hidden"
//                                         />

//                                         <div className="flex flex-col items-center justify-center space-y-2">
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className="h-10 w-10 text-[#2a7397]"
//                                                 fill="none"
//                                                 viewBox="0 0 24 24"
//                                                 stroke="currentColor"
//                                             >
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     strokeWidth={1.5}
//                                                     d="M12 16v-8m0 0l-4 4m4-4l4 4m6 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2"
//                                                 />
//                                             </svg>
//                                             <p className="text-sm text-gray-600 font-medium">
//                                                 Click to upload or drag & drop your video here
//                                             </p>
//                                             {
//                                                 !file ?
//                                                     <p className="text-xs text-gray-500">MP4, MOV, or AVI (max 30 sec)</p>
//                                                     :
//                                                     <p className="mt-2 text-sm text-gray-700">
//                                                         <strong>Selected file:</strong> {file?.name}
//                                                     </p>}
//                                         </div>
//                                     </div>

//                                     <p className="text-xs text-gray-500 mt-3">
//                                         Tip: For better facial and audio analysis, use a clear frontal shot and a quiet room.
//                                     </p>

//                                     <div className="mt-4 flex gap-3">
//                                         <button
//                                             className="px-4 py-2 bg-[#2a7397] text-white rounded-lg disabled:opacity-50"
//                                             onClick={startAnalysis}
//                                             disabled={!file}
//                                         >
//                                             Analyze
//                                         </button>
//                                         <button
//                                             className="px-4 py-2 border border-gray-200 rounded-lg"
//                                             onClick={() => {
//                                                 setFile(null);
//                                                 setPreview(null);
//                                             }}
//                                         >
//                                             Reset
//                                         </button>
//                                     </div>
//                                 </div>

//                                 <div className="bg-slate-50 rounded-lg mt-[-33px] p-3 flex flex-col items-center">
//                                     <p className="text-xs text-gray-600">Preview</p>
//                                     {preview ? (
//                                         <video ref={videoRef} src={preview} controls className="w-full h-32 mt-2 rounded" />
//                                     ) : (
//                                         <div className="w-full h-32 rounded bg-white/60 flex items-center justify-center text-gray-400 mt-2">
//                                             No file selected
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>


//                             {/* invisible canvas for frame capture */}
//                             <canvas ref={canvasRef} style={{ display: 'none' }} />
//                         </motion.div>
//                     )}

//                     {step === 'processing' && (
//                         <div className="bg-white rounded-2xl shadow p-8 text-center">
//                             <h2 className="text-xl font-semibold">Processing your video</h2>
//                             <p className="text-sm text-gray-600 mt-2">The app is analyzing audio, frames and posture — this is a demo analysis done locally in your browser.</p>
//                             <div className="mt-6">
//                                 <div className="inline-block px-4 py-2 rounded-full bg-[#e6f2fb] text-[#0f5678]">Running analysis</div>
//                             </div>
//                         </div>
//                     )}