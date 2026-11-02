// "BETTER TOGETHER" as a neon bar sign. Each word is split into three parts (BE·TT·ER, TOG·ETH·ER);
// matching parts share a colour, and the colours fade letter by letter from mint → GfG green → lime.
// A couple of letters flicker like a tired old tube.

const STOPS = ['#3df5cf', '#00e676', '#c5f55a'];

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c) => `rgb(${c.join(',')})`;

// Colour at position t (0..1) along mint → green → lime
const colourAt = (t) => {
  const [a, b, c] = STOPS.map(hex);
  return t < 0.5 ? mix(a, b, t * 2) : mix(b, c, (t - 0.5) * 2);
};

// Which letters flicker, and with which rhythm
const FLICKER = { BETTER: { 3: 'a' }, TOGETHER: { 5: 'b' } };

function Word({ text }) {
  const letters = [...text];
  return (
    <span className="neon-word">
      {letters.map((ch, i) => {
        const c = colourAt(letters.length > 1 ? i / (letters.length - 1) : 0);
        const flicker = FLICKER[text]?.[i];
        return (
          <span
            key={i}
            className={flicker ? `neon-letter neon-flicker-${flicker}` : 'neon-letter'}
            style={{ '--n': rgb(c), '--core': rgb(mix(c, [255, 255, 255], 0.45)) }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}

export default function NeonSign({ id }) {
  return (
    <h2 id={id} aria-label="Better together" className="neon-board">
      <span aria-hidden="true" className="neon-screw neon-screw--tl" />
      <span aria-hidden="true" className="neon-screw neon-screw--tr" />
      <span aria-hidden="true" className="neon-screw neon-screw--bl" />
      <span aria-hidden="true" className="neon-screw neon-screw--br" />
      <span aria-hidden="true" className="neon-text">
        <Word text="BETTER" />
        <Word text="TOGETHER" />
      </span>
      <span aria-hidden="true" className="neon-tag">★ GFG · SRMIST ★</span>
    </h2>
  );
}
