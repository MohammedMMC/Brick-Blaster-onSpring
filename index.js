/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: 
@author: 
@tags: []
@addedOn: 2024-00-00
*/

const player = "p";
const ball = "b";
const brick = "k";
const bg = "g";

let gameEnded = false;
let newLevel = false;
let score = 0;
let ball_velocity_x = Math.random() < 0.5 ? -1 : 1;
let ball_velocity_y = Math.random() < 0.5 ? -1 : 1;


setLegend(
  [ player, bitmap`
4444444444444444
4444444444444444
4444444D44444D44
4DD444DD444DDD4D
DDDDDDDDDDDDDDDD
................
................
................
................
................
................
................
................
................
................
................` ],
  [ ball, bitmap`
................
................
................
.....111111.....
....12222221....
...1222222221...
...1222222221...
...122222222L...
...122222222L...
...122222222L...
...1222222220...
....12222220....
.....1LL000.....
................
................
................` ],
  [ brick, bitmap`
................
................
................
................
3233323332333233
3233323332333233
2222222222222222
3332333233323332
3332333233323332
3332333233323332
2222222222222222
3233323332333233
................
................
................
................` ],
  [ bg, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000` ],
);

setSolids([player, ball]);
setBackground(bg);

let level = 0;
const levels = [ map`
..............
.kk.kk.kk.kk..
..............
..kk.kk.kk.kk.
..............
.kk.kk.kk.kk..
..............
......b.......
..............
..............
..............
..............
......pp......`];

setMap(levels[level]);

setPushables({
  [ player ]: []
});

onInput("a", () => {
  if (!gameEnded) getAll(player).map(p=>p.x -= 2);
});
onInput("d", () => {
  if (!gameEnded) getAll(player).map(p=>p.x += 2);
});
onInput("k", () => {
  if (newLevel) {
    setMap(levels[level]);
    newLevel = false;
  }
});


afterInput(() => {
  
});


function updateScore() {
  clearText();
  addText(String(score), { x: 0, y: 0, color: color`7` });
}


const gameLoop = setInterval(function(){
  let gameball = getFirst(ball);
  
  // Store the pall position
  let last_x_axis = gameball.x;
  let last_y_axis = gameball.y;

  // Move the ball
  gameball.x += ball_velocity_x;
  gameball.y += ball_velocity_y;

  const isLost = gameball.y >= height() - 1;
  if (isLost) {
    clearInterval(gameLoop);
    gameEnded = true;

    addText("YOU LOST!", { x: 6, y: 11, color: color`3` });
    
    return;
  }
  
  // Check the new position and change directions
  if (last_x_axis === gameball.x) ball_velocity_x *= -1;
  if (last_y_axis === gameball.y) ball_velocity_y *= -1;

  const touchedBrick = tilesWith(ball)[0] ? tilesWith(ball)[0].find(sprite => sprite.type === brick) : null;
  if (touchedBrick) {
  ['+1', '-1'].forEach(offset => {
    let block = getTile(touchedBrick.x + parseInt(offset), touchedBrick.y);
    if (block.length > 0 && block[0].type === brick) block[0].remove();
  });
    
     touchedBrick.remove();

    score++;
    
     ball_velocity_x *= -1;
     ball_velocity_y *= -1;
  }
  
  updateScore();

  if (getAll(brick).length === 0) {
    level++;
    if (levels[level]) newLevel = true;
  }
  
}, 200);

