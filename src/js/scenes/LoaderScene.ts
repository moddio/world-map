import tiles from "../../assets/images/tiles.png"
export default class LoaderScene extends Phaser.Scene {
  public preload() {
    this.load.image("tiles", tiles);
  }

  public create() {
    this.scene.start("game");
  }
}
