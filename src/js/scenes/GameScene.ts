import { tilemapjson } from "../../assets/tilemaps/tilemap";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default class GameScene extends Phaser.Scene {
  // @ts-ignore
  tilemap: Phaser.Tilemaps.Tilemap;
  tileSize: number = 64;
  //@ts-ignore
  buildings: Phaser.Tilemaps.Tile[];
  tileInfoArray: {
    mapName: string;
    position: {};
    index: number;
    redirectUrl: string;
    image: string;
  }[];
  //@ts-ignore
  tooltip: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "game", active: false, visible: false });

    // Sample data for tile information
    this.tileInfoArray = [
      {
        mapName: "Building A",
        position: {},
        index: 0,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/401/100",
      },
      {
        mapName: "Building B",
        position: {},
        index: 1,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/402/100",
      },
      {
        mapName: "Building C",
        position: {},
        index: 2,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/403/100",
      },
      {
        mapName: "Building D",
        position: {},
        index: 3,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/404/100",
      },
      {
        mapName: "Building E",
        position: {},
        index: 4,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/405/100",
      },
      {
        mapName: "Building F",
        position: {},
        index: 5,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/407/100",
      },
      {
        mapName: "Building G",
        position: {},
        index: 6,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/406/100",
      },
      {
        mapName: "Building H",
        position: {},
        index: 789,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/400/100",
      },
      {
        mapName: "Building I",
        position: {},
        index: 333,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/400/100",
      },
      {
        mapName: "Building J",
        position: {},
        index: 428,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/400/100",
      },
      {
        mapName: "Building K",
        position: {},
        index: 817,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/400/100",
      },
      {
        mapName: "Building L",
        position: {},
        index: 560,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/400/100",
      },
      {
        mapName: "Building M",
        position: {},
        index: 407,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/400/100",
      },
      {
        mapName: "Building N",
        position: {},
        index: 1135,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/400/100",
      },
      {
        mapName: "Building O",
        position: {},
        index: 598,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/400/100",
      },
      {
        mapName: "Building P",
        position: {},
        index: 716,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/400/100",
      },
    ];
    window.addEventListener(
      "storage",
      this.handleLocalStorageChange.bind(this)
    );

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css";
    document.head.appendChild(link);
  }

  handleLocalStorageChange(event) {
    // Check if the changed item is the one we're interested in
    if (event.key === "tileInfo") {
      const tileInfo = JSON.parse(event.newValue);
      if (tileInfo) {
        // Open modal popup with the content from local storage
        this.openModal(tileInfo);
      }
    }
  }
  openModal(tileInfo) {
    console.log(154, tileInfo);
  
    // Create modal element
    const modal = document.createElement("span");
    modal.classList.add("fixed", "inset-0", "flex", "items-center", "justify-center", "bg-black", "bg-opacity-50");
  
    // Create modal content
    modal.innerHTML = `
      <div class="modal-content bg-white rounded-lg p-8">
        <span class="close absolute top-0 right-0 m-4 text-gray-600 cursor-pointer">&times;</span>
        <h2 class="text-2xl font-bold">${tileInfo.mapName}</h2>
        <p class="text-lg">Position: (${tileInfo.position.x}, ${tileInfo.position.y})</p>
        <a href="${tileInfo.redirectUrl}" class="block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Play</a>
        <img src="${tileInfo.image}" alt="Building Image" class="mt-4 mx-auto">
      </div>
    `;
  
    // Append modal to the body
    document.body.appendChild(modal);
  
    // Close modal when close button is clicked
    const closeButton = modal.querySelector(".close");
    closeButton.addEventListener("click", () => {
      modal.remove();
    });
  }
  

  public preload() {
    this.load.tilemapTiledJSON("tilemap", tilemapjson);
  }

  public create() {
    const tilemap = (this.tilemap = this.make.tilemap({ key: "tilemap" }));
    const tileset = tilemap.addTilesetImage("tiles");
    const buildings = (this.buildings = []);

    tilemap.layers.forEach((layer) => {
      //@ts-ignore
      const tileLayer = tilemap.createLayer(layer.name, tileset, 0, 0);
      if (layer.name === "buildings") {
        //@ts-ignore
        tileLayer.forEachTile((tile, index) => {
          if (index >= 0) {
            //@ts-ignore
            buildings.push(tile);
          }
        });
      }
    });

    const { widthInPixels, heightInPixels } = tilemap;

    this.cameras.main.centerOn(widthInPixels / 2, heightInPixels / 2);
    this.cameras.main.setZoom(1.5);

    // Create the tooltip
    this.tooltip = this.add.text(0, 0, "", {
      font: "16px Arial",
      color: "#ffffff",
      backgroundColor: "#000000",
    });
    this.tooltip.setAlpha(0);
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

    //@ts-ignore
    const hoveredTile = tilemap.getTileAt(pointerTileX, pointerTileY);
    if (hoveredTile) {
      if (this.input.manager.activePointer.leftButtonDown()) {
        //@ts-ignore
        const hoveredTileIndex = hoveredTile.id;
        const hoveredTileInfo = this.tileInfoArray.find(
          //@ts-ignore
          (tileInfo) => tileInfo.index === hoveredTileIndex
        );
        hoveredTileInfo.position = { x: pointerTileX, y: pointerTileY };
        //@ts-ignore
        hoveredTileInfo.mousePointer = { x: worldPoint.x, y: worldPoint.y };
        // console.log(238, hoveredTileInfo);
        const event = new CustomEvent("tileClick", { detail: hoveredTileInfo });
        window.dispatchEvent(event);
        // this.openModal(hoveredTileInfo);
        console.log("click on tile:", pointerTileX, pointerTileY);
        // Open game link
      } else {
        //@ts-ignore
        const hoveredTileIndex = hoveredTile.id;
        const hoveredTileInfo = this.tileInfoArray.find(
          //@ts-ignore
          (tileInfo) => tileInfo.index === hoveredTileIndex
        );
        hoveredTileInfo.position = { x: pointerTileX, y: pointerTileY };
        // console.log(238, hoveredTileInfo);
        //@ts-ignore
        // console.log(101, hoveredTileIndex, hoveredTileInfo);
        //@ts-ignore
        // localStorage.setItem("tileInfo", hoveredTileInfo);
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
