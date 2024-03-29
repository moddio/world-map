
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

    this.cameras.main.centerOn(widthInPixels / 2, heightInPixels / 2);
  }

  public update() {
	  const tilemap = this.tilemap;
	  tilemap.forEachTile((tile) => {
	  	tile.setAlpha(1);
	  });
	  const worldPoint = this.cameras.main.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y);
	  const pointerTileX = tilemap.worldToTileX(worldPoint.x, true);
	  const pointerTileY = tilemap.worldToTileY(worldPoint.y, true);

    if (tilemap.getTileAt(pointerTileX, pointerTileY)) {
      if (this.input.manager.activePointer.leftButtonDown()) {
        console.log('click on tile:', pointerTileX, pointerTileY);
        //open game link
      } else {
        tilemap.getTileAt(pointerTileX, pointerTileY).setAlpha(0.75);
        console.log('tile index:', tilemap.getTileAt(pointerTileX, pointerTileY).index, 'tile position in array:', pointerTileY * tilemap.width + pointerTileX);
        //show html tooltip
      }
    }
  }
}
