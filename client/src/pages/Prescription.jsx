import React from "react";
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import videobg from "../assets/vid.mp4";
import "./ScanningStyle.css";

export default function Prescription() {
	const navigate = useNavigate();
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/sign");
		}
	}, []);

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
			text: "Do you wish to upload an image of a medicine prescribed by your doctor?",
		},
	]);
	const [userResponse, setUserResponse] = useState(null);

	function handleResponse(response) {
		setUserResponse(response);
		setChat((prevChat) => [...prevChat, { role: "user", text: response }]);

		if (response === "yes") {
			setChat((prevChat) => [
				...prevChat,
				{ role: "chatbot", text: "Please upload an image of the medicine." },
			]);
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
					text: "Do you wish to upload an image of a medicine prescribed by your doctor?",
				},
			]);
		} else if (response === "exit") {
			setChat((prevChat) => [
				...prevChat,
				{ role: "chatbot", text: "Goodbye!" },
			]);
		}
	}

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
				<div class='chat-container'>
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
							<button
								onClick={() => handleResponse("yes")}
								className='btn btn-outline'
								disabled={userResponse !== null}>
								Yes
							</button>
							<button
								onClick={() => handleResponse("no")}
								className='btn btn-outline'
								disabled={userResponse !== null}>
								No
							</button>
						</div>
					</div>
					{userResponse === "yes" && (
						<div id='upload-section'>
							<form id='upload-form'>
								<input
									type='file'
									name='file'
									className='chat-input button_a bg-slate-50'
								/>
								<button
									type='submit'
									className='chat-button btn btn-outline'>
									Upload
								</button>
							</form>
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
