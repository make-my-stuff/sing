<html>
<head>
	<title>Hello goorm</title>
	<script src="https://unpkg.com/tone"></script>
    <script>
        function playNote() {
            // create a synth
            const synth = new Tone.Synth().toDestination();
            // play a note from that synth
            synth.triggerAttackRelease("C4", "8n");
        }
    </script>
	<script type="text/javascript" src="./player.js"></script>
</head>
<body>
    <button id="tonePlay">
        play
    </button>
    <button id="notePlay">
        note
    </button>
    <script type="text/javascript" src="./script.js"></script>
</body>
</html>