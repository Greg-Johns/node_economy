import type p5 from 'p5';

import { AgingHealthMotivation } from '../engine/customhealthmotivations/AgingHealthMotivation';
import { BoidsMotivation } from '../engine/custommotivations/BoidsMotivation';
import { CircularMotivation } from '../engine/custommotivations/CircularMotivation';
import { FollowFarthestMotivation } from '../engine/custommotivations/FollowFarthestMotivation';
import { MagnetChainMotivation } from '../engine/custommotivations/MagnetChainMotivation';
import { MagnetPairMotivation } from '../engine/custommotivations/MagnetPairMotivation';
import { MagnetRandomMotivation } from '../engine/custommotivations/MagnetRandomMotivation';
import { RandomXMotivation } from '../engine/custommotivations/RandomXMotivation';
import { RandomYMotivation } from '../engine/custommotivations/RandomYMotivation';
import { SineXMotivation } from '../engine/custommotivations/SineXMotivation';
import { SineYMotivation } from '../engine/custommotivations/SineYMotivation';
import { SocialPersonalMotivation } from '../engine/custommotivations/SocialPersonalMotivation';
import { SocialVisibleMotivation } from '../engine/custommotivations/SocialVisibleMotivation';
import { TowardsXMotivation } from '../engine/custommotivations/TowardsXMotivation';
import { TowardsYMotivation } from '../engine/custommotivations/TowardsYMotivation';
import { BoundingBoxKillRestriction } from '../engine/customrestrictions/BoundingBoxKillRestriction';
import { BoundingBoxRandomJumpRestriction } from '../engine/customrestrictions/BoundingBoxRandomJumpRestriction';
import { BoundingBoxWrapRestriction } from '../engine/customrestrictions/BoundingBoxWrapRestriction';
import { MaxSpeedRestriction } from '../engine/customrestrictions/MaxSpeedRestriction';
import { MinSpeedRestriction } from '../engine/customrestrictions/MinSpeedRestriction';
import { NeighborVisualization } from '../engine/customvisualizations/NeighborVisualization';
import { NodeMotivationVisualization } from '../engine/customvisualizations/NodeMotivationVisualization';
import { PixelVisualization } from '../engine/customvisualizations/PixelVisualization';
import { SpeedCircleDrawVisualization } from '../engine/customvisualizations/SpeedCircleDrawVisualization';
import { SpeedCircleVisualization } from '../engine/customvisualizations/SpeedCircleVisualization';
import { SpeedSquareVisualization } from '../engine/customvisualizations/SpeedSquareVisualization';
import type { ColorPallet } from '../engine/ColorPallet';
import type { Motivation } from '../engine/Motivation';
import type { Restriction } from '../engine/Restriction';
import type { Visualization } from '../engine/Visualization';

export type MotivationId =
  | 'boids'
  | 'magnetPair'
  | 'magnetRandom'
  | 'magnetChain'
  | 'socialPersonal'
  | 'socialVisible'
  | 'sineX'
  | 'sineY'
  | 'randomX'
  | 'randomY'
  | 'towardsX'
  | 'towardsY'
  | 'followFarthest'
  | 'circular'
  | 'agingHealth';

export type VisualizationId =
  | 'pixel'
  | 'neighbor'
  | 'nodeMotivation'
  | 'speedCircleDraw'
  | 'speedSquare'
  | 'speedCircle';

export type RestrictionId =
  | 'boundingBoxKill'
  | 'boundingBoxWrap'
  | 'boundingBoxRandomJump'
  | 'maxSpeed'
  | 'minSpeed';

type ParamValue = number | boolean;

type NumberParamDefinition = {
  kind: 'number';
  label: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
};

type BooleanParamDefinition = {
  kind: 'boolean';
  label: string;
  defaultValue: boolean;
};

type ParamDefinition = NumberParamDefinition | BooleanParamDefinition;
type ParamDefinitionMap = Record<string, ParamDefinition>;

export type FeatureState = {
  enabled: boolean;
  params: Record<string, ParamValue>;
};

export type SimulationConfig = {
  nodeCount: number;
  motivations: Record<MotivationId, FeatureState>;
  visualizations: Record<VisualizationId, FeatureState>;
  restrictions: Record<RestrictionId, FeatureState>;
};

