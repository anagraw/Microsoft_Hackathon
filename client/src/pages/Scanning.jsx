import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import videobg from "../assets/vid.mp4";
import "./ScanningStyle.css";
import { getAuth, signOut } from "firebase/auth";

export default function Scanning() {
    const navigate = useNavigate();
    const [fileName, setFileName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/sign");
        }
    }, [navigate]);

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

    const [chat, setChat] = useState([
        { role: "chatbot", text: "Hi there!" },
        {
            role: "chatbot",
            text: "Do you have an X-Ray scan of your chest available?",
        },
    ]);
    const [userResponse, setUserResponse] = useState(null);
    const [showFinalOptions, setShowFinalOptions] = useState(false);
    const [finalOptionSelected, setFinalOptionSelected] = useState(false);

    function handleResponse(response) {
        setUserResponse(response);
        setChat((prevChat) => [...prevChat, { role: "user", text: response }]);

        if (response === "yes") {
            setChat((prevChat) => [
                ...prevChat,
                { role: "chatbot", text: "Please upload your X-Ray scan." },
            ]);
            setShowFinalOptions(false);
        } else if (response === "no") {
            setChat((prevChat) => [
                ...prevChat,
                { role: "chatbot", text: "Okay, have a nice day!" },
            ]);
        } else if (response === "restart") {
            setUserResponse(null);
            setChat([
                { role: "chatbot", text: "Hi there!" },
                {
                    role: "chatbot",
                    text: "Do you have an X-Ray scan of your chest available?",
                },
            ]);
            setShowFinalOptions(false);
            setFinalOptionSelected(false);
        } else if (response === "exit") {
            setChat((prevChat) => [
                ...prevChat,
                { role: "chatbot", text: "Goodbye!" },
            ]);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        console.log([...formData.entries()]);
        const response = await fetch("http://127.0.0.1:5000/api/xray", {
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        console.log(result);
        if (result.error) {
            setChat((prevChat) => [
                ...prevChat,
                { role: "chatbot", text: `Chatbot: ${result.error}` },
            ]);
        } else {
            setChat((prevChat) => [
                ...prevChat,
                {
                    role: "chatbot",
                    text: `Chatbot: The predicted class is ${result.predicted_class}`,
                },
                { role: "chatbot", text: "Chatbot: Do you want to restart or exit?" },
            ]);
            setShowFinalOptions(true);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
        } else {
            setFileName("");
        }
    };

    return (
        <>
            <div className='div_a'>
                <div className='background-video'>
                    <video
                        className='video'
                        autoPlay
                        loop
                        muted
                        src={videobg}
                    />
                </div>
                <nav className='fixed top-0 w-full z-50 bg-neutral-content opacity-75'>
                    <div className='navbar'>
                        <div className='flex-1'>
                            <a
                                className='btn btn-ghost text-xl'
                                onClick={() => navigate("/dashboard")}>
                                Home
                            </a>
                            <a
                                className='btn btn-ghost text'
                                onClick={() => navigate("/diagnostic")}>
                                Detection{" "}
                            </a>
                            <a
                                className='btn btn-ghost text'
                                onClick={() => navigate("/scan")}>
                                Scanning
                            </a>
                            <a
                                className='btn btn-ghost text'
                                onClick={() => navigate("/presc")}>
                                Prescription Upload
                            </a>
                            <a
                                className='btn btn-ghost text'
                                onClick={() => navigate("/summary")}>
                                Summary
                            </a>
                        </div>
                        <div className='flex-none'>
                            <ul className='menu menu-horizontal px-1'>
                                <li>
                                    <a>Link</a>
                                </li>
                                <li>
                                    <button
                                        className='button_a'
                                        onClick={LogOut}>
                                        Log-out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className='chat-container'>
                    <div
                        className='chat-box'
                        id='chat-box'>
                        {chat.map((message, index) => (
                            <div
                                key={index}
                                className={`chat-bubble ${message.role}-bubble`}>
                                {message.role === "chatbot" ? "Chatbot: " : "You: "}
                                {message.text}
                            </div>
                        ))}
                        <div className='button-container'>
                            {!showFinalOptions && (
                                <>
                                    <button
                                        onClick={() => handleResponse("yes")}
                                        className='btn btn-outline'
                                        disabled={
                                            (userResponse === "yes" && showFinalOptions === true) ||
                                            userResponse === "no" ||
                                            userResponse === "restart" ||
                                            userResponse === "exit"
                                        }>
                                        Yes
                                    </button>
                                    <button
                                        onClick={() => handleResponse("no")}
                                        className='btn btn-outline'
                                        disabled={
                                            (userResponse === "yes" && showFinalOptions === true) ||
                                            userResponse === "no" ||
                                            userResponse === "restart" ||
                                            userResponse === "exit"
                                        }>
                                        No
                                    </button>
                                </>
                            )}
                            {showFinalOptions && (
                                <>
                                    <button
                                        onClick={() => {
                                            handleResponse("restart");
                                            setFinalOptionSelected(true);
                                        }}
                                        className='btn btn-outline'
                                        disabled={finalOptionSelected}
                                    >
                                        Restart
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleResponse("exit");
                                            setFinalOptionSelected(true);
                                        }}
                                        className='btn btn-outline'
                                        disabled={finalOptionSelected}
                                    >
                                        Exit
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    {userResponse === "yes" && (
                        <div id='upload-section'>
                            {(!showFinalOptions || !finalOptionSelected) && (
                                <form
                                    id='upload-form'
                                    encType='multipart/form-data'
                                    onSubmit={handleSubmit}>
                                    <input
                                        type='file'
                                        name='file'
                                        className='chat-input button_a bg-slate-50'
                                        onChange={handleFileChange}
                                    />
                                    <span>{fileName}</span>
                                    <button
                                        type='submit'
                                        className='chat-button btn btn-outline'>
                                        Upload
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                    {userResponse === "no" && (
                        <div id='message-section'>
                            <p>Okay, no problem. Let us know if you change your mind.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
