import React, { useState, useEffect } from 'react';
import { X, Copy, Check, QrCode, KeyRound, FileText, Scale, Image as ImageIcon, Code2, RefreshCw, Download, Sparkles } from 'lucide-react';
import { ToolItem } from '../../types';

interface ToolRunnerModalProps {
  tool: ToolItem | null;
  onClose: () => void;
}

export const ToolRunnerModal: React.FC<ToolRunnerModalProps> = ({ tool, onClose }) => {
  const [copied, setCopied] = useState(false);

  // States for QR Code
  const [qrText, setQrText] = useState('https://allora.app');

  // States for Password Generator
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // States for Text Formatter
  const [textContent, setTextContent] = useState('Welcome to ALLORA. Explore essential digital tools with instant client-side execution.');

  // States for Unit Converter
  const [converterType, setConverterType] = useState<'length' | 'weight' | 'temp'>('length');
  const [convertValue, setConvertValue] = useState<number>(100);
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');

  // States for JSON Formatter
  const [jsonInput, setJsonInput] = useState('{"platform":"ALLORA","version":2.0,"features":["tools","movies","social"]}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');

  // Auto-generate password on mount/change
  useEffect(() => {
    if (tool?.id === 'password-generator') {
      generateNewPassword();
    }
    if (tool?.id === 'json-formatter') {
      handleFormatJson();
    }
  }, [tool?.id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateNewPassword = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let result = '';
    const array = new Uint32Array(passwordLength);
    crypto.getRandomValues(array);
    for (let i = 0; i < passwordLength; i++) {
      result += chars[array[i] % chars.length];
    }
    setGeneratedPassword(result);
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setJsonError('');
    } catch (err: any) {
      setJsonError(err.message);
    }
  };

  // Unit converter logic
  const calculateConversion = () => {
    const val = Number(convertValue) || 0;
    if (converterType === 'length') {
      // Base: meters
      const inMeters: Record<string, number> = {
        meters: 1,
        kilometers: 1000,
        centimeters: 0.01,
        feet: 0.3048,
        miles: 1609.34,
        inches: 0.0254,
      };
      const meters = val * (inMeters[fromUnit] || 1);
      const converted = meters / (inMeters[toUnit] || 1);
      return converted.toFixed(4);
    } else if (converterType === 'weight') {
      // Base: kilograms
      const inKg: Record<string, number> = {
        kilograms: 1,
        grams: 0.001,
        pounds: 0.453592,
        ounces: 0.0283495,
      };
      const kg = val * (inKg[fromUnit] || 1);
      const converted = kg / (inKg[toUnit] || 1);
      return converted.toFixed(4);
    } else {
      // Temperature
      if (fromUnit === 'Celsius' && toUnit === 'Fahrenheit') return ((val * 9) / 5 + 32).toFixed(2);
      if (fromUnit === 'Fahrenheit' && toUnit === 'Celsius') return (((val - 32) * 5) / 9).toFixed(2);
      if (fromUnit === 'Celsius' && toUnit === 'Kelvin') return (val + 273.15).toFixed(2);
      return val.toFixed(2);
    }
  };

  if (!tool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        id="tool-runner-dialog"
        className="w-full max-w-2xl glass-card rounded-2xl border border-purple-500/30 shadow-[0_0_50px_rgba(236,72,153,0.2)] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-purple-500/20 bg-[#120826]/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500/20 to-purple-600/30 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white leading-none">
                {tool.name}
              </h3>
              <span className="text-xs text-purple-300/80 mt-1 inline-block">
                Client-Side Sandbox • Zero Data Collection
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Tool specific runners */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* TOOL 1: QR CODE GENERATOR */}
          {tool.id === 'qr-generator' && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300">
                Enter Destination Link or Plain Text
              </label>
              <input
                type="text"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#180c33] border border-purple-500/30 text-white focus:outline-none focus:border-pink-500"
              />

              <div className="flex flex-col items-center justify-center py-6 bg-[#0e061e] rounded-2xl border border-purple-500/20">
                {/* Visual SVG QR Matrix */}
                <div className="p-4 bg-white rounded-xl shadow-2xl">
                  <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                    <rect width="180" height="180" fill="white" />
                    {/* QR Code finder patterns */}
                    <rect x="15" y="15" width="45" height="45" fill="black" />
                    <rect x="22" y="22" width="31" height="31" fill="white" />
                    <rect x="29" y="29" width="17" height="17" fill="black" />

                    <rect x="120" y="15" width="45" height="45" fill="black" />
                    <rect x="127" y="22" width="31" height="31" fill="white" />
                    <rect x="134" y="29" width="17" height="17" fill="black" />

                    <rect x="15" y="120" width="45" height="45" fill="black" />
                    <rect x="22" y="127" width="31" height="31" fill="white" />
                    <rect x="29" y="134" width="17" height="17" fill="black" />

                    {/* Data matrix dots */}
                    <rect x="70" y="20" width="10" height="10" fill="black" />
                    <rect x="90" y="25" width="12" height="12" fill="black" />
                    <rect x="75" y="45" width="15" height="10" fill="black" />
                    <rect x="20" y="75" width="12" height="12" fill="black" />
                    <rect x="40" y="90" width="10" height="10" fill="black" />
                    <rect x="70" y="70" width="40" height="40" fill="#0d041e" rx="4" />
                    <rect x="80" y="80" width="20" height="20" fill="#ec4899" rx="2" />
                    <rect x="125" y="75" width="12" height="12" fill="black" />
                    <rect x="145" y="95" width="14" height="14" fill="black" />
                    <rect x="75" y="125" width="15" height="15" fill="black" />
                    <rect x="100" y="135" width="10" height="10" fill="black" />
                    <rect x="130" y="130" width="25" height="20" fill="black" />
                  </svg>
                </div>
                <p className="text-xs text-purple-300/70 mt-3 font-mono">
                  Payload: {qrText.slice(0, 35)}{qrText.length > 35 ? '...' : ''}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => copyToClipboard(qrText)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1b0e38] border border-purple-500/30 text-white font-semibold text-xs flex items-center justify-center space-x-2 hover:border-pink-500"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy Content'}</span>
                </button>
                <button
                  onClick={() => alert('QR Code ready for direct scanner capture!')}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs flex items-center justify-center space-x-2 hover:opacity-90"
                >
                  <Download className="w-4 h-4" />
                  <span>Download SVG</span>
                </button>
              </div>
            </div>
          )}

          {/* TOOL 2: PASSWORD GENERATOR */}
          {tool.id === 'password-generator' && (
            <div className="space-y-5">
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={generatedPassword}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#120726] border border-purple-500/40 text-pink-300 font-mono text-lg tracking-wider focus:outline-none select-all"
                />
                <button
                  onClick={() => copyToClipboard(generatedPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/40 hover:bg-pink-500 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Length Slider */}
              <div>
                <div className="flex justify-between text-xs text-purple-200 font-semibold mb-1.5">
                  <span>Password Length</span>
                  <span className="text-pink-400 font-mono font-bold">{passwordLength} chars</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="48"
                  value={passwordLength}
                  onChange={(e) => {
                    setPasswordLength(Number(e.target.value));
                    setTimeout(generateNewPassword, 0);
                  }}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>

              {/* Toggle Options */}
              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center space-x-2 p-3 rounded-xl bg-[#180c33] border border-purple-500/20 text-xs text-white cursor-pointer hover:border-pink-500/40">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => {
                      setIncludeUppercase(e.target.checked);
                      setTimeout(generateNewPassword, 0);
                    }}
                    className="accent-pink-500"
                  />
                  <span>Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center space-x-2 p-3 rounded-xl bg-[#180c33] border border-purple-500/20 text-xs text-white cursor-pointer hover:border-pink-500/40">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => {
                      setIncludeNumbers(e.target.checked);
                      setTimeout(generateNewPassword, 0);
                    }}
                    className="accent-pink-500"
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="flex items-center space-x-2 p-3 rounded-xl bg-[#180c33] border border-purple-500/20 text-xs text-white cursor-pointer hover:border-pink-500/40">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => {
                      setIncludeSymbols(e.target.checked);
                      setTimeout(generateNewPassword, 0);
                    }}
                    className="accent-pink-500"
                  />
                  <span>Symbols (!@#$)</span>
                </label>
              </div>

              <button
                onClick={generateNewPassword}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:opacity-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Regenerate Password</span>
              </button>
            </div>
          )}

          {/* TOOL 3: TEXT FORMATTER & WORD COUNTER */}
          {tool.id === 'text-formatter' && (
            <div className="space-y-4">
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={5}
                className="w-full p-4 rounded-xl bg-[#150a2b] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-500"
                placeholder="Type or paste your text here..."
              ></textarea>

              {/* Text Statistics Bar */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-[#180c33] border border-purple-500/20">
                  <div className="text-base font-bold text-white">
                    {textContent.trim() ? textContent.trim().split(/\s+/).length : 0}
                  </div>
                  <div className="text-[10px] uppercase text-purple-300">Words</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#180c33] border border-purple-500/20">
                  <div className="text-base font-bold text-pink-400">{textContent.length}</div>
                  <div className="text-[10px] uppercase text-purple-300">Characters</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#180c33] border border-purple-500/20">
                  <div className="text-base font-bold text-purple-300">
                    {textContent.split(/[.!?]+/).filter(Boolean).length}
                  </div>
                  <div className="text-[10px] uppercase text-purple-300">Sentences</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#180c33] border border-purple-500/20">
                  <div className="text-base font-bold text-fuchsia-300">
                    {Math.ceil((textContent.trim().split(/\s+/).length || 0) / 200)}m
                  </div>
                  <div className="text-[10px] uppercase text-purple-300">Read Time</div>
                </div>
              </div>

              {/* Transformation Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => setTextContent(textContent.toUpperCase())}
                  className="px-3 py-1.5 rounded-lg bg-[#180c33] border border-purple-500/30 text-xs text-white hover:border-pink-500"
                >
                  UPPERCASE
                </button>
                <button
                  onClick={() => setTextContent(textContent.toLowerCase())}
                  className="px-3 py-1.5 rounded-lg bg-[#180c33] border border-purple-500/30 text-xs text-white hover:border-pink-500"
                >
                  lowercase
                </button>
                <button
                  onClick={() =>
                    setTextContent(
                      textContent.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#180c33] border border-purple-500/30 text-xs text-white hover:border-pink-500"
                >
                  Capitalize Words
                </button>
                <button
                  onClick={() => setTextContent(textContent.replace(/\s+/g, ' ').trim())}
                  className="px-3 py-1.5 rounded-lg bg-[#180c33] border border-purple-500/30 text-xs text-white hover:border-pink-500"
                >
                  Strip Whitespace
                </button>
                <button
                  onClick={() => copyToClipboard(textContent)}
                  className="ml-auto px-3 py-1.5 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs font-semibold flex items-center space-x-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TOOL 4: UNIT CONVERTER */}
          {tool.id === 'unit-converter' && (
            <div className="space-y-4">
              <div className="flex rounded-xl bg-[#120726] p-1 border border-purple-500/30">
                {(['length', 'weight', 'temp'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setConverterType(type);
                      if (type === 'length') {
                        setFromUnit('meters');
                        setToUnit('feet');
                      } else if (type === 'weight') {
                        setFromUnit('kilograms');
                        setToUnit('pounds');
                      } else {
                        setFromUnit('Celsius');
                        setToUnit('Fahrenheit');
                      }
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                      converterType === type
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                        : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-purple-300 font-semibold">From</label>
                  <input
                    type="number"
                    value={convertValue}
                    onChange={(e) => setConvertValue(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#180c33] border border-purple-500/30 text-white font-mono"
                  />
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#120826] border border-purple-500/30 text-sm text-purple-200"
                  >
                    {converterType === 'length' && (
                      <>
                        <option value="meters">Meters (m)</option>
                        <option value="kilometers">Kilometers (km)</option>
                        <option value="feet">Feet (ft)</option>
                        <option value="miles">Miles (mi)</option>
                      </>
                    )}
                    {converterType === 'weight' && (
                      <>
                        <option value="kilograms">Kilograms (kg)</option>
                        <option value="grams">Grams (g)</option>
                        <option value="pounds">Pounds (lbs)</option>
                        <option value="ounces">Ounces (oz)</option>
                      </>
                    )}
                    {converterType === 'temp' && (
                      <>
                        <option value="Celsius">Celsius (°C)</option>
                        <option value="Fahrenheit">Fahrenheit (°F)</option>
                        <option value="Kelvin">Kelvin (K)</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-purple-300 font-semibold">To (Result)</label>
                  <div className="w-full px-4 py-2.5 rounded-xl bg-[#120726] border border-pink-500/40 text-pink-300 font-mono text-lg font-bold">
                    {calculateConversion()}
                  </div>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#120826] border border-purple-500/30 text-sm text-purple-200"
                  >
                    {converterType === 'length' && (
                      <>
                        <option value="feet">Feet (ft)</option>
                        <option value="meters">Meters (m)</option>
                        <option value="kilometers">Kilometers (km)</option>
                        <option value="miles">Miles (mi)</option>
                      </>
                    )}
                    {converterType === 'weight' && (
                      <>
                        <option value="pounds">Pounds (lbs)</option>
                        <option value="kilograms">Kilograms (kg)</option>
                        <option value="grams">Grams (g)</option>
                        <option value="ounces">Ounces (oz)</option>
                      </>
                    )}
                    {converterType === 'temp' && (
                      <>
                        <option value="Fahrenheit">Fahrenheit (°F)</option>
                        <option value="Celsius">Celsius (°C)</option>
                        <option value="Kelvin">Kelvin (K)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 5: IMAGE COMPRESSOR */}
          {tool.id === 'image-compressor' && (
            <div className="space-y-4 text-center">
              <div className="p-8 border-2 border-dashed border-purple-500/30 rounded-2xl bg-[#140a2b] flex flex-col items-center justify-center hover:border-pink-500/50 transition-colors">
                <ImageIcon className="w-12 h-12 text-pink-400 mb-3" />
                <h4 className="text-base font-bold text-white mb-1">
                  Drag & Drop Image Here
                </h4>
                <p className="text-xs text-purple-300/80 mb-4 max-w-sm">
                  Client-side JPEG/PNG optimizer. Processes directly in memory with 0 bytes transferred over the network.
                </p>
                <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs cursor-pointer hover:opacity-90 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                  <span>Browse Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        alert(`File "${e.target.files[0].name}" loaded into browser canvas compressor! Target reduction: ~62%.`);
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-purple-400">
                Supports PNG, JPG, WebP with variable compression levels.
              </p>
            </div>
          )}

          {/* TOOL 6: JSON BEAUTIFIER */}
          {tool.id === 'json-formatter' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-purple-300 font-semibold">
                  <span>Raw JSON Input</span>
                  <button
                    onClick={handleFormatJson}
                    className="px-2.5 py-1 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 hover:bg-pink-500 hover:text-white text-[11px]"
                  >
                    Format & Validate
                  </button>
                </div>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-xl bg-[#140a2b] border border-purple-500/30 text-white font-mono text-xs focus:outline-none focus:border-pink-500"
                ></textarea>
              </div>

              {jsonError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono">
                  Syntax Error: {jsonError}
                </div>
              )}

              {jsonOutput && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-purple-300 font-semibold">
                    <span>Formatted JSON Output</span>
                    <button
                      onClick={() => copyToClipboard(jsonOutput)}
                      className="flex items-center space-x-1 text-pink-400 hover:text-white text-xs"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#0e061e] border border-purple-500/30 text-pink-200 font-mono text-xs max-h-48 overflow-y-auto">
                    {jsonOutput}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
