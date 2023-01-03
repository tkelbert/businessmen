"use strict"
let usersTurn = true
const serverUrl = "http://localhost:5050"


//let the user pick x or o
let usersChoice = null;
const choices = document.getElementById('choices')

document.getElementById('choiceX')
.addEventListener("click", (element) => {
    usersChoice = 'X'
    choices.remove()
})
document.getElementById('choiceO')
.addEventListener("click", (element) => {
    usersChoice = 'O'
    choices.remove()
})

class square {
    constructor(index){
        this.index = index;
        this.text = ' '
        this.element = document.getElementById(`${this.index}`)
        this.element.addEventListener('click', this.handleClick) //idk if the callback can have args
    }

    handleClick = () => {
        //check if it's user's turn
        if(!usersTurn) return null;

        //check if the user hasn't chosen x or o yet
        if(usersChoice === null) return null
    
        //check if the element value is null
        if(this.text !== ' ') return null
    
        //rerender, ie change the element's value to userChoice
        this.text = usersChoice;
        this.element.innerHTML = (`${usersChoice}`)

        //check for victory
        let winner = victoryCheck()
        if(winner) {
            if(winner === usersChoice){
                handleVictory("user")
            } else {
                console.log("bot wins")
                handleVictory("server")
            }
        }

    
        //send the clientBoard to the server
        usersTurn = false;
        sendToSever()
        .then((newBoard) => {
            console.log("new board", newBoard)
            //update board to match server response
            newBoard = newBoard["board"]
            let numberOfChanges = 0;
            let changed;
            for(let x = 0; x <= 8; x++){
                if(clientBoard[x].text !== newBoard[x]){
                    clientBoard[x].text = newBoard[x]
                    clientBoard[x].element.innerHTML = newBoard[x]
                    changed = x;
                    numberOfChanges++
                }
            }
            if(numberOfChanges > 1){ throw new Error("The server returned an board with too many changes: ", newBoard)}

            //check for victory
            let winner = victoryCheck()
            if(winner) {
                if(winner === usersChoice){
                    handleVictory("user")
                } else {
                    console.log("bot wins")
                    handleVictory("server")
                }
            }

            usersTurn = true;
        })
        .catch((err) => {
            console.log(err)
        })
    }
};

const clientBoard = []
for(let x = 0; x <= 8; x++){
    clientBoard.push(new square(x))
}

const sendToSever = () => {
    let boardJson = { 
        "board": [], 
        "userChoice" : usersChoice
    };
    for(const sq of clientBoard){
        boardJson.board.push(sq.text)
    }
    let promise = new Promise((resolve, reject) => {
        fetch(`${serverUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body :  JSON.stringify(boardJson)
        })
        .then((response) => {
            console.log("got response", response)
            return response.json()
        })
        .then((result) => {
            console.log("parsed response", result)
            //check if result is in proper format//////////
            resolve(result)
        })
        .catch((err) => {
            reject(err)
        })
    })

    return promise;
}



const victoryCheck = () => {
    let board = [null]
    for(let a of clientBoard){
        board.push(a.text)
    }
    if(board[1] == board[2] && board[1] == board[3] && board[1] != ' ') {
        return board[1]
    } else if(board[4] == board[5] && board[4] == board[6] && board[4] != ' ') {
       return board[4]
    } else if(board[7] == board[8] && board[7] == board[9] && board[7] != ' ') {
       return board[7]
    } else if(board[1] == board[4] && board[1] == board[7] && board[1] != ' ') {
       return board[1]
    } else if(board[2] == board[5] && board[2] == board[8] && board[2] != ' ') {
       return board[2]
    } else if(board[3] == board[6] && board[3] == board[9] && board[3] != ' ') {
       return board[3]
    } else if(board[1] == board[5] && board[1] == board[9] && board[1] != ' ') {
       return board[1]
    } else if(board[7] == board[5] && board[7] == board[3] && board[7] != ' ') {
       return board[7]
    } else {
       return false
    }
}



const handleVictory = (victor) => {
    const main = document.getElementById('game');
    let elements = main.childNodes;
    console.log(elements)
    for(let x of elements){
        x.remove()
    }

    //create a h1 element
    const node = document.createElement("h1");
    node.setAttribute("id", "victoryText")
    // Create a text node:
    let textnode;

    switch(victor) {
        case 'user' : {
            textnode = document.createTextNode("YOU WIN");
            break;
        }
        case 'server' : {
            textnode = document.createTextNode("YOU LOOSE");
            break;
        }
        case 'draw' : {
            textnode = document.createTextNode("YOU DID NOT WIN");
            break;
        }
    }

    // Append the text node to the "li" node:
    node.appendChild(textnode);
    // Append the h1 to main
    main.appendChild(node);
}