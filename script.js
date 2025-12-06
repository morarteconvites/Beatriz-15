const video = document.getElementById("video");
const frame = document.getElementById("frame");
const canvas = document.getElementById("canvas");

const startBtn = document.getElementById("startRecord");
const stopBtn = document.getElementById("stopRecord");
const switchBtn = document.getElementById("switchCamera");

let facingMode = "user";
let recorder;
let recordedChunks = [];
let drawing = false;

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode },
      audio: true
    });

    video.srcObject = stream;
  } catch (err) {
    alert("Erro ao abrir câmera: " + err.message);
  }
}

function drawLoop() {
  if (!drawing) return;

  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

  requestAnimationFrame(drawLoop);
}

startBtn.onclick = () => {
  drawing = true;
  drawLoop();

  const stream = canvas.captureStream(30); // 30 FPS
  recorder = new MediaRecorder(stream);

  recordedChunks = [];
  recorder.ondataavailable = e => recordedChunks.push(e.data);

  recorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "video_moldura.webm";
    a.click();
  };

  recorder.start();
  startBtn.style.display = "none";
  stopBtn.style.display = "inline-block";
};

stopBtn.onclick = () => {
  drawing = false;
  recorder.stop();
  startBtn.style.display = "inline-block";
  stopBtn.style.display = "none";
};

switchBtn.onclick = () => {
  facingMode = facingMode === "user" ? "environment" : "user";
  startCamera();
};

startCamera();
