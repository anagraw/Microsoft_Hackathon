import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import videobg from "../assets/vid.mp4";
import "./DiagStyle.css";
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