type BuildContext = {
  p: p5;
  colorPallet: ColorPallet;
  width: number;
  height: number;
};

type FeatureDefinition<TId extends string, TFeature> = {
  id: TId;
  label: string;
  enabledByDefault: boolean;
  params: ParamDefinitionMap;
  create: (params: Record<string, ParamValue>, context: BuildContext) => TFeature;
};

const numberParam = (
  label: string,
  defaultValue: number,
  min: number,
  max: number,
  step: number
): NumberParamDefinition => ({
  kind: 'number',
  label,
  defaultValue,
  min,
  max,
  step,
});

const booleanParam = (label: string, defaultValue: boolean): BooleanParamDefinition => ({
  kind: 'boolean',
  label,
  defaultValue,
});

const motivationDefinitions: readonly FeatureDefinition<MotivationId, Motivation>[] = [
  {
    id: 'boids',
    label: 'Boids',
    enabledByDefault: true,
    params: {
      perceptionRadius: numberParam('Perception Radius', 199, 0, 600, 1),
      separationRadius: numberParam('Separation Radius', 12, 0, 400, 1),
      maxSpeed: numberParam('Max Speed', 9.9, 0, 20, 0.1),
      maxForce: numberParam('Max Force', 0.6, 0, 3, 0.001),
      maxNeighbors: numberParam('Max Neighbors', 28, 1, 200, 1),
      separationWeight: numberParam('Separation Weight', 1.7, 0, 5, 0.01),
      alignmentWeight: numberParam('Alignment Weight', 1, 0, 5, 0.01),
      cohesionWeight: numberParam('Cohesion Weight', 0.2, 0, 5, 0.01),
    },
    create: (params) =>
      new BoidsMotivation(
        getNumber(params, 'perceptionRadius'),
        getNumber(params, 'separationRadius'),
        getNumber(params, 'maxSpeed'),
        getNumber(params, 'maxForce'),
        getNumber(params, 'maxNeighbors'),
        getNumber(params, 'separationWeight'),
        getNumber(params, 'alignmentWeight'),
        getNumber(params, 'cohesionWeight')
      ),
  },
  {
    id: 'magnetPair',
    label: 'Magnet Pair',
    enabledByDefault: false,
    params: {
      scaleX: numberParam('Scale X', 100, 1, 1000, 1),
      scaleY: numberParam('Scale Y', 100, 1, 1000, 1),
      dampeningX: numberParam('Dampening X', 0.64, 0, 1.2, 0.001),
      dampeningY: numberParam('Dampening Y', 0.64, 0, 1.2, 0.001),
    },
    create: (params) =>
      new MagnetPairMotivation(
        getNumber(params, 'scaleX'),
        getNumber(params, 'scaleY'),
        getNumber(params, 'dampeningX'),
        getNumber(params, 'dampeningY')
      ),
  },
  {
    id: 'magnetRandom',
    label: 'Magnet Random',
    enabledByDefault: false,
    params: {
      scaleX: numberParam('Scale X', 9, 1, 1000, 1),
      scaleY: numberParam('Scale Y', 9, 1, 1000, 1),
      dampeningX: numberParam('Dampening X', 0.001, 0, 1.2, 0.001),
      dampeningY: numberParam('Dampening Y', 0.01, 0, 1.2, 0.001),
    },
    create: (params) =>
      new MagnetRandomMotivation(
        getNumber(params, 'scaleX'),
        getNumber(params, 'scaleY'),
        getNumber(params, 'dampeningX'),
        getNumber(params, 'dampeningY')
      ),
  },
  {
    id: 'magnetChain',
    label: 'Magnet Chain',
    enabledByDefault: false,
    params: {
      scaleX: numberParam('Scale X', 5, 1, 1000, 1),
      scaleY: numberParam('Scale Y', 5, 1, 1000, 1),
      dampeningX: numberParam('Dampening X', 0.964, 0, 1.2, 0.001),
      dampeningY: numberParam('Dampening Y', 0.964, 0, 1.2, 0.001),
    },
    create: (params) =>
      new MagnetChainMotivation(
        getNumber(params, 'scaleX'),
        getNumber(params, 'scaleY'),
        getNumber(params, 'dampeningX'),
        getNumber(params, 'dampeningY')
      ),
  },
  {
    id: 'socialPersonal',
    label: 'Social Personal',
    enabledByDefault: false,
    params: {
      personalRadius: numberParam('Personal Radius', 10, 0, 500, 1),
      strength: numberParam('Strength', 0.8, 0, 5, 0.001),
    },
    create: (params) =>
      new SocialPersonalMotivation(getNumber(params, 'personalRadius'), getNumber(params, 'strength')),
  },
  {
    id: 'socialVisible',
    label: 'Social Visible',
    enabledByDefault: false,
    params: {
      visibleRadius: numberParam('Visible Radius', 40, 0, 500, 1),
      strength: numberParam('Strength', 0.009, 0, 1, 0.001),
    },
    create: (params) =>
      new SocialVisibleMotivation(getNumber(params, 'visibleRadius'), getNumber(params, 'strength')),
  },
  {
    id: 'sineX',
    label: 'Sine X',
    enabledByDefault: false,
    params: {
      amplitude: numberParam('Amplitude', 100, -1000, 1000, 1),
      phase: numberParam('Phase', 100, -2000, 2000, 0.1),
      damping: numberParam('Damping', 0.08, 0, 2, 0.001),
    },
    create: (params) =>
      new SineXMotivation(getNumber(params, 'amplitude'), getNumber(params, 'phase'), getNumber(params, 'damping')),
  },
  {
    id: 'sineY',
    label: 'Sine Y',
    enabledByDefault: false,
    params: {
      amplitude: numberParam('Amplitude', 400, -1000, 1000, 1),
      phase: numberParam('Phase', -200, -2000, 2000, 0.1),
      damping: numberParam('Damping', 0.008, 0, 2, 0.001),
    },
    create: (params) =>
      new SineYMotivation(getNumber(params, 'amplitude'), getNumber(params, 'phase'), getNumber(params, 'damping')),
  },
  {
    id: 'randomX',
    label: 'Random X',
    enabledByDefault: false,
    params: {
      amount: numberParam('Amount', 8, 0, 100, 0.1),
    },
    create: (params) => new RandomXMotivation(getNumber(params, 'amount')),
  },
  {
    id: 'randomY',
    label: 'Random Y',
    enabledByDefault: false,
    params: {
      amount: numberParam('Amount', 1, 0, 100, 0.1),
    },
    create: (params) => new RandomYMotivation(getNumber(params, 'amount')),
  },
  {
    id: 'towardsX',
    label: 'Towards X',
    enabledByDefault: true,
    params: {
      targetX: numberParam('Target X', 320, 0, 640, 1),
      strength: numberParam('Strength', 0.00001, 0, 0.02, 0.000001),
    },
    create: (params) => new TowardsXMotivation(getNumber(params, 'targetX'), getNumber(params, 'strength')),
  },
  {
    id: 'towardsY',
    label: 'Towards Y',
    enabledByDefault: true,
    params: {
      targetY: numberParam('Target Y', 320, 0, 640, 1),
      strength: numberParam('Strength', 0.000001, 0, 0.02, 0.000001),
    },
    create: (params) => new TowardsYMotivation(getNumber(params, 'targetY'), getNumber(params, 'strength')),
  },
  {
    id: 'followFarthest',
    label: 'Follow Farthest',
    enabledByDefault: false,
    params: {},
    create: () => new FollowFarthestMotivation(),
  },
  {
    id: 'circular',
    label: 'Circular',
    enabledByDefault: false,
    params: {
      radius: numberParam('Radius', 4, -200, 200, 0.1),
      angle: numberParam('Angle', 400, -1000, 1000, 0.1),
    },
    create: (params) => new CircularMotivation(getNumber(params, 'radius'), getNumber(params, 'angle')),
  },
  {
    id: 'agingHealth',
    label: 'Aging Health',
    enabledByDefault: true,
    params: {
      dHealth: numberParam('dHealth', 0.8, -5, 5, 0.01),
    },
    create: (params) => new AgingHealthMotivation(getNumber(params, 'dHealth')),
  },
];

