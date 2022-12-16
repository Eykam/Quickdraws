function createBirds() {
  const birds = document.createElement("div");
  const numBirds = Math.floor(5 * Math.random()) + 3;

  for (let i = 0; i < numBirds; i++) {
    const birdCont = document.createElement("div");
    const bird = document.createElement("div");

    const contHeight = 50 * Math.random() + "%";
    const contDelay = 10 * Math.random() + "s";
    const contDuration = 5 * Math.random() + 20 + "s";

    const birdDelay = -1 * Math.random() + "s";
    const birdDuration = Math.random() + 1.5 + "s";

    birdCont.classList.add("bird-container");
    // birdCont.classList.add(containerID);
    birdCont.style.top = contHeight;
    birdCont.style.animationDuration = contDuration;
    birdCont.style.animationDelay = contDelay;

    bird.classList.add("bird");
    // bird.classList.add(birdID);
    bird.style.animationDuration = birdDuration;
    bird.style.animationDelay = birdDelay;

    birdCont.appendChild(bird);
    birds.appendChild(birdCont);
  }

  return birds;
}
