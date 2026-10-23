import p5 from 'p5';

import { AutonomousNodeEconomy } from './engine/AutonomousNodeEconomy';
import { NodeGroup } from './engine/NodeGroup';
import { Node } from './engine/Node';
import { ManualColorPallet } from './engine/customcolorpallets/ManualColorPallet';

// motivations
import { MagnetMotivation } from './engine/custommotivations/MagnetMotivation';
import { MagnetRandomMotivation } from './engine/custommotivations/MagnetRandomMotivation';
import { MagnetPairMotivation } from './engine/custommotivations/MagnetPairMotivation';
import { MagnetChainMotivation } from './engine/custommotivations/MagnetChainMotivation';

import { SineXMotivation } from './engine/custommotivations/SineXMotivation';
import { SineYMotivation } from './engine/custommotivations/SineYMotivation';

import { RandomXMotivation } from './engine/custommotivations/RandomXMotivation';
import { RandomYMotivation } from './engine/custommotivations/RandomYMotivation';

import { TowardsXMotivation } from './engine/custommotivations/TowardsXMotivation';
import { TowardsYMotivation } from './engine/custommotivations/TowardsYMotivation';

import { FollowFarthestMotivation } from './engine/custommotivations/FollowFarthestMotivation';
import { CircularMotivation } from './engine/custommotivations/CircularMotivation';
import { SocialPersonalMotivation } from './engine/custommotivations/SocialPersonalMotivation';
import { SocialVisibleMotivation } from './engine/custommotivations/SocialVisibleMotivation';

import { AgingHealthMotivation } from './engine/customhealthmotivations/AgingHealthMotivation';

// visualizations
import { SpeedCircleDrawVisualization } from './engine/customvisualizations/SpeedCircleDrawVisualization';
import { SpeedCircleVisualization } from './engine/customvisualizations/SpeedCircleVisualization';
import { SpeedSquareVisualization } from './engine/customvisualizations/SpeedSquareVisualization';
import { PixelVisualization } from './engine/customvisualizations/PixelVisualization';
import { NodeMotivationVisualization } from './engine/customvisualizations/NodeMotivationVisualization';
import { NeighborVisualization } from './engine/customvisualizations/NeighborVisualization';

// restrictions
import { MaxSpeedRestriction } from './engine/customrestrictions/MaxSpeedRestriction';
import { MinSpeedRestriction } from './engine/customrestrictions/MinSpeedRestriction';
import { BoundingBoxKillRestriction } from './engine/customrestrictions/BoundingBoxKillRestriction';
import { BoundingBoxWrapRestriction } from './engine/customrestrictions/BoundingBoxWrapRestriction';
import { BoundingBoxRandomJumpRestriction } from './engine/customrestrictions/BoundingBoxRandomJumpRestriction';

// base variables
const WIDTH = 640;
const HEIGHT = 640;
const MULTIFRAME_RENDER = false;
const INITIAL_NODE_COUNT = 20; // must be even because of MagnetPairMotivation pairing

