export default class GameScene extends Phaser.Scene {
  tilemap: Phaser.Tilemaps.Tilemap;
  tileSize: number = 64;
  buildings: Phaser.Tilemaps.Tile [];
  tileInfoArray: { mapName: string, position: {}, index: number }[];
  tooltip: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "game", active: false, visible: false });


    
    // Sample data for tile information
    this.tileInfoArray = [
      { mapName: "Building A", position: {}, index: 0 },
      { mapName: "Building B", position: {}, index: 1 },
      { mapName: "Building C", position: {}, index: 2 },
      { mapName: "Building D", position: {}, index: 3 },
      { mapName: "Building E", position: {}, index: 4 },
      { mapName: "Building F", position: {}, index: 5 },
      { mapName: "Building G", position: {}, index: 6 },
      { mapName: "Building H", position: {}, index: 7 },
      { mapName: "Building I", position: {}, index: 8 },
      { mapName: "Building J", position: {}, index: 9 },
      { mapName: "Building K", position: {}, index: 10 },
      { mapName: "Building L", position: {}, index: 11 },
      { mapName: "Building M", position: {}, index: 12 },
      { mapName: "Building N", position: {}, index: 13 },
      { mapName: "Building O", position: {}, index: 14 },
      { mapName: "Building P", position: {}, index: 15 },
    ];
  }

  public preload() {
    this.load.tilemapTiledJSON("tilemap", "./assets/tilemaps/tilemap.json");
  }

  public create() {
    const tilemap = this.tilemap = this.make.tilemap({ key: "tilemap" });
    const tileset = tilemap.addTilesetImage("tiles");
    const buildings = this.buildings = [];
    
    tilemap.layers.forEach(layer => {
      const tileLayer = tilemap.createLayer(layer.name, tileset, 0, 0);
      if (layer.name === 'buildings') {
        tileLayer.forEachTile((tile, index) => {
          if (index >= 0) {
            buildings.push(tile);
          }
        });
      }
    });

    const { widthInPixels, heightInPixels } = tilemap;

    this.cameras.main.centerOn(widthInPixels / 2, heightInPixels / 2);
    this.cameras.main.setZoom(1.5);

    // Create the tooltip
    this.tooltip = this.add.text(0, 0, "", { font: "16px Arial", color: "#ffffff", backgroundColor: "#000000" });
    this.tooltip.setAlpha(0); 
  }

  public update() {
    const tilemap = this.tilemap;

    this.buildings.forEach(building => {
      building.setAlpha(1);
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
        /*hoveredTileInfo.position = {x: pointerTileX, y: pointerTileY}

        if (hoveredTileInfo) {
          const tooltipText = `Map Name: ${hoveredTileInfo.mapName}\nPosition: (${JSON.stringify(hoveredTileInfo.position)})`;
          const tileScreenPos = tilemap.tileToWorldXY(hoveredTile.x, hoveredTile.y);
          this.tooltip.setText(tooltipText);
          this.tooltip.setPosition(tileScreenPos.x, tileScreenPos.y);
          this.tooltip.setAlpha(1); // Show tooltip
        } else {
          this.tooltip.setAlpha(0); // Hide tooltip if no tile information found
        }*/
        hoveredTile.setAlpha(0.75);
      }
    } else {
      this.tooltip.setAlpha(0); // Hide tooltip if not hovering over a tile
    }
  }
}
