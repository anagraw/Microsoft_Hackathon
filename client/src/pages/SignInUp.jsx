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
			.then(() => {
				console.log("User Created", email, password, name);
				navigate("/dashboard");
			})
			.catch((error) => {
				console.log("Error", error);
			});
	};
	const signinHandler = (e) => {
		e.preventDefault();

		if (!email || !password) {
			console.log("Email and password are required or wrong email/password");
			return;
		}

		signInWithEmailAndPassword(auth, email, password)
			.then(() => {
				navigate("/dashboard");
			})
			.catch((error) => {
				console.log("Error", error);
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
				console.log("User", user);
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
			<video
				className='myVideo'
				autoPlay
				muted
				loop>
				<source
					src='client\src\assets\brain4.mp4'
					type='video/mp4'
				/>
				Your browser does not support the video tag.
			</video>

			<div
				className={`container ${isActive ? "right-panel-active" : ""}`}
				id='container'>
				<div className='form-container sign-up-container'>
					<form
						action='#'
						onSubmit={signupHandler}>
						<h1>Create Account</h1>
						<div className='social-container'>
							<a
								href='#'
								className='social'>
								<i className='fab fa-facebook-f'></i>
							</a>
							<a
								href='#'
								className='social'>
								<button
									onClick={LoginWithGoogle}
									style={{ border: "none" }}
									className='fab fa-google-plus-g'></button>
							</a>
							<a
								href='#'
								className='social'>
								<i className='fab fa-linkedin-in'></i>
							</a>
						</div>
						<span>or use your email for registration</span>
						<div className='infield'>
							<input
								type='text'
								placeholder='Name'
								onChange={(e) => setName(e.target.value)}
							/>
							<label></label>
						</div>
						<div className='infield'>
							<input
								type='email'
								placeholder='Email'
								onChange={(e) => setEmail(e.target.value)}
							/>
							<label></label>
						</div>
						<div className='infield'>
							<input
								type='password'
								placeholder='Password'
								onChange={(e) => setPassword(e.target.value)}
							/>
							<label></label>
						</div>
						<button className='btn'>Sign Up</button>
					</form>
				</div>
				<div className='form-container sign-in-container'>
					<form
						action='#'
						onSubmit={signinHandler}>
						<h1>Sign in</h1>
						<div className='social-container'>
							<a
								href='#'
								className='social'>
								<i className='fab fa-facebook-f'></i>
							</a>
							<a
								href='#'
								className='social'>
								<i className='fab fa-google-plus-g'></i>
							</a>
							<a
								href='#'
								className='social'>
								<i className='fab fa-linkedin-in'></i>
							</a>
						</div>
						<span>or use your account</span>
						<div className='infield'>
							<input
								type='email'
								placeholder='Email'
								name='email'
								onChange={(e) => setEmail(e.target.value)}
							/>
							<label></label>
						</div>
						<div className='infield'>
							<input
								type='password'
								placeholder='Password'
								onChange={(e) => setPassword(e.target.value)}
							/>
							<label></label>
						</div>
						<a
							href='#'
							className='forgot'>
							Forgot your password?
						</a>
						<button className='btn'>Sign In</button>
					</form>
				</div>
				<div
					className='overlay-container'
					id='overlayCon'>
					<div className='overlay'>
						<div className='overlay-panel overlay-left'>
							<h1>Welcome Back!</h1>
							<p>
								To keep connected with us please login with your personal info
							</p>
							{/* <button>Sign In</button> */}
						</div>
						<div className='overlay-panel overlay-right'>
							<h1>Hello, Friend!</h1>
							<p>Enter your personal details and start journey with us</p>
							{/* <button>Sign Up</button> */}
						</div>
					</div>
					<button
						id='overlayBtn'
						onClick={handleClick}
						className={
							isActive
								? "btnScaled overlay-panel overlay-left btn"
								: "overlay-panel overlay-left btn"
						}>
						{isActive ? "SignIn" : "SignUp"}
					</button>
				</div>
			</div>
		</>
	);
}

export default SignInUp;
