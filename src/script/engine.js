const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
    cardDetails: document.getElementById("cardDetails"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSides: {
    player1: "player-cards",
    player1BOX: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBOX: document.querySelector("#computer-cards"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "SCISSORS",
    type: "cuts Paper and decapitates Lizard",
    img: `${pathImages}scissors.png`, //ARRUMAR IMAGENS
    WinOf: [1,2],
    LoseOf: [0,3,4],
  },

  {
    id: 1,
    name: "PAPER",
    type: "covers Rock and disproves Spock",
    img: `${pathImages}paper.png`, //ARRUMAR IMAGENS
    WinOf: [3,4],
    LoseOf: [0,1,2],
  },

  {
    id: 2,
    name: "LIZARD",
    type: "poisons Spock and eats Paper",
    img: `${pathImages}lizard.png`, //ARRUMAR IMAGENS
    WinOf: [4,1],
    LoseOf: [0,2,3],
  },

  {
    id: 3,
    name: "ROCK",
    type: "crushes Lizard and crushes Scissors",
    img: `${pathImages}rock.png`, //ARRUMAR IMAGENS
    WinOf: [2,0],
    LoseOf: [1,3,4],
  },

  {
    id: 4,
    name: "SPOCK",
    type: "smashes Scissors and vaporizes Rock",
    img: `${pathImages}spock.png`, //ARRUMAR IMAGENS
    WinOf: [0,3],
    LoseOf: [1,2,4],
  },
];

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", IdCard);
  cardImage.classList.add("card");

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(IdCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }

  if (fieldSide === state.playerSides.computer) {
    cardImage.addEventListener("click", () => {
      playAudio("alert")
      setTimeout(() => {
        alert("Ops! What are you doing here? 🤔");
      }, 500);// Meio segundo de atraso para garantir que o som toque antes
    });
  }

  return cardImage;
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";

  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  state.cardSprites.name.innerText = "Select";
  state.cardSprites.type.innerText = "a Card";

  state.cardSprites.cardDetails.style.display = "";

  init();
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.mp3`);
  audio.play();
}

async function setCardsField(cardId) {
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();

  await blockFieldCards();

  await hiddenCardDetails();

  await drawCardsInField(cardId, computerCardId);

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function blockFieldCards() {
  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";
}

async function hiddenCardDetails() {
  state.cardSprites.avatar.src = "";
  state.cardSprites.cardDetails.style.display = "none";
}

async function drawCardsInField(cardId, computerCardId) {
  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function drawButton(text) {
  state.actions.button.innerText = text;
  state.actions.button.style.display = "block";
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
  let playerCard = cardData[playerCardId];
  let computerCard = cardData[computerCardId];
  
  if(playerCard === computerCard){
    duelResults = "TIE";
    await playAudio("tie");
  }

  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = "YOU WIN! 😁";
    await playAudio("win");
    state.score.playerScore++;
  }
  if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = "you lose! 😥";
    await playAudio("lose");
    state.score.computerScore++;
  }

  return duelResults;
}

async function removeAllCardsImages() {
  let { computerBOX, player1BOX } = state.playerSides;
  let imgElements = computerBOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  imgElements = player1BOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    console.log(fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function playPageSound() {
  const bgm = document.getElementById("bgm");
  bgm.muted = false;
  bgm.volume = 0.8;
  bgm.play();  
}

async function init() {
  drawCards(5, state.playerSides.player1);
  drawCards(5, state.playerSides.computer);

  await playPageSound();
  
}

init();
