// 1. ROM-KONFIGURASJON
const rooms = {
    "skogen": {
        width: 2500, 
        height: 1200,
        bg: "image/IMG_0613.jpeg" // Ditt nye bilde
    }
};

let currentRoom = rooms["skogen"];
let posX = 500, posY = 600;
let blindManX = 1800; // Mannen starter her
let blindManY = 600;
let isHidden = false;
let tutorialTriggered = false;

const player = document.getElementById('player');
const world = document.getElementById('world');
const blindMan = document.getElementById('blind-man');
const dialogBox = document.getElementById('dialog-box');
const dialogText = document.getElementById('dialog-text');

let keys = {};
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function visDialog(tekst) {
    dialogText.innerText = tekst;
    dialogBox.style.display = 'block';
}

function gameLoop() {
    // Gjemme-logikk (Ctrl)
    isHidden = keys['control'];
    if (isHidden) player.classList.add('hidden-mode');
    else player.classList.remove('hidden-mode');

    // Bevegelse
    let speed = 5;
    if (keys['w']) posY -= speed;
    if (keys['s']) posY += speed;
    if (keys['a']) posX -= speed;
    if (keys['d']) posX += speed;

    // Grenser for spilleren (stopp ved bildekanten)
    if (posX < 0) posX = 0;
    if (posY < 450) posY = 450; 
    if (posX > currentRoom.width - 80) posX = currentRoom.width - 80;
    if (posY > currentRoom.height - 80) posY = currentRoom.height - 80;

    // Mannens bevegelse
    blindManX -= 1.5;
    if (blindMan) {
        blindMan.style.left = blindManX + 'px';
        blindMan.style.top = blindManY + 'px';
    }

    // Kamera-logikk (Undertale-stil)
    let camX = (window.innerWidth / 2) - posX;
    let camY = (window.innerHeight / 2) - posY;

    // Stopp kameraet ved kantene (Camera Clamping)
    if (camX > 0) camX = 0;
    if (camY > 0) camY = 0;
    if (camX < window.innerWidth - currentRoom.width) camX = window.innerWidth - currentRoom.width;
    if (camY < window.innerHeight - currentRoom.height) camY = window.innerHeight - currentRoom.height;

    // Oppdatering av skjerm
    world.style.width = currentRoom.width + "px";
    world.style.height = currentRoom.height + "px";
    world.style.backgroundImage = `url('${currentRoom.bg}')`;
    world.style.transform = `translate(${camX}px, ${camY}px)`;
    
    player.style.left = posX + 'px';
    player.style.top = posY + 'px';

    // Tutorial-sjekk
    let distance = blindManX - posX;
    if (!tutorialTriggered && isHidden && distance < -200) {
        visDialog("Good job, it seems you’ve already got the hang of it.");
        tutorialTriggered = true;
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
