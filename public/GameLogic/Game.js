const leftPlayerCharacter = document.createElement("img");
const rightPlayerCharacter = document.createElement("img");
const topPos = "67%";
const charHeight = "150x";
const charWidth = "150px";
const startPosRight = "46%";
const startPosLeft = "40%";
const deadSpritePos = "82%";
let currSprite = 0;
let baseDirLeft = "../Images/character_left/";
let baseDirRight = "../Images/character_right/";
let baseIdle = "Cowboy4_idle without gun_2.png";
let baseWalkImg = "Cowboy4_walk without gun_";
let baseTurn = "Cowboy4_shoot_0.png";
let baseDead = "Cowboy4_dead.png";
let baseShoot = "Cowboy4_shoot_1.png";
let walkInterval = "";


function startPosition(parent) {

    leftPlayerCharacter.src = baseDirLeft + baseIdle;
    leftPlayerCharacter.style.position = "fixed";
    leftPlayerCharacter.style.left = startPosLeft;
    leftPlayerCharacter.style.top = topPos;
    leftPlayerCharacter.style.width =charWidth;
    leftPlayerCharacter.style.height =charHeight;
    leftPlayerCharacter.style.display ="block";
    leftPlayerCharacter.id="left-player-char";


    rightPlayerCharacter.src = baseDirRight + baseIdle;
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

// function shooting(){
//     clearInterval(walkInterval);
// }

function setShot(direction){

    if(direction == "right")
        rightPlayerCharacter.src = baseDirRight + baseShoot;
    else
        leftPlayerCharacter.src = baseDirLeft + baseShoot;
}

function setDead(direction){
    if(direction == "right"){
        rightPlayerCharacter.src = baseDirRight + baseDead;
        rightPlayerCharacter.style.top = deadSpritePos; 
    }
    else{
        leftPlayerCharacter.src = baseDirLeft + baseDead;
        leftPlayerCharacter.style.top = deadSpritePos;
    }
}

function turn(){
    clearInterval(walkInterval);
    leftPlayerCharacter.src = baseDirLeft + baseTurn;
    rightPlayerCharacter.src = baseDirRight + baseTurn;
}