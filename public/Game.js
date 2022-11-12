const leftPlayerCharacter = document.createElement("img");
const rightPlayerCharacter = document.createElement("img");
const topPos = "67%";
const charHeight = "150x"
const charWidth = "150px"
const startPosRight = "46%"
const startPosLeft = "40%"
let currSprite = 0;
let baseDirLeft = "/Images/character_left/"
let baseDirRight = "/Images/character_right/"
let baseWalkImg = "Cowboy4_walk without gun_";
let baseShoot = "Cowboy4_shoot_1.png"
let walkInterval = "";


function startPosition(parent) {

    leftPlayerCharacter.src = "/Images/character_left/Cowboy4_idle without gun_2.png";
    leftPlayerCharacter.style.position = "fixed";
    leftPlayerCharacter.style.left = startPosLeft;
    leftPlayerCharacter.style.top = topPos;
    leftPlayerCharacter.style.width =charWidth;
    leftPlayerCharacter.style.height =charHeight;
    leftPlayerCharacter.style.display ="block";
    leftPlayerCharacter.id="left-player-char";


    rightPlayerCharacter.src = "/Images/character_right/Cowboy4_idle without gun_2.png";
    rightPlayerCharacter.style.position = "fixed";
    rightPlayerCharacter.style.left = startPosRight;
    rightPlayerCharacter.style.top = topPos;
    rightPlayerCharacter.style.width = charWidth;
    rightPlayerCharacter.style.height = charHeight;
    rightPlayerCharacter.style.display ="block";
    rightPlayerCharacter.id="right-player-char";

    parent.appendChild(leftPlayerCharacter);
    parent.appendChild(rightPlayerCharacter);

}


let walk = () => {
    let srcNum = currSprite % 4;
    let imgRight = baseDirRight + baseWalkImg + srcNum + ".png"
    let imgLeft = baseDirLeft + baseWalkImg + srcNum + ".png"
    let currCoordRight = parseFloat(rightPlayerCharacter.style.left);
    let currCoordLeft = parseFloat(leftPlayerCharacter.style.left);


    rightPlayerCharacter.src = imgRight;
    currCoordRight = currCoordRight + 1;
    rightPlayerCharacter.style.left = currCoordRight + "%"; 

    leftPlayerCharacter.src = imgLeft;
    currCoordLeft = currCoordLeft - 1;
    leftPlayerCharacter.style.left = currCoordLeft + "%";

    currSprite++;
}
function walking(){
    clearInterval(walkInterval);
    walkInterval = setInterval(walk, 300);
}

function turn(){
    clearInterval(walkInterval);
    leftPlayerCharacter.src = baseDirLeft + baseShoot;
    rightPlayerCharacter.src = baseDirRight + baseShoot;
}
