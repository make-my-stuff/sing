# Sing



## Setup
Running `setup.sh`
- Updates the OS
- Installs webserver (apache2)



## Resources
UI
---
- https://www.youtube.com/watch?v=cGYyOY4XaFs



## ToDo
UI Ideas
---
- Notes fall down as a stream. Speed depends upon tempo and height depends upon duration.
- Notes have background (solid color, pattern or something else like neon glow)
- Degree of help. 1 -> You see notes falling down, 2 -> You see only the correct note highlighted.
- Correct/Incorrect notes have visual feedbacks depending upon degree of correctness. Visual feedback for degree of accuracy.

Training ideas
---
- Interval training
- Range training




Tools
---
- Music player (takes in notes as JSON cassette)
- Range detection
- Tuner (Guitar / Violin) 


## Functional requirement



## Non-Functional requirements
- State
- Router
- Cache (sessionStorage, localStorage)
- Logger


## Workflow
- List functionality, tools, use cases
- Setup views, (pages, modals, popups)
- List resources and their view states
- List actions on those resources
- List triggers which may take any action on those resources or their view (show, hide etc.)


## tdd
- Write function signature with empty body
- Write tests that completely spec out the function (be it side effect, types and range of arguments, idempotency)
- Implement spec/test one by one