// SYS-002: Jarvis Command Center Client Controller
// Language: Javascript

let lastAlertTicks = 0;
let sfxEnabled = true;
let gyroActive = false;
let lastVolTrigger = 0;
let lastSwipeTrigger = 0;
let activePanelIndex = 1; // Start in middle panel
const panels = ["left-panel", "middle-panel", "right-panel"];

// Audio Context Synthesizer variables
let audioCtx = null;
let humNode = null;

// DOM Elements
const timeDisplay = document.getElementById("time-display");
const terminalLogs = document.getElementById("terminal-logs");
const screenshotViewer = document.getElementById("screenshot-viewer");
const viewportPlaceholder = document.getElementById("viewport-placeholder");
const voiceTranscript = document.getElementById("voice-transcript");
const voiceTrigger = document.getElementById("voice-trigger");
const runPipelineBtn = document.getElementById("run-pipeline-btn");
const screenshotBtn = document.getElementById("btn-screenshot-trigger");
const gyroToggle = document.getElementById("gyro-toggle");
const gyroTiltVal = document.getElementById("gyro-tilt-val");
const gyroRollVal = document.getElementById("gyro-roll-val");
const arcReactor = document.getElementById("arc-reactor");
const sfxToggle = document.getElementById("sfx-toggle");
const themeToggle = document.getElementById("theme-toggle");

// Initialize Clock
function updateClock() {
    const now = new Date();
    timeDisplay.textContent = now.toISOString().split('T')[1].substring(0, 8) + " UTC";
}
setInterval(updateClock, 1000);
updateClock();

// UI LOGGING
function logToTerminal(message, type = "system-log") {
    const entry = document.createElement("div");
    entry.className = `log-entry ${type}`;
    const timestamp = new Date().toLocaleTimeString();
    entry.textContent = `[${timestamp}] ${message}`;
    terminalLogs.appendChild(entry);
    terminalLogs.scrollTop = terminalLogs.scrollHeight;
}

// AUDIO SYNTHESIZER
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playBeep(freq = 1200, duration = 0.08) {
    if (!sfxEnabled) return;
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
}

function playAlertSound() {
    if (!sfxEnabled) return;
    try {
        initAudio();
        const now = audioCtx.currentTime;
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        const gain2 = audioCtx.createGain();
        
        osc1.connect(gain1);
        osc2.connect(gain2);
        gain1.connect(audioCtx.destination);
        gain2.connect(audioCtx.destination);
        
        osc1.frequency.setValueAtTime(900, now);
        osc1.frequency.setValueAtTime(1100, now + 0.15);
        osc2.frequency.setValueAtTime(500, now);
        osc2.frequency.setValueAtTime(600, now + 0.15);
        
        gain1.gain.setValueAtTime(0.04, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.30);
        gain2.gain.setValueAtTime(0.04, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.30);
        
        osc1.start();
        osc2.start();
        osc1.stop(now + 0.30);
        osc2.stop(now + 0.30);
    } catch (e) {}
}

function startAmbientHum() {
    try {
        initAudio();
        if (humNode) return;
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.value = 60; // Low frequency hum
        gain.gain.value = 0.01; // Low volume
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        humNode = { osc, gain };
        logToTerminal("Jarvis reactor power hum active.", "success-log");
    } catch (e) {}
}

function stopAmbientHum() {
    if (humNode) {
        try {
            humNode.osc.stop();
        } catch (e) {}
        humNode = null;
        logToTerminal("Jarvis reactor power hum muted.", "system-log");
    }
}

// SPEAK FEEDBACK ON PHONE
function speakOnPhone(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Halt ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.95; // Slightly lower pitch for Jarvis feel
    utterance.rate = 1.05;  // Slightly faster speed
    // Try to find a nice male English voice
    const voices = window.speechSynthesis.getVoices();
    const jarvisVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Microsoft David"));
    if (jarvisVoice) utterance.voice = jarvisVoice;
    window.speechSynthesis.speak(utterance);
}

