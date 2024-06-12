import React from "react";
import videobg from "../assets/vid.mp4";
export default function About() {
	return (
		<div>
			<div className='background-video'>
				<video
					autoPlay
					loop
					muted
					src={videobg}
				/>
			</div>
		</div>
	);
}
