// Login info storage
let userLocalStorage = { noOfLogins: 0, red: 0, orange: 0, pink: 0, green: 0 }; // Object to store user-related data
let user; // User's username

// Controls the pieces' positions
let squaresGrid = []; // An array to store information about the positions of game pieces

// Player turn: 0 for red, 1 for orange, 2 for pink, 3 for green
let currentTurn = -1; // Initialize to an invalid value

// Stores the current game state for each player
const players = {
    red: { monsters: 0, werewolf: 0, dracula: 0, ghost: 0 },
    orange: { monsters: 0, werewolf: 0, dracula: 0, ghost: 0 },
    pink: { monsters: 0, werewolf: 0, dracula: 0, ghost: 0 },
    green: { monsters: 0, werewolf: 0, dracula: 0, ghost: 0 },
};

// HTML page references
const boardSquares = document.getElementsByClassName("square"); // Collection of square elements on the game board
const pieces = document.getElementsByClassName("piece"); // Collection of game piece elements
const piecesImages = document.getElementsByTagName("img"); // Collection of image elements

// References to various UI elements
let btnLogin = document.getElementById("btn-login"); // Login button
let btnStart = document.getElementById("btn-start"); // Start game button
let btnTurn = document.getElementById("btn-turn"); // Turn button
let turn = document.getElementById("turn"); // Element displaying the current turn
let redPlayer = document.getElementById("redPlayer"); // Red player's info
let orangePlayer = document.getElementById("orangePlayer"); // Orange player's info
let pinkPlayer = document.getElementById("pinkPlayer"); // Pink player's info
let greenPlayer = document.getElementById("greenPlayer"); // Green player's info
let myUser = document.getElementById("userId"); // Element displaying the logged-in user
let userInfo = document.getElementById("userInfo"); // Element displaying user info


// WebSocket setup
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function(event) {
    console.log('Connected to the WebSocket server');
};

socket.onmessage = function(event) {
    console.log('Message from server:', event.data);
    // Handle incoming messages (e.g., update game state, synchronize with other clients)
};

socket.onclose = function(event) {
    console.log('Disconnected from the WebSocket server');
};

socket.onerror = function(error) {
    console.error('WebSocket error:', error);
};

// Send a message to the server
function sendMessage(message) {
  socket.send(message);
}


// Login function
function login() {
    userLocalStorage.noOfLogins = 0;
    userLocalStorage.red = 0;
    userLocalStorage.orange = 0;
    userLocalStorage.pink = 0;
    userLocalStorage.green = 0;

    do {
        user = prompt("Enter your username"); // Prompt the user for their username
    } while (user === ''); // Repeat until a valid username is provided

    // If the user pressed Cancel, skip the login process
    if (user) {
        // Check if the user has previously logged in
        if (!localStorage.getItem(user)) {
            localStorage.setItem(user, JSON.stringify(userLocalStorage)); // Store initial user data
        }

        userLocalStorage = JSON.parse(localStorage.getItem(user));
        userLocalStorage.noOfLogins++; // Increment login count
        localStorage.setItem(user, JSON.stringify(userLocalStorage));

        // Update UI with user info
        userInfo.textContent = `Number of logins: ${userLocalStorage.noOfLogins}
        Red's victories: ${userLocalStorage.red}
        Orange's victories: ${userLocalStorage.orange}
        Pink's victories: ${userLocalStorage.pink}
        Green's victories: ${userLocalStorage.green}`;

        btnLogin.textContent = "Logout"; // Change button text to "Logout"
        if (userLocalStorage.noOfLogins === 1) {
            myUser.textContent = `Logged as ${user}`;
        } else {
            myUser.textContent = `Welcome back, ${user}!`;
        }
    }
}

// Logout function
function logout() {
    myUser.textContent = "Login to play!!!"; // Reset user display
    btnLogin.textContent = "Login"; // Change button text back to "Login"
    userInfo.textContent = ""; // Clear user info display
    location.reload(); // Reload the page
}

