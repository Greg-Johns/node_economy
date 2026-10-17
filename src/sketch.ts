import p5 from 'p5';

import { AutonomousNodeEconomy } from './engine/AutonomousNodeEconomy';
import { NodeGroup } from './engine/NodeGroup';
import { Node } from './engine/Node';
import { ManualColorPallet } from './engine/customcolorpallets/ManualColorPallet';
import { MagnetPairMotivation } from './engine/custommotivations/MagnetPairMotivation';
import { SocialPersonalMotivation } from './engine/custommotivations/SocialPersonalMotivation';
import { CircularMotivation } from './engine/custommotivations/CircularMotivation';
import { SpeedCircleDrawVisualization } from './engine/customvisualizations/SpeedCircleDrawVisualization';
import { PixelVisualization } from './engine/customvisualizations/PixelVisualization';
import { NeighborVisualization } from './engine/customvisualizations/NeighborVisualization';
const WIDTH = 640;
const HEIGHT = 640;
const INITIAL_NODE_COUNT = 700; // must be even because of MagnetPairMotivation pairing
const MULTIFRAME_RENDER = false;

const sketch = (p: p5) => {
  let autonomousNodeEconomy: AutonomousNodeEconomy | null = null;
  let saveFileName = '';
  let animationPaused = false;

  p.setup = () => {
    p.createCanvas(WIDTH, HEIGHT);
    p.background(255);

    // --- set up the color pallet (background white index 0, foreground black index 1)
    const colorPallet = new ManualColorPallet();
    colorPallet.addColor(255, 255, 255);
    colorPallet.addColor(0, 0, 0);
    colorPallet.addColor(80, 80, 100);
    colorPallet.addColor(200, 80, 10);
    colorPallet.addColor(20, 200, 90);
    colorPallet.addColor(20, 20, 200);

    // --- create the node group and economy
    const nodeGroup = new NodeGroup();
    autonomousNodeEconomy = new AutonomousNodeEconomy(nodeGroup, colorPallet);

    // --- populate the node group
    for (let i = 0; i < INITIAL_NODE_COUNT; i++) {
      const newNode = new Node(p.random(0, p.width), p.random(0, p.height), 100);

      // motivations for the node's movement
      newNode.addMotivation(new MagnetPairMotivation(400, 700, 0.94, 0.9));
      // scaleX = 600,
      // scaleY = 700,
      // dampeningX = 0.964,
      // dampeningY = 0.964

      newNode.addMotivation(new SocialPersonalMotivation(90, .7));

      // newNode.addMotivation(new CircularMotivation(2, 109));
      // public radius: number;
      // public angle: number;

      // visualizations
      newNode.addVisualization(new PixelVisualization(p, colorPallet, 2, 70));
      //   public index: number;
      //   public alpha: number;

      newNode.addVisualization(new NeighborVisualization(p, colorPallet, 10, 60, false));
      //   public neighborRadius: number;
      //   public maxAlpha: number;
      //   public toggleEnabled: boolean;

      // newNode.addVisualization(
      //   new SpeedCircleDrawVisualization(
      //     p,
      //     colorPallet,
      //     1, // scalingFactor
      //     0,  // angle
      //     2,
      //     // (Math.pow(-1, Math.floor(p.random(0, 10))) / 1.2),
      //     0,  // strokeColorIndex
      //     100,  // strokeColorAlpha
      //     0, // strokeColorWidth
      //     2,  // fillColorIndex
      //     20,  // fillColorAlpha
      //     1   // fillColorWidth
      //   )
      // );

      nodeGroup.addNode(newNode);
    }

    // --- initialize the node group
    nodeGroup.initialize();

    // --- clear the canvas and start drawing
    // p.background(...colorPallet.getColor(0, 232));
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
          const fileName = `${saveFileName}_${p.frameCount}.png`;
          p.saveCanvas(fileName, 'png');
          console.log(`... done: '${fileName}'`);
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
