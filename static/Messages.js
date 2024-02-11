const userButtonContainer = document.getElementById('user-buttons');
const messageContainer = document.getElementById("messages")
const body = document.getElementById("body")
const textinput = document.getElementById("text-input")
const submit = document.getElementById("submit-button")
const ManageButton = document.getElementById("Manage-button")
const listofmembers = []
const socket = io('https://dragonmongame.com')
var currentconvo = ""
var currentconvotype = ""
const friends = []
const Groupnames = []
const Groupids = []
socket.on('connect',function(){ 
  socket.emit("Finalise", username)
  socket.emit("Requestconversations")
  socket.on("Recieveconversations", (frienddict, Groupnamedict, Groupiddict) => {
    let friendslist = Object.values(frienddict)
    let Groupnameslist = Object.values(Groupnamedict)
    let Groupidslist = Object.values(Groupiddict)
    for (i=0;i<friendslist.length;i++){
        friends.push(friendslist[i])
    }
    for (i=0;i<Groupnameslist.length;i++){
        Groupnames.push(Groupnameslist[i])
        Groupids.push(Groupidslist[i])
    }
    updateconversationtable(friends)
  })
})

function ReverseList(list){
    let reversedlist = []
    for (let i = 0; i < list.length; i++) {
        let previousitem = list.length - (i+1)
        let lastitem = list[previousitem]
        reversedlist.push(lastitem)
    }
    return reversedlist
}

function updateconversationtable(friendnames){
    const elements = document.getElementsByClassName("username-button")
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0])
    }
    // Loop through the usernames and create a button for each one
    for (let i = 0; i < friendnames.length; i++) {
        const friendname = friendnames[i];
        const button = document.createElement('button');
        button.id = "friendbutton"
        button.innerHTML = friendname;
        button.classList.add('username-button');
        button.addEventListener('click', function() {
            currentconvotype = "Friend"
            ClearPage()
            textinput.style.display = "block"
            submit.style.display = "block"
            const allbuttons = document.getElementsByClassName("username-button")
            for (i = 0; i<allbuttons.length; i++){
                allbuttons[i].style.backgroundColor = "white"
            }
            button.style.backgroundColor = "rgb(25, 224, 246)"
            currentconvo = friendname
            socket.emit("Requestfriendmessages", currentconvo)
        })
        userButtonContainer.appendChild(button);
    }
    for (let i = 0; i < Groupnames.length; i++) {
        const Groupname = Groupnames[i];
        const Groupid = Groupids[i]
        const button = document.createElement('button');
        button.id = "friendbutton"
        button.innerHTML = Groupname;
        button.classList.add('username-button');
        button.addEventListener('click', function() {
            ClearPage()
            currentconvotype = "Group"
            textinput.style.display = "block"
            submit.style.display = "block"
            const allbuttons = document.getElementsByClassName("username-button")
            for (i = 0; i<allbuttons.length; i++){
                allbuttons[i].style.backgroundColor = "white"
            }
            button.style.backgroundColor = "rgb(25, 224, 246)"
            currentconvo = Groupid
            socket.emit("RequestGroupconversation", currentconvo)
        })
        userButtonContainer.appendChild(button);
    }
}

function updatemessages(Messages){
    const elements = document.getElementsByClassName("message")
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
    for (let i = 0; i < Messages.length; i++) {
        const message = Messages[i];
        const paragraph = document.createElement('p');
        paragraph.innerHTML = message;
        paragraph.classList.add('message');
        messageContainer.appendChild(paragraph);
    }
}

socket.on("Recievemessages", (Messagesdict) =>{
    messages = Object.values(Messagesdict)
    console.log(messages)
    updatemessages(messages)
})

document.addEventListener("keydown", (event)=>{
    if(event.key==="Enter"){
      Sendmessage()
    }
  })

function Sendmessage(){
    messagetogo = textinput.value
    textinput.value = ""
    socket.emit("SendMessage", messagetogo, currentconvo)
}

function Goback(){
    socket.emit("GoBack")
}

socket.on("ToGame", (message) =>{
    playerid = message.PID
    location.href = "https://dragonmongame.com/Game?data="+ playerid
})

function ManageConversation() {
    console.log(currentconvotype)
    ManageButton.innerHTML = "Show Messages"
    ManageButton.onclick = ShowMessages
    ClearPage()
    const ClearConversationbutton = document.createElement('button')
    ClearConversationbutton.id = "ClearConversation"
    ClearConversationbutton.classList.add("ClearConversation")
    ClearConversationbutton.innerHTML = "Clear Conversation"
    ClearConversationbutton.onclick = ClearConversation
    body.appendChild(ClearConversationbutton)
    const CreateGroupbutton = document.createElement('button')
    CreateGroupbutton.id = "CreateGroup"
    CreateGroupbutton.classList.add("CreateGroup")
    CreateGroupbutton.innerHTML = "Create message group"
    CreateGroupbutton.addEventListener("click", function(){
        console.log("ran?")
        CreateGroup("Create", friends)
    })
    body.appendChild(CreateGroupbutton)
    if (currentconvotype == "Group"){
        const leavebutton = document.createElement("button")
        const AddmemberButton = document.createElement("button")
        leavebutton.id = "leavebutton"
        leavebutton.classList.add("leavebutton")
        leavebutton.innerHTML = "Leave Group"
        leavebutton.addEventListener("click", function() {
            socket.emit("LeaveGroup", currentconvo)
        })
        AddmemberButton.id = "addmember"
        AddmemberButton.classList.add("addmember")
        AddmemberButton.innerHTML = "Add member"
        AddmemberButton.addEventListener("click", function() {
            socket.emit("GetMembers", currentconvo)
            socket.on("GroupMembers", (Members) => {
                let Memberslist = Object.values(Members)
                console.log(friends)
                let nonmemberlist = []
                for (let i = 0; i<friends.length;i++){
                    if (Memberslist.includes(friends[i])==false){
                        nonmemberlist.push(friends[i])
                    }
                }
                console.log(nonmemberlist)
                CreateGroup("Add", nonmemberlist)
            })
        })
        body.appendChild(AddmemberButton)
        body.appendChild(leavebutton)
    }

}