// Event handler for the Login button
btnLogin.onclick = () => {
    if (btnLogin.textContent === "Login") {
        login(); // Call the login function
    } else {
        logout(); // Call the logout function
    }
};

// Event handler for the Start button
btnStart.onclick = () => {
    if (btnStart.textContent === "Start Game") {
        if (myUser.textContent === "Login to play!!!") {
            alert("Login to play!!!"); // Display an alert if user is not logged in
        } else {
            currentTurn = parseInt(Math.random() * 4); // Randomly select the starting player
            countMonsters(); // Call a function to count monsters (not shown in this snippet)
            updateStatus(); // Call a function to update game status (not shown in this snippet)
            btnStart.textContent = "Stop Game"; // Change button text
        btnTurn.style.visibility = "visible";
        }

    }

    else {
      alert("Logged out, bye!");
      location.reload();
    }
}

// When the user clicks on the "End Turn" button
btnTurn.onclick = () => {
  let rand;
  do {
      rand = parseInt(Math.random() * 4); // Generate a random number between 0 and 3
  } while (rand === currentTurn || players[intToString(rand)].monsters === 0); // Ensure the new turn is different and has available monsters

  currentTurn = rand; // Update the current turn
  updateTurn(); // Call the function to update the displayed turn
};

// Function to update the displayed turn
function updateTurn() {
  turn.textContent = `${intToString(currentTurn)}'s turn`; // Display the current player's turn
}

// Function to count the number of monsters for each player
function countMonsters() {
  const boardSquares = document.getElementsByClassName("square"); // Get all square elements on the board

  for (let i = 0; i < boardSquares.length; i++) {
      let square = boardSquares[i];

      if (square.querySelector(".piece")) {
          // If a piece exists in the square
          let color = square.querySelector(".piece").getAttribute("color"); // Get the color of the piece
          players[color]["monsters"]++; // Increment the total monster count for the player

          // Check the specific type of piece and update counts accordingly
          if (square.querySelector(".piece").getAttribute("class").includes("werewolf")) {
              players[color]["werewolf"]++;
          } else if (square.querySelector(".piece").getAttribute("class").includes("dracula")) {
              players[color]["dracula"]++;
          } else if (square.querySelector(".piece").getAttribute("class").includes("ghost")) {
              players[color]["ghost"]++;
          }
      }
  }
}


//pdates the status of each player based on the number of monsters they have.
function updateStatus(){

  if (players.red.monsters)
      redPlayer.textContent = `Werewolves: ${players.red.werewolf},
    Draculas: ${players.red.dracula}, Ghosts: ${players.red.ghost}`;
  else redPlayer.textContent = "Game over";

  if (players.orange.monsters)
      orangePlayer.textContent = `Werewolves: ${players.orange.werewolf},
    Draculas: ${players.orange.dracula}, Ghosts: ${players.orange.ghost}`;
  else orangePlayer.textContent = "Game over";

  if (players.pink.monsters)
      pinkPlayer.textContent = `Werewolves: ${players.pink.werewolf},
    Draculas: ${players.pink.dracula}, Ghosts: ${players.pink.ghost}`;
  else pinkPlayer.textContent = "Game over";

  if (players.green.monsters)
      greenPlayer.textContent = `Werewolves: ${players.green.werewolf},
    Draculas: ${players.green.dracula}, Ghosts: ${players.green.ghost}`;
  else greenPlayer.textContent = "Game over";

  //In case of victory localStorage get updated
  if(players.red.monsters > 0 && players.orange.monsters == 0 &&
    players.pink.monsters == 0 && players.green.monsters == 0) {
      alert("Red player you are the Winner!!!");
      userLocalStorage.red++;
      localStorage.setItem(user, JSON.stringify(userLocalStorage));
      logout();
  }
  else if(players.red.monsters == 0 && players.orange.monsters > 0 &&
    players.pink.monsters == 0 && players.green.monsters == 0) {
      alert("Orange player you are the Winner!!!");
      userLocalStorage.orange++;
      localStorage.setItem(user, JSON.stringify(userLocalStorage));
      logout();
  }
  else if(players.red.monsters == 0 && players.orange.monsters == 0 &&
    players.pink.monsters > 0 && players.green.monsters == 0) {
      alert("Pink player you are the Winner!!!");
      userLocalStorage.pink++;
      localStorage.setItem(user, JSON.stringify(userLocalStorage));
      logout();
  }
  else if(players.red.monsters == 0 && players.orange.monsters == 0 &&
    players.pink.monsters == 0 && players.green.monsters > 0) {
      alert("Green player you are the Winner!!!");
      userLocalStorage.green++;
      localStorage.setItem(user, JSON.stringify(userLocalStorage));
      logout();
  }

  else updateTurn();
}

