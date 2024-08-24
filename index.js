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

let score = 0;
let ball_velocity_x = 1;
let ball_velocity_y = 1;


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

setSolids([player, ball, brick]);
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
  getAll(player).map(p=>p.x -= 2);
});
onInput("d", () => {
  getAll(player).map(p=>p.x += 2);
});


afterInput(() => {
  
});


const gameLoop = setInterval(function(){
  let gameball = getFirst(ball);
  
  // Store the pall position
  let last_x_axis = gameball.x;
  let last_y_axis = gameball.y;

  // Move the ball
  gameball.x += ball_velocity_x;
  gameball.y += ball_velocity_y;

  // Check the new position
  if (last_x_axis === gameball.x) ball_velocity_x *= -1;
  if (last_y_axis === gameball.y) ball_velocity_y *= -1;

  
  
}, 200);

