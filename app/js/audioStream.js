function getLocalStream() {
    navigator.mediaDevices
    .getUserMedia({ video: false, audio: true })
    .then((stream) => {
        window.localStream = stream;
        window.localAudio.srcObject = stream;
        window.localAudio.autoplay = true;
    })
    .catch((err) => {
        console.error(`you got an error: ${err}`);
    });
}
  