//Populates an array with information about each square on the board
function fillBoardSquaresArray() {
const boardSquares = document.getElementsByClassName("square");
for (let i = 0; i < boardSquares.length; i++) {
  let row = 11 - Math.floor(i / 12);
  let column = String.fromCharCode(96 + (i % 12));
  let square = boardSquares[i];

  square.id = column + row;
  let color = "";
  let pieceType = "";
  let pieceId = "";
  if (square.querySelector(".piece")) {
    color     = square.querySelector(".piece").getAttribute("color");
    pieceType = square.querySelector(".piece").classList[1];
    pieceId   = square.querySelector(".piece").id;
  } else {
    color = "blank";
    pieceType = "blank";
    pieceId ="blank";
  }
  let arrayElement = {
    squareId: square.id,
    pieceColor: color,
    pieceType: pieceType,
    pieceId: pieceId
  };
  squaresGrid.push(arrayElement);
}
}

// Updates the squaresGrid array based on the outcome of a move
function updateBoardSquaresArray(currentSquareId, destinationSquareId, squaresGrid, whoLived) {
  // Retrieve information about the attacker (current square)
  let currentSquare = squaresGrid.find(
      (element) => element.squareId === currentSquareId
  );

  // Check if there was a piece on the destination square
  let destinationSquareElement = squaresGrid.find(
      (element) => element.squareId === destinationSquareId
  );

  // Extract information about the piece from the current square
  let pieceColor = currentSquare.pieceColor;
  let pieceType = currentSquare.pieceType;
  let pieceId = currentSquare.pieceId;

  // Update the destination square based on whoLived:
  // - If whoLived = 0, the attacker occupies the destination square.
  // - If whoLived = -1, both pieces die, and the destination square becomes empty.
  // - If whoLived = 1, the attacked piece survives, and nothing changes.
  if (whoLived == 0) {
      destinationSquareElement.pieceColor = pieceColor;
      destinationSquareElement.pieceType = pieceType;
      destinationSquareElement.pieceId = pieceId;
  } else if (whoLived == -1) {
      destinationSquareElement.pieceColor = "blank";
      destinationSquareElement.pieceType = "blank";
      destinationSquareElement.pieceId = "blank";
  }

  // The current square always becomes empty after a move
  currentSquare.pieceColor = "blank";
  currentSquare.pieceType = "blank";
  currentSquare.pieceId = "blank";
}

// Set up event listeners for board squares
setupBoardSquares();
setupPieces();
fillBoardSquaresArray();
function setupBoardSquares() {
  for (let i = 0; i < boardSquares.length; i++) {
      boardSquares[i].addEventListener("dragover", canDrop);
      boardSquares[i].addEventListener("drop", drop);
      let row = 11 - Math.floor(i / 12);
      let column = String.fromCharCode(96 + (i % 12));
      let square = boardSquares[i];
      square.id = column + row;
  }
}

// Set up draggable pieces (monsters)
function setupPieces() {
  for (let i = 0; i < pieces.length; i++) {
      pieces[i].addEventListener("dragstart", drag);
      pieces[i].setAttribute("draggable", true);
      pieces[i].id = pieces[i].className.split(" ")[1] + pieces[i].parentElement.id;
  }
  for (let i = 0; i < piecesImages.length; i++) {
      piecesImages[i].setAttribute("draggable", false);
  }
}

