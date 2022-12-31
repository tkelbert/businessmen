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
        this.text = ''
        this.element = document.getElementById(`${this.index}`)
        this.element.addEventListener('click', this.handleClick) //idk if the callback can have args
    }

    handleClick = () => {
        //check if it's user's turn
        if(!usersTurn) return null;

        //check if the user hasn't chosen x or o yet
        if(usersChoice === null) return null
    
        //check if the element value is null
        if(this.text !== '') return null
    
        //rerender, ie change the element's value to userChoice
        this.text = usersChoice;
        this.element.innerHTML = (`${usersChoice}`)

        //check for victory
        // victoryCheck(this.index, usersTurn)

    
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

            // victoryCheck(changed, usersTurn)

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
            console.log("got response")
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