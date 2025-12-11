export interface KaraokePlainTextToken {
	note?: number | undefined; // MIDI note number
	text: string;
}

export interface KaraokeAnimatedTextToken extends KaraokePlainTextToken {
	start: number; // in ticks
	end: number; // in ticks
}

export interface KaraokeAnimatedTextSegment {
	tokens: KaraokeAnimatedTextToken[];
}

export interface KaraokeAnimatedRuby {
	rubyBase: KaraokeAnimatedTextToken;
	rubyText: KaraokeAnimatedTextSegment;
}

export interface KaraokeLine {
	segments: (KaraokePlainTextToken | KaraokeAnimatedTextSegment | KaraokeAnimatedRuby)[];
	start: number; // in ticks
	end: number; // in ticks
}

export interface KaraokeParagraph {
	lines: KaraokeLine[];
}

export interface EnterExitTransitionTimes {
	// All in ticks
	enterStart: number;
	enterEnd: number;
	exitStart: number;
	exitEnd: number;
}

export interface KaraokeAnimatedLine extends EnterExitTransitionTimes {
	segments: (KaraokePlainTextToken | KaraokeAnimatedTextSegment | KaraokeAnimatedRuby)[];
	displayLineIndex: number;
}