const visualizationDefinitions: readonly FeatureDefinition<VisualizationId, Visualization>[] = [
  {
    id: 'pixel',
    label: 'Pixel',
    enabledByDefault: true,
    params: {
      index: numberParam('Color Index', 3, 0, 20, 1),
      alpha: numberParam('Alpha', 100, 0, 255, 1),
    },
    create: (params, context) =>
      new PixelVisualization(context.p, context.colorPallet, getNumber(params, 'index'), getNumber(params, 'alpha')),
  },
  {
    id: 'neighbor',
    label: 'Neighbor Lines',
    enabledByDefault: false,
    params: {
      neighborRadius: numberParam('Neighbor Radius', 40, 1, 640, 1),
      maxAlpha: numberParam('Max Alpha', 80, 0, 255, 1),
      toggleEnabled: booleanParam('Toggle Enabled', false),
    },
    create: (params, context) =>
      new NeighborVisualization(
        context.p,
        context.colorPallet,
        getNumber(params, 'neighborRadius'),
        getNumber(params, 'maxAlpha'),
        getBoolean(params, 'toggleEnabled')
      ),
  },
  {
    id: 'nodeMotivation',
    label: 'Node + Direction',
    enabledByDefault: false,
    params: {
      bodyRadius: numberParam('Body Radius', 1, 0.1, 20, 0.1),
      dirScale: numberParam('Direction Scale', 10, 0, 100, 0.1),
      bodyColorIndex: numberParam('Body Color Index', 3, 0, 20, 1),
      bodyColorAlpha: numberParam('Body Alpha', 99, 0, 255, 1),
      lineColorIndex: numberParam('Line Color Index', 2, 0, 20, 1),
      lineColorAlpha: numberParam('Line Alpha', 6, 0, 255, 1),
    },
    create: (params, context) =>
      new NodeMotivationVisualization(
        context.p,
        context.colorPallet,
        getNumber(params, 'bodyRadius'),
        getNumber(params, 'dirScale'),
        getNumber(params, 'bodyColorIndex'),
        getNumber(params, 'bodyColorAlpha'),
        getNumber(params, 'lineColorIndex'),
        getNumber(params, 'lineColorAlpha')
      ),
  },
  {
    id: 'speedCircleDraw',
    label: 'Speed Circle Draw',
    enabledByDefault: false,
    params: {
      scalingFactor: numberParam('Scaling Factor', 9, 0, 100, 0.1),
      angle: numberParam('Angle', 0, -1000, 1000, 0.1),
      dAngle: numberParam('dAngle', 1, -10, 10, 0.01),
      strokeColorIndex: numberParam('Stroke Color Index', 1, 0, 20, 1),
      strokeColorAlpha: numberParam('Stroke Alpha', 100, 0, 255, 1),
      strokeColorWidth: numberParam('Stroke Width', 1, 0, 20, 0.1),
      fillColorIndex: numberParam('Fill Color Index', 8, 0, 20, 1),
      fillColorAlpha: numberParam('Fill Alpha', 20, 0, 255, 1),
      fillColorWidth: numberParam('Fill Width', 0, 0, 20, 0.1),
    },
    create: (params, context) =>
      new SpeedCircleDrawVisualization(
        context.p,
        context.colorPallet,
        getNumber(params, 'scalingFactor'),
        getNumber(params, 'angle'),
        getNumber(params, 'dAngle'),
        getNumber(params, 'strokeColorIndex'),
        getNumber(params, 'strokeColorAlpha'),
        getNumber(params, 'strokeColorWidth'),
        getNumber(params, 'fillColorIndex'),
        getNumber(params, 'fillColorAlpha'),
        getNumber(params, 'fillColorWidth')
      ),
  },
  {
    id: 'speedSquare',
    label: 'Speed Square',
    enabledByDefault: false,
    params: {
      scalingFactor: numberParam('Scaling Factor', 10, 0, 100, 0.1),
      strokeColorIndex: numberParam('Stroke Color Index', 1, 0, 20, 1),
      strokeColorAlpha: numberParam('Stroke Alpha', 0, 0, 255, 1),
      fillColorIndex: numberParam('Fill Color Index', 2, 0, 20, 1),
      fillColorAlpha: numberParam('Fill Alpha', 100, 0, 255, 1),
    },
    create: (params, context) =>
      new SpeedSquareVisualization(
        context.p,
        context.colorPallet,
        getNumber(params, 'scalingFactor'),
        getNumber(params, 'strokeColorIndex'),
        getNumber(params, 'strokeColorAlpha'),
        getNumber(params, 'fillColorIndex'),
        getNumber(params, 'fillColorAlpha')
      ),
  },
  {
    id: 'speedCircle',
    label: 'Speed Circle',
    enabledByDefault: false,
    params: {
      scalingFactor: numberParam('Scaling Factor', 9, 0, 100, 0.1),
      strokeColorIndex: numberParam('Stroke Color Index', 1, 0, 20, 1),
      strokeColorAlpha: numberParam('Stroke Alpha', 10, 0, 255, 1),
      fillColorIndex: numberParam('Fill Color Index', 4, 0, 20, 1),
      fillColorAlpha: numberParam('Fill Alpha', 100, 0, 255, 1),
    },
    create: (params, context) =>
      new SpeedCircleVisualization(
        context.p,
        context.colorPallet,
        getNumber(params, 'scalingFactor'),
        getNumber(params, 'strokeColorIndex'),
        getNumber(params, 'strokeColorAlpha'),
        getNumber(params, 'fillColorIndex'),
        getNumber(params, 'fillColorAlpha')
      ),
  },
];

