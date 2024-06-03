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
  