// COMMAND TRIGGER
async function sendCommand(action, payload = {}) {
    playBeep(900, 0.05);
    try {
        const response = await fetch("/api/control", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, ...payload })
        });
        const result = await response.json();
        if (result.status === "OK") {
            logToTerminal(`PC Action [${action}] executed.`, "success-log");
            return true;
        } else {
            logToTerminal(`Action [${action}] failed: ${result.message}`, "warning-log");
        }
    } catch (err) {
        logToTerminal(`Server connection error: ${err.message}`, "alert-log");
    }
    return false;
}

// MEDIA CONTROL & EVENT LISTENERS
document.querySelectorAll(".control-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-action");
        if (action) sendCommand(action);
    });
});

document.querySelectorAll(".link-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const url = btn.getAttribute("data-url");
        if (url) sendCommand("open-url", { url });
    });
});

// LANDING SCREENSHOT VIEW
async function takeScreenshot() {
    playBeep(1400, 0.06);
    logToTerminal("Requesting live screenshot viewport...", "system-log");
    screenshotViewer.style.display = "none";
    viewportPlaceholder.style.display = "block";
    viewportPlaceholder.textContent = "CAPTURING...";
    
    try {
        const timestamp = Date.now();
        screenshotViewer.src = `/api/screenshot?t=${timestamp}`;
        screenshotViewer.onload = () => {
            viewportPlaceholder.style.display = "none";
            screenshotViewer.style.display = "block";
            logToTerminal("PC Viewport refreshed.", "success-log");
        };
        screenshotViewer.onerror = () => {
            viewportPlaceholder.textContent = "CAPTURE FAILED";
            logToTerminal("Viewport reload error.", "alert-log");
        };
    } catch (e) {
        viewportPlaceholder.textContent = "OFFLINE";
    }
}
screenshotBtn.addEventListener("click", takeScreenshot);

// ACTIVE WORKSPACE STATUS CHECK
async function checkWorkspaceStatus() {
    try {
        const response = await fetch("/api/workspace-status");
        const data = await response.json();
        if (data.status === "OK") {
            logToTerminal(`Workspace verified. Founder: ${data.founder}. Location: ${data.location}.`, "success-log");
            data.modules.forEach(m => {
                logToTerminal(`[Module] ${m.name}: ${m.files} files, ${m.size} KB`, "system-log");
            });
        }
    } catch (err) {
        logToTerminal(`Workspace check failed: ${err.message}`, "warning-log");
    }
}

// EXECUTE SEQUENCER PIPELINE
runPipelineBtn.addEventListener("click", async () => {
    playBeep(1600, 0.1);
    
    // Get checked options
    const checkedTasks = [];
    document.querySelectorAll(".task-checklist input:checked").forEach(cb => {
        checkedTasks.push(cb.value);
    });

    if (checkedTasks.length === 0) {
        logToTerminal("Sequencer aborted: No tasks selected.", "warning-log");
        return;
    }

    logToTerminal("Initializing Pipeline Sequence...", "success-log");
    speakOnPhone("Starting orchestration sequence, Boss.");
    
    try {
        const response = await fetch("/api/sequence", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                tasks: checkedTasks,
                text: "Jarvis sequence executed successfully on PC, Boss."
            })
        });
        const result = await response.json();
        
        // Output orchestration logs
        if (result.logs) {
            result.logs.forEach(l => {
                const logType = l.includes("[ERROR]") ? "alert-log" : (l.includes("[WARNING]") ? "warning-log" : "success-log");
                logToTerminal(l, logType);
            });
        }
        
        if (result.status === "OK") {
            speakOnPhone("Orchestration pipeline completed successfully.");
            // If screenshot was in task list, trigger live refresh
            if (checkedTasks.includes("screenshot")) {
                setTimeout(takeScreenshot, 600);
            }
        }
    } catch (e) {
        logToTerminal(`Pipeline sequence failed: ${e.message}`, "alert-log");
    }
});