const restrictionDefinitions: readonly FeatureDefinition<RestrictionId, Restriction>[] = [
  {
    id: 'boundingBoxKill',
    label: 'Bounding Box Kill',
    enabledByDefault: false,
    params: {
      x1: numberParam('x1', 0, -2000, 2000, 1),
      y1: numberParam('y1', 0, -2000, 2000, 1),
      x2: numberParam('x2', 640, -2000, 2000, 1),
      y2: numberParam('y2', 640, -2000, 2000, 1),
    },
    create: (params, context) =>
      new BoundingBoxKillRestriction(
        getNumber(params, 'x1'),
        getNumber(params, 'y1'),
        clampCanvas(getNumber(params, 'x2'), context.width),
        clampCanvas(getNumber(params, 'y2'), context.height)
      ),
  },
  {
    id: 'boundingBoxWrap',
    label: 'Bounding Box Wrap',
    enabledByDefault: false,
    params: {
      x1: numberParam('x1', 0, -2000, 2000, 1),
      y1: numberParam('y1', 0, -2000, 2000, 1),
      x2: numberParam('x2', 640, -2000, 2000, 1),
      y2: numberParam('y2', 640, -2000, 2000, 1),
    },
    create: (params, context) =>
      new BoundingBoxWrapRestriction(
        getNumber(params, 'x1'),
        getNumber(params, 'y1'),
        clampCanvas(getNumber(params, 'x2'), context.width),
        clampCanvas(getNumber(params, 'y2'), context.height)
      ),
  },
  {
    id: 'boundingBoxRandomJump',
    label: 'Bounding Box Random Jump',
    enabledByDefault: false,
    params: {
      x1: numberParam('x1', 0, -2000, 2000, 1),
      y1: numberParam('y1', 0, -2000, 2000, 1),
      x2: numberParam('x2', 640, -2000, 2000, 1),
      y2: numberParam('y2', 640, -2000, 2000, 1),
    },
    create: (params, context) =>
      new BoundingBoxRandomJumpRestriction(
        getNumber(params, 'x1'),
        getNumber(params, 'y1'),
        clampCanvas(getNumber(params, 'x2'), context.width),
        clampCanvas(getNumber(params, 'y2'), context.height)
      ),
  },
  {
    id: 'maxSpeed',
    label: 'Max Speed',
    enabledByDefault: false,
    params: {
      maxSpeed: numberParam('Max Speed', 4, 0, 100, 0.1),
    },
    create: (params) => new MaxSpeedRestriction(getNumber(params, 'maxSpeed')),
  },
  {
    id: 'minSpeed',
    label: 'Min Speed',
    enabledByDefault: false,
    params: {
      minSpeed: numberParam('Min Speed', 0.2, 0, 100, 0.1),
    },
    create: (params) => new MinSpeedRestriction(getNumber(params, 'minSpeed')),
  },
];

