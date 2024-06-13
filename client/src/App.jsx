import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignInUp from "./pages/SignInUp";
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