// SPEECH RECOGNITION (VOICE CONTROL)
let recognition = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        arcReactor.classList.add("listening");
        voiceTranscript.textContent = "Listening for command...";
        voiceTranscript.style.color = "var(--neon-color)";
        playBeep(1000, 0.05);
    };

    recognition.onend = () => {
        arcReactor.classList.remove("listening");
    };

    recognition.onerror = (e) => {
        logToTerminal(`Voice recognition error: ${e.error}`, "warning-log");
        voiceTranscript.textContent = "Listening halted.";
        voiceTranscript.style.color = "var(--text-muted)";
    };

    recognition.onresult = async (event) => {
        const text = event.results[0][0].transcript.toLowerCase().trim();
        voiceTranscript.textContent = `"${text}"`;
        logToTerminal(`Voice trigger: "${text}"`, "success-log");

        // Parse commands: Look for "jarvis" keyword or just standard actions
        if (text.includes("jarvis") || text.includes("hey jarvis") || text.includes("status")) {
            speakOnPhone("Processing command, Boss.");
            
            if (text.includes("screenshot") || text.includes("desktop image")) {
                takeScreenshot();
            } else if (text.includes("lock")) {
                speakOnPhone("Locking terminal, Boss.");
                setTimeout(() => sendCommand("lock"), 500);
            } else if (text.includes("mute")) {
                sendCommand("mute");
            } else if (text.includes("volume up") || text.includes("louder")) {
                sendCommand("volume-up");
            } else if (text.includes("volume down") || text.includes("quieter")) {
                sendCommand("volume-down");
            } else if (text.includes("desktop") || text.includes("minimize")) {
                sendCommand("show-desktop");
            } else if (text.includes("status") || text.includes("health") || text.includes("check")) {
                runPipelineBtn.click(); // Trigger default sequencer
            } else if (text.includes("say")) {
                const words = text.split("say");
                const speakText = words.slice(1).join("say").trim();
                if (speakText) sendCommand("speak", { text: speakText });
            } else {
                speakOnPhone("Command unrecognized, Boss.");
                logToTerminal(`Jarvis: Unrecognized speech directive.`, "warning-log");
            }
        } else {
            voiceTranscript.textContent = `Tap and speak command...`;
            voiceTranscript.style.color = "var(--text-muted)";
        }
    };
} else {
    voiceTrigger.style.display = "none";
    voiceTranscript.textContent = "Speech Recognition not supported on this browser.";
}

voiceTrigger.addEventListener("click", () => {
    if (recognition) {
        try {
            recognition.start();
        } catch (e) {
            recognition.stop();
        }
    }
});

// ALERTS POLLING (Watch for file changes on server)
async function pollAlerts() {
    try {
        const response = await fetch(`/api/alerts?since=${lastAlertTicks}`);
        const data = await response.json();
        
        if (data.alerts && data.alerts.length > 0) {
            playAlertSound();
            data.alerts.forEach(a => {
                logToTerminal(`[FILE ALERT] ${a.change}: ${a.file}`, "alert-log");
                speakOnPhone(`Warning. Workspace file modified: ${a.file.split('\\').pop()}`);
            });
        }
        lastAlertTicks = data.currentTicks;
    } catch (e) {
        // Quietly fail to prevent log spamming during disconnections
    }
}
setInterval(pollAlerts, 2000);

// GYROSCOPE/TILT MOTION CONTROLS
async function handleGyro(event) {
    if (!gyroActive) return;

    const tilt = Math.round(event.beta);  // Forward/Backward (-180 to 180)
    const roll = Math.round(event.gamma); // Left/Right (-90 to 90)

    gyroTiltVal.textContent = `${tilt}°`;
    gyroRollVal.textContent = `${roll}°`;

    const now = Date.now();

    // 1. TILT FORWARD/BACKWARD (VOL CONTROL)
    // Threshold: Tilt forward > 25° for Volume Up, Backward < -25° for Volume Down
    if (now - lastVolTrigger > 1500) { // Throttle command to once every 1.5s
        if (tilt > 25) {
            logToTerminal("Gyroscope directive: VOLUME UP", "success-log");
            sendCommand("volume-up");
            lastVolTrigger = now;
        } else if (tilt < -25) {
            logToTerminal("Gyroscope directive: VOLUME DOWN", "success-log");
            sendCommand("volume-down");
            lastVolTrigger = now;
        }
    }

    // 2. TILT LEFT/RIGHT (PANEL SWITCH)
    // Threshold: Roll left < -35° or Roll right > 35°
    if (now - lastSwipeTrigger > 2000) { // Throttle view switches
        if (roll > 35) {
            // Swipe right
            activePanelIndex = (activePanelIndex + 1) % panels.length;
            focusPanel(activePanelIndex);
            lastSwipeTrigger = now;
        } else if (roll < -35) {
            // Swipe left
            activePanelIndex = (activePanelIndex - 1 + panels.length) % panels.length;
            focusPanel(activePanelIndex);
            lastSwipeTrigger = now;
        }
    }
}