const getNumber = (params: Record<string, ParamValue>, key: string): number => {
  const value = params[key];
  return typeof value === 'number' ? value : 0;
};

const getBoolean = (params: Record<string, ParamValue>, key: string): boolean => {
  const value = params[key];
  return typeof value === 'boolean' ? value : false;
};

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const clampCanvas = (value: number, max: number): number => clamp(value, -2000, Math.max(2000, max));

const buildFeatureState = <TId extends string>(
  definitions: readonly FeatureDefinition<TId, unknown>[]
): Record<TId, FeatureState> => {
  const entries = definitions.map((definition) => {
    const params: Record<string, ParamValue> = {};
    for (const [paramKey, paramDefinition] of Object.entries(definition.params)) {
      params[paramKey] = paramDefinition.defaultValue;
    }
    return [
      definition.id,
      {
        enabled: definition.enabledByDefault,
        params,
      },
    ] as const;
  });

  return Object.fromEntries(entries) as Record<TId, FeatureState>;
};

export const createDefaultSimulationConfig = (initialNodeCount: number): SimulationConfig => ({
  nodeCount: initialNodeCount,
  motivations: buildFeatureState(motivationDefinitions),
  visualizations: buildFeatureState(visualizationDefinitions),
  restrictions: buildFeatureState(restrictionDefinitions),
});

