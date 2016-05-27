var gameport = document.getElementById('gameport');
var renderer =  PIXI.autoDetectRenderer(800,400,{backgroundColor: 0x99D5FF});

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

var stage = new PIXI.Container();

var world;

gameport.appendChild(renderer.view);

PIXI.loader
    .add('map_json','../assets/Map.json')
    .add('tileset', '../assets/tileset.png')
    .add('../assets/assets.json')
    .load(ready);

function ready() {
    var tu =  new TileUtilities(PIXI);
    world = tu.makeTiledWorld("../assets/Map.json", "../assets/tileset.png");

    var stand = new PIXI.Sprite(PIXI.Texture.fromFrame('Player.png'));
    stand.scale.set(4,4);
    stand.position.set(0,0);

    stage.addChild(world);
    stage.addChild(stand);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
}

animate();