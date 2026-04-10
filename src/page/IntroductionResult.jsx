import { useState, useRef, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDownloadCandidateResultMutation, useViewResultByUserIdQuery } from '../redux/services/vendorApi';
import PageLoader from '../libs/PageLoader';
import { base } from '../redux/services/api';
import toast from 'react-hot-toast';
import { useViewResultByUserIdBySubVendorQuery } from '../redux/services/subvendorApi';

export default function IntroAnalysisApp() {
    const [step, setStep] = useState('result');
    const [searchParams] = useSearchParams();
    const candidateId = searchParams.get("candidateId");
    const resultId = searchParams.get("resultId");
    const role = localStorage.getItem('role')
    const { data, isLoading } = role === "sub_vendor" ? useViewResultByUserIdBySubVendorQuery({ candidateId, resultId }) : useViewResultByUserIdQuery({ candidateId, resultId })


    const navigate = useNavigate()
    const [dummyReport, setDummyReport] = useState(null);


    function mapApiResultToReport(api) {
        const clamp = (val) => Math.max(0, Math.min(100, Math.round(val * 100)));
        // console.log("api", api)
        const feedback = api?.metrics_json?.feedback || {};

        // 🔥 Transform for UI
        const feedbackUI = transformFeedbackForUI(feedback);
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
            // feedback: api?.metrics_json?.feedback,
            feedbackUI,
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

    function transformFeedbackForUI(feedback) {
        return [
            {
                tab: "Parent",
                key: "Parent",
                sections: [
                    { title: "Strengths", type: "list", data: feedback?.parent?.strengths || [] },
                    { title: "Areas of Improvement", type: "list", data: feedback?.parent?.areas_of_improvement || [] },
                    { title: "Guidance", type: "list", data: feedback?.parent?.parent_guidance || [] },
                    { title: "Summary", type: "text", data: feedback?.parent?.overall_summary || "" },
                    { title: "Encouragement", type: "text", data: feedback?.parent?.encouragement || "" },
                    {
                        title: "Levels",
                        type: "badges",
                        data: {
                            confidence: feedback?.parent?.confidence_level,
                            communication: feedback?.parent?.communication_level
                        }
                    }
                ]
            },
            {
                tab: "Vendor",
                key: "Vendor",
                sections: [
                    { title: "Key Strengths", type: "list", data: feedback?.vendor?.key_strengths || [] },
                    { title: "Critical Issues", type: "list", data: feedback?.vendor?.critical_issues || [] },
                    { title: "Training Focus", type: "list", data: feedback?.vendor?.training_focus || [] },
                    { title: "Recommendations", type: "list", data: feedback?.vendor?.recommendations || [] },
                    { title: "Skill Assessment", type: "badges", data: feedback?.vendor?.skill_assessment || {} },
                    {
                        title: "Final Decision",
                        type: "highlight",
                        data: {
                            hire: feedback?.vendor?.hire_recommendation,
                            performance: feedback?.vendor?.performance_summary
                        }
                    }
                ]
            },
            {
                tab: "Candidate",
                key: "Candidate",
                sections: [
                    { title: "Strengths", type: "list", data: feedback?.candidate?.strengths || [] },
                    { title: "Areas to Improve", type: "list", data: feedback?.candidate?.areas_to_improve || [] },
                    { title: "Recommendations", type: "list", data: feedback?.candidate?.recommendations || [] },
                    { title: "Tips", type: "list", data: feedback?.candidate?.tips || [] }
                ]
            }
        ];
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
            const response = localStorage.getItem('role') === "sub_vendor" ? await fetch(`${base}/vendor/result/download?result_id=${resultId}&format=pdf`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'), // your auth header
                },
            }) :
                await fetch(`${base}/vendor/result/download?result_id=${resultId}&format=pdf`, {
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
            toast.error(error?.message ?? "Something went wrong. Pls try again")
            // console.error('Download error:', error);
        } finally {
            setPdfLoader(false)
        }
    };

    if (isLoading || !dummyReport) {
        return <PageLoader />
    }

    return (
        <>
            <div className=" bg-linear-to-br from-white to-slate-50 p-6">
                <div className="max-w-5xl mx-auto">
                    {step === 'result' && (
                        <ResultPage report={dummyReport} pdfLoader={pdfLoader} downloadClickHandler={downloadPDF} onBack={() => navigate(-1)} />)}

                    <footer className="text-xs text-gray-500 mt-8">Built by ebench team {new Date().getFullYear()}.</footer>
                </div>
            </div>
        </>

    );
}

