import { getAuth, signOut } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeStyle.css";
import "bootstrap/dist/css/bootstrap.min.css";
import prescImage from "../assets/presc.jpeg";
import diagImage from "../assets/diag.jpeg";
import scanImage from "../assets/scan.jpeg";
import videobg from "../assets/vid.mp4";
export default function Home() {
	const navigate = useNavigate();

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

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/sign");
		}
	}, []);
	useEffect(() => {
		const cards = document.querySelectorAll(".card");
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("show");
					}
				});
			},
			{
				threshold: 0.1,
			}
		);

		cards.forEach((card) => {
			observer.observe(card);
		});

		// Cleanup function to disconnect observer when component unmounts
		return () => observer.disconnect();
	}, []);
	return (
		<div>
			{/* <h1>Home</h1>
			<button
				classNameName='btn'
				onClick={LogOut}>
				LogOut
			</button> */}
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
						<a className='btn btn-ghost text-xl'>Home</a>
						<a className='btn btn-ghost text'>Detection </a>
						<a className='btn btn-ghost text'>Scanning</a>
						<a className='btn btn-ghost text'>Prescription Upload</a>
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
			<div className='intro content_01 text-white overlay_home'>
				<h1 className='text-sm uppercase tracking-widest mb-4'>
					Healthcare Detection App
				</h1>
				<h2 className='text-5xl font-bold mb-2'>Healthcare Detection App</h2>
				<h3 className='text-3xl mb-4'>Loren Ipsum</h3>
				<a
					href='#cards'
					className='inline-block mt-8 text-white border border-white py-2 px-4 rounded-full'>
					button
				</a>
			</div>

			<div
				id='cards'
				className='card-container'>
				<div className='card'>
					<div className='imgBx'>
						<img
							src={diagImage}
							alt='Diagnostic'
						/>
					</div>
					<div className='content_01'>
						<h2 className='text-xl font-bold'>Diagnostic</h2>
						<p>
							We use cookies to enable certain functions and tools on this
							website, track resources and data used on this website, and
							promote our products and services. We also share information about
							your use of our website with our analytics partners.
						</p>
					</div>
				</div>

				<div className='card'>
					<div className='imgBx'>
						<img
							src={scanImage}
							alt='Scanning'
						/>
					</div>
					<div className='content_01'>
						<h2 className='text-xl font-bold'>Scanning</h2>
						<p>
							We use cookies to enable certain functions and tools on this
							website, track resources and data used on this website, and
							promote our products and services. We also share information about
							your use of our website with our analytics partners.
						</p>
					</div>
				</div>

				<div className='card'>
					<div className='imgBx'>
						<img
							src={prescImage}
							alt='Prescription Upload'
						/>
					</div>
					<div className='content_01'>
						<h2 className='text-xl font-bold'>Prescription Upload</h2>
						<p>
							We use cookies to enable certain functions and tools on this
							website, track resources and data used on this website, and
							promote our products and services. We also share information about
							your use of our website with our analytics partners.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