const downloadFile = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const sketch = (p: p5) => {
  let autonomousNodeEconomy: AutonomousNodeEconomy | null = null;
  let saveFileName = '';
  let animationPaused = false;

  p.setup = () => {
    p.createCanvas(WIDTH, HEIGHT);
    // p.background(40, 40, 60);

    // --- set up the color pallet (background white index 0, foreground black index 1)
    const colorPallet = new ManualColorPallet();
    // Pink 2 Blue
    // colorPallet.addColor(35, 201, 255);
    // colorPallet.addColor(124, 198, 254);
    // colorPallet.addColor(202, 213, 255);
    // colorPallet.addColor(231, 187, 227);
    // colorPallet.addColor(200, 132, 166);

    // Oragnie
    colorPallet.addColor(0, 48, 73);
    colorPallet.addColor(56, 4, 14);
    colorPallet.addColor(214, 40, 40);
    colorPallet.addColor(247, 147, 0);
    colorPallet.addColor(252, 191, 73);
    colorPallet.addColor(234, 226, 183);

    // red
    // colorPallet.addColor(37, 9, 2);
    // colorPallet.addColor(56, 4, 14);
    // colorPallet.addColor(100, 13, 20);
    // colorPallet.addColor(173, 40, 49);
    // colorPallet.addColor(128, 14, 19);
    // colorPallet.addColor(203, 65, 74);
    // colorPallet.addColor(234, 97, 106);
    // colorPallet.addColor(255, 163, 169);

    // Green 
    colorPallet.addColor(52, 78, 65);
    colorPallet.addColor(58, 90, 64);
    colorPallet.addColor(88, 129, 87);
    colorPallet.addColor(163, 177, 138);
    colorPallet.addColor(218, 215, 205);


    // --- create the node group and economy
    const nodeGroup = new NodeGroup();
    autonomousNodeEconomy = new AutonomousNodeEconomy(nodeGroup, colorPallet);

    // --- populate the node group
    for (let i = 0; i < INITIAL_NODE_COUNT; i++) {
      // Populate nodes on the canvas
      const newNode = new Node(p.random(0, p.width), p.random(0, p.height), 100);
      // const newNode = new Node((p.width / 2), p.random(0, p.height), 100);
      // const newNode = new Node((p.width / 2.6), (p.height / 3.6), 100);

      // MOTIVATIONS ///////////////
      newNode.addMotivation(new MagnetMotivation(90, 90, .9, .9))
      // magnet: Node | null, scaleX, scaleY, dampeningX, dampeningY;

      newNode.addMotivation(new MagnetPairMotivation(200, 200, 0.4, 0.1));
      // scaleX = 600, scaleY = 700, dampeningX = 0.964, dampeningY = 0.964

      newNode.addMotivation(new MagnetChainMotivation(100, 100, .7, .7));
      // scaleX = 5, scaleY = 5, dampeningX = 0.964, dampeningY = 0.964

      // newNode.addMotivation(new MagnetRandomMotivation(9, 40, .1, .01));
      // scaleX = 50, scaleY = 50, dampeningX = 0.964, dampeningY = 0.964

      // newNode.addMotivation(new SocialPersonalMotivation(10, .8));
      // newNode.addMotivation(new SocialVisibleMotivation(700, .9));
      // personalRadius: number, strength: number

      // newNode.addMotivation(new SineXMotivation(100, 100, .08))
      // newNode.addMotivation(new SineYMotivation(400, -200, .008))
      // amplitude, phase, dampening

      // newNode.addMotivation(new RandomXMotivation(8));
      // newNode.addMotivation(new RandomYMotivation(1));
      // amount

      // newNode.addMotivation(new TowardsXMotivation(p.width / 2, .0009));
      // newNode.addMotivation(new TowardsYMotivation(p.height / 2, .00009));
      // targetX, strength

      // newNode.addMotivation(new FollowFarthestMotivation())
      // visibleRadius: number, strength: number

      // newNode.addMotivation(new CircularMotivation(4, 400));
      // radius: number, angle: number

      newNode.addMotivation(new AgingHealthMotivation(.8));

      // RESTRICTIONS ///////////////
      // nodeGroup.addNodeRestriction(new BoundingBoxRandomJumpRestriction(0, 0, p.width, p.height))
      // nodeGroup.addNodeRestriction(new BoundingBoxWrapRestriction(0, 0, p.width, p.height))
      // nodeGroup.addNodeRestriction(new BoundingBoxKillRestriction(0, p.height, p.width, 40))
      nodeGroup.addNodeRestriction(new BoundingBoxKillRestriction(0, 0, p.width, p.height))
      // nodeGroup.addNodeRestriction(new MaxSpeedRestriction())
      // nodeGroup.addNodeRestriction(new MinSpeedRestriction())

      // VISUALIZATIONS ////////////
      // newNode.addVisualization(new PixelVisualization(p, colorPallet, 5, 100));
      // // ... index, alpha

      newNode.addVisualization(new NeighborVisualization(p, colorPallet, 400, 80, false));
      // // neighborRadius, maxAlpha: number, toggleEnabled: boolean
      //
      // newNode.addVisualization(new NodeMotivationVisualization(p, colorPallet, 2, 10, 3, 80, 7, 40));
      // // ... bodyRadius, dirScale, bodyColorIndex, bodyColorAlpha,lineColorIndex, lineColorAlpha
      //
      // newNode.addVisualization(
      //   new SpeedCircleDrawVisualization(
      //     p,
      //     colorPallet,
      //     4,  // scalingFactor
      //     0,  // angle
      //     1,
      //     // (Math.pow(-1, Math.floor(p.random(0, 10))) / 1.2),
      //     1,  // strokeColorIndex
      //     1,  // strokeColorAlpha
      //     1,  // strokeColorWidth
      //     8,  // fillColorIndex
      //     20, // fillColorAlpha
      //     0   // fillColorWidth
      //   )
      // );
      //
      // newNode.addVisualization(new SpeedSquareVisualization(p, colorPallet, .6, 1, 100, 4, 0));
      // newNode.addVisualization(new SpeedCircleVisualization(p, colorPallet, 4, 1, 10, 4, 100));
      // // p, colorPallet, scalingFactor, strokeColorIndex, strokeColorAlpha, fillColorIndex, fillColorAlpha
      //

      nodeGroup.addNode(newNode);
    }

    // --- initialize the node group
    nodeGroup.initialize();

    // --- clear the canvas and start drawing
    // p.background(...colorPallet.getColor(0, 32));
    p.loop();

    saveFileName = `nodes_${Date.now()}`;
  };

  p.draw = () => {
    if (!autonomousNodeEconomy) return;

    // render a single frame of the node group
    autonomousNodeEconomy.nodeGroup.render();

    // remove any unhealthy nodes after rendering a frame
    autonomousNodeEconomy.nodeGroup.removeUnhealthyNodes();

    // reset the drawing if necessary
    if (!autonomousNodeEconomy.nodeGroup.isGroupMoving()) {
      console.log(`Done rendering frame ${Date.now()}`);
      if (!MULTIFRAME_RENDER) {
        p.noLoop();
      } else {
        p.setup();
      }
    }
  };

  p.keyPressed = () => {
    if (p.key === undefined || p.key.length !== 1) return;
    const key = p.key;
    switch (key) {
      case 'r': // restart animation
        if (autonomousNodeEconomy) {
          p.setup();
          p.loop();
        }
        break;
      case ' ': // pause
        animationPaused = !animationPaused;
        if (animationPaused) {
          p.noLoop();
        } else {
          p.loop();
        }
        break;
      case 's': // save current canvas
        if (autonomousNodeEconomy) {
          console.log('Saving image ...');
          const fileName = `${saveFileName}_${p.frameCount}`;
          p.saveCanvas(`${fileName}.png`, 'png');

          console.log(`... done: '${fileName}.png'`);
        }
        break;
      case 'i': // save current canvas
        if (autonomousNodeEconomy) {
          console.log('Saving info ...');
          const fileName = `${saveFileName}_${p.frameCount}`;

          const info = {
            nodeCount: autonomousNodeEconomy.nodeGroup.getNodeCount(),
            canvas: { width: WIDTH, height: HEIGHT },
            motivations: ['MagnetRandomMotivation(8, 8, 0.04, 0.04)'],
            visualizations: ['PixelVisualization(index=5, alpha=20)'],
            restrictions: [],
          };
          const jsonBlob = new Blob([JSON.stringify(info, null, 2)], {
            type: 'application/json',
          });
          downloadFile(jsonBlob, `${fileName}.json`);
          console.log(`... done: '${fileName}.json'`);
        }
        break;
      case 'c': // clear canvas, but keep nodes in current state
        if (autonomousNodeEconomy) {
          p.background(...autonomousNodeEconomy.colorPallet.getColor(0, 255));
        }
        break;
      default:
      // do nothing
    }
  };
};

new p5(sketch);
