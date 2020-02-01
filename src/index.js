import Phaser from "phaser";
import hammerImg from "./assets/hammer.png";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'matter',
      matter: {
          debug: true,
          gravity: {
              y: 1
          },
      }
  },
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("hammer", hammerImg);
}

function create() {

  this.matter.world.setBounds();
  var handle = this.matter.add.circle(200, 300, 10);
  var hammer = this.matter.add.image(400, 300, 'hammer');
  this.matter.add.constraint(handle, hammer, 150, 0.5);

  this.matter.add.mouseSpring();

}
