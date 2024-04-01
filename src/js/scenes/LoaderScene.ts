export default class LoaderScene extends Phaser.Scene {
  public preload() {
    this.load.image("tiles", "./assets/images/tiles.png");
  }

  public create() {
    this.scene.start("game");
  }
}
