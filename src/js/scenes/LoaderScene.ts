export default class LoaderScene extends Phaser.Scene {
  public preload() {
    this.load.image("tiles", "./assets/images/tiless.png");
  }

  public create() {
    this.scene.start("game");
  }
}