function ShowMessages() {
    ClearPage()
    ManageButton.innerHTML = "Manage Conversation"
    ManageButton.onclick = ManageConversation
    textinput.style.display = "block"
    submit.style.display = "block"
    if (currentconvo != ""){
        socket.emit("Requestfriendmessages", currentconvo)
    }
}


function ClearConversation() {
    if (currentconvo != ""){
        socket.emit("ClearMessages", currentconvo)
    }
}



function ClearPage() {
    console.log("Page Cleared")
    textinput.style.display = "none"
    submit.style.display = "none"
    let ClearConversationbutton = document.getElementById("ClearConversation")
    let CreateGroupbutton = document.getElementById("CreateGroup")
    let membertable = document.getElementById("membertable")
    let addmember = document.getElementById("addmember")
    let leavegroup = document.getElementById("leavebutton")
    let messages = document.querySelectorAll(".message")
    if (messages != null){
        messages.forEach((message) => {
            message.remove()
        })
    }
    if (CreateGroupbutton != null){
        CreateGroupbutton.remove()
    }
    if (ClearConversationbutton != null){
        ClearConversationbutton.remove()
    }
    if (membertable != null){
        membertable.remove()
    }
    if (addmember != null){
        addmember.remove()
    }
    if (leavegroup != null){
        leavegroup.remove()
    }
}

function CreateGroup(reference, array) {
    console.log("reference")
    console.log(reference)
    ManageButton.innerHTML = "Back"
    ManageButton.onclick = Back
    ClearPage()
    const membertable = document.createElement("table")
    membertable.classList.add("membertable")
    membertable.id = "membertable"
    array.forEach(friend => {
        let row = document.createElement("tr")
        let cell = document.createElement("td")
        cell.innerText = friend
        row.appendChild(cell)
        let buttonCell = document.createElement("td") // create a new cell for the button
        let button = document.createElement("button") // create the button element
        button.innerText = "Add" // set the button text
        button.classList.add("Addmember") // add a class to the button for styling
        button.dataset.friend = friend // store the friend name as a data attribute on the button
        if (reference == "Create"){
            button.addEventListener("click", ChangeMember) // add a click event listener to the button
        }
        else if (reference == "Add"){
            button.addEventListener("click", AddMember)
        }
        buttonCell.appendChild(button) // add the button to the new cell
        row.appendChild(buttonCell) // add the new cell to the row
        membertable.appendChild(row)
    })
    if(reference=="Create"){
        let row = document.createElement("tr")
        let buttonCell = document.createElement("td") // create a new cell for the button
        let button = document.createElement("button") // create the button element
        button.innerText = "Create Group" // set the button text
        button.id = "CreateGroup"
        button.classList.add("Addmember") // add a class to the button for styling
        button.addEventListener("click", FinishGroup) // add a click event listener to the button
        buttonCell.appendChild(button) // add the button to the new cell
        row.appendChild(buttonCell) // add the new cell to the row
        membertable.appendChild(row)

        let row2 = document.createElement("tr")
        let Cell = document.createElement("td")
        let Groupname = document.createElement("input")
        Groupname.id = "Groupname" 
        Groupname.type = "text"
        Groupname.placeholder = "Groupname"
        Groupname.minLength = 10
        Cell.appendChild(Groupname) 
        row2.appendChild(Cell) 
        membertable.appendChild(row2)
    }
    body.appendChild(membertable)
}


function Back() {
    console.log("TRUE")
    ManageConversation()
}

function ChangeMember(event){
    let button = event.target
    let membername = event.target.dataset.friend
    if (button.innerText == "Add"){
        console.log("added")
        listofmembers.push(membername)
        button.innerText = "Added"
    }
    else{
        console.log("else")
        let index = listofmembers.indexOf(membername)
        listofmembers.splice(index, 1)
        button.innerText = "Add"
    }
    console.log(listofmembers)
}

function AddMember(event){
    targetname = event.target.dataset.friend
    socket.emit("AddMember", targetname, currentconvo)
}

function FinishGroup(){
    let Groupnamebox = document.getElementById("Groupname")
    console.log(Groupnamebox)
    let Groupname = Groupnamebox.value
    console.log(Groupname)
    if (Groupname != null){
        socket.emit("CreateGroup", listofmembers, Groupname)
        while(listofmembers.length > 0) {
            listofmembers.pop();
        }
        CreateGroup("Create", friends)
    }
    else{
        alert("Please Input a Group name")
    }
}

socket.on("Notenoughmembers", function(){
    CreateGroup("Create", friends)
    errormessage = document.createElement("p")
    errormessage.innerHTML = "Not Enough Members"
    errormessage.classList = "Error"
    body.appendChild(errormessage)
})

socket.on("refresh", function(){
    socket.emit("Redirecting")
    socket.on("Redirectconfirmed", (message) => {
        let Token = message.token
        location.href = "https://dragonmongame.com/Messages?token="+Token
    })
})