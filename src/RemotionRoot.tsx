import { Composition } from "remotion";

import BakFungTungTaaiJoeng from "./BakFungTungTaaiJoeng";
// import TiuMouGaai from "./TiuMouGaai";
import "./index.css";

// Each <Composition> is an entry in the sidebar!

export default function RemotionRoot() {
	return (
		<>
			<Composition
				id="BakFungTungTaaiJoeng"
				component={BakFungTungTaaiJoeng}
				durationInFrames={40 * 30}
				fps={30}
				width={1920}
				height={1080} />
			{
				/*
					<Composition
						id="TiuMouGaai"
						component={TiuMouGaai}
						durationInFrames={150}
						fps={30}
						width={1920}
						height={1080} />
				*/
			}
		</>
	);
}
