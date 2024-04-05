import { tilemapjson } from "../../assets/tilemaps/tilemap";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default class GameScene extends Phaser.Scene {
  // @ts-ignore
  tilemap: Phaser.Tilemaps.Tilemap;
  tileSize: number = 64;
  //@ts-ignore
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
  //@ts-ignore
  tooltip: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "game", active: false, visible: false });

    // Sample data for tile information
    this.tileInfoArray = [
      {
        type: 'Dungeon',
        mapName: "Ancient Catacombs",
        ownerName: "m0dE",
        position: {},
        dateCreated: '1/1/1970',
        mousePointer: {},
        index: 789,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl2zp7hVtTShkmSLWHTH4IvNd14z-RtFptwf6I5dPWCw&s",
        description: "Deep within the bowels of the earth lie the Ancient Catacombs, an ominous labyrinth steeped in mystery and peril. Brave adventurers who dare to tread its shadowy corridors may uncover long-forgotten treasures concealed within its ancient walls. But beware, for the Catacombs hold secrets untold and dangers unseen, with every step fraught with the risk of awakening ancient curses or encountering lurking monstrosities. The air is heavy with the weight of centuries, echoing with the whispers of the past and the ominous creaking of unseen terrors. Only the boldest souls dare to venture into the depths of the Catacombs, driven by the allure of riches and the thrill of uncovering the unknown."
      },
      {
        type: 'Dungeon',
        mapName: "Mystic Caverns",
        ownerName: "m0dE",
        position: {},
        dateCreated: '1/1/1970',
        mousePointer: {},
        index: 333,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d3739608-5eda-4e4f-9f45-b6c9dcbb974f/d7n0iq7-37a2ee0b-eae4-451e-9158-b8d1879b2102.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTpmaWxlLmRvd25sb2FkIl0sIm9iaiI6W1t7InBhdGgiOiIvZi9kMzczOTYwOC01ZWRhLTRlNGYtOWY0NS1iNmM5ZGNiYjk3NGYvZDduMGlxNy0zN2EyZWUwYi1lYWU0LTQ1MWUtOTE1OC1iOGQxODc5YjIxMDIucG5nIn1dXX0.Vaud1pl28zNLpcJ0Mx1WkxjvxgLILMDbd-lQow3s-Tw",
        description: "Delve into the heart of the Mystic Caverns, where the very air hums with arcane energy and the walls are adorned with ancient runes of power. As you navigate the twisting passages, illuminated only by the faint glow of luminescent fungi, you can feel the presence of long-forgotten magic lingering in the shadows. Whispers of bygone enchantments echo through the cavernous chambers, hinting at the existence of hidden treasures and mystical relics waiting to be unearthed. But tread carefully, for the Mystic Caverns are not without their perils. Dark creatures, drawn to the residual magic that permeates the air, lurk in the shadows, ready to defend their territory against intruders. Yet, for those who possess the courage and wisdom to decipher the ancient runes and evade the dangers that lie in wait, the Mystic Caverns promise untold riches and the discovery of powerful artifacts that have long been lost to time."
      },
      {
        type: 'Dungeon',
        mapName: "Shadowy Labyrinth",
        ownerName: "m0dE",
        position: {},
        dateCreated: '1/1/1970',
        mousePointer: {},
        index: 428,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://imagedelivery.net/9sCnq8t6WEGNay0RAQNdvQ/UUID-cl8sbu5mf2462ghqyf4sdvflv/public",
        description: "Embark on a perilous journey through the twisting passages of the Shadowy Labyrinth, where darkness reigns supreme and the echoes of lost souls haunt the air. The labyrinthine corridors wind endlessly, each turn leading deeper into the abyss, where the very walls seem to close in around you, suffocating in their oppressive embrace. As you navigate the labyrinth's treacherous twists and turns, shadows dance and flicker in the dim light, obscuring the path ahead and distorting reality. Whispers of long-forgotten voices echo through the darkness, their mournful tones serving as a grim reminder of the countless souls who have perished within these cursed halls. Yet, it is not only the specters of the past that you must contend with, for hidden dangers lurk around every corner."
      },
      {
        type: 'Dungeon',
        mapName: "Forgotten Crypts",
        ownerName: "m0dE",
        position: {},
        dateCreated: '1/1/1970',
        mousePointer: {},
        index: 817,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://img6.arthub.ai/63e158ff-5cf3.webp",
        description: "Descend into the chilling depths of the Forgotten Crypts, where the echoes of centuries past reverberate through the stale air and the flickering torchlight casts eerie shadows upon the ancient walls. Here, beneath the earth's surface, lie the final resting places of kings and queens long forgotten by history, their tombs shrouded in mystery and guarded by the silent sentinels of the underworld. As you navigate the labyrinthine corridors of the crypts, the cold touch of death seems to seep into your very bones, a constant reminder of the grim fate that awaits all who dare to disturb the slumber of the dead. The walls are adorned with faded murals and inscriptions, their meanings lost to the sands of time, while the floors are littered with the dust of ages and the scattered remnants of long-forgotten rituals. But it is not only the bones of ancient monarchs that lie within these cursed halls. Cursed artifacts and forbidden relics, imbued with dark magic and untold power, lurk amidst the shadows, waiting to ensnare the unwary and unleash their malevolent influence upon the world once more. Yet, despite the dangers that lurk within the depths of the Forgotten Crypts, there are those who dare to brave its haunted halls in search of riches and forbidden knowledge. For beneath the veil of darkness lies the promise of untold treasures and the opportunity to unravel the secrets of the past, if only one has the courage to delve deep enough into the heart of the crypts and face the horrors that lie in wait."
      },
      {
        type: 'Ruins',
        mapName: "Lost City of Eldoria",
        ownerName: "m0dE",
        position: {},
        dateCreated: '1/1/1970',
        mousePointer: {},
        index: 560,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/353c3b44-c495-4aaf-a970-9c1967d5ca56/dexzcm5-541899f5-d743-4724-b6eb-a7dd5fe27170.jpg/v1/fill/w_1280,h_1280,q_75,strp/ruins_in_the_forest__rpg_map__by_ndvmaps_dexzcm5-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcLzM1M2MzYjQ0LWM0OTUtNGFhZi1hOTcwLTljMTk2N2Q1Y2E1NlwvZGV4emNtNS01NDE4OTlmNS1kNzQzLTQ3MjQtYjZlYi1hN2RkNWZlMjcxNzAuanBnIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.qeJOr9ik1jNEmOCvfr-cgVjbVWxhK8hr03S6vNQyKlw",
        description: "Embark upon a harrowing journey through the Shadowy Labyrinth, a labyrinthine maze of darkness and despair where the very walls seem to whisper secrets of forgotten tragedies. With each step, the oppressive darkness presses in, obscuring your path and distorting your senses. Echoes of lost souls reverberate through the winding corridors, their mournful cries serving as a grim reminder of the perils that await within. Beware, for the Shadowy Labyrinth is rife with hidden dangers, its twisting passages concealing traps and pitfalls designed to ensnare the unwary traveler."
      },
      {
        type: 'Ruins',
        mapName: "Ancient Temple Ruins",
        ownerName: "m0dE",
        position: {},
        dateCreated: '1/1/1970',
        mousePointer: {},
        index: 407,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://runefoundry.com/cdn/shop/products/ForestEncampment_digital_day_grid.jpg?v=1676584019",
        description: "Venture forth into the overgrown pathways of the Ancient Temple Ruins, where nature has reclaimed the remnants of a once-great civilization. Moss-covered statues stand sentinel amidst the tangled foliage, their weathered features bearing silent witness to the passage of centuries. Crumbling altars, once the focal points of sacred rites and ceremonies, now lie in ruin, their significance lost to the annals of time. As you traverse the winding pathways of the ruins, shafts of sunlight filter through the dense canopy overhead, casting dappled patterns of light and shadow upon the ancient stones."
      },
      {
        type: 'Forest',
        mapName: "Enchanted Woodlands",
        ownerName: "m0dE",
        position: {},
        dateCreated: '1/1/1970',
        mousePointer: {},
        index: 1135,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://i.pinimg.com/474x/92/c3/a9/92c3a9f0c2d68bb9bc5b96c616d4f608.jpg",
        description: "Step into the mystical beauty of the Enchanted Woodlands, a realm where time seems to stand still and the boundaries between the mundane and the magical blur into obscurity. Towering ancient trees, their gnarled branches reaching skyward, create a verdant canopy overhead, filtering the sunlight into a gentle, dappled glow that bathes the forest floor in an ethereal light. As you wander through the enchanted groves, the air is alive with the melodic symphony of birdsong and the rustle of leaves stirred by unseen breezes. Every corner of the woodlands teems with life, from the vibrant blooms of exotic flowers to the elusive creatures that flit between the shadows."
      },
      {
        type: 'Forest',
        mapName: "Whispering Grove",
        ownerName: "m0dE",
        position: {},
        dateCreated: '1/1/1970',
        mousePointer: {},
        index: 598,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://i0.wp.com/www.cuttlefishpress.com/wp-content/uploads/2021/04/Forest-Path-Tactical-Day.jpg?fit=2048%2C2048&ssl=1",
        description: "Enter the tranquil embrace of the Whispering Grove, where time seems to slow and the worries of the world fade into insignificance. Here, amidst the ancient trees and verdant foliage, a sense of serenity pervades the air, wrapping you in a comforting embrace that soothes the soul. As you wander through the sun-dappled glades of the grove, the gentle rustle of leaves and the soft murmurs of the wind create a symphony of natural sounds that lull you into a state of peaceful reverie. Shafts of golden sunlight filter through the canopy above, casting warm, inviting pools of light upon the forest floor. In the Whispering Grove, the boundaries between the mundane and the magical blur, and it's easy to lose yourself in the beauty of your surroundings. "
      },
      {
        type: 'Mountain',
        mapName: "Dragon's Peak",
        ownerName: "m0dE",
        position: {},
        dateCreated: '1/1/1970',
        mousePointer: {},
        index: 716,
        redirectUrl: "https://modd.io/play/LAD/",
        image: "https://image.cdn2.seaart.ai/2023-08-23/15132466942614533/de984fbdb0f900f3dd71ea13cb23e163eb5f13ea_high.webp",
        description: "Journey upward, through treacherous paths and winding trails, to the summit of Dragon's Peak, where the very air grows thin and the landscape takes on an otherworldly aura. Here, amid the craggy peaks and jagged cliffs, lies the lair of an ancient wyrm, a fearsome beast whose presence casts a shadow over the land below. As you ascend higher and higher, the terrain becomes increasingly inhospitable, with sheer drops and precarious ledges testing your resolve at every turn. Yet, the promise of adventure and the lure of untold treasures drive you onward, fueling your determination to reach the summit and face the dragon that dwells there. At last, you stand upon the windswept peak of Dragon's Peak, with the world spread out below you in a breathtaking panorama. But there is little time to admire the view, for the wyrm's lair lies just ahead, its entrance guarded by fearsome sentinels and ancient wards."
      }
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
        <p class="text-lg">Date Created: ${tileInfo.dateCreated}</p>
        <p class="text-lg">${tileInfo.description}</p>
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
      fontFamily: `'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif`,
      fontSize: "12px",
      color: "#fff", // Black text color
      backgroundColor: "rgba(0,0,0,0.8)", // White background color
      padding: {
        x: 10,
        y: 10,
      },
      // cornerRadius: 10 // Rounded corners
    });

    this.tooltip.setAlpha(0);

    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      const maxZoom = (20 * 16) / tilemap.tileWidth;
      const minZoom = (0.5 * 16) / tilemap.tileWidth;
      let targetZoom;

      if (deltaY < 0) {
        targetZoom = camera.zoom * 1.2;
        if (targetZoom < maxZoom) {
          let xDist = pointer.worldX - camera.midPoint.x;
          let yDist = pointer.worldY - camera.midPoint.y;
          camera.scrollX += xDist/6;
          camera.scrollY += yDist/6;
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
          // (tileInfo) => tileInfo.index === hoveredTileIndex
          clickedTileInfo.position = { x: pointerTileX, y: pointerTileY };
          clickedTileInfo.mousePointer = { x: worldPoint.x, y: worldPoint.y };
          const event = new CustomEvent("tileClick", { detail: clickedTileInfo });
          window.dispatchEvent(event);
          // this.openModal(hoveredTileInfo);
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
        hoveredTileInfo.mousePointer = { x: worldPoint.x, y: worldPoint.y };

        const event = new CustomEvent("tileHover", { detail: hoveredTileInfo });
        window.dispatchEvent(event);

        if (hoveredTileInfo) {
          const shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
          const shiftPressed = shiftKey.isDown;
          let tooltipText;
          const tileScreenPos = tilemap.tileToWorldXY(hoveredTile.x, hoveredTile.y);
          if (shiftPressed) {
            tooltipText = `Map Name: ${hoveredTileInfo.mapName}\nOwner: ${hoveredTileInfo.ownerName}\nDate Created: ${hoveredTileInfo.dateCreated}\nPosition: (${String(hoveredTile.x)}, ${String(hoveredTile.y)})`;
            this.tooltip.setPosition(tileScreenPos.x - this.tooltip.width / 2 + 10, tileScreenPos.y - 90);
          } else {
            tooltipText = `Map Name: ${hoveredTileInfo.mapName}\nOwner: ${hoveredTileInfo.ownerName}`;
            this.tooltip.setPosition(tileScreenPos.x - this.tooltip.width / 2 + 10, tileScreenPos.y - 54);
          }
          this.tooltip.setText(tooltipText);
          this.tooltip.setAlpha(1); 
        } else {
          const event = new CustomEvent("noTileHover", { detail: null });
        window.dispatchEvent(event);
          this.tooltip.setAlpha(0); 
        }
        hoveredTile.setAlpha(1);
      }
    } else {
      // const event = new Event("noTileHover");
      // window.dispatchEvent(event);
      this.tooltip.setAlpha(0); // Hide tooltip if not hovering over a tile
    }
  }
}
