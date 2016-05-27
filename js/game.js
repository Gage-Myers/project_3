var gameWidth = 800;
var gameHeight = 500;
var gameScale = 1;

var gameport = document.getElementById('gameport');
var renderer =  PIXI.autoDetectRenderer(gameWidth, gameHeight, {backgroundColor: 0x7ec0ee});

// Text for in game
var headline = new PIXI.Text('Venture Jump', {font: '30px Arial', fill: 0x0, align: 'center'});
var instructions = new PIXI.Text('Click anywhere to continue', {font: '16px Arial', fill: 0x0, align: 'center'});
var win = new PIXI.Text('You made it to the finish!', {font: '30px Arial', fill: 0x0, align: 'center'});
var lose = new PIXI.Text('Sorry you lost', {font: '30px Arial', fill: 0x0, align: 'center'});

var jump;
var fall;

var runner;

var obstacles = [50,60,70,80,90, 230,240,250,260,270,280,420,430,440,450,460,660,670,680,690,700,840, 850,860,870,880,890,970,980,990,1150,1160,1170,1180,1260,1270,1280,1290,1310,1320];

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

var stage =  new PIXI.Container();
stage.scale.set(gameScale,gameScale);


var world;

var stand = new PIXI.Sprite(PIXI.Texture.fromImage('../assets/Player.png'));
var finish = new PIXI.Sprite(PIXI.Texture.fromImage('../assets/Finish.png'));

gameport.appendChild(renderer.view);

PIXI.loader
    .add('map_json','../assets/Map2.json')
    .add('tileset', '../assets/tileset2.png')
    .add('../assets/assets.json')
    .load(ready);

function ready() {
    var tu =  new TileUtilities(PIXI);
    world = tu.makeTiledWorld("map_json", "../assets/tileset2.png");
    
    stand.scale.set(6,6);
    stand.position.set(250,200);

    headline.position.set(300, 20);
    instructions.position.set(300, 70);

    world.position.y += 100;

    stage.addChild(stand);

    stage.addChild(headline);
    stage.addChild(instructions);

    stage.addChild(world);
}

function mouseHandler(e) {
    stand.visible = false;
    headline.visible = false;
    instructions.visible = false;

    var frames = [];
    for (var i = 1; i < 4; i++) {
        frames.push(PIXI.Texture.fromFrame('Player' + i + '.png'));
    }

    runner = new PIXI.extras.MovieClip(frames);
    runner.scale.set(2,2);
    runner.position.set(0,390 - 16 * 5);
    runner.animationSpeed = 0.1;
    runner.play();
    stage.addChild(runner);

    finish.scale.set(.5,.5);
    finish.position.set(1400, 320);
    stage.addChild(finish);
}

function keyDownEventHandler(e) {
    e.preventDefault();

    // A: Move Left
    if (e.keyCode == 65) {
        runner.position.x -= 10;
    }

    // D: Move Right
    if (e.keyCode == 68) {
        runner.position.x += 10;
    }

    if (e.keyCode == 32) {
        jump = true;
    }
}

function jumpCheck() {
    if (runner.position.y < 390 - 16 * 5 - 40) {
        jump = false;
        fall = true;
    }
    if (runner.position.y == 390 - 16 * 5) {fall = false;}

    if (jump) {
        return 5;
    }
    if (fall) {
        return -5;
    }
    else {
        return 0;
    }
}

function isAlive() {
    return runner.position.y < 400 - 32*4;
}

function contains(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == runner.position.x) {
            return true;
        }
    }
    return false;
}


document.addEventListener('keydown', keyDownEventHandler);
document.addEventListener('mousedown', mouseHandler);

function animate() {
    requestAnimationFrame(animate);
    if (!stand.visible) {
        update_camera();
        runner.position.y -= jumpCheck();
        runner.position.x += Math.abs(jumpCheck());
        if (contains(obstacles) && !jump && !fall) {
            runner.visible = false;
            lose.position.set(runner.position.x,30);
            stage.addChild(lose);
        }
    }
    renderer.render(stage);
}

function update_camera() {
  if (runner.position.x > 600 && stage.x >= -600) {
    stage.x -= 5;
  }
  if (runner.position.x > 1100 && stage.x >= -1100) {stage.x -= 5;}
  if (runner.position.x > 1400) {
    runner.visible = false;
    win.position.set(1400,20);
    stage.addChild(win);
  }
}

animate();