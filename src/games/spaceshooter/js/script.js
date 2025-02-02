const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['assets/monster_1.png', 'assets/monster_2.png', 'assets/monster_3.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;

//movimento e tiro da nave
function flyShip(event) {

    switch (event.which) {
        // Subir:
        case 87:
        case 38:
            event.preventDefault();
            moveUp();
            break;

        // Descer:
        case 83:
        case 40:
            event.preventDefault();
            moveDown();
            break;

        // Atirar:
        case 32:
            event.preventDefault();
            fireLaser();
            break;
    }
}

//função de subir
function moveUp() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');

    if (topPosition === "0px") {
        return
    }

    let position = parseInt(topPosition);
    position -= 50;
    yourShip.style.top = `${position}px`;
}

//função de descer
function moveDown() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');

    if (topPosition === "550px") {
        return
    }

    let position = parseInt(topPosition);
    position += 50;
    yourShip.style.top = `${position}px`;
}

//funcionalidade de tiro
function fireLaser() {
    let laser = createLaserElement();

    playArea.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');

    newLaser.src = 'assets/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${0}px`;
    newLaser.style.top = `${yPosition - 10}px`;

    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        //comparando se cada alien foi atingido, se sim, troca o src da imagem
        aliens.forEach((alien) => {
            if (checkLaserCollision(laser, alien)) {
                alien.src = 'assets/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        })

        if (xPosition >= 400) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 8}px`;
        }

    }, 10);
}

//função para criar inimigos aleatórios
function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; //sorteio de imagens

    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

//função para movimentar os inimigos
function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));

        if (xPosition <= 50) {
            if (Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
            } else {
                gameOver();
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }

    }, 30);
}

//função para  colisão
function checkLaserCollision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;

    if (laserLeft != 340 && laserLeft + 40 >= alienLeft) {
        if (laserTop <= alienTop && laserTop >= alienBottom) {
            return true;
        }

        return false;
    }

    return false;
}

//inicio do jogo
startButton.addEventListener('click', () => {
    playGame();
})

function playGame() {
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);

    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

//função de game over
function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);

    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());

    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());

    setTimeout(() => {
        alert('GAME OVER!');
        yourShip.style.top = "250px";
        startButton.style.display = "block";
        instructionsText.style.display = "block";
    });
}