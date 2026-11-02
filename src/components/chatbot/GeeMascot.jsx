// Gee: a little line-drawn cartoon whose face is the GeeksforGeeks mark
// (the left half of public/assets/logo/gfg-mark.svg: same arc, bar and colour), with blinking eyes.
const GFG_GREEN = '#00895E';
const BODY = '#121513';    // black body and sleeves
const EDGE = '#59625c';    // soft grey outline so the black body still reads on the dark page
const SKIN = '#f1c29a';    // hands and feet
const SCARF = '#2fbf71';        // waist scarf, a brighter green than the head
const SCARF_FOLD = '#1e8d50';   // its knot, back tail and fold line

// The mark, drawn in its own 40×40 box. The eyes sit in the space under the upper arc.
// `sad`: worried brows, eyes looking down, a small frown and a tear.
function GfgMark({ x = 0, y = 0, scale = 1, sad = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M8.09 8.09A16.85 16.85 0 1 1 3.15 20" fill="none" stroke={GFG_GREEN} strokeWidth="6.3" />
      <path d="M0 16.85h40v6.3H0z" fill={GFG_GREEN} />
      <g className="gee-eye">
        {[16, 24].map((cx) => (
          <g key={cx}>
            <ellipse cx={cx} cy="12.6" rx="2.1" ry="2.4" fill="#fff" />
            <circle cx={cx + 0.25} cy={sad ? 13.7 : 13} r="1.3" fill="#0b1a10" />
            <circle cx={cx + 0.7} cy={sad ? 13.1 : 12.4} r=".45" fill="#fff" />
          </g>
        ))}
      </g>
      {sad && (
        <>
          <path d="M13.6 9.5 L18.2 8.1" stroke="#fff" strokeWidth=".9" strokeLinecap="round" />
          <path d="M21.8 8.1 L26.4 9.5" stroke="#fff" strokeWidth=".9" strokeLinecap="round" />
          <path d="M16.2 30.4 Q20 27.4 23.8 30.4" fill="none" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" />
          <path className="gee-tear" d="M25.2 15.2 Q26.5 17.3 25.2 18.3 Q23.9 17.3 25.2 15.2 Z" fill="#9fdcff" />
        </>
      )}
    </g>
  );
}

// A small cartoon hand, drawn pointing up from the wrist at (0,0): palm, four fingers and a thumb.
// `angle` turns it to follow the arm; `flip` mirrors it so the thumb faces the body.
function Hand({ x, y, angle, flip = false }) {
  const finger = { stroke: SKIN, strokeWidth: 1.6, strokeLinecap: 'round', fill: 'none' };
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${flip ? -1 : 1} 1)`}>
      <ellipse cx="0" cy="-3" rx="2.8" ry="3" fill={SKIN} />
      <path d="M-2 -4.6 L-2.6 -7.9" {...finger} />
      <path d="M-0.7 -5.4 L-0.85 -9" {...finger} />
      <path d="M0.7 -5.4 L0.9 -8.9" {...finger} />
      <path d="M2 -4.6 L2.6 -7.6" {...finger} />
      <path d="M2.3 -2.3 L4.9 -3.9" {...finger} />
    </g>
  );
}

// A black arm or leg: a grey outline stroke with the black stroke on top
function Sleeve({ d }) {
  const base = { strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
  return (
    <>
      <path d={d} {...base} stroke={EDGE} strokeWidth="3.8" />
      <path d={d} {...base} stroke={BODY} strokeWidth="2.5" />
    </>
  );
}

// Full figure: the GfG mark as the head on a thin black body with a waist scarf. The right arm waves;
// with mood="sad" both arms hang, the head droops and a tear rolls down.
export function GeeMascot({ className, mood }) {
  const sad = mood === 'sad';
  return (
    <svg viewBox="0 -2 60 116" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="30" cy="110" rx="17" ry="2.6" fill="rgba(0,0,0,.5)" />

      <g className="gee-body">
        {/* black legs with bare feet */}
        <Sleeve d="M29 79 L23 100.5" />
        <Sleeve d="M31 79 L37 100.5" />
        <ellipse cx="20.6" cy="101.8" rx="3.3" ry="1.8" fill={SKIN} />
        <ellipse cx="39.4" cy="101.8" rx="3.3" ry="1.8" fill={SKIN} />

        {/* hanging left arm */}
        <Sleeve d="M29 52 Q22 60 19.5 69" />
        <Hand x={19.2} y={70.4} angle={197} flip />

        {sad ? (
          <>
            {/* right arm hanging too */}
            <Sleeve d="M31 52 Q38 60 40.5 69" />
            <Hand x={40.8} y={70.4} angle={163} />
          </>
        ) : (
          /* waving right arm, open hand */
          <g className="gee-arm">
            <Sleeve d="M31 52 Q40 52 45.5 44" />
            <Hand x={45.9} y={43} angle={28} flip />
          </g>
        )}

        {/* black body */}
        <rect x="27" y="39" width="6" height="42" rx="3" fill={BODY} stroke={EDGE} strokeWidth="1" />

        {/* green scarf tied round the waist: the band, two loose ends, then the knot on top */}
        <path d="M26.5 69.8 Q30 70.8 33.5 69.8 L33.5 73.6 Q30 74.6 26.5 73.6 Z" fill={SCARF} />
        <path d="M27 71.2 Q30 72 33 71.2" fill="none" stroke={SCARF_FOLD} strokeWidth=".6" strokeLinecap="round" />
        <g className="gee-scarf">
          <path d="M33.2 72.4 Q37.6 75.2 38.8 80.8 L37.3 80.3 L36.8 81.9 Q35.4 77 32.7 73.5 Z" fill={SCARF_FOLD} />
          <path d="M32 72.7 Q34 77.2 32.6 82.8 L34.2 81.9 L35.3 82.8 Q36.2 77.2 33.7 72.5 Z" fill={SCARF} />
        </g>
        <ellipse cx="32.8" cy="71.7" rx="1.7" ry="1.9" fill={SCARF_FOLD} />
        <path d="M32 71 Q32.8 71.8 33.6 71" fill="none" stroke={SCARF} strokeWidth=".55" strokeLinecap="round" />

        {/* head: the GfG mark itself */}
        <g transform={sad ? 'rotate(-8 30 40)' : undefined}>
          <GfgMark x={10} y={0} sad={sad} />
        </g>
      </g>
    </svg>
  );
}

// Just the mark (with its eyes) on a small dark disc, for the chat header and message avatars
export function GeeHead({ className }) {
  return (
    <svg viewBox="-6 -6 52 52" className={className} aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="25" fill="#0d1a12" stroke="rgba(70,196,107,.35)" strokeWidth="1.5" />
      <GfgMark x={5.6} y={5.6} scale={0.72} />
    </svg>
  );
}
