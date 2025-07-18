import React, { useState } from 'react';
import './morse_converter.css';

// Morse code alphabet map
const ALPHABET = {
  "a": ".-",     "b": "-...",   "c": "-.-.",    "d": "-..",    "e": ".",
  "f": "..-.",   "g": "--.",    "h": "....",    "i": "..",     "j": ".---",
  "k": "-.-",    "l": ".-..",   "m": "--",      "n": "-.",     "o": "---",
  "p": ".--.",   "q": "--.-",   "r": ".-.",     "s": "...",    "t": "-",
  "u": "..-",    "v": "...-",   "w": ".--",     "x": "-..-",   "y": "-.--",
  "z": "--..",
  "0": "-----",  "1": ".----",  "2": "..---",   "3": "...--",  "4": "....-",
  "5": ".....",  "6": "-....",  "7": "--...",   "8": "---..",  "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..",  "'": ".----.",
  "!": "-.-.--", "/": "-..-.",  "(": "-.--.",   ")": "-.--.-",
  "&": ".-...",  ":": "---...", ";": "-.-.-.",  "=": "-...-",
  "+": ".-.-.",  "-": "-....-", "_": "..--.-",  "\"": ".-..-.",
  "$": "...-..-","@": ".--.-.", " ": "/" // Space is slash in Morse
};

// Reverse Morse map
const MORSE = {};
Object.entries(ALPHABET).forEach(([k, v]) => { MORSE[v] = k; });

function textToMorse(text) {
  return text
    .toLowerCase()
    .split("")
    .map(ch => ALPHABET[ch] || ch)
    .join(" ")
    .replace(/\s+\/\s+/g, " / ");
}

function morseToText(morse) {
  return morse
    .replace(/\s{2,}/g, " ") // collapse spaces
    .split(" ")
    .map(code => (MORSE[code] ? MORSE[code] : code === "/" ? " " : ""))
    .join("")
    .replace(/ +/g, " ");
}

const defaultSliders = {
  speed: 20,
  pitch: 550,
  volume: 80,
};

// PUBLIC_INTERFACE
function MorseConverter() {
  /**
   * React Morse code converter UI and logic.
   *
   * Features: input, output, two-way conversion, clear, copy, styled as per Figma.
   */
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('text-to-morse'); // or 'morse-to-text'
  const [sliders, setSliders] = useState({ ...defaultSliders });
  const [copied, setCopied] = useState(false);

  // Methods
  // PUBLIC_INTERFACE
  function handleInputChange(e) {
    const value = e.target.value;
    setInput(value);
    if (mode === 'text-to-morse') {
      setOutput(value ? textToMorse(value) : '');
    } else {
      setOutput(value ? morseToText(value) : '');
    }
  }

  // PUBLIC_INTERFACE
  function handleModeChange(e) {
    // Flip conversion direction. Do basic re-run.
    const direction = e.target.value;
    setMode(direction);
    setInput('');
    setOutput('');
  }

  // PUBLIC_INTERFACE
  function handleClear() {
    setInput('');
    setOutput('');
    setCopied(false);
  }

  // PUBLIC_INTERFACE
  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  // PUBLIC_INTERFACE
  function sliderUpdate(name, value) {
    setSliders(sl => ({ ...sl, [name]: value }));
  }

  // Only UI: update slider value shown
  function getSliderMarkup(label, name, min, max, val) {
    return (
      <div className="slider-block" key={name}>
        <label htmlFor={name}>{label}</label>
        <input
          className="slider"
          id={name}
          type="range"
          min={min}
          max={max}
          value={val}
          onChange={e => sliderUpdate(name, +e.target.value)}
        />
        <span className="slider-value">{val}</span>
      </div>
    );
  }

  return (
    <div className="morse-bg">
      {/* Logo/branding */}
      <div className="branding-row">
        <img
          src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/c6d44a3e-c541-468e-b8a4-13ad28bef8e7"
          alt="MorseCodeConverter.ai"
          className="logo-banner"
        />
      </div>
      <div className="converter-wrapper">
        {/* LEFT: Input, Sliders */}
        <div className="col-side col-left">
          <span className="col-label">Input:</span>
          <input
            className="col-input"
            type="text"
            placeholder={
              mode === 'text-to-morse'
                ? 'Type your message here'
                : 'Type Morse (e.g. .... . .-.. .-.. ---)'
            }
            value={input}
            onChange={handleInputChange}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            data-testid="input-field"
          />
          <div style={{display: "flex", flexDirection: "row", gap: "24px"}}>
            <label style={{fontSize:"1rem",marginRight:8}}>Mode:</label>
            <select
              value={mode}
              onChange={handleModeChange}
              style={{
                fontSize: "1rem",
                borderRadius: 7,
                border: "1px solid #888",
                padding: "4px 8px",
                marginLeft: 2
              }}
              data-testid="mode-select"
            >
              <option value="text-to-morse">Text → Morse</option>
              <option value="morse-to-text">Morse → Text</option>
            </select>
          </div>
          {getSliderMarkup('Speed', 'speed', 0, 50, sliders.speed)}
          {getSliderMarkup('Pitch', 'pitch', 300, 1000, sliders.pitch)}
          {getSliderMarkup('Volume', 'volume', 0, 100, sliders.volume)}
          <button
            className="action-btn"
            aria-label="Clear"
            style={{
              background: "#fafafa",
              border: "1.5px solid #aaa",
              color: "#444",
              borderRadius: "10px",
              marginTop: "10px",
              fontWeight: 600
            }}
            onClick={handleClear}
            data-testid="clear-btn"
          >
            Clear
          </button>
        </div>
        {/* CENTER: Output */}
        <div className="col-center">
          <div className="output-bg">
            <span className="output-label">Output:</span>
            <div className="output-box" tabIndex={-1} data-testid="output-box">
              {output ? (
                <span style={{wordBreak: "break-word"}}>{output}</span>
              ) : (
                <span className="output-placeholder">
                  {mode === 'text-to-morse'
                    ? 'Translated message'
                    : 'Type Morse code to see translation'}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* RIGHT: Action icons/buttons */}
        <div className="col-side col-right">
          <button
            className="action-btn copy"
            aria-label="Copy"
            onClick={handleCopy}
            data-testid="copy-btn"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          {/* Below: Placeholder for play/pause/sound */}
          <button className="action-btn play" style={{fontSize:'1.1rem'}} aria-label="Listen" disabled>
            Play
          </button>
          <button className="action-btn pause" style={{fontSize:'1.1rem'}} aria-label="Pause" disabled>
            Pause
          </button>
          <button className="action-btn sound" style={{fontSize:'1.1rem'}} aria-label="Sound" disabled>
            Sound
          </button>
          {/* Decorative SVG/icons as extracted from Figma */}
          <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/561f7148-e6b8-4c46-a5c9-871970d94170" className="polygon" alt="Polygon"/>
          <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/1c062b1c-90ef-4426-9d6d-40c9f8451ea4" className="vertical-bars" alt="Bars"/>
          <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/84e7d318-6aea-473b-b115-01b07dc0ee66" className="square-btn" alt="Btn"/>
        </div>
      </div>
    </div>
  );
}

export default MorseConverter;
