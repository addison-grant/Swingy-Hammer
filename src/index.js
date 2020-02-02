import Phaser from "phaser";
import hammerHandleImg from "./assets/hammer/hammer_handle.png";
import hammerHeadImg from "./assets/hammer/hammer_head.png";
import hammerImg from "./assets/hammer.png";
import handImg from "./assets/hand.png";
//import hammer from './hammer';

const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 600;

const Matter = Phaser.Physics.Matter.Matter;
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

/**
 * TODO:
 * Nail
 * Breakables
 * Points
 */

const game = new Phaser.Game(config);

function preload() {
  this.load.image("hammer", hammerImg);
  this.load.image("hammerHead", hammerHeadImg);
  this.load.image("hammerHandle", hammerHandleImg);
  this.load.image("hand", handImg);
}

function create() {


  this.matter.world.setBounds(0, 0, 800, 600, 10000);

  //const hammerHandle = this.matter.

  /*
  const hammerHandle = this.matter.add.image(400, 300, 'hammerHandle');
  hammerHandle.setSize(180, 30);
  const hammerHead = this.matter.add.image(400, 300, 'hammerHead');
  hammerHead.setSize(20, 100);
  */

    const handleWidth = 180;
    const handleHeight = 20;
    const headHeight = 90;
    const headWidth = 20;

  const totalLength = handleWidth + headWidth;
  const handleOffsetX = handleWidth / 2;
  const headOffsetX = handleWidth + headWidth / 2;
  const hammerHandle =
   Matter.Bodies.rectangle(handleOffsetX, 0, handleWidth, handleHeight);
  const hammerHead =
    Matter.Bodies.rectangle(headOffsetX, 0, headWidth, headHeight, {
      density: 0.003//,
      //frictionAir: 0.3
    }
  );

  /*
  const hammerBody = Body.create({
    parts: [
      hammerHandle,
      hammerHead
    ]
  });
  World.add(this.matter.world.localWorld, hammerBody);
  */

  const hammer = this.matter.add.image(0, 0, 'hammer', null, {
    parts: [
      hammerHead,
      hammerHandle
    ]
  });
  const hand = this.matter.add.image(400, 300, 'hand').setIgnoreGravity(true);
  Matter.Body.setStatic(hand.body, true);
  hand.body.isSensor = true;

  //var handAndHammer = new Composite.create({label: 'Hand and Hammer'});

  const hammerConstraint = Constraint.create({
//    bodyA: hand.body,
    pointA: {x: 300, y: 300},
    bodyB: hammer.body,
    pointB: {x: -(totalLength) / 2, y: 0},
    stiffness: 0.7,
    length: 0//,
    //damping: 0.1
  });

  World.add(this.matter.world.localWorld, [hammerConstraint]);
  //World.add(this.matter.world.localWorld, [hand.body, hammer.body, hammerConstraint]);

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

        hammerConstraint.pointA.x = Math.max(0 + marginX, Math.min(pointer.movementX + hammerConstraint.pointA.x, WORLD_WIDTH - marginX));
        hammerConstraint.pointA.y = Math.max(0 + marginY, Math.min(pointer.movementY + hammerConstraint.pointA.y, WORLD_HEIGHT - marginY));


        //Matter.Body.translate(hand.body, {x: pointer.movementX, y: pointer.movementY})
        hand.x = Math.max(0 + marginX, Math.min(pointer.movementX + hand.x, WORLD_WIDTH - marginX));
        hand.y = Math.max(0 + marginY, Math.min(pointer.movementY + hand.y, WORLD_HEIGHT - marginY));
    }
  }, this);
}
