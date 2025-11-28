let currentWallpaper = 0;
const wallpapersList = [
    'radial-gradient(circle at center, #222, #1a1a1a)',
    'radial-gradient(circle at center, #0066ff, #1a1a1a)',
    'radial-gradient(circle at center, #ff0066, #1a1a1a)',
    'radial-gradient(circle at center, #00ff66, #1a1a1a)',
    'radial-gradient(circle at center, #6600ff, #1a1a1a)'
];

function wallpapers() {
    const watchFrame = document.getElementById('watchFrame');
    currentWallpaper = (currentWallpaper + 1) % wallpapersList.length;
    watchFrame.style.backgroundImage = wallpapersList[currentWallpaper];
}

const themeSwitcher = document.getElementById('themeSwitcher');
const watchFrame = document.getElementById('watchFrame');
let darkMode = true;
function darkLightMode() {
    darkMode = !darkMode;
    if(darkMode){
        watchFrame.classList.remove('light');
        themeSwitcher.textContent = '\u{1F319}';
    } else {
        watchFrame.classList.add('light');
        themeSwitcher.textContent = '\u2600\uFE0F';
    }
}

let digitalMode = true;
const timerText = document.getElementById("timer");
const analogCanvas = document.getElementById("analogClock");
const ctx = analogCanvas.getContext("2d");

function toggleClockMode() {
    digitalMode = !digitalMode;
    if(digitalMode){
        timerText.style.display = "block";
        analogCanvas.style.display = "none";
    } else {
        timerText.style.display = "none";
        analogCanvas.style.display = "block";
    }
}

function drawAnalogClock() {
    const radius = analogCanvas.height / 2;
    ctx.clearRect(0, 0, analogCanvas.width, analogCanvas.height);
    ctx.save();
    ctx.translate(radius, radius);

    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    ctx.beginPath();
    ctx.arc(0, 0, radius - 5, 0, 2 * Math.PI);
    ctx.strokeStyle = darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)";
    ctx.lineWidth = 4;
    ctx.stroke();

    for(let i=1;i<=12;i++){
        let ang = i*Math.PI/6;
        ctx.save();
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.moveTo(0, -radius+10);
        ctx.lineTo(0, -radius+20);
        ctx.stroke();
        ctx.restore();
    }

    drawHand((hour % 12 + minute / 60) * 30, radius * 0.5, 6);
    drawHand(minute * 6, radius * 0.8, 4);
    drawHand(second * 6, radius * 0.9, 2, "rgba(255,255,255,0.5)");

    ctx.restore();
}

function drawHand(angleDeg, length, width, color = "rgba(255,255,255,0.8)") {
    const angle = angleDeg * Math.PI / 180 - Math.PI / 2;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(0, 0);
    ctx.lineTo(length * Math.cos(angle), length * Math.sin(angle));
    ctx.stroke();
}

setInterval(() => {
    if(!digitalMode){
        drawAnalogClock();
    } else {
        timer();
    }
}, 1000);

