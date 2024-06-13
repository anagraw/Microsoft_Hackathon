import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignInUp from "./pages/SignInUp";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Diagnostic from "./pages/Diagnostic";
import Scanning from "./pages/Scanning";
import Prescription from "./pages/Prescription";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='/sign'
					element={<SignInUp />}
				/>
				<Route
					path='/profile'
					element={<Profile />}
				/>
				<Route
					path='/about'
					element={<About />}
				/>
				<Route
					path='/dashboard'
					element={<Home />}
				/>
				<Route
					path='/'
					element={<Home />}
				/>
				<Route
					path='/diagnostic'
					element={<Diagnostic />}
				/>
				<Route
					path='/scan'
					element={<Scanning />}
				/>
				<Route
					path='/presc'
					element={<Prescription />}
				/>
			</Routes>
		</BrowserRouter>
	);
}
