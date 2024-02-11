keysdown = {
  w: false,
  a: false,
  s: false,
  d: false
}

function MainLoop() {
  if (start==true){
    background.draw()
    player.update()
    for (let i =0;i<NPCGroup.length;i++){
      let AI = NPCGroup[i]
      AI.update()
    }
    for (let i =0;i<FriendGroup.length;i++){
      let friend = FriendGroup[i]
      friend.update()
    }
    background.drawtop()
  }
  window.requestAnimationFrame(MainLoop)
}
MainLoop()

document.addEventListener("keydown", function(event){
  key = event.key.toLowerCase()
  if (key=="w"){
    keysdown.w = true
  }
  if (key=="a"){
    keysdown.a = true
  }
  if (key=="s"){
    keysdown.s = true
  }
  if (key=="d"){
    keysdown.d = true
  }
  if (key=="r"){
    player.position.x = 180
    player.position.y = 180
    socket.emit("Resetplayer")
  }
})
document.addEventListener("keyup", function(event){
  key = event.key.toLowerCase()
  if (key=="w"){
    keysdown.w = false
  }
  if (key=="a"){
    keysdown.a = false
  }
  if (key=="s"){
    keysdown.s = false
  }
  if (key=="d"){
    keysdown.d = false
  }
})
canvas.addEventListener("click", function(event){
  let cursorrelativeposition = {
    x: event.clientX-leftedge,
    y: event.clientY - topedge
  }
  for(let i = 0; i<FriendGroup.length; i++){
    let currentfriend = FriendGroup[i]
    if((currentfriend.position.x<=cursorrelativeposition.x&&currentfriend.position.x+40>=cursorrelativeposition.x)&&(currentfriend.position.y<=cursorrelativeposition.y&&currentfriend.position.y+40>=cursorrelativeposition.y)){
      currentfriend.doclick()
    }
  }
})