function getWeather() {
    const latitude = 50.061;
    const longitude = 19.937;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m,apparent_temperature`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const temp = data.current_weather.temperature;
            const wind = data.current_weather.windspeed;
            const humidity = data.hourly.relativehumidity_2m[0];
            const apparent = data.hourly.apparent_temperature[0];

            document.getElementById("weather").innerHTML =
                `\u{1F324} <b>Kraków</b><br>` +
                `\u{1F321} Temp: <b>${temp}°C</b><br>` +
                `\u{1F914} Odczuwalna: <b>${apparent}°C</b><br>` +
                `\u{1F4A8} Wiatr: <b>${wind} km/h</b><br>` +
                `\u{1F4A7} Wilgotność: <b>${humidity}%</b>`;
        });
}
getWeather();

function batteryStatus() {
    navigator.getBattery().then(battery => {
        function update() {
            document.getElementById("battery").textContent = `\u{1F50B} ${Math.round(battery.level * 100)}%`;
        }
        update();
        battery.onlevelchange = update;
        battery.onchargingchange = update;
    });
}
batteryStatus();

function timer() {
    let time = new Date();
    let hour = String(time.getHours()).padStart(2, "0");
    let minute = String(time.getMinutes()).padStart(2, "0");
    let second = String(time.getSeconds()).padStart(2, "0");
    timerText.textContent = `${hour}:${minute}:${second}`;
}
timer();

function date() {
    let date = new Date();
    const daysOfWeek = ["niedziela","poniedziałek","wtorek","środa","czwartek","piątek","sobota"];
    const months = ["stycznia","lutego","marca","kwietnia","maja","czerwca","lipca","sierpnia","września","października","listopada","grudnia"];
    let text = `${daysOfWeek[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    document.getElementById("date").textContent = text;
}
setInterval(date, 1000);
date();

function steps() {
    let currentSteps = 0;
    const caloriesPerStep = 0.04;
    const metersPerStep = 0.78;
    setInterval(() => {
        currentSteps++;
        const calories = (currentSteps * caloriesPerStep).toFixed(1);
        const distance = (currentSteps * metersPerStep / 1000).toFixed(2);
        document.getElementById("steps").innerHTML =
            `\u{1F463} Kroki: <b>${currentSteps}</b><br>` +
            `\u{1F525} Kalorie: <b>${calories} kcal</b><br>` +
            `\u{1F4CF} Dystans: <b>${distance} km</b>`;
    }, 1000);
}
steps();

const notificationsList = [
    "\u{1F4E9} Masz nowego maila",
    "\u{1F4AC} Wiadomość od Anny",
    "\u{1F4C5} Spotkanie o 15:00",
    "\u26A1 Aktualizacja aplikacji dostępna",
    "\u{1F514} Przypomnienie: Woda do picia",
    "\u{1F6D2} Lista zakupów: mleko, chleb, jajka"
];

const notificationsElement = document.getElementById("notifications");

function addNotification() {
    const randomIndex = Math.floor(Math.random() * notificationsList.length);
    const notification = notificationsList[randomIndex];

    const li = document.createElement("li");
    li.textContent = notification;
    li.style.marginBottom = "5px";
    notificationsElement.prepend(li);

    if(notificationsElement.children.length > 5){
        notificationsElement.removeChild(notificationsElement.lastChild);
    }
}
setInterval(addNotification, 3000);

function heartRateMonitor() {
    const heartRateElement = document.getElementById("heartRate");
    setInterval(() => {
        const bpm = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
        heartRateElement.textContent = `\u2764\uFE0F ${bpm} bpm`;
    }, 3000);
}
heartRateMonitor();

function oxygenMonitor() {
    const oxygenElement = document.getElementById("oxygenLevel");
    setInterval(() => {
        const spo2 = Math.floor(Math.random() * (100 - 95 + 1)) + 95;
        oxygenElement.textContent = `\u{1FA78} ${spo2}%`;
    }, 3000);
}
oxygenMonitor();

function bloodPressureMonitor() {
    const bpElement = document.getElementById("bloodPressure");
    setInterval(() => {
        const systolic = Math.floor(Math.random() * (140 - 90 + 1)) + 90;
        const diastolic = Math.floor(Math.random() * (90 - 60 + 1)) + 60;
        bpElement.textContent = `\u2763 ${systolic}/${diastolic} mmHg`;
    }, 3000);
}
bloodPressureMonitor();

function stressMonitor() {
    const stressElement = document.getElementById("stressLevel");
    setInterval(() => {
        const stress = Math.floor(Math.random() * 101);
        let emoji = "\u{1F60C}";
        if(stress > 70) emoji = "\u{1F62B}";
        else if(stress > 40) emoji = "\u{1F610}";
        stressElement.textContent = `${emoji} ${stress}%`;
    }, 3000);
}
stressMonitor();

const audioElement = document.getElementById("myAudio");
const playIcon = document.getElementById("playIcon");
const audioLabel = document.getElementById("audioLabel");

playIcon.addEventListener("click", () => {
    if (audioElement.paused) {
        audioElement.play();
        playIcon.textContent = "\u23F8\uFE0F";
        audioLabel.textContent = "\u{1F3B5} Mozart – Symphony No. 40";
    } else {
        audioElement.pause();
        playIcon.textContent = "\u25B6\uFE0F";
    }
});

let stopwatchInterval, milliseconds = 0, seconds = 0, minutes = 0, stopwatchRunning = false;
const stopwatchIcon = document.getElementById("stopwatchIcon");
const stopwatchReset = document.getElementById("stopwatchReset");
const stopwatchDisplay = document.getElementById("stopwatch");

function updateStopwatchDisplay() {
    const formatted = String(minutes).padStart(2,'0')+':' + String(seconds).padStart(2,'0')+':' + String(Math.floor(milliseconds/10)).padStart(2,'0');
    stopwatchDisplay.textContent = formatted;
}

stopwatchIcon.addEventListener("click", () => {
    if (!stopwatchRunning) {
        stopwatchInterval = setInterval(() => {
            milliseconds += 10;
            if(milliseconds>=1000){ milliseconds=0; seconds++; }
            if(seconds>=60){ seconds=0; minutes++; }
            updateStopwatchDisplay();
        }, 10);
        stopwatchRunning = true;
        stopwatchIcon.textContent = "\u23F8\uFE0F";
    } else {
        clearInterval(stopwatchInterval);
        stopwatchRunning = false;
        stopwatchIcon.textContent = "\u25B6\uFE0F";
    }
});

stopwatchReset.addEventListener("click", () => {
    clearInterval(stopwatchInterval);
    stopwatchRunning=false;
    milliseconds=0; seconds=0; minutes=0;
    updateStopwatchDisplay();
    stopwatchIcon.textContent = "\u25B6\uFE0F";
});

let countdownInterval;
let countdownTime = 5 * 60;
const countdownDisplay = document.getElementById("countdown");
const startCountdownBtn = document.getElementById("startCountdown");
const pauseCountdownBtn = document.getElementById("pauseCountdown");
const resetCountdownBtn = document.getElementById("resetCountdown");

function updateCountdownDisplay() {
    let minutes = Math.floor(countdownTime / 60);
    let seconds = countdownTime % 60;
    countdownDisplay.textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}

function startCountdown() {
    if (countdownInterval) return;
    countdownInterval = setInterval(() => {
        if (countdownTime > 0) {
            countdownTime--;
            updateCountdownDisplay();
        } else {
            clearInterval(countdownInterval);
            countdownInterval = null;
            alert("\u23F0 Czas minął!");
        }
    }, 1000);
}

function pauseCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = null;
}

function resetCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = null;
    countdownTime = 5 * 60;
    updateCountdownDisplay();
}

