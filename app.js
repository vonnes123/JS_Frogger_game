const gameArea = document.querySelector('.gameArea');
const game = {x:15,y:20,eles:[],active:7,speed:30,counter:0,inPlay:true,logSize:3};
const keyz = {'ArrowLeft': false, 'ArrowRight': false,'ArrowDown':false,'ArrowUp':false};
const obs = [];
gameArea.addEventListener('click',(e)=>{
    if(game.inPlay){
        gameStop();

    }else{
        gameStart();
    }
})

document.addEventListener('DOMContentLoaded',init);

document.addEventListener('keydown',(e)=>{
    if(e.code in keyz) keyz[e.code] = true;
})
document.addEventListener('keyup',(e)=>{
    //if(e.code in keyz) keyz[e.code] = false;
})

function mover(){
    game.counter++;
    if(game.counter > game.speed){
      game.counter = 0;

      game.eles[game.active].classList.remove("frog");
      if (keyz.ArrowRight && (game.active + 1) % game.x != 0) {
        game.active++;
      } else if (keyz.ArrowLeft && game.active % game.x != 0) {
        game.active--;
      }
      if (keyz.ArrowUp && game.active > game.x - 1) {
        game.active -= game.x;
      } else if (keyz.ArrowDown && game.active < game.x * game.y - game.x) {
        game.active += game.x;
      }
      for(keyPress in keyz){
        keyz[keyPress] = false;
      }
      //game.eles[game.active].classList.add("frog");
      obs.forEach((el, index) => {
        let temp = el.pos;
        if (el.dir == "left") {
          el.pos--;
          if (el.pos < el.row * game.x) {
            el.pos += game.x;
          }
        } else {
          //right
          el.pos++;
          if (el.pos > (el.row + 1) * game.x - 1) {
            el.pos -= game.x;
          }
        }
        if(el.type == 'log'){
            for (let x = 0; x < game.logSize; x++) {
              game.eles[temp + x].classList.remove(el.type);
            }
            for(let x = 0; x < game.logSize; x++){
                if(el.pos + x < (el.row + 1) * game.x){
                    game.eles[el.pos + x].classList.add(el.type);
                }
            }
        }else{
        game.eles[temp].classList.remove(el.type);
        game.eles[el.pos].classList.add(el.type);
        }
      });
    }
    let cur = game.eles[game.active].classList;
    if(game.eles[game.active].classList.contains('safe')){
        //console.log('you won');
        gameStop("you won");
    }else if(cur.contains('car')){
        //console.log('you lost hit by car');
        gameStop("you lost hit by car");
    }else if(cur.contains('water')){
        if(cur.contains('log')){

            //game.eles[game.active].classList.remove('frog');
            if(cur.contains('left')){
                keyz.ArrowLeft = true;
            }else{
                keyz.ArrowRight = true;
            }
        }else{
            //console.log('you fell in the water');
            gameStop("you fell in the water");
        }
    }

    game.eles[game.active].classList.add('frog');
    if(game.inPlay){
    game.ani = requestAnimationFrame(mover);
    }
}

function gameStop(mes){
    messageOutput(mes);
    game.inPlay = false;
    game.eles[game.active].classList.remove('frog');
    game.active = Math.floor(game.x * game.y - game.x / 2);
   /* game.active+= game.x;
    if(game.active >= game.eles.length){
        game.active = game.eles.length - 5;
    }
    */
    cancelAnimationFrame(game.ani);
}
function gameStart() {
    game.inPlay = true;
    game.ani = requestAnimationFrame(mover);
}

function messageOutput(mes){
    game.message.innerHTML = mes;
}

function init(){
    console.log(game);
    game.message = createMyEles(gameArea, 'div', 'Message', 'message');
    game.board = createMyEles(gameArea, "div", "", "gameBoard");
    game.rect = game.board.getBoundingClientRect();
    createBoard();
    game.active = Math.floor(game.x * game.y - (game.x/2));
    game.ani = requestAnimationFrame(mover);
}

function createBoard(){
    const total = game.x * game.y;
    const safety = Math.floor(Math.random()*game.x);
    let tempClass = 'land';
    let row = 0;
    let steps = 0;
    let dir = 'right';
    for(let i = 0; i < total; i++){
        steps++;
        if(i%5 == 0){
            steps = Math.floor(Math.random()*3);
        }
        let temp = createMyEles(game.board, "div", '', "box");
        if(i == safety){temp.classList.add('safe');}
        if(i % game.x == 0){
            row = i/game.x;
            if(row > 0 && row < game.y/2){
                tempClass = 'water';
            }else if(row > game.y/2 && row < game.y - 1){
                tempClass = 'road';
            }else{
                tempClass = 'land';
            }
        }
        dir = row%2 == 0 ? 'left' : 'right';
        temp.classList.add(tempClass);
        if(tempClass == 'road' && steps == 1){
            temp.classList.add('car');
            obs.push({type:'car',pos:i,dir:dir,row:row});
        }
        if (tempClass == "water" && steps == 3) {
          temp.classList.add("log");
          obs.push({ type: "log", pos: i, dir: dir, row: row });
        }
        temp.classList.add(dir);
        game.eles.push(temp);
    }
    game.board.style.setProperty('grid-template-columns','repeat('+game.x+', 1fr)');
}
function createMyEles(parent,eleType,html,cla){
    const el = document.createElement(eleType);
    parent.append(el);
    el.innerHTML = html;
    el.classList.add(cla);
    return el;
    
}