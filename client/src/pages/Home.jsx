import { getAuth, signOut } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

	return (
		<div className='flex justify-center'>
			<h1>Home</h1>
			<button
				className='btn'
				onClick={LogOut}>
				LogOut
			</button>
		</div>
	);
}
