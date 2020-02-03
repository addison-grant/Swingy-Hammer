import Phaser from "phaser";
//import hammerHandleImg from "./assets/hammer/hammer_handle.png";
//import hammerHeadImg from "./assets/hammer/hammer_head.png";
import hammerImg from "./assets/hammer.png";
import handImg from "./assets/hand.png";
import nailImg from "./assets/nail.png";
//import hammer from './hammer';

const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 600;

const Matter = Phaser.Physics.Matter.Matter;
const MatterImage = Phaser.Physics.Matter.MatterImage;
const Constraint = Matter.Constraint;
const World = Matter.World;
const Body = Matter.Body;

const config = {
  type: Phaser.AUTO,
  width: WORLD_WIDTH,
  height: WORLD_HEIGHT,
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

const handleWidth = 180;
const handleHeight = 20;
const headHeight = 100;
const headWidth = 20;

const hammerWidth = handleWidth + headWidth;
const handleOffsetX = handleWidth / 2;
const headOffsetX = handleWidth + headWidth / 2;

/**
 * TODO:
 * Nail
 * Breakables
 * Points
 */

new Phaser.Game(config);

function preload() {
  this.load.image("hammer", hammerImg);
  //this.load.image("hammerHead", hammerHeadImg);
  //this.load.image("hammerHandle", hammerHandleImg);
  this.load.image("hand", handImg);
  this.load.image("nail", nailImg);
}

function create() {
  this.matter.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  const hammerHandle =
   Matter.Bodies.rectangle(handleOffsetX, headHeight/2, handleWidth, handleHeight, {
     label: "Hammer handle"
  });
  const hammerHead =
    Matter.Bodies.rectangle(headOffsetX, headHeight/2, headWidth, headHeight, {
      label: "Hammer head"
      //density: 0.001//,
      //frictionAir: 0.3
  });

  /* const hammerImage = this.add.image(0, 0, 'hammer');
  const container = this.add.container(400, 300, [ hammerHandle, hammerHead, hammerImage ]);
  const hammer = this.matter.add.gameObject(container); */

  const start = {x: 400, y: 300};

  const hammer = this.matter.add.image(start.x, start.y, 'hammer', null, {
    label: 'Composite hammer',
    parts: [
      hammerHead,
      hammerHandle
    ]//,
    //density: 0,
    //isSensor: true
  });
  // Matter.Body.translate(hammer.body, start);

const nail = this.matter.add.image(500, 500, 'nail', null, {
  label: 'Nail',
  onCollideCallback: (pair) => console.log(pair)
});
nail.setScale(0.1);


  // const hammerScale = 0.5;
  // hammer.setDisplaySize(50,25);
  // Matter.Body.scale(hammer.body, hammerScale, hammerScale)

  const hand = this.matter.add.image(start.x, start.y, 'hand', null, {
    density: 0,
    ignoreGravity: true,
    collisionFilter: {
      mask: 0
    }/*,
    isSensor: true*/
  });
  Matter.Body.setStatic(hand.body, true);

  //var handAndHammer = new Composite.create({label: 'Hand and Hammer'});


  const hammerConstraint = Constraint.create({
    bodyA: hand.body,
    //pointA: {x: 0, y: 0},
    bodyB: hammer.body,
    pointB: {x: -(hammerWidth / 2), y: 0},
    stiffness: 0.7,
    length: 0/*,
    damping: 0.1*/
  });

  World.add(this.matter.world.localWorld, [hammerConstraint]);

  // Pointer lock will only work after an 'engagement gesture', e.g. mousedown, keypress, etc.
  this.input.on('pointerdown', function (pointer) {
    this.input.mouse.requestPointerLock();
  }, this);

  // When locked, you will have to use the movementX and movementY properties of the pointer
  // (since a locked cursor's xy position does not update)
  this.input.on('pointermove', function (pointer) {
    if (this.input.mouse.locked) {
        const marginX = hand.width / 2;
        const marginY = hand.height / 2;

        /*
        hammerConstraint.pointA.x = Math.max(0 + marginX, Math.min(pointer.movementX + hammerConstraint.pointA.x, WORLD_WIDTH - marginX));
        hammerConstraint.pointA.y = Math.max(0 + marginY, Math.min(pointer.movementY + hammerConstraint.pointA.y, WORLD_HEIGHT - marginY));
        */

        //Matter.Body.translate(hand.body, {x: pointer.movementX, y: pointer.movementY})
        hand.x = Math.max(0 + marginX, Math.min(pointer.movementX + hand.x, WORLD_WIDTH - marginX));
        hand.y = Math.max(0 + marginY, Math.min(pointer.movementY + hand.y, WORLD_HEIGHT - marginY));
    }
  }, this);
}