// Prevent unexpected moves
function canDrop(ev) {
  ev.preventDefault();
}

// Function that controls when a piece is dragged
function drag(ev) {
  const piece = ev.target;

  const pieceColor = piece.getAttribute("color");
  const pieceType = piece.classList[1];
  const pieceId = piece.id;

  // Check if the piece's color matches the current turn
  if (intToString(currentTurn) == pieceColor) {
      const startingSquareId = piece.parentNode.id;
      ev.dataTransfer.setData("text", pieceId + "|" + startingSquareId);
      const pieceObject = { pieceColor: pieceColor, pieceType: pieceType, pieceId: pieceId };

      // Get legal squares for the piece's movement
      let legalSquares = getMoves(startingSquareId, pieceObject, squaresGrid);

      let legalSquaresJson = JSON.stringify(legalSquares);
      ev.dataTransfer.setData("application/json", legalSquaresJson);
  }
  // If the game hasn't started, show an alert
  else if (btnStart.textContent == "Start Game") {
      alert("Press Start to begin the game");
  }
  // If the selected piece is of a different color, show an alert
  else {
      alert(`${intToString(currentTurn)} is your turn!`);
  }
}

// Function that defines what happens when a piece is dropped onto a square
function drop(ev) {
  ev.preventDefault();

  // Extract information about the moved piece and its starting position
  let data = ev.dataTransfer.getData("text");
  let [pieceId, startingSquareId] = data.split("|");
  let legalSquaresJson = ev.dataTransfer.getData("application/json");
  let legalSquares = JSON.parse(legalSquaresJson);

  const piece = document.getElementById(pieceId);
  const pieceColor = piece.getAttribute("color");
  const pieceType = piece.classList[1];

  const destinationSquare = ev.currentTarget;
  let destinationSquareId = destinationSquare.id;

  // Check if there is a piece on the destination square
  let squareContent = getPieceAtPosition(destinationSquareId, squaresGrid);

  // Verify if the move is valid according to the rules
  if (!legalSquares.includes(destinationSquareId)) {
      alert("Invalid move!");
      return;
  }

  // Place the piece on the destination square to determine combat outcome
  destinationSquare.appendChild(piece);

  let children = destinationSquare.children;
  let whoLived = 0;

  if (squareContent.pieceType != "blank") {
    if (squareContent.pieceType == pieceType) {
        // Both pieces are of the same type, so they are removed from the board
        alert(`${squareContent.pieceType} x ${pieceType}: Both removed from the board!`);

        // Remove the pieces from the destination square
        for (let i = 0; i < children.length; i++) {
            if (!children[i].classList.contains('coordinate')) {
                destinationSquare.removeChild(children[i--]);
            }
        }

        // Update the player's monster count and specific monster count
        players[squareContent.pieceColor]["monsters"]--;
        players[squareContent.pieceColor][squareContent.pieceType]--;
        players[pieceColor]["monsters"]--;
        players[pieceColor][pieceType]--;

        whoLived = -1;
    } else {
        // Different types of monsters
        destinationSquare.appendChild(piece);
        let children = destinationSquare.children;

        // Check combat rules to determine who survives
        if ((squareContent.pieceType == "werewolf" && pieceType == "dracula") ||
            (squareContent.pieceType == "dracula" && pieceType == "ghost") ||
            (squareContent.pieceType == "ghost" && pieceType == "werewolf")) {
            // The attacker wins
            alert(`${pieceType} x ${squareContent.pieceType}: ${squareContent.pieceType} removed from the board!`);
            // Remove the loser from the square
            destinationSquare.removeChild(children[0]);
            players[squareContent.pieceColor]["monsters"]--;
            players[squareContent.pieceColor][squareContent.pieceType]--;
        } else {
            // The attacked piece wins
            alert(`${pieceType} x ${squareContent.pieceType}: ${pieceType} removed from the board!`);
            destinationSquare.removeChild(children[1]);
            players[pieceColor]["monsters"]--;
            players[pieceColor][pieceType]--;
            whoLived = 1;
        }
    }
  }

  // Update the squaresGrid array based on the outcome of the move
  updateBoardSquaresArray(startingSquareId, destinationSquareId, squaresGrid, whoLived);

  // Update the displayed information on the page
  updateStatus();
  return;
}
// Verify the possible movement options for the selected piece
function getMoves(startingSquareId, piece, squaresGrid) {
  let horiVert = getHVMoves(startingSquareId, piece.pieceColor, squaresGrid);
  let diagonal = getDMoves(startingSquareId, piece.pieceColor, squaresGrid);
  let legalSquares = [...horiVert, ...diagonal];
  return legalSquares;
}

