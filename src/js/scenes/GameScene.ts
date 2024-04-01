export default class GameScene extends Phaser.Scene {
  tilemap: Phaser.Tilemaps.Tilemap;
  tileSize: number = 64;
  tileInfoArray: { mapName: string, position: {}, index: number }[];
  tooltip: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "game", active: false, visible: false });


    
    // Sample data for tile information
    this.tileInfoArray = [
      { mapName: "Tile A", position: {}, index: 0 },
      { mapName: "Tile B", position: {}, index: 1 },
      { mapName: "Tile C", position: {}, index: 2 },
      { mapName: "Tile D", position: {}, index: 3 },
      { mapName: "Tile E", position: {}, index: 4 },
      { mapName: "Tile F", position: {}, index: 5 },
      { mapName: "Tile G", position: {}, index: 6 },
      { mapName: "Tile H", position: {}, index: 7 },
      { mapName: "Tile I", position: {}, index: 8 },
      { mapName: "Tile J", position: {}, index: 9 },
      { mapName: "Tile K", position: {}, index: 10 },
      { mapName: "Tile L", position: {}, index: 11 },
      { mapName: "Tile M", position: {}, index: 12 },
      { mapName: "Tile N", position: {}, index: 13 },
      { mapName: "Tile O", position: {}, index: 14 },
      { mapName: "Tile P", position: {}, index: 15 },
    ];
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

    // Create the tooltip
    this.tooltip = this.add.text(0, 0, "", { font: "16px Arial", color: "#ffffff", backgroundColor: "#000000" });
    this.tooltip.setAlpha(0); 
  }

  public update() {
    const tilemap = this.tilemap;

    tilemap.forEachTile((tile, index) => {
      tile.setAlpha(1);
      tile.index = index;
    });

    const worldPoint = this.cameras.main.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y);
    const pointerTileX = tilemap.worldToTileX(worldPoint.x, true);
    const pointerTileY = tilemap.worldToTileY(worldPoint.y, true);

    const hoveredTile = tilemap.getTileAt(pointerTileX, pointerTileY);

    if (hoveredTile) {
      if (this.input.manager.activePointer.leftButtonDown()) {
        console.log(hoveredTile);
        console.log('click on tile:', pointerTileX, pointerTileY);
        // Open game link
      } else {
        const hoveredTileIndex = hoveredTile.index;
        const hoveredTileInfo = this.tileInfoArray.find(tileInfo => tileInfo.index === hoveredTileIndex);
        hoveredTileInfo.position = {x: pointerTileX, y: pointerTileY}

        if (hoveredTileInfo) {
          const tooltipText = `Map Name: ${hoveredTileInfo.mapName}\nPosition: (${JSON.stringify(hoveredTileInfo.position)})`;
          const tileScreenPos = tilemap.tileToWorldXY(hoveredTile.x, hoveredTile.y);
          this.tooltip.setText(tooltipText);
          this.tooltip.setPosition(tileScreenPos.x, tileScreenPos.y);
          this.tooltip.setAlpha(1); // Show tooltip
        } else {
          this.tooltip.setAlpha(0); // Hide tooltip if no tile information found
        }
        hoveredTile.setAlpha(0.75);
      }
    } else {
      this.tooltip.setAlpha(0); // Hide tooltip if not hovering over a tile
    }
  }
}