function focusPanel(index) {
    logToTerminal(`HUD View switched to: ${panels[index].toUpperCase()}`, "system-log");
    playBeep(1100, 0.05);
    
    // Hide panels and display active one on mobile
    if (window.innerWidth < 768) {
        document.querySelectorAll(".hud-panel").forEach((panel, idx) => {
            if (idx === index) {
                panel.style.display = "flex";
            } else {
                panel.style.display = "none";
            }
        });
    }
}

// Request Gyro Permissions on mobile browsers
gyroToggle.addEventListener("click", async () => {
    playBeep(1000, 0.05);
    
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+ requires manual request
        try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === 'granted') {
                toggleGyroState();
            } else {
                logToTerminal("Gyroscope access denied.", "warning-log");
            }
        } catch (e) {
            logToTerminal("Error requesting Gyro permission: " + e.message, "alert-log");
        }
    } else {
        // Android / Non-iOS
        toggleGyroState();
    }
});

function toggleGyroState() {
    gyroActive = !gyroActive;
    if (gyroActive) {
        window.addEventListener("deviceorientation", handleGyro);
        gyroToggle.textContent = "DISCONNECT GYRO";
        gyroToggle.style.backgroundColor = "rgba(0, 240, 255, 0.15)";
        logToTerminal("Holographic motion control sensor linked.", "success-log");
        speakOnPhone("Gyroscope linked. Conductor controls active.");
    } else {
        window.removeEventListener("deviceorientation", handleGyro);
        gyroToggle.textContent = "CONNECT GYRO";
        gyroToggle.style.backgroundColor = "rgba(0, 240, 255, 0.05)";
        logToTerminal("Holographic motion control unlinked.", "system-log");
        speakOnPhone("Gyroscope unlinked.");
        gyroTiltVal.textContent = "0°";
        gyroRollVal.textContent = "0°";
    }
}

// SFX & Ambience Toggle
sfxToggle.addEventListener("click", () => {
    sfxEnabled = !sfxEnabled;
    if (sfxEnabled) {
        sfxToggle.textContent = "SFX ON";
        sfxToggle.className = "audio-btn sfx-on";
        startAmbientHum();
    } else {
        sfxToggle.textContent = "SFX OFF";
        sfxToggle.className = "audio-btn sfx-off";
        stopAmbientHum();
    }
});

// Theme Switcher (Cyan vs Red)
themeToggle.addEventListener("click", () => {
    playBeep(1200, 0.05);
    const body = document.body;
    if (body.classList.contains("cyan-theme")) {
        body.classList.remove("cyan-theme");
        body.classList.add("red-theme");
        themeToggle.textContent = "THEME: RED/GOLD";
        logToTerminal("Jarvis system core shifted to RED/GOLD thermal output.", "warning-log");
        speakOnPhone("Core power redirected. Red theme loaded.");
    } else {
        body.classList.remove("red-theme");
        body.classList.add("cyan-theme");
        themeToggle.textContent = "THEME: CYAN";
        logToTerminal("Jarvis system core shifted to CYAN standard output.", "success-log");
        speakOnPhone("Core power standard. Cyan theme loaded.");
    }
});

// Startup sequence
window.addEventListener("load", () => {
    // Initial workspace check
    checkWorkspaceStatus();
    // Warm up voice list
    if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
    }
    // Start ambient power hum
    setTimeout(startAmbientHum, 1000);
});