// Get legal squares for horizontal and vertical movements
function getHVMoves(startingSquareId, pieceColor, squaresGrid) {
  let vetMoveAllUp = moveUp(startingSquareId, pieceColor, squaresGrid);
  let vetMoveAllDown = moveDown(startingSquareId, pieceColor, squaresGrid);
  let vetMoveAllLeft = moveToLeft(startingSquareId, pieceColor, squaresGrid);
  let vetMoveAllRight = moveToRight(startingSquareId, pieceColor, squaresGrid);
  let legalSquares = [
      ...vetMoveAllUp,
      ...vetMoveAllDown,
      ...vetMoveAllLeft,
      ...vetMoveAllRight,
  ];
  return legalSquares;
}

// Get legal squares for diagonal movements
function getDMoves(startingSquareId, pieceColor, squaresGrid) {
  let vetMoveToDirNE = moveToNE(startingSquareId, pieceColor, squaresGrid);
  let vetMoveToDirNW = moveToNW(startingSquareId, pieceColor, squaresGrid);
  let vetMoveToDirSE = moveToSE(startingSquareId, pieceColor, squaresGrid);
  let vetMoveToDirSW = moveToSW(startingSquareId, pieceColor, squaresGrid);
  let legalSquares = [
      ...vetMoveToDirNE,
      ...vetMoveToDirNW,
      ...vetMoveToDirSE,
      ...vetMoveToDirSW,
  ];
  return legalSquares;
}

// Check all possible vertical squares above the starting position
function moveUp(startingSquareId, pieceColor, squaresGrid) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.substring(1);

  const rankNumber = parseInt(rank);
  let currentRank = rankNumber;
  let legalSquares = [];

  while (currentRank < 10) {
      currentRank++;
      let currentSquareId = file + currentRank;
      let currentSquare = squaresGrid.find(
          (element) => element.squareId === currentSquareId
      );
      let squareContent = currentSquare.pieceColor;
      if (squareContent != "blank" && squareContent == pieceColor)
          return legalSquares;
      legalSquares.push(currentSquareId);
      if (squareContent != "blank" && squareContent != pieceColor)
          return legalSquares;
  }

  return legalSquares;
}

//Checks all the possible moves vertically downward from a given starting square
function moveDown(startingSquareId, pieceColor, squaresGrid) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.substring(1);
  const rankNumber = parseInt(rank);
  let currentRank = rankNumber;
  let legalSquares = [];

  while (currentRank > 1) {
    currentRank--;
    let currentSquareId = file + currentRank;
    let currentSquare = squaresGrid.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
  }

  return legalSquares;
}

//checks all the possible moves horizontally to the left from a given starting square
function moveToLeft(startingSquareId, pieceColor, squaresGrid) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.substring(1);
  let currentFile = file;
  let legalSquares = [];

  if (rank == 0 || rank == 11 || currentFile == "`") return legalSquares;
  while (currentFile != "a") {
    currentFile = String.fromCharCode(currentFile.charCodeAt(0) - 1);
    let currentSquareId = currentFile + rank;
    let currentSquare = squaresGrid.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
  }

  return legalSquares;
}

