import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import videobg from "../assets/vid.mp4";
import "./ScanningStyle.css";
import { getAuth, signOut } from "firebase/auth";

export default function Scanning() {
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
	const [exitResp, setExitResp] = useState(true);

	function handleResponse(response) {
		setUserResponse(response);
		setChat((prevChat) => [...prevChat, { role: "user", text: response }]);

		if (response === "yes") {
			setChat((prevChat) => [
				...prevChat,
				{ role: "chatbot", text: "Please upload an image of the medicine." },
			]);
			setExitResp(true);
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
		// setUserResponse(null);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		console.log([...formData.entries()]);
		const response = await fetch("http://127.0.0.1:5000/api/scan", {
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
					text: `Chatbot: The predicted medicine is ${result.predicted_class}`,
				},
				{ role: "chatbot", text: "Chatbot: Do you want to restart or exit?" },
			]);
			setExitResp(false);
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
							<button
								onClick={() => handleResponse("yes")}
								className='btn btn-outline'
								disabled={
									(userResponse === "yes" && exitResp === true) ||
									userResponse === "no"
								}>
								Yes
							</button>
							<button
								onClick={() => handleResponse("no")}
								className='btn btn-outline'
								disabled={
									(userResponse === "yes" && exitResp === true) ||
									userResponse === "no"
								}>
								No
							</button>
						</div>
					</div>
					{userResponse === "yes" && (
						<div id='upload-section'>
							{exitResp && (
								<form
									id='upload-form'
									encType='multipart/form-data'
									onSubmit={handleSubmit}>
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
