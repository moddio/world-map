const tiles = require('../../assets/images/tiles.png');
const cloud1 = require('../../assets/images/Clouds_1.png');
const cloud2 = require('../../assets/images/Clouds_2.png');
const cloud3 = require('../../assets/images/Clouds_3.png');
const cloud4 = require('../../assets/images/Clouds_4.png');
const cloud5 = require('../../assets/images/Clouds_5.png');
const cloud6 = require('../../assets/images/Clouds_6.png');
const user = require('../../assets/images/icon.png')
export default class LoaderScene extends Phaser.Scene {
  public preload() {
    this.load.image('tiles', tiles);
    this.load.image('cloud1', cloud1);
    this.load.image('cloud2', cloud2);
    this.load.image('cloud3', cloud3);
    this.load.image('cloud4', cloud4);
    this.load.image('cloud5', cloud5);
    this.load.image('cloud6', cloud6);
    this.load.image('user', user);

    this.load.plugin('rexpinchplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexpinchplugin.min.js', true);
  }

  public create() {
    this.scene.start('game');
  }
}
