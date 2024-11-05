import React, { useCallback, useState, useEffect, useRef } from "react";

function IndicatorBar({ bgColor }) {
  return (
    <div className={`w-2.5 h-6 border-2 border-zinc-400 ${bgColor}`}></div>
  );
}

function App() {
  const [password, setPassword] = useState("default-p@$$wor6");
  const [passwordLength, setPasswordLength] = useState(8);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSpecChars, setIncludeSpecChars] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const inputRef = useRef(null);
  const tooltipBtnRef = useRef(null);

  // copy to clipboard
  const copyPassword = () => {
    tooltipBtnRef.current.dataset.toolTip = "copied!";
    inputRef.current.select();
    inputRef.current.setSelectionRange(0, 999);
    window.navigator.clipboard.writeText(inputRef.current.value);
  };

  // define password strength
  const evaluatePasswordStrength = (password) => {
    let length = password.length;

    if (8 <= length && length < 12) {
      return 1;
    }
    if (12 <= length && length < 16) {
      return 2;
    }
    if (16 <= length && length < 20) {
      return 3;
    }
    if (20 <= length && length <= 24) {
      return 4;
    }
  };

  // password validation
  const validatePassword = (password) => {
    // guarantee atleast one number character
    if (includeNumbers && !includeSpecChars) {
      let flag = /[0-9]/.test(password);
      return flag;
    }

    // guarantee atleast one special character
    if (!includeNumbers && includeSpecChars) {
      let flag = /[!@#$%^&*()_+-=/[\]{};:'\",.<>?/`~]/.test(password);
      return flag;
    }

    // guarantee atleast one number and a special character
    if (includeNumbers && includeSpecChars) {
      let flag = /[!@#$%^&*()_+-=/[\]{};:'\",.<>?/`~][0-9]/.test(password);
      return flag;
    }

    return true;
  };

  // password generation
  const generatePassword = useCallback(() => {
    let currentPassword = "";
    let passwordCharSet =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let numbersSet = "0123456789";
    let specCharSet = "!@#$%^&*()_+-=[]{};:'\",.<>?/`~";

    // check if numbers required
    if (includeNumbers) {
      passwordCharSet = passwordCharSet + numbersSet;
    }

    // check if special characters required
    if (includeSpecChars) {
      passwordCharSet = passwordCharSet + specCharSet;
    }

    // generate new password
    for (let i = 0; i < passwordLength; i++) {
      let rIndex = Math.floor(Math.random() * passwordCharSet.length);
      currentPassword += passwordCharSet[rIndex];
    }

    // check if the generated password fulfills the user requirement
    if (!validatePassword(currentPassword)) {
      generatePassword();
    }

    // set password strength and password when user requirement fulfills
    let strength = evaluatePasswordStrength(currentPassword);
    setPasswordStrength(strength);
    setPassword(currentPassword);
  }, [
    passwordLength,
    includeNumbers,
    includeSpecChars,
    setPassword,
    evaluatePasswordStrength,
    validatePassword,
  ]);

  // generate password on change of every password settings
  useEffect(() => {
    generatePassword();
  }, [passwordLength, includeNumbers, includeSpecChars]);

  return (
    <>
      <div className="main-container mx-auto max-w-md min-w-[300px] mt-24">
        <div>
          <h1 className="text-zinc-400 text-lg font-semibold text-center">
            Password Generator
          </h1>
        </div>

        <div className="mt-5 px-5 relative">
          <input
            type="text"
            value={password}
            ref={inputRef}
            className="bg-slate-700 outline-none text-zinc-300 w-full px-4 py-2.5 font-sans text-xl"
            readOnly
          />
          <span
            ref={tooltipBtnRef}
            onClick={copyPassword}
            onMouseLeave={() =>
              (tooltipBtnRef.current.dataset.toolTip = "copy")
            }
            className="absolute right-7 top-0 text-white block bg-slate-900 p-1 cursor-pointer hover:bg-slate-800 transition-all 
            before:absolute before:text-xs before:rounded-md before:border before:border-emerald-400 before:content-[attr(data-tool-tip)] before:-top-full before:left-1/2 before:-translate-x-1/2 before:bg-slate-700 before:px-5 before:py-1 before:scale-0 hover:before:scale-100 before:transition-[transform] before:origin-bottom
            after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:translate-y-1/2 after:border-[6px] after:border-[transparent] after:border-t-emerald-400 after:scale-0 after:hover:scale-100 after:transition-[transform] after:origin-top"
            data-tool-tip="copy"
          >
            &#9998;
          </span>
        </div>

        <div className="bg-slate-700 text-zinc-300 mt-4 mx-5 px-4">
          <div className="pt-3">
            <div className="flex justify-between items-center">
              <label htmlFor="pwd-length">Password Length</label>
              <span className="bg-slate-900 w-8 rounded-full text-center text-lg font-semibold text-emerald-400">
                {passwordLength}
              </span>
            </div>
            <div className="mt-2">
              <input
                type="range"
                onChange={(e) => setPasswordLength(e.target.value)}
                value={passwordLength}
                min={8}
                max={24}
                id="pwd-length"
                className="w-full cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-2">
            <input
              type="checkbox"
              id="number-chk-box"
              onClick={() => setIncludeNumbers((prevVal) => !prevVal)}
            />
            <label htmlFor="number-chk-box" className="ml-3 cursor-pointer">
              Include Numbers
            </label>
          </div>

          <div className="mt-2">
            <input
              type="checkbox"
              id="spec-char-chk-box"
              onClick={() => setIncludeSpecChars((prevVal) => !prevVal)}
            />
            <label htmlFor="spec-char-chk-box" className="ml-3 cursor-pointer">
              Include Special Characters
            </label>
          </div>

          <div className="mt-5 bg-slate-900 p-3.5 flex items-center justify-between">
            <div className="text-zinc-400 uppercase font-semibold text-xs">
              strength
            </div>
            <div className="flex gap-1.5">
              <IndicatorBar 
                bgColor={passwordStrength >= 1 ? "bg-emerald-400" : ""} 
              />
              <IndicatorBar
                bgColor={passwordStrength >= 2 ? "bg-emerald-400" : ""}
              />
              <IndicatorBar
                bgColor={passwordStrength >= 3 ? "bg-emerald-400" : ""}
              />
              <IndicatorBar
                bgColor={passwordStrength >= 4 ? "bg-emerald-400" : ""}
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => generatePassword()}
              className="bg-emerald-400 w-full my-5 py-2 text-slate-900 font-semibold
              hover:bg-emerald-500 transition-all"
            >
              Generate &#10141;
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
