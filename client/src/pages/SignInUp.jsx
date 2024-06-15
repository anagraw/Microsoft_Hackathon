import React from "react";
import "./SigninUp.css";
import { useState } from "react";
import { app, auth } from "../firebase-config";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

import videobg from "../assets/vid.mp4";
function SignInUp() {
	const [isActive, setIsActive] = useState(false);
	const handleClick = () => {
		setIsActive(!isActive);
	};

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const navigate = useNavigate();
	const signupHandler = (e) => {
		e.preventDefault();

		if (!email || !password || !name) {
			console.log("All fields are required");
			return;
		}

		console.log("signupHandler", email, password, name);

		createUserWithEmailAndPassword(auth, email, password)
			.then((res) => {
				const token = res.user.accessToken;
				localStorage.setItem("token", token);
				localStorage.setItem("userID", res.user.uid);
				// console.log("User Created", email, password, name);
				navigate("/dashboard");
			})
			.catch((error) => {
				console.log("Error", error);
			});
	};
	const signinHandler = (e) => {
		e.preventDefault();

		if (!email || !password) {
			// console.log("Email and password are required or wrong email/password");
			if (!email) {
				alert("Email is required");
			} else if (!password) {
				alert("Password is required");
			}
			return;
		}

		signInWithEmailAndPassword(auth, email, password)
			.then((res) => {
				// console.log("User Logged In", res.user.accessToken);
				const token = res.user.accessToken;
				localStorage.setItem("token", token);
				localStorage.setItem("userID", res.user.uid);
				navigate("/dashboard");
			})
			.catch((error) => {
				alert(error.message);
			});
	};
	const LoginWithGoogle = (e) => {
		e.preventDefault();
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
			.then((result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				const user = result.user;
				localStorage.setItem("token", token);
				localStorage.setItem("userID", result.user.uid);
				navigate("/dashboard");
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				const email = error.email;
				const credential = GoogleAuthProvider.credentialFromError(error);
				console.log("Error", errorMessage);
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

				<div
					className={`container ${isActive ? "right-panel-active" : ""}`}
					id='container'>
					<div className='form-container sign-up-container'>
						<form
							className='form_a'
							action='#'
							onSubmit={signupHandler}>
							<h1 className='head_1'>Create Account</h1>
							<div className='social-container'>
								<a
									href='#'
									className='social a_a'>
									<i className='fab fa-facebook-f'></i>
								</a>
								<a
									href='#'
									className='social a_a'>
									<button
										onClick={LoginWithGoogle}
										style={{ border: "none" }}
										className='fab fa-google-plus-g'></button>
								</a>
								<a
									href='#'
									className='social a_a'>
									<i className='fab fa-linkedin-in'></i>
								</a>
							</div>
							<span className='span_a'>or use your email for registration</span>
							<div className='infield'>
								<input
									className='input_a'
									type='text'
									placeholder='Name'
									onChange={(e) => setName(e.target.value)}
								/>
								<label className='label_a'></label>
							</div>
							<div className='infield'>
								<input
									className='input_a'
									type='email'
									placeholder='Email'
									onChange={(e) => setEmail(e.target.value)}
								/>
								<label className='label_a'></label>
							</div>
							<div className='infield'>
								<input
									className='input_a'
									type='password'
									placeholder='Password'
									onChange={(e) => setPassword(e.target.value)}
								/>
								<label className='label_a'></label>
							</div>
							<button className='btn button_a'>Sign Up</button>
						</form>
					</div>
					<div className='form-container sign-in-container'>
						<form
							className='form_a'
							action='#'
							onSubmit={signinHandler}>
							<h1 className='head_1'>Sign in</h1>
							<div className='social-container'>
								<a
									href='#'
									className='social a_a'>
									<i className='fab fa-facebook-f'></i>
								</a>
								<a
									href='#'
									className='social a_a'>
									<button
										onClick={LoginWithGoogle}
										style={{ border: "none" }}
										className='fab fa-google-plus-g'></button>
								</a>
								<a
									href='#'
									className='social a_a'>
									<i className='fab fa-linkedin-in'></i>
								</a>
							</div>
							<span className='span_a'>or use your account</span>
							<div className='infield'>
								<input
									className='input_a'
									type='email'
									placeholder='Email'
									name='email'
									onChange={(e) => setEmail(e.target.value)}
								/>
								<label className='label_a'></label>
							</div>
							<div className='infield'>
								<input
									className='input_a'
									type='password'
									placeholder='Password'
									onChange={(e) => setPassword(e.target.value)}
								/>
								<label className='label_a'></label>
							</div>
							<a
								href='#'
								className='forgot a_a'>
								Forgot your password?
							</a>
							<button className='btn button_a'>Sign In</button>
						</form>
					</div>
					<div
						className='overlay-container'
						id='overlayCon'>
						<div className='overlay'>
							<div className='overlay-panel overlay-left'>
								<h1 className='head_1'>Welcome Back!</h1>
								<p className='p_a'>
									To keep connected with us please login with your personal info
								</p>
								{/* <button>Sign In</button> */}
							</div>
							<div className='overlay-panel overlay-right'>
								<h1 className='head_1'>Hello, Friend!</h1>
								<p className='p_a'>
									Enter your personal details and start journey with us
								</p>
								{/* <button>Sign Up</button> */}
							</div>
						</div>
						<button
							id='overlayBtn'
							onClick={handleClick}
							className={
								isActive
									? "btnScaled button_a overlay-panel overlay-left"
									: "overlay-panel button_a overlay-left"
							}>
							{isActive ? "SignIn" : "SignUp"}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default SignInUp;
