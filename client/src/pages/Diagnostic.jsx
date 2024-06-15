import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import videobg from "../assets/vid.mp4";
import "./DiagStyle.css";
import { getAuth, signOut } from "firebase/auth";

export default function Diagnostic() {
    const navigate = useNavigate();

    // Function to handle logout
    const LogOut = () => {
        const auth = getAuth();
        localStorage.removeItem("token");
        signOut(auth)
            .then(() => {
                navigate("/sign");
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };

    // State variables
    const [symptomCount, setSymptomCount] = useState(1);
    const [symptoms, setSymptoms] = useState([]);
    const [predicting, setPredicting] = useState(true);
    const [symptomOptions, setSymptomOptions] = useState([]);
    const [showButtons, setShowButtons] = useState(false);

    // Fetch symptom options on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/sign");
        } else {
            symptomOptionsHelper();
            addBotMessage(
                "Hi there! What are the top 5 symptoms you are feeling? Please drag and drop symptom 1 here:"
            );
        }
    }, []);

    // Helper function to fetch symptom options from API
    const symptomOptionsHelper = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/features");
            const data = await response.json();
            setSymptomOptions(data);
        } catch (error) {
            console.error("Error fetching symptom options:", error);
        }
    };

    // Function to handle dropping symptom into chatbox
    const drop = (ev) => {
        ev.preventDefault();
        const symptomId = ev.dataTransfer.getData("text");
        const symptom = document.getElementById(symptomId).textContent;

        if (predicting) {
            setSymptoms([...symptoms, symptom]);
            setSymptomCount(symptomCount + 1);
            addUserMessage(symptom);

            if (symptomCount < 5) {
                addBotMessage(
                    `Please drag and drop symptom ${symptomCount + 1} here:`
                );
            } else {
                fetchPrediction();
            }
        }
    };

    // Function to add user message to chatbox
    const addUserMessage = (message) => {
        const chatbox = document.getElementById("chatbox");
        const userMessageElement = document.createElement("div");
        userMessageElement.textContent = `You: ${message}`;
        userMessageElement.classList.add("chat-message", "user-bubble");
        chatbox.appendChild(userMessageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    };

    // Function to add bot message to chatbox
    const addBotMessage = (message) => {
        const chatbox = document.getElementById("chatbox");
        const botMessageElement = document.createElement("div");
        botMessageElement.textContent = `Bot: ${message}`;
        botMessageElement.classList.add("chat-message", "chatbot-bubble");
        chatbox.appendChild(botMessageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    };

    // Function to fetch prediction from server
    const fetchPrediction = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ symptoms }),
            });
            const data = await response.json();
            addBotMessage(`Predicted Disease: ${data.prediction}`);
            addBotMessage("Would you like to restart or exit?");
            setPredicting(false);
            setShowButtons(true); // Show the buttons after prediction
        } catch (error) {
            console.error("Error fetching prediction:", error);
        }
    };

    // Function to handle restart action
    const handleRestart = () => {
        setSymptomCount(1);
        setSymptoms([]);
        setPredicting(true);
        clearChatbox();
        setShowButtons(false); // Hide buttons when restarting
        addBotMessage(
            "Hi there! What are the top 5 symptoms you are feeling? Please drag and drop symptom 1 here:"
        );
    };

    // Function to handle exit action
    const handleExit = () => {
        addBotMessage("Goodbye!");
        setShowButtons(false); // Hide buttons when exiting
    };

    // Function to clear chatbox messages
    const clearChatbox = () => {
        const chatbox = document.getElementById("chatbox");
        chatbox.innerHTML = "";
    };

    // Render JSX
    return (
        <>
            <div className="div_a">
                <div className="background-video">
                    <video className="video" autoPlay loop muted src={videobg} />
                </div>
                <nav className="fixed top-0 w-full z-50 bg-neutral-content opacity-75">
                    <div className="navbar">
                        <div className="flex-1">
                            <a className="btn btn-ghost text-xl" onClick={() => navigate("/dashboard")}>
                                Home
                            </a>
                            <a className="btn btn-ghost text" onClick={() => navigate("/diagnostic")}>
                                Detection{" "}
                            </a>
                            <a className="btn btn-ghost text" onClick={() => navigate("/scan")}>
                                Scanning
                            </a>
                            <a className="btn btn-ghost text" onClick={() => navigate("/presc")}>
                                Prescription Upload
                            </a>
                            <a
                                className='btn btn-ghost text'
                                onClick={() => navigate("/summary")}>
                                Summary
                            </a>
                        </div>
                        <div className="flex-none">
                            <ul className="menu menu-horizontal px-1">
                                <li>
                                    <a>Link</a>
                                </li>
                                <li>
                                    <button className="button_a" onClick={LogOut}>
                                        Log-out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="diag_div_a">
                    <div id="container_01">
                        <div id="chatbox" onDrop={drop} onDragOver={(ev) => ev.preventDefault()}></div>
                        <div id="symptomList">
                            {symptomOptions.map((symptom, index) => (
                                <div
                                    key={index}
                                    id={`symptom${index + 2}`}
                                    className="symptom"
                                    draggable="true"
                                    onDragStart={(ev) => ev.dataTransfer.setData("text", ev.target.id)}
                                >
                                    {symptom}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="button-container">
                        {showButtons && ( // Conditionally render buttons
                            <>
                                <button id="restartButton" onClick={handleRestart}>
                                    Restart
                                </button>
                                <button id="exitButton" onClick={handleExit}>
                                    Exit
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
