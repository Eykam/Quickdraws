const leftPlayerCharacter = document.createElement("img");
const rightPlayerCharacter = document.createElement("img");
const topPos = "67%";
const charHeight = "150x"
const charWidth = "150px"
const startPosRight = "50%"
const startPosLeft = "40%"
let currSprite = 0;
let baseDirLeft = "/Images/character_left/"
let baseDirRight = "/Images/character_right/"
let baseWalkImg = "Cowboy4_walk without gun_";
let currParent = "";


function render (position){
    switch(position) {
        case "start":
            startPosition();
            break;

        default:
            startPosition();
    }

    console.log(leftPlayerCharacter);
    return [leftPlayerCharacter, rightPlayerCharacter]

}


function startPosition() {

    leftPlayerCharacter.src = "/Images/character_left/Cowboy4_idle without gun_2.png";
    leftPlayerCharacter.style.position = "fixed";
    leftPlayerCharacter.style.left = startPosLeft;
    leftPlayerCharacter.style.top = topPos;
    leftPlayerCharacter.style.width =charWidth;
    leftPlayerCharacter.style.height =charHeight;
    leftPlayerCharacter.style.display ="block";


    rightPlayerCharacter.src = "/Images/character_right/Cowboy4_idle without gun_2.png";
    rightPlayerCharacter.style.position = "fixed";
    rightPlayerCharacter.style.left = startPosRight;
    rightPlayerCharacter.style.top = topPos;
    rightPlayerCharacter.style.width = charWidth;
    rightPlayerCharacter.style.height = charHeight;
    rightPlayerCharacter.style.display ="block";

}


let walk = () => {
    console.log("walking")
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

    currParent.appendChild(rightPlayerCharacter);
    currParent.appendChild(leftPlayerCharacter);
    console.log("currCoordLeft: ", currCoordLeft)
    console.log("currPic: ", imgLeft)
    currSprite++;
}

function walking(parent){
    console.log("Walk");
    currParent = parent;
    setInterval(walk, 200);
}

function turn(){
    clearInterval(walk);
}
