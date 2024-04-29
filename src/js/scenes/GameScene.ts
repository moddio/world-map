import axios from 'axios';
import { tilemapjson } from '../../assets/tilemaps/tilemap';
import { siteUrl, worldMapId } from '../../config';

export default class GameScene extends Phaser.Scene {
  tilemap: Phaser.Tilemaps.Tilemap;
  tileSize: number = 16;
  buildings: Phaser.Tilemaps.Tile[];
  clouds: (Phaser.GameObjects.Container & { speed: number })[];
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
    marker: Phaser.GameObjects.Container;
  }[];
  tooltip: Phaser.GameObjects.Text;
  indicator: Phaser.GameObjects.Graphics;
  angle: number = 0;
  selectedTile: Phaser.Tilemaps.Tile;

  constructor() {
    super({ key: 'game', active: false, visible: false });

    // Sample data for tile information
    this.tileInfoArray = [];
    this.loadMapInfo();

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
    document.head.appendChild(link);
  }

  async loadMapInfo() {
    try {
      const response = await axios.get(
        `${siteUrl}/api/game/${worldMapId}/all-world-maps/?isMapPositionAvailable=true`
      );
      const data = response.data.data;
      const playCountResponse = await axios.get(
        `${siteUrl}/api/v1/games/active-player-count-by-game-id/?gameId=${worldMapId}`
      );
      const playCountData = playCountResponse.data.data;

      this.tileInfoArray =
        data && data.length
          ? data.map((item) => {
              const correspondingPlayCount =
                playCountData &&
                playCountData.length &&
                playCountData.find(
                  (playCountItem) =>
                    playCountItem &&
                    playCountItem.mapPosition &&
                    item.mapPosition &&
                    playCountItem.mapPosition.x === item.mapPosition.x &&
                    playCountItem.mapPosition.y === item.mapPosition.y
                );
              return {
                mapName: item.title,
                ownerName: item.owner.local.username,
                position: {
                  x: item.mapPosition?.x || 0,
                  y: item.mapPosition?.y || 0,
                },
                id: item._id.toString(),
                cover: item.cover,
                totalActivePlayers: correspondingPlayCount
                  ? correspondingPlayCount.totalActivePlayers
                  : 0,
              };
            })
          : [];

      this.tileInfoArray.forEach((tileInfo: any) => {
        if (
          (!tileInfo.position.x && !tileInfo.position.y) ||
          !tileInfo.totalActivePlayers
        ) {
          return;
        }
        this.createMarker(tileInfo);
      });
    } catch (error) {
      console.error('Error loading data from API:', error);
    }
  }

  createMarker(tileInfo: any) {
    const marker = this.add.container(
      tileInfo.position.x * this.tileSize,
      tileInfo.position.y * this.tileSize - this.tileSize / 2
    );

    const graphics = this.add.graphics();
    graphics.fillStyle(0x5d509b, 0.9);
    graphics.fillRoundedRect(0, 0, 24, 14, 8);
    marker.add(graphics);

    const markerIcon = this.add.image(7, 7, 'user');
    markerIcon.setScale(0.06);
    markerIcon.setTint(0xffffff);
    markerIcon.tintFill = true;
    marker.add(markerIcon);

    const markerText = this.add.text(
      14,
      6.5,
      `${tileInfo.totalActivePlayers}`,
      {
        fontSize: '12px',
      }
    );
    markerText.setResolution(16);
    markerText.setFont('population_zero_bbregular');
    markerText.setTint(0xffffff);
    markerText.setScale(0.8);
    markerText.setOrigin(0, 0.5);
    markerText.setStyle({ fontWeight: 'bold' });
    marker.add(markerText);

    tileInfo.marker = marker;

    /*
const camera = this.cameras.main;
    if (camera.zoom > 2) {
      this.updateMarkerVisibility(true);
    } else {
      this.updateMarkerVisibility(false);
    }
*/
  }

  updateMarkerVisibility(bool: boolean) {
    this.tileInfoArray.forEach((tileInfo) => {
      if (tileInfo.marker) tileInfo.marker.setVisible(bool);
    });
  }

  public preload() {
    this.load.tilemapTiledJSON('tilemap', tilemapjson);
  }

  public create() {
    const pinchPlugin = this.plugins.get('rexpinchplugin') as any;
    const dragScale = pinchPlugin.add(this);

    const tilemap = (this.tilemap = this.make.tilemap({ key: 'tilemap' }));
    const tileset = tilemap.addTilesetImage('tiles');
    const buildings = (this.buildings = []);
    const clouds = (this.clouds = []);

    tilemap.layers.forEach((layer) => {
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

    const Xmin = -widthInPixels;
    const Xmax = 2 * widthInPixels;
    const Ymin = -0.5 * heightInPixels;
    const Ymax = 1.5 * heightInPixels;

    const camera = this.cameras.main;
    camera.setBackgroundColor('#1883fd');
    camera.centerOn(widthInPixels / 3, heightInPixels / 2);
    camera.setZoom(1.66);
    camera.scrollX += widthInPixels / 4;
    camera.setBounds(Xmin, Ymin, Xmax - Xmin, Ymax - Ymin);

    //create clouds at random positions
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(Xmin, Xmax);
      const y = Phaser.Math.Between(Ymin, Ymax);
      const random = Phaser.Math.Between(1, 6);
      //container for cloud and its shadow
      const cloudContainer = this.add.container(
        x,
        y
      ) as Phaser.GameObjects.Container & { speed: number };
      cloudContainer.speed = Phaser.Math.Between(10, 30) / 10;

      //shadow image
      const shadow = this.add.image(20, 20, 'cloud' + random.toString());
      shadow.setScale(0.75);
      shadow.setOrigin(0, 0);
      shadow.setAlpha(0.1);
      shadow.tint = 0x000000;
      cloudContainer.add(shadow);

      //cloud image
      const cloud = this.add.image(0, 0, 'cloud' + random.toString());
      cloud.setScale(0.75);
      cloud.setOrigin(0, 0);
      cloudContainer.add(cloud);

      clouds.push(cloudContainer);
    }

    dragScale.on(
      'pinch',
      function (dragScale) {
        const maxZoom = (10 * 16) / tilemap.tileWidth;
        const minZoom = (0.75 * 16) / tilemap.tileWidth;
        var scaleFactor = dragScale.scaleFactor;
        camera.zoom *= scaleFactor;
        if (camera.zoom < minZoom) camera.zoom = minZoom;
        else if (camera.zoom > maxZoom) camera.zoom = maxZoom;
        if (camera.zoom > 2) {
          this.updateMarkerVisibility(true);
        } else {
          this.updateMarkerVisibility(false);
        }
      },
      this
    );

    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      this.zoom(deltaY, pointer);
    });

    this.input.on('pointermove', (p) => {
      if (p.isDown) {
        const scrollX = (p.x - p.prevPosition.x) / camera.zoom;
        const scrollY = (p.y - p.prevPosition.y) / camera.zoom;
        camera.scrollX -= scrollX;
        camera.scrollY -= scrollY;

        const modalPopup = document.getElementById('modalPopup');
        if (modalPopup) {
          const closeModal = new CustomEvent('closePopup');
          window.dispatchEvent(closeModal);
        }
      }
    });

    // Graphics object for drawing the indicator
    this.indicator = this.add.graphics({
      lineStyle: { width: 3, color: 0x254102 },
    });

    // Draw the initial indicator
    this.drawIndicator();
  }

  drawIndicator() {
    const indicator = this.indicator;

    // Drawing the circle with gaps
    for (let i = 0; i < 4; i++) {
      indicator.beginPath();
      indicator.arc(
        0,
        0,
        15,
        Phaser.Math.DegToRad(5 + i * 90),
        Phaser.Math.DegToRad(80 + i * 90),
        false
      );
      indicator.strokePath();
    }
    indicator.rotation = this.angle;
  }

  private zoom(deltaY: number, pointer: Phaser.Input.Pointer) {
    const tilemap = this.tilemap;
    const camera = this.cameras.main;

    const maxZoom = (10 * 16) / tilemap.tileWidth;
    const minZoom = (1.25 * 16) / tilemap.tileWidth;
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
    if (camera.zoom > 2) {
      this.updateMarkerVisibility(true);
    } else {
      this.updateMarkerVisibility(false);
    }
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
        this.tileInfoArray.map((tileInfo: any) => {
          if (clickedTileInfo !== tileInfo) {
            tileInfo.clicked = false;
          }
          return tileInfo;
        });
        if (clickedTileInfo && !clickedTileInfo.clicked) {
          clickedTileInfo.mousePointer = { x: worldPoint.x, y: worldPoint.y };
          const event = new CustomEvent('tileClick', {
            detail: { clickedTileInfo, hoveredTile },
          });
          window.dispatchEvent(event);
          clickedTileInfo.clicked = true;
          this.selectedTile = hoveredTile;
        }
      } else {
        // const isModalClosed = document.getElementById('modalPopup') === null;

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
          document.body.style.cursor = 'pointer';
          const event = new CustomEvent('tileHover', {
            detail: hoveredTileInfo,
          });
          window.dispatchEvent(event);
        } else {
          const event = new CustomEvent('tileHover', { detail: null });
          window.dispatchEvent(event);
        }
      }
    } else {
      document.body.style.cursor = 'default';
      const event = new CustomEvent('tileHover', { detail: null });
      window.dispatchEvent(event);
    }
    //move clouds
    this.clouds.forEach((cloud) => {
      cloud.x += 0.05 * cloud.speed;
      if (cloud.x > 2 * this.tilemap.widthInPixels) {
        cloud.x = -cloud.width - this.tilemap.widthInPixels;
      }
    });

    // Clear the previous frame
    this.indicator.clear();
    if (this.selectedTile) {
      // Update the rotation angle
      this.angle -= 0.01; // This will rotate the indicator counterclockwise
      // Draw the updated indicator
      this.drawIndicator();
      this.indicator.x = this.selectedTile.getCenterX();
      this.indicator.y = this.selectedTile.getCenterY();
    }
  }
}
