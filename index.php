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
    <button onclick="playNote">
        play
    </button>
	<script type="text/javascript" src="./player.js"></script>
    <script type="text/javascript" src="./script.js"></script>
</head>
<body>
	<h1>Hello goorm</h1>
	<?php
		echo "Contents here";
	?>
</body>
</html>