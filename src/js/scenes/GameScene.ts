import axios from "axios";
import { tilemapjson } from "../../assets/tilemaps/tilemap";
import { siteUrl, worldMapId } from "../../config";

export default class GameScene extends Phaser.Scene {
  tilemap: Phaser.Tilemaps.Tilemap;
  tileSize: number = 64;
  buildings: Phaser.Tilemaps.Tile[];
  tileInfoArray: {
    mousePointer: {};
    mapName: string;
    ownerName: string;
    dateCreated: string;
    description: string;
    position: {};
    type: string;
    index: number;
    redirectUrl: string;
    image: string;
  }[];
  tooltip: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "game", active: false, visible: false });

    // Sample data for tile information
    this.tileInfoArray = [];
    this.loadMapInfo();

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css";
    document.head.appendChild(link);
  }

  async loadMapInfo() {
    try {
      const response = await axios.get(
        `${siteUrl}/api/game/${worldMapId}/all-world-maps/?isMapPositionAvailable=true`
      );
      const data = response.data.data;

      this.tileInfoArray =
        data && data.length
          ? data.map((item) => ({
              mapName: item.title,
              ownerName: item.owner.local.username,
              position: {
                x: item.mapPosition?.x || 0,
                y: item.mapPosition?.y || 0,
              },
              id: item._id.toString(),
            }))
          : [];
    } catch (error) {
      console.error("Error loading data from API:", error);
    }
  }

  public preload() {
    this.load.tilemapTiledJSON("tilemap", tilemapjson);
  }

  public create() {
    const tilemap = (this.tilemap = this.make.tilemap({ key: "tilemap" }));
    const tileset = tilemap.addTilesetImage("tiles");
    const buildings = (this.buildings = []);

    tilemap.layers.forEach((layer) => {
      const tileLayer = tilemap.createLayer(layer.name, tileset, 0, 0);
      if (layer.name === "buildings") {
        tileLayer.forEachTile((tile, index) => {
          if (index >= 0) {
            buildings.push(tile);
          }
        });
      }
    });

    const { widthInPixels, heightInPixels } = tilemap;
    const camera = this.cameras.main;
    camera.setBackgroundColor("#1883fd");

    camera.centerOn(widthInPixels / 2, heightInPixels / 2);
    camera.setZoom(1.5);

    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      const maxZoom = (20 * 16) / tilemap.tileWidth;
      const minZoom = (0.5 * 16) / tilemap.tileWidth;
      let targetZoom;

      if (deltaY < 0) {
        targetZoom = camera.zoom * 1.2;
        if (targetZoom < maxZoom) {
          let xDist = pointer.worldX - camera.midPoint.x;
          let yDist = pointer.worldY - camera.midPoint.y;
          camera.scrollX += xDist / 6;
          camera.scrollY += yDist / 6;
        }
      } else targetZoom = camera.zoom / 1.2;
      if (targetZoom < minZoom) targetZoom = minZoom;
      else if (targetZoom > maxZoom) targetZoom = maxZoom;
      camera.setZoom(targetZoom);
    });

    this.input.on("pointermove", (p) => {
      if (p.isDown) {
        const scrollX = (p.x - p.prevPosition.x) / camera.zoom;
        const scrollY = (p.y - p.prevPosition.y) / camera.zoom;
        camera.scrollX -= scrollX;
        camera.scrollY -= scrollY;
      }
    });
  }

  public update() {
    const tilemap = this.tilemap;

    this.buildings.forEach((building, index) => {
      //@ts-ignore
      building.id = index;
      building.setAlpha(1);
    });

    const worldPoint = this.cameras.main.getWorldPoint(
      this.input.activePointer.x,
      this.input.activePointer.y
    );
    const pointerTileX = tilemap.worldToTileX(worldPoint.x, true);
    const pointerTileY = tilemap.worldToTileY(worldPoint.y, true);

    const hoveredTile = tilemap.getTileAt(pointerTileX, pointerTileY);
    if (hoveredTile) {
      if (this.input.manager.activePointer.leftButtonDown()) {       
        const clickedTileInfo: any = this.tileInfoArray.find(
          (tileInfo: any) => {
            return (
              tileInfo.position.x === pointerTileX.toString() &&
              tileInfo.position.y === pointerTileY.toString()
            );
          }
        );
        if (clickedTileInfo && !clickedTileInfo.clicked) {
          clickedTileInfo.mousePointer = { x: worldPoint.x, y: worldPoint.y };
          const event = new CustomEvent("tileClick", {
            detail: clickedTileInfo,
          });
          const hoverEvent = new CustomEvent("tileHover", { detail: null });
          window.dispatchEvent(event);
          window.dispatchEvent(hoverEvent);
        //  clickedTileInfo.clicked = true;   
        } 
      } else {
        const isModalClosed = document.getElementById("modalPopup") === null;

        const hoveredTileInfo: any = this.tileInfoArray.find(
          (tileInfo: any) => {
            return (
              tileInfo.position.x === pointerTileX.toString() &&
              tileInfo.position.y === pointerTileY.toString()
            );
          }
        );

        if (hoveredTileInfo) {
          hoveredTileInfo.mousePointer = {
            x: this.input.activePointer.x,
            y: this.input.activePointer.y,
          };
          document.body.style.cursor = "pointer";
          if (isModalClosed) {
            const event = new CustomEvent("tileHover", {
              detail: hoveredTileInfo,
            });
            window.dispatchEvent(event);
          }
          // if (document.getElementById("modalPopup").style.display == "none") {
          // const shiftKey = this.input.keyboard.addKey(
          //   Phaser.Input.Keyboard.KeyCodes.SHIFT
          // );
        } else {
          const event = new CustomEvent("tileHover", { detail: null });
          window.dispatchEvent(event);
        }
      }
    } else {
      document.body.style.cursor = "default";
      const event = new CustomEvent("tileHover", { detail: null });
      window.dispatchEvent(event);
    }
  }
}
