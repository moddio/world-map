const tiles = require('../../assets/images/tiles.png');
const shadowClouds = require('../../assets/images/new_cloud_01.png');
export default class LoaderScene extends Phaser.Scene {
  public preload() {
    this.load.image('tiles', tiles);
    this.load.image(
      'cloud',
      shadowClouds /*'../../assets/images/new_cloud_01.png'*/
    );
  }

  public create() {
    this.scene.start('game');
  }
}