const sanitizeFeatureStates = <TId extends string>(
  states: Record<TId, FeatureState>,
  definitions: readonly FeatureDefinition<TId, unknown>[]
): Record<TId, FeatureState> => {
  const sanitizedEntries = definitions.map((definition) => {
    const originalState = states[definition.id];
    const sanitizedState: FeatureState = {
      enabled: originalState?.enabled ?? definition.enabledByDefault,
      params: {},
    };

    for (const [paramKey, paramDefinition] of Object.entries(definition.params)) {
      const candidateValue = originalState?.params[paramKey];
      if (paramDefinition.kind === 'number') {
        const value = typeof candidateValue === 'number' ? candidateValue : paramDefinition.defaultValue;
        sanitizedState.params[paramKey] = clamp(value, paramDefinition.min, paramDefinition.max);
      } else {
        const value = typeof candidateValue === 'boolean' ? candidateValue : paramDefinition.defaultValue;
        sanitizedState.params[paramKey] = value;
      }
    }

    return [definition.id, sanitizedState] as const;
  });

  return Object.fromEntries(sanitizedEntries) as Record<TId, FeatureState>;
};

export const sanitizeSimulationConfig = (config: SimulationConfig): SimulationConfig => {
  const sanitizedNodeCount = Math.max(2, Math.floor(config.nodeCount));
  const evenNodeCount = sanitizedNodeCount % 2 === 0 ? sanitizedNodeCount : sanitizedNodeCount + 1;

  return {
    nodeCount: evenNodeCount,
    motivations: sanitizeFeatureStates(config.motivations, motivationDefinitions),
    visualizations: sanitizeFeatureStates(config.visualizations, visualizationDefinitions),
    restrictions: sanitizeFeatureStates(config.restrictions, restrictionDefinitions),
  };
};

export const createMotivations = (config: SimulationConfig, context: BuildContext): Motivation[] => {
  const motivations: Motivation[] = [];
  for (const definition of motivationDefinitions) {
    const state = config.motivations[definition.id];
    if (!state || !state.enabled) continue;
    motivations.push(definition.create(state.params, context));
  }
  return motivations;
};

export const createVisualizations = (config: SimulationConfig, context: BuildContext): Visualization[] => {
  const visualizations: Visualization[] = [];
  for (const definition of visualizationDefinitions) {
    const state = config.visualizations[definition.id];
    if (!state || !state.enabled) continue;
    visualizations.push(definition.create(state.params, context));
  }
  return visualizations;
};

export const createRestrictions = (config: SimulationConfig, context: BuildContext): Restriction[] => {
  const restrictions: Restriction[] = [];
  for (const definition of restrictionDefinitions) {
    const state = config.restrictions[definition.id];
    if (!state || !state.enabled) continue;
    restrictions.push(definition.create(state.params, context));
  }
  return restrictions;
};

