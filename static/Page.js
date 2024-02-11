const socket = io('https://dragonmongame.com')
var start = false
var Game
var player
var background
var NPCGroup = []
var FriendGroup = []
const body = document.getElementById("body")
socket.on('connect',function(){ 
    socket.emit("Finalise", username)
})

socket.on("Activecharacters", (message) => {
    let oldcontainer = document.getElementById("leftcontainer")
    oldcontainer.remove()
    let container = document.createElement("div")
    container.id = "leftcontainer"
    container.classList.add("leftcontainer")
    body.appendChild(container)
    console.log("Teamrecieved")
    let names = message["Characters"]
    let urls = message["Urls"]
    let table = document.createElement("table")
    for(let y = 0;y<names.length*2;y++){
        let row = document.createElement("tr")
        let cell = document.createElement("td")
        if (y%2==0){
            let tblimg = document.createElement("img")
            let url = urls[y/2]
            tblimg.src = url
            cell.appendChild(tblimg)
        }else{
            let text = document.createElement("p")
            text.innerHTML= names[Math.floor(y/2)]
            cell.appendChild(text)
        }
        row.appendChild(cell)
        table.appendChild(row)
        container.appendChild(table)
    }
})
socket.on("mapdata", (message) => {
    Game = message["data"]
    let xpos = message["xpos"]
    let ypos = message["ypos"]
    let fnames = message["map"]
    background = new Background(fnames[0], fnames[1])
    player = new Player({
        x:xpos*12,
        y:ypos*12
    })
    start = true
})
socket.on("NPCS", (message) => {
    let ids = message["ids"]
    let xpositions = message["xposs"]
    let ypositions = message["yposs"]
    let lookings = message["lookings"]
    let Beatenids = message["beaten"]
    for (let i = 0;i<ids.length;i++){
        let Active
        if (Beatenids.includes(ids[i])){
            Active = false
        }else{
            Active = true
        }
        let position = {
            x:xpositions[i]*12,
            y:ypositions[i]*12
        }
        let newAI = new NPC(ids[i], position, lookings[i], Active)
    }
})
socket.on("Friendpos", (message) => {
    let account = message["account"]
    console.log(account)
    let xposition = message["xpos"]
    let yposition = message["ypos"]
    let position = {
        x:xposition*12,
        y:yposition*12
    }
    let friend = new Friend(account, position)
})
socket.on("UpdateFriendpos", (message) => {
    let target = message["account"]
    let nxtmove = message["nextmove"]
    for (let i=0;i<FriendGroup.length;i++){
        let current = FriendGroup[i]
        if (current.name==target){
            current.movestodo.push(nxtmove)
        }
    }
})
socket.on("battlerequestdata", (message) => {
    let container = document.getElementById("rightcontainer")
    let names = message["names"]
    let table = document.createElement("table")
    table.style.margin = "0px"
    table.style.padding = "0px"
    table.style.display = "flex"
    table.style.flexDirection = "column"
    table.style.justifyContent = "space-evenly"
    table.style.alignItems = "center"
    for(let y = 0;y<names.length;y++){
        let row = document.createElement("tr")
        row.style.display = "flex"
        row.style.justifyContent = "space-between"
        let cell1 = document.createElement("td")
        let text = document.createElement("p")
        text.innerHTML = names[y]
        text.style.fontSize = "15px"
        cell1.appendChild(text)
        row.appendChild(cell1)
        let cell2 = document.createElement("td")
        let btn = document.createElement("button")
        btn.style.border = "2px black"
        btn.style.borderRadius = "5px"
        btn.style.width = "50px"
        btn.style.backgroundColor = "lightblue"
        btn.innerHTML = "Battle"
        btn.style.padding = "0px"
        btn.onmouseover = function(){
            btn.style.backgroundColor = "cornflowerblue"
        }
        btn.onmouseleave = function(){
            btn.style.backgroundColor = "lightblue"
        }
        btn.onclick = function(){
            socket.emit("Acceptbattle", text.innerHTML)
        }
        cell2.appendChild(btn)
        row.appendChild(cell2)
        let cell3 = document.createElement("td")
        let btn2 = document.createElement("button")
        btn2.style.border = "2px black"
        btn2.style.borderRadius = "5px"
        btn2.style.backgroundColor = "red"
        btn2.style.width = "50px"
        btn2.innerHTML = "Decline"
        btn2.style.padding = "0px"
        btn2.onmouseover = function(){
            btn2.style.backgroundColor = "darkred"
        }
        btn2.onmouseleave = function(){
            btn2.style.backgroundColor = "red"
        }
        btn2.onclick = function(){
            socket.emit("Declinebattle", text.innerHTML)
            row.remove()
        }
        cell3.appendChild(btn2)
        row.appendChild(cell3)
        table.appendChild(row)
    }
    container.appendChild(table)
})