startCountdownBtn.addEventListener("click", startCountdown);
pauseCountdownBtn.addEventListener("click", pauseCountdown);
resetCountdownBtn.addEventListener("click", resetCountdown);

const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");
const setCountdownBtn = document.getElementById("setCountdown");

setCountdownBtn.addEventListener("click", () => {
    const minutesVal = parseInt(minutesInput.value) || 0;
    const secondsVal = parseInt(secondsInput.value) || 0;
    countdownTime = minutesVal * 60 + secondsVal;
    updateCountdownDisplay();
});

updateCountdownDisplay();

const compassCanvas = document.getElementById("compass");
const compassCtx = compassCanvas.getContext("2d");
const compassRadius = compassCanvas.width / 2;

function drawCompass(angleDeg) {
    compassCtx.clearRect(0, 0, compassCanvas.width, compassCanvas.height);
    compassCtx.save();
    compassCtx.translate(compassRadius, compassRadius);

    compassCtx.beginPath();
    compassCtx.arc(0, 0, compassRadius - 5, 0, 2 * Math.PI);
    compassCtx.fillStyle = "rgba(255,255,255,0.05)";
    compassCtx.fill();
    compassCtx.lineWidth = 2;
    compassCtx.strokeStyle = "rgba(255,255,255,0.3)";
    compassCtx.stroke();

    const dirs = ["N", "E", "S", "W"];
    dirs.forEach((d, i) => {
        const rad = (i * 90 - 90) * Math.PI / 180;
        compassCtx.fillStyle = "white";
        compassCtx.font = "14px sans-serif";
        compassCtx.textAlign = "center";
        compassCtx.textBaseline = "middle";
        compassCtx.fillText(d, (compassRadius - 25) * Math.cos(rad), (compassRadius - 25) * Math.sin(rad));
    });

    const angle = angleDeg * Math.PI / 180 - Math.PI / 2;
    compassCtx.beginPath();
    compassCtx.moveTo(0, 0);
    compassCtx.lineTo((compassRadius - 30) * Math.cos(angle), (compassRadius - 30) * Math.sin(angle));
    compassCtx.lineWidth = 4;
    compassCtx.strokeStyle = "red";
    compassCtx.stroke();

    compassCtx.restore();
}

let simulatedAngle = 0;
setInterval(() => {
    simulatedAngle = (simulatedAngle + 1) % 360;
    drawCompass(simulatedAngle);
}, 500);

const map = L.map('map');
setTimeout(() => {
    map.setView([50.061, 19.937], 13);
    map.invalidateSize();
}, 250);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(map);
L.marker([50.061,19.937]).addTo(map).bindPopup("Kraków");

const slotEmojis = ["\u{1F352}", "\u{1F34B}", "\u{1F34A}", "\u{1F349}", "\u{1F347}", "\u2B50"];
const slotDisplay = document.getElementById("slotDisplay");
const spinSlotBtn = document.getElementById("spinSlot");

function spinSlotsAnimated() {
    let spinCount = 0;
    const maxSpins = 15;
    const intervalTime = 100;

    const spinInterval = setInterval(() => {
        const slots = [];
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * slotEmojis.length);
            slots.push(slotEmojis[randomIndex]);
        }
        slotDisplay.textContent = slots.join(" ");
        spinCount++;

        if (spinCount >= maxSpins) {
            clearInterval(spinInterval);
            if (slots[0] === slots[1] && slots[1] === slots[2]) {
                alert("\u{1F389} Wygrana! \u{1F389}");
            }
        }
    }, intervalTime);
}
spinSlotBtn.addEventListener("click", spinSlotsAnimated);

const calcDisplay = document.getElementById("calcDisplay");
const calcButtons = document.querySelectorAll(".calc-btn");
let currentInput = "";

calcButtons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.textContent;
        if(value === "C") {
            currentInput = "";
            calcDisplay.value = "";
        } else if(value === "=") {
            try {
                currentInput = eval(currentInput).toString();
                calcDisplay.value = currentInput;
            } catch {
                calcDisplay.value = "Błąd";
                currentInput = "";
            }
        } else {
            currentInput += value;
            calcDisplay.value = currentInput;
        }
    });
});