function ResultPage({ report, onBack, pdfLoader, downloadClickHandler }) {
    console.log("reee", report);
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

    // console.log("rttrt", report);

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

    //"AABABBA", k = 1
// Output: 4

    function solution(s,k){
        let ans=0;

        for(let i=0;i<s.length;i++){
            const arr=new Array(26).fill(0);
            let maxi=0;
            for(let j=i;j<s.length;j++){
                let  index=s[j].charCodeAt(0)-'A'.charCodeAt(0)
                arr[index]+=1
                maxi=Math.max(maxi,arr[index])
                let valid=j-i+1 - maxi
                if(valid<=k){
                    ans=Math.max(ans,j-i+1)
                }
                if(valid>k){
                    break;
                }
            }
        }
        console.log(ans);
    }
    solution("AABABBACFKR",2)
    //"AABABBA", k = 1
    
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
                                    className='cursor-pointer'
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
                    <div className=" bg-slate-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Multi-modal scores</h4>
                        <div className="flex gap-6">
                            <RadarChart cx={150} cy={120} outerRadius={80} width={300} height={240} data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar name="Scores" dataKey="A" stroke="#2a7397" fill="#2a7397" fillOpacity={0.35} />
                            </RadarChart>

                            {/* <BarChart width={360} height={240} data={barData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="score" fill="#2a7397" />
                            </BarChart> */}
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

                <div className="grid grid-cols-1 md:grid-cols- gap-6">
                    {/* <div className="bg-slate-50 rounded-lg p-4">
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
                    </div> */}

                    <div className="bg-slate-50 rounded-lg p-4">
                        {/* <h4 className="font-semibold mb-2">Feedback & highlights</h4>
                        <ul className="list-disc pl-5 text-sm">
                            {report.highlights.map((h, i) => <li key={i}>{h}</li>)}
                        </ul> */}

                        {
                            report?.feedbackUI?.length > 0 &&
                            report?.feedbackUI?.map((item) => {
                                return <div key={item?.key} className="mt-4 ">
                                    <h5 className="font-semibold border-b border-gray-200 pb-2 mb-4">{item?.key} feedback</h5>
                                    <ul className="list-disc pl-5 text-sm flex flex-wrap gap-10">
                                        {item?.sections?.length ? (
                                            item.sections.map((section, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-white w-96 rounded-xl shadow-sm border border-gray-200 p-4 mb-4"
                                                >
                                                    <h5 className="font-semibold text-gray-800 mb-2">
                                                        {section?.title || "Untitled"}
                                                    </h5>

                                                    {/* LIST */}
                                                    {section?.type === "list" && (
                                                        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                                            {Array.isArray(section?.data) && section.data.length > 0 ? (
                                                                section.data.map((listItem, idx) => (
                                                                    <li key={idx}>{listItem || "N/A"}</li>
                                                                ))
                                                            ) : (
                                                                <li>No data available</li>
                                                            )}
                                                        </ul>
                                                    )}

                                                    {/* TEXT */}
                                                    {section?.type === "text" && (
                                                        <p className="text-sm text-gray-700">
                                                            {section?.data || "No data available"}
                                                        </p>
                                                    )}

                                                    {/* BADGES */}
                                                    {section?.type === "badges" && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {section?.data && Object.keys(section.data).length > 0 ? (
                                                                Object.entries(section.data).map(([key, value]) => (
                                                                    <span
                                                                        key={key}
                                                                        className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                                                                    >
                                                                        {key}: {value || "N/A"}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-xs text-gray-500">
                                                                    No data available
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* HIGHLIGHT */}
                                                    {section?.type === "highlight" && (
                                                        <div className="text-sm text-gray-700 space-y-1">
                                                            <p>
                                                                <b>Hire:</b> {section?.data?.hire || "N/A"}
                                                            </p>
                                                            <p>
                                                                <b>Performance:</b> {section?.data?.performance || "N/A"}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No sections available</p>
                                        )}
                                    </ul>
                                </div>
                            })
                        }

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