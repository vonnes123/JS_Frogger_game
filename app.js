const gameArea = document.querySelector('.gameArea');
const game = {x:20,y:14,eles:[]};

document.addEventListener('DOMContentLoaded',init);

function init(){
    console.log(game);
    game.message = createMyEles(gameArea, 'div', 'Message', 'message');
    game.board = createMyEles(gameArea, "div", "", "gameBoard");
    game.rect = game.board.getBoundingClientRect();
    createBoard();
}

function createBoard(){
    const total = game.x * game.y;
    //const widthX = game.rect.width / game.x;
    //const heightY = game.rect.height / game.y;
    for(let i = 0; i < total; i++){
        let temp = createMyEles(game.board, "div", i+1, "box");
        //temp.style.width = widthX + 'px';
        //temp.style.height = heightY + 'px';
        game.eles.push(temp)
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