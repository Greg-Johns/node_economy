import p5 from 'p5';

import { AutonomousNodeEconomy } from './engine/AutonomousNodeEconomy';
import { NodeGroup } from './engine/NodeGroup';
import { Node } from './engine/Node';
import { ManualColorPallet } from './engine/customcolorpallets/ManualColorPallet';
import {
  createDefaultSimulationConfig,
  createMotivations,
  createRestrictions,
  createVisualizations,
  listEnabledFeatureDescriptions,
  mountSimulationControlPanel,
  sanitizeSimulationConfig,
  type SimulationConfig,
} from './ui/simulationControls';

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
  let activeConfig: SimulationConfig = createDefaultSimulationConfig(INITIAL_NODE_COUNT);
  let saveFileName = '';
  let animationPaused = false;
  let controlPanelMounted = false;
  let rebuildTimer: number | null = null;

  const createColorPallet = (): ManualColorPallet => {
    const colorPallet = new ManualColorPallet();

    // Orange
    colorPallet.addColor(0, 48, 73);
    colorPallet.addColor(56, 4, 14);
    colorPallet.addColor(214, 40, 40);
    colorPallet.addColor(247, 147, 0);
    colorPallet.addColor(252, 191, 73);
    colorPallet.addColor(234, 226, 183);

    // Green
    colorPallet.addColor(52, 78, 65);
    colorPallet.addColor(58, 90, 64);
    colorPallet.addColor(88, 129, 87);
    colorPallet.addColor(163, 177, 138);
    colorPallet.addColor(218, 215, 205);

    return colorPallet;
  };

  const rebuildSimulation = (): void => {
    const sanitizedConfig = sanitizeSimulationConfig(activeConfig);
    activeConfig = sanitizedConfig;

    const colorPallet = createColorPallet();
    const nodeGroup = new NodeGroup();
    autonomousNodeEconomy = new AutonomousNodeEconomy(nodeGroup, colorPallet);

    const buildContext = {
      p,
      colorPallet,
      width: WIDTH,
      height: HEIGHT,
    };

    const restrictions = createRestrictions(sanitizedConfig, buildContext);
    for (const restriction of restrictions) {
      nodeGroup.addNodeRestriction(restriction);
    }

    for (let i = 0; i < sanitizedConfig.nodeCount; i++) {
      const newNode = new Node(p.random(20, p.width - 20), p.random(20, p.height - 20), 100);

      const motivations = createMotivations(sanitizedConfig, buildContext);
      for (const motivation of motivations) {
        newNode.addMotivation(motivation);
      }

      const visualizations = createVisualizations(sanitizedConfig, buildContext);
      for (const visualization of visualizations) {
        newNode.addVisualization(visualization);
      }

      nodeGroup.addNode(newNode);
    }

    nodeGroup.initialize();
    p.background(...colorPallet.getColor(0, 255));
    saveFileName = `nodes_${Date.now()}`;
  };

  const scheduleRebuild = (): void => {
    if (rebuildTimer !== null) {
      window.clearTimeout(rebuildTimer);
    }
    rebuildTimer = window.setTimeout(() => {
      rebuildTimer = null;
      rebuildSimulation();

      if (animationPaused) {
        p.noLoop();
        p.redraw();
      } else {
        p.loop();
      }
    }, 120);
  };

  p.setup = () => {
    p.createCanvas(WIDTH, HEIGHT);

    activeConfig = sanitizeSimulationConfig(activeConfig);
    rebuildSimulation();

    if (!controlPanelMounted) {
      mountSimulationControlPanel(activeConfig, {
        onConfigChange: (nextConfig) => {
          activeConfig = nextConfig;
          scheduleRebuild();
        },
        onRestart: () => {
          rebuildSimulation();
          if (animationPaused) {
            p.noLoop();
            p.redraw();
          } else {
            p.loop();
          }
        },
      });
      controlPanelMounted = true;
    }

    p.loop();
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
        rebuildSimulation();
        if (animationPaused) {
          p.noLoop();
        } else {
          p.loop();
        }
      }
    }
  };

  p.keyPressed = () => {
    if (p.key === undefined || p.key.length !== 1) return;
    const key = p.key;
    switch (key) {
      case 'r': // restart animation
        if (autonomousNodeEconomy) {
          animationPaused = false;
          rebuildSimulation();
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

          const descriptions = listEnabledFeatureDescriptions(activeConfig);

          const info = {
            nodeCount: autonomousNodeEconomy.nodeGroup.getNodeCount(),
            canvas: { width: WIDTH, height: HEIGHT },
            motivations: descriptions.motivations,
            visualizations: descriptions.visualizations,
            restrictions: descriptions.restrictions,
            config: activeConfig,
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
