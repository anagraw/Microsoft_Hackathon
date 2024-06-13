import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import videobg from "../assets/vid.mp4";
import "./DiagStyle.css";
import { getAuth, signOut } from "firebase/auth";

export default function Diagnostic() {
	const navigate = useNavigate();
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/sign");
		}
	}, []);
	const [symptoms, setSymptoms] = useState([
		"Symptom 1",
		"Symptom 2",
		"Symptom 3",
		"Symptom 4",
		"Symptom 5",
	]);
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
	return (
		<>
			<div className='div_a diag_div_a'>
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
				<form className='formContainer'>
					{symptoms.map((symptom, index) => (
						<div key={index}>
							<div className='diag_symp_a'>
								<label>Symptom {index + 1}:</label>
								<select
									name={`symptom${index + 1}`}
									id={`symptom${index + 1}`}>
									<option value=''>Select Symptom</option>
									{symptoms.map((symptom, i) => (
										<option
											key={i}
											value={symptom}>
											{symptom}
										</option>
									))}
								</select>
							</div>
						</div>
					))}
				</form>
				<button className='button_a cust_btn'>Predict</button>
				<div>
					<p className='diag_result_a'>Result: </p>
				</div>
			</div>
		</>
	);
}