export const listEnabledFeatureDescriptions = (config: SimulationConfig): {
  motivations: string[];
  visualizations: string[];
  restrictions: string[];
} => {
  const describe = <TId extends string>(
    states: Record<TId, FeatureState>,
    definitions: readonly FeatureDefinition<TId, unknown>[]
  ): string[] => {
    return definitions
      .filter((definition) => states[definition.id]?.enabled)
      .map((definition) => {
        const state = states[definition.id];
        const entries = Object.entries(state.params);
        if (entries.length === 0) {
          return definition.label;
        }
        const paramText = entries.map(([k, v]) => `${k}=${String(v)}`).join(', ');
        return `${definition.label}(${paramText})`;
      });
  };

  return {
    motivations: describe(config.motivations, motivationDefinitions),
    visualizations: describe(config.visualizations, visualizationDefinitions),
    restrictions: describe(config.restrictions, restrictionDefinitions),
  };
};

type ControlPanelCallbacks = {
  onConfigChange: (nextConfig: SimulationConfig) => void;
  onRestart: () => void;
};

type FeatureSection = 'motivations' | 'visualizations' | 'restrictions';

type FeatureViewDefinition<TId extends string> = {
  section: FeatureSection;
  definitions: readonly FeatureDefinition<TId, unknown>[];
};

