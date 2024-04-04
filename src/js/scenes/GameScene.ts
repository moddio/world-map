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
    ownerName: string;
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
        ownerName: "m0dE",
        position: {},
        index: 0,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://fastly.picsum.photos/id/524/200/200.jpg?hmac=t6LNfKKZ41wUVh8ktcFHag3CGQDzovGpZquMO5cbH-o",
      },
      {
        mapName: "Building B",
        ownerName: "m0dE",
        position: {},
        index: 1,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "hhttps://fastly.picsum.photos/id/719/200/200.jpg?hmac=WkMnZveCKylVzw33Ui-BNFbah8IQWImYq68wVKznlEo",
      },
      {
        mapName: "Building C",
        ownerName: "m0dE",
        position: {},
        index: 2,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://fastly.picsum.photos/id/142/200/200.jpg?hmac=L8yY8tFPavTj32ZpuPiqsLsfWgDvW1jvoJ0ETDOUMGg",
      },
      {
        mapName: "Building D",
        ownerName: "m0dE",
        position: {},
        index: 3,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://fastly.picsum.photos/id/257/200/200.jpg?hmac=k0qf_n518If39xOB7qmdqgZZNQ38WdbfQXdF30TSPCw",
      },
      {
        mapName: "Building E",
        ownerName: "m0dE",
        position: {},
        index: 4,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/405/100",
      },
      {
        mapName: "Building F",
        ownerName: "m0dE",
        position: {},
        index: 5,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/407/100",
      },
      {
        mapName: "Building G",
        ownerName: "m0dE",
        position: {},
        index: 6,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/406/100",
      },
      {
        mapName: "Building H",
        ownerName: "m0dE",
        position: {},
        index: 789,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://fastly.picsum.photos/id/185/200/200.jpg?hmac=YNeKNCPhFVkjxUu5nB7ZP8UJVw_zYu3TPLI11_edSWc",
      },
      {
        mapName: "Building I",
        ownerName: "m0dE",
        position: {},
        index: 333,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://fastly.picsum.photos/id/257/200/200.jpg?hmac=k0qf_n518If39xOB7qmdqgZZNQ38WdbfQXdF30TSPCw",
      },
      {
        mapName: "Building J",
        ownerName: "m0dE",
        position: {},
        index: 428,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://fastly.picsum.photos/id/142/200/200.jpg?hmac=L8yY8tFPavTj32ZpuPiqsLsfWgDvW1jvoJ0ETDOUMGg",
      },
      {
        mapName: "Building K",
        ownerName: "m0dE",
        position: {},
        index: 817,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://fastly.picsum.photos/id/447/200/200.jpg?hmac=CwQWs2SxtAz87GyTTmC1s4okk4869xQiZAfx7rPW0FM",
      },
      {
        mapName: "Building L",
        ownerName: "m0dE",
        position: {},
        index: 560,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://fastly.picsum.photos/id/524/200/200.jpg?hmac=t6LNfKKZ41wUVh8ktcFHag3CGQDzovGpZquMO5cbH-o",
      },
      {
        mapName: "Building M",
        ownerName: "m0dE",
        position: {},
        index: 407,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://fastly.picsum.photos/id/719/200/200.jpg?hmac=WkMnZveCKylVzw33Ui-BNFbah8IQWImYq68wVKznlEo",
      },
      {
        mapName: "Building N",
        ownerName: "m0dE",
        position: {},
        index: 1135,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://picsum.photos/400/100",
      },
      {
        mapName: "Building O",
        ownerName: "m0dE",
        position: {},
        index: 598,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://fastly.picsum.photos/id/264/200/200.jpg?hmac=O4sRY3iZeFvmPRuanICCCZi-CDz0HdRHMsHttvNCgmw",
      },
      {
        mapName: "Building P",
        ownerName: "m0dE",
        position: {},
        index: 716,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://fastly.picsum.photos/id/590/200/200.jpg?hmac=Z5g54UWkuML96A-q7x7wX6LDuVGFdHQrEYEsU2CIM1U",
      },
    ];
    window.addEventListener(
      "storage",
      this.handleLocalStorageChange.bind(this)
    );

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css";
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
    modal.classList.add(
      "fixed",
      "inset-0",
      "flex",
      "items-center",
      "justify-center",
      "bg-black",
      "bg-opacity-50"
    );

    // Create modal content
    modal.innerHTML = `
      <div id="modal" class="modal-content bg-white rounded-lg p-8">
        <span class="close absolute top-0 right-0 m-4 text-gray-600 cursor-pointer">&times;</span>
        <h2 class="text-2xl font-bold">${tileInfo.mapName}</h2>
        <p class="text-lg">Owner: ${tileInfo.ownerName}</p>
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
    const camera = this.cameras.main;
    camera.setBackgroundColor("#1883fd");

    camera.centerOn(widthInPixels / 2, heightInPixels / 2);
    camera.setZoom(1.5);

    // Create the tooltip
    this.tooltip = this.add.text(0, 0, "", {
      font: "16px Arial",
      color: "#fff", // Black text color
      backgroundColor: "rgba(0,0,0,0.8)", // White background color
      padding: {
        x: 10,
        y: 5
      },
      // cornerRadius: 10 // Rounded corners
    });
    
    this.tooltip.setAlpha(0);

    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      const maxZoom = (20 * 16) / tilemap.tileWidth;
      const minZoom = (0.5 * 16) / tilemap.tileWidth;
      let targetZoom;
      if (deltaY < 0) targetZoom = camera.zoom * 1.2;
      else targetZoom = camera.zoom / 1.2;
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

    //@ts-ignore
    const hoveredTile = tilemap.getTileAt(pointerTileX, pointerTileY);
    if (hoveredTile) {
      if (this.input.manager.activePointer.leftButtonDown()) {
        if (!document.getElementById("modal")) {
          //@ts-ignore
          const hoveredTileIndex = hoveredTile.id;
          const clickedTileInfo = this.tileInfoArray.find(
            //@ts-ignore
            (tileInfo) => tileInfo.index === hoveredTileIndex
          );
          clickedTileInfo.position = { x: pointerTileX, y: pointerTileY };
          //@ts-ignore
          clickedTileInfo.mousePointer = { x: worldPoint.x, y: worldPoint.y };
          // console.log(238, hoveredTileInfo);
          const event = new CustomEvent("tileClick", { detail: clickedTileInfo });
          window.dispatchEvent(event);
          // this.openModal(hoveredTileInfo);
          console.log("click on tile:", pointerTileX, pointerTileY);
          // Hide tooltip on click
          this.tooltip.setAlpha(0);
          // Open game link
        }
      } else {
        //@ts-ignore
        const hoveredTileIndex = hoveredTile.id;
        const hoveredTileInfo = this.tileInfoArray.find(
          //@ts-ignore
          (tileInfo) => tileInfo.index === hoveredTileIndex
        );
        hoveredTileInfo.position = { x: pointerTileX, y: pointerTileY };
        const event = new CustomEvent("tileHover", { detail: hoveredTileInfo });
        window.dispatchEvent(event);

        hoveredTileInfo.position = { x: pointerTileX, y: pointerTileY };

        if (hoveredTileInfo) {
          const tooltipText = `Map Name: ${hoveredTileInfo.mapName}\nOwner: ${hoveredTileInfo.ownerName}\nPosition: (${String(hoveredTile.x)}, ${String(hoveredTile.y)})`;
          const tileScreenPos = tilemap.tileToWorldXY(hoveredTile.x, hoveredTile.y);
          this.tooltip.setText(tooltipText);
          this.tooltip.setPosition(tileScreenPos.x - this.tooltip.width / 2 + 10, tileScreenPos.y - 72);
          if (!document.getElementById("modal")) {
            this.tooltip.setAlpha(1);
          }
        } else {
          this.tooltip.setAlpha(0); // Hide tooltip if no tile information found
        }
        hoveredTile.setAlpha(0.75);
      }
    } else {
      const event = new Event("noTileHover");
      window.dispatchEvent(event);
      this.tooltip.setAlpha(0); // Hide tooltip if not hovering over a tile
    }
  }
}