function Friends() {
    socket.emit("Friends")
    socket.on('Friends', function(Token) {
      const token = Token.data
      location.href = "https://dragonmongame.com/Friends?token="+token
    })
  }

function Bag() {
    let container = document.getElementById("maincontainer")
    container.style.overflowY = "scroll"
    currentgamebutton = document.getElementById("Game")
    if (currentgamebutton != null){
        currentgamebutton.click()
    }
    let oldbutton = document.getElementById("Bag")
    let button = document.createElement("button")
    button.innerHTML = "Game"
    button.classList.add("button1")
    button.id = "Game"
    button.addEventListener("click", function(){
        let container = document.getElementById("maincontainer")
        container.style.overflowY = "hidden"
        table = document.getElementById("Itemtable")
        table.parentNode.replaceChild(canvas, table);
        let oldbutton = document.getElementById("Game")
        let button = document.createElement("button")
        button.innerHTML = "Bag"
        button.classList.add("button1")
        button.id = "Bag"
        button.onclick = Bag
        console.log(oldbutton)
        console.log(button)
        oldbutton.parentNode.replaceChild(button, oldbutton)
    })
    console.log(oldbutton)
    console.log(button)
    oldbutton.parentNode.replaceChild(button, oldbutton)
    Items.splice(0, Items.length)
    console.log(Items)
    socket.emit("Bag")
}
function Team() {
    let container = document.getElementById("maincontainer")
    container.style.overflowY = "scroll"
    currentgamebutton = document.getElementById("Game")
    console.log(currentgamebutton)
    if (currentgamebutton != null){
        currentgamebutton.click()
    }
    let oldbutton = document.getElementById("Team")
    let button = document.createElement("button")
    button.innerHTML = "Game"
    button.classList.add("button1")
    button.id = "Game"
    button.addEventListener("click", function(){
        table = document.getElementById("Itemtable")
        table.parentNode.replaceChild(canvas, table);
        let oldbutton = document.getElementById("Game")
        let button = document.createElement("button")
        button.innerHTML = "Team"
        container.style.overflowY = "hidden"
        button.classList.add("button1")
        button.id = "Team"
        button.onclick = Team
        console.log(oldbutton)
        console.log(button)
        oldbutton.parentNode.replaceChild(button, oldbutton)
    })
    console.log(oldbutton)
    console.log(button)
    oldbutton.parentNode.replaceChild(button, oldbutton)
    Items.splice(0, Items.length)
    console.log(Items)
    socket.emit("Team")
}
function Messages() {
    socket.emit("Redirecting")
    socket.on("Redirectconfirmed", (message) => {
        let Token = message.token
        location.href = "https://dragonmongame.com/Messages?token="+Token
    })
}

socket.on("battle", (message) => {
    playerid = message["pid"]
    location.href = "https://dragonmongame.com/Battle?pid="+playerid
})
socket.on("Confirmbattle", (message) =>{
    battleid = message["battleid"]
    socket.emit("Dolivebattle", battleid)
})
