import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import videobg from "../assets/vid.mp4";
import "./ScanningStyle.css";
import { getAuth, signOut } from "firebase/auth";
import { db, app, auth } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import prescImage from "../assets/presc.jpeg";
import diagImage from "../assets/diag.jpeg";
import scanImage from "../assets/scan.jpeg";
export default function Summary() {
	// const [prevData, setPrevData] = useState([]);
	const [prevScan, setPrevScan] = useState("");
	const [prevDesc, setPrevDesc] = useState("");
	const [prevPres, setPrevPres] = useState("");

	const getPrevData = async () => {
		const getUserId = localStorage.getItem("userID");
		const doRefxray = (await getDoc(doc(db, `${getUserId}`, "X-Ray"))).data();
		const doRefpres = (
			await getDoc(doc(db, `${getUserId}`, "Prescription"))
		).data();
		const doRefdiag = (await getDoc(doc(db, `${getUserId}`, "Disease"))).data();
		console.log(doRefdiag);
		if (doRefxray !== undefined) {
			setPrevScan(doRefxray["X-Ray"]);
		} else {
			setPrevScan("No previous data found");
		}
		if (doRefpres !== undefined) {
			setPrevPres(doRefpres["Prescription"]);
		} else {
			setPrevPres("No previous data found");
		}
		if (doRefdiag !== undefined) {
			setPrevDesc(doRefdiag["Disease Detected"]);
		} else {
			setPrevDesc("No previous data found");
		}
	};
	const navigate = useNavigate();
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/sign");
		}
		getPrevData();
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
								Detection
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
				<div className='card-container'>
					<div className='card card-side bg-base-100 shadow-xl card__01'>
						<figure className='Images_summary'>
							<img
								src={diagImage}
								alt='Movie'
							/>
						</figure>
						<div className='card-body'>
							<h2 className='card-title'>Diagnostic</h2>
							<p>Previous result here: </p> <div>{prevDesc}</div>
							<div className='card-actions justify-end'>
								<button
									className='btn btn-primary'
									onClick={() => navigate("/diagnostic")}>
									Retake
								</button>
							</div>
						</div>
					</div>
					<div className='card card-side bg-base-100 shadow-xl card__01'>
						<figure className='Images_summary'>
							<img
								src={scanImage}
								alt='Movie'
							/>
						</figure>
						<div className='card-body'>
							<h2 className='card-title'>Scanning</h2>
							<p>Previous result here: </p> <div>{prevScan}</div>
							<div className='card-actions justify-end'>
								<button
									className='btn btn-primary'
									onClick={() => navigate("/scan")}>
									Retake
								</button>
							</div>
						</div>
					</div>
					<div className='card card-side bg-base-100 shadow-xl card__01'>
						<figure className='Images_summary'>
							<img
								src={prescImage}
								alt='Movie'
							/>
						</figure>
						<div className='card-body'>
							<h2 className='card-title'>Prescription</h2>
							<p>Previous result here: </p> <div>{prevPres}</div>
							<div className='card-actions justify-end'>
								<button
									className='btn btn-primary'
									onClick={() => navigate("/presc")}>
									Retake
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
