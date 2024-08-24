/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: 
@author: 
@tags: []
@addedOn: 2024-00-00
*/

const player = "p";
const power = "m";
const ball = "b";
const brick = "k";
const bg = "g";

let time_start = performance.now();
let time_rest = 0;
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
  [ power, bitmap`
9............9..
.9..77777777...9
...7777777777.9.
..777777777777..
.74444444444447.
.74DD44DDD44D47.
.7DDDDDDDDDDDD7.
.7777778H777777.
.777788888H7777.
.7778H78H78H777.
.778H778H778H75.
.7777778H777755.
..777778H77755..
9..77778H7755...
..9.77777555...9
9............9..` ],
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
const levels = [
  map`
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
......pp......`,
  map`
..............
.kkkkkkkkkkkk.
..kkkkkkkkkk..
...kkkkkkkk...
....kkkkkk....
.....kkk......
......k.......
......b.......
..............
..............
..............
..............
......pp......`,
  map`
..............
kkkkkk..kkkkkk
kkkkk..kkkkkkk
kkkkkk..kkkkkk
kkkkkkk..kkkkk
kkkkkkkk..kkkk
kkkkkkkkk..kkk
......b.......
..............
..............
..............
..............
......pp......`,
];

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
  if (newLevel && gameEnded) {
    time_start += (performance.now() - time_rest);
    setMap(levels[level]);
    newLevel = false;
    gameEnded = false;
  }
});


afterInput(() => {
  
});

const gameLoop = setInterval(function(){
  if (gameEnded) return;
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
    if (level === 0) ['+1', '-1'].forEach(offset => {
      let block = getTile(touchedBrick.x + parseInt(offset), touchedBrick.y);
      if (block.length > 0 && block[0].type === brick) block[0].remove();
    });
    
     touchedBrick.remove();

    score++;
    
     ball_velocity_x *= -1;
     ball_velocity_y *= -1;
  }
  
  clearText();
  addText(String(score), { x: 0, y: 0, color: color`7` });

  let time_diff = (performance.now() - time_start) / 1000;
  let time_minutes = Math.floor(time_diff / 60);
  let time_seconds = Math.floor(time_diff % 60);
  let time_string = time_minutes > 0 ? `${time_minutes}m ${time_seconds}s` : `${time_seconds}s`;
  addText(time_string, { x: 10 - Math.floor(time_string.length / 2), y: 0, color: color`9` });
  
  addText(String(level+1), { x: 19, y: 0, color: color`5` });

  if (getAll(brick).length === 0) {
    level++;
    gameEnded = true;
    if (levels[level]) {
      addText(`lvl.${level} completed!`, { x: 2, y: 10, color: color`4` });
      addText("Next level click K", { x: 1, y: 11, color: color`8` });
      newLevel = true;
      time_rest = performance.now();
    } else {
      addText(`YOU WON!`, { x: 6, y: 10, color: color`4` });
      clearInterval(gameLoop);
    }
  }
  
}, 200);

