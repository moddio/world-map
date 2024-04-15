const tiles = require('../../assets/images/tiles.png')
export default class LoaderScene extends Phaser.Scene {
  public preload() {
    this.load.image("tiles", tiles);
	this.load.image('cloud', 'https://cache.modd.io/asset/spriteImage/1713188798417_new_cloud_01.png'/*'../../assets/images/new_cloud_01.png'*/);
  }

  public create() {
    this.scene.start("game");
  }
}