export const mountSimulationControlPanel = (
  initialConfig: SimulationConfig,
  callbacks: ControlPanelCallbacks
): { setConfig: (nextConfig: SimulationConfig) => void } => {
  const container = document.createElement('aside');
  container.setAttribute('aria-label', 'Simulation Controls');
  container.style.position = 'fixed';
  container.style.top = '12px';
  container.style.right = '12px';
  container.style.width = '340px';
  container.style.maxHeight = 'calc(100vh - 24px)';
  container.style.overflowY = 'auto';
  container.style.background = 'rgba(255,255,255,0.96)';
  container.style.border = '1px solid #d1d5db';
  container.style.borderRadius = '8px';
  container.style.padding = '12px';
  container.style.boxShadow = '0 8px 24px rgba(0,0,0,0.16)';
  container.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
  container.style.fontSize = '12px';
  container.style.zIndex = '1000';

  const title = document.createElement('h3');
  title.textContent = 'Simulation Controls';
  title.style.margin = '0 0 8px 0';
  title.style.fontSize = '14px';
  container.appendChild(title);

  const intro = document.createElement('p');
  intro.textContent = 'Changing values restarts the simulation with the current settings.';
  intro.style.margin = '0 0 12px 0';
  intro.style.color = '#4b5563';
  container.appendChild(intro);

  let activeConfig = sanitizeSimulationConfig(initialConfig);

  const updateConfig = (updater: (config: SimulationConfig) => void): void => {
    const nextConfig = structuredClone(activeConfig);
    updater(nextConfig);
    activeConfig = sanitizeSimulationConfig(nextConfig);
    callbacks.onConfigChange(structuredClone(activeConfig));
  };

  const nodeCountRow = document.createElement('div');
  nodeCountRow.style.display = 'flex';
  nodeCountRow.style.alignItems = 'center';
  nodeCountRow.style.gap = '8px';
  nodeCountRow.style.marginBottom = '10px';

  const nodeCountLabel = document.createElement('label');
  nodeCountLabel.textContent = 'Node count (even)';
  nodeCountLabel.style.flex = '1';

  const nodeCountInput = document.createElement('input');
  nodeCountInput.type = 'number';
  nodeCountInput.value = String(activeConfig.nodeCount);
  nodeCountInput.min = '2';
  nodeCountInput.step = '2';
  nodeCountInput.style.width = '100px';
  nodeCountInput.style.padding = '4px';
  nodeCountInput.addEventListener('change', () => {
    const parsed = Number(nodeCountInput.value);
    updateConfig((config) => {
      config.nodeCount = Number.isFinite(parsed) ? parsed : config.nodeCount;
    });
    nodeCountInput.value = String(activeConfig.nodeCount);
  });

  nodeCountRow.appendChild(nodeCountLabel);
  nodeCountRow.appendChild(nodeCountInput);
  container.appendChild(nodeCountRow);

  const restartButton = document.createElement('button');
  restartButton.textContent = 'Restart';
  restartButton.type = 'button';
  restartButton.style.marginBottom = '10px';
  restartButton.style.padding = '4px 8px';
  restartButton.style.border = '1px solid #9ca3af';
  restartButton.style.borderRadius = '6px';
  restartButton.style.background = '#f3f4f6';
  restartButton.style.cursor = 'pointer';
  restartButton.addEventListener('click', () => callbacks.onRestart());
  container.appendChild(restartButton);

  const featureGroups: Array<FeatureViewDefinition<MotivationId> | FeatureViewDefinition<VisualizationId> | FeatureViewDefinition<RestrictionId>> = [
    { section: 'motivations', definitions: motivationDefinitions },
    { section: 'visualizations', definitions: visualizationDefinitions },
    { section: 'restrictions', definitions: restrictionDefinitions },
  ];

  for (const group of featureGroups) {
    const details = document.createElement('details');
    details.open = true;
    details.style.marginBottom = '8px';

    const summary = document.createElement('summary');
    summary.textContent = capitalize(group.section);
    summary.style.cursor = 'pointer';
    summary.style.fontWeight = '600';
    summary.style.marginBottom = '6px';
    details.appendChild(summary);

    for (const definition of group.definitions) {
      const state = getFeatureState(activeConfig, group.section, definition.id);

      const card = document.createElement('div');
      card.style.border = '1px solid #e5e7eb';
      card.style.borderRadius = '6px';
      card.style.padding = '8px';
      card.style.marginTop = '6px';

      const headerRow = document.createElement('label');
      headerRow.style.display = 'flex';
      headerRow.style.alignItems = 'center';
      headerRow.style.gap = '6px';
      headerRow.style.fontWeight = '600';

      const enabledInput = document.createElement('input');
      enabledInput.type = 'checkbox';
      enabledInput.checked = state.enabled;
      enabledInput.addEventListener('change', () => {
        updateConfig((config) => {
          getFeatureState(config, group.section, definition.id).enabled = enabledInput.checked;
        });
      });

      const labelText = document.createElement('span');
      labelText.textContent = definition.label;

      headerRow.appendChild(enabledInput);
      headerRow.appendChild(labelText);
      card.appendChild(headerRow);

      for (const [paramKey, paramDefinition] of Object.entries(definition.params)) {
        const row = document.createElement('div');
        row.style.display = 'grid';
        row.style.gridTemplateColumns = '1fr auto';
        row.style.alignItems = 'center';
        row.style.gap = '8px';
        row.style.marginTop = '6px';

        const rowLabel = document.createElement('label');
        rowLabel.textContent = paramDefinition.label;

        if (paramDefinition.kind === 'number') {
          const input = document.createElement('input');
          input.type = 'number';
          input.value = String(state.params[paramKey]);
          input.min = String(paramDefinition.min);
          input.max = String(paramDefinition.max);
          input.step = String(paramDefinition.step);
          input.style.width = '100px';
          input.style.padding = '3px';
          input.addEventListener('change', () => {
            const parsed = Number(input.value);
            updateConfig((config) => {
              getFeatureState(config, group.section, definition.id).params[paramKey] = Number.isFinite(parsed)
                ? parsed
                : paramDefinition.defaultValue;
            });
            const refreshedState = getFeatureState(activeConfig, group.section, definition.id);
            input.value = String(refreshedState.params[paramKey]);
          });
          row.appendChild(rowLabel);
          row.appendChild(input);
        } else {
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.checked = Boolean(state.params[paramKey]);
          input.addEventListener('change', () => {
            updateConfig((config) => {
              getFeatureState(config, group.section, definition.id).params[paramKey] = input.checked;
            });
          });
          row.appendChild(rowLabel);
          row.appendChild(input);
        }

        card.appendChild(row);
      }

      details.appendChild(card);
    }

    container.appendChild(details);
  }

  document.body.appendChild(container);

  return {
    setConfig: (nextConfig: SimulationConfig) => {
      activeConfig = sanitizeSimulationConfig(nextConfig);
      nodeCountInput.value = String(activeConfig.nodeCount);
    },
  };
};

const getFeatureState = <TId extends string>(
  config: SimulationConfig,
  section: FeatureSection,
  featureId: TId
): FeatureState => {
  if (section === 'motivations') {
    return config.motivations[featureId as MotivationId];
  }
  if (section === 'visualizations') {
    return config.visualizations[featureId as VisualizationId];
  }
  return config.restrictions[featureId as RestrictionId];
};

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);