//checks all the possible moves horizontally to the right from a given starting square
function moveToRight(startingSquareId, pieceColor, squaresGrid) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.substring(1);
  let currentFile = file;
  let legalSquares = [];

  if (rank == 0 || rank == 11 || currentFile == "k") return legalSquares;
  while (currentFile != "j") {
    currentFile = String.fromCharCode(
      currentFile.charCodeAt(0) + 1
    );
    let currentSquareId = currentFile + rank;
    let currentSquare = squaresGrid.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
  }

  return legalSquares;
}

//checks all the possible moves northwest diagoal from a given starting square
function moveToNW(
  startingSquareId,
  pieceColor,
  squaresGrid
) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.substring(1);
  const rankNumber = parseInt(rank);
  let currentFile = file;
  let currentRank = rankNumber;
  let legalSquares = [];

  if (file == "`" || rank == 11) return legalSquares;

  let moves = 2;
  while (!(currentFile == "a" || currentRank == 8 || moves == 0)) {
    currentFile = String.fromCharCode(
      currentFile.charCodeAt(0) - 1
    );
    currentRank++;
    let currentSquareId = currentFile + currentRank;
    let currentSquare = squaresGrid.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
    moves--;
  }
  return legalSquares;
}

//Checks all the possible moves in the northeast diagonal direction from a given starting square
function moveToNE(
  startingSquareId,
  pieceColor,
  squaresGrid
) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.substring(1);
  const rankNumber = parseInt(rank);
  let currentFile = file;
  let currentRank = rankNumber;
  let legalSquares = [];

  if (file == "k" || rank == 11) return legalSquares;

  let moves = 2;
  while (!(currentFile == "j" || currentRank == 10 || moves == 0)) {
    currentFile = String.fromCharCode(
      currentFile.charCodeAt(0) + 1
    );
    currentRank++;
    let currentSquareId = currentFile + currentRank;
    let currentSquare = squaresGrid.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
    moves--;
  }
  return legalSquares;
}

//Checks all the possible moves in the southwest diagonal direction from a given starting square
function moveToSW(startingSquareId, pieceColor, squaresGrid) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.substring(1);
  const rankNumber = parseInt(rank);
  let currentFile = file;
  let currentRank = rankNumber;
  let legalSquares = [];

  if (file == "`" || rank == 0) return legalSquares;

  let moves = 2;
  while (!(currentFile == "a" || currentRank == 1 || moves == 0)) {
    currentFile = String.fromCharCode(
      currentFile.charCodeAt(0) - 1
    );
    currentRank--;
    let currentSquareId = currentFile + currentRank;
    let currentSquare = squaresGrid.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
    moves--;
  }
  return legalSquares;
}

//Check all the possible moves in the southeast diagonal direction from a gicen starting square
function moveToSE(startingSquareId, pieceColor, squaresGrid) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.substring(1);
  const rankNumber = parseInt(rank);
  let currentFile = file;
  let currentRank = rankNumber;
  let legalSquares = [];

  if (file == "k" || rank == 0) return legalSquares;

  let moves = 2;
  while (!(currentFile == "j" || currentRank == 1 || moves == 0)) {
    currentFile = String.fromCharCode(
      currentFile.charCodeAt(0) + 1
    );
    currentRank--;
    let currentSquareId = currentFile + currentRank;
    let currentSquare = squaresGrid.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
    moves--;
  }
  return legalSquares;
}

//Retrieves information about the piece located at a specific square on the chessboard
function getPieceAtPosition(squareId, squaresGrid) {
  let currentSquare = squaresGrid.find(
    (element) => element.squareId === squareId
  );
  const color = currentSquare.pieceColor;
  const pieceType = currentSquare.pieceType;
  const pieceId=currentSquare.pieceId;
  return { pieceColor: color, pieceType: pieceType,pieceId:pieceId};
}

//Converts numeric values to their corresponding text representations
function intToString(i) {
  switch(i){
      case 0:   return "red";
      case 1:   return "orange";
      case 2:   return "pink";
      case 3:   return "green";
      default:  return "undefined";
  }
}
