//import GameInputs from "../inputs/GameInputs";
//import Player from "../gameObjects/Player";

export default class GameScene extends Phaser.Scene {
	tilemap: Phaser.Tilemaps.Tilemap;
	tileSize: number = 64;

  constructor() {
    super({ key: "game", active: false, visible: false });
  }

  public preload() {
    this.load.tilemapTiledJSON("tilemap", "./assets/tilemaps/tilemap.json");
  }

  public create() {
    const tilemap = this.tilemap = this.make.tilemap({ key: "tilemap" });
    const tileset = tilemap.addTilesetImage("tiles");
    const tileLayer = tilemap.createLayer(0, tileset, 0, 0);

    const { widthInPixels, heightInPixels } = tilemap;

    this.physics.world.setBounds(0, -64, widthInPixels, heightInPixels + 64).TILE_BIAS = 8;


    this.cameras.main.setBounds(0, 0, widthInPixels, heightInPixels);
  }

  public update() {
	const tilemap = this.tilemap;
	tilemap.forEachTile((tile) => {
		tile.setAlpha(1);
	});
	const worldPoint = this.cameras.main.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y);
	const pointerTileX = tilemap.worldToTileX(worldPoint.x, true);
	const pointerTileY = tilemap.worldToTileY(worldPoint.y, true);

	tilemap.getTileAt(pointerTileX, pointerTileY).setAlpha(0.75);
	console.log('tile index:', tilemap.getTileAt(pointerTileX, pointerTileY).index);
  }
}
