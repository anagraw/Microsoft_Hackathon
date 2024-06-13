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
			</div>
		</>
	);
}
