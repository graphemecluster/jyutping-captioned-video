export interface KaraokeTextSegment {
	text: string;
}

export interface KaraokeAnimatedTextSegment extends KaraokeTextSegment {
	start: number; // in ticks
	end: number; // in ticks
}

export interface KaraokeRuby {
	rubyBase: KaraokeAnimatedTextSegment;
	rubyText: KaraokeAnimatedTextSegment[];
}

export interface KaraokeLine {
	segments: (KaraokeTextSegment | KaraokeAnimatedTextSegment | KaraokeRuby)[];
	start: number; // in ticks
	end: number; // in ticks
}

export interface KaraokeParagraph {
	lines: KaraokeLine[];
}

export interface KaraokeLineWithIndex extends KaraokeLine {
	index: number;
}
