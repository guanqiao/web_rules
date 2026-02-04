import { Node } from '@xyflow/react';

export interface LayoutOptions {
  type: 'hierarchical' | 'tree' | 'force';
  direction: 'horizontal' | 'vertical';
  spacing: { x: number; y: number };
}

export const alignNodes = (nodes: Node[], alignment: 'left' | 'right' | 'top' | 'bottom' | 'center'): Node[] => {
  if (nodes.length === 0) return nodes;

  let targetValue: number;
  let property: 'x' | 'y';

  switch (alignment) {
    case 'left':
      targetValue = Math.min(...nodes.map(n => n.position.x));
      property = 'x';
      break;
    case 'right':
      targetValue = Math.max(...nodes.map(n => n.position.x));
      property = 'x';
      break;
    case 'top':
      targetValue = Math.min(...nodes.map(n => n.position.y));
      property = 'y';
      break;
    case 'bottom':
      targetValue = Math.max(...nodes.map(n => n.position.y));
      property = 'y';
      break;
    case 'center':
      const avgX = nodes.reduce((sum, n) => sum + n.position.x, 0) / nodes.length;
      const avgY = nodes.reduce((sum, n) => sum + n.position.y, 0) / nodes.length;
      return nodes.map(n => ({
        ...n,
        position: { x: avgX - (n.position.x - avgX), y: avgY - (n.position.y - avgY) }
      }));
    default:
      return nodes;
  }

  return nodes.map(node => ({
    ...node,
    position: {
      ...node.position,
      [property]: targetValue
    }
  }));
};

export const distributeNodes = (nodes: Node[], direction: 'horizontal' | 'vertical', spacing: number = 100): Node[] => {
  if (nodes.length < 2) return nodes;

  const sortedNodes = [...nodes].sort((a, b) => 
    direction === 'horizontal' ? a.position.y - b.position.y : a.position.x - b.position.x
  );

  const property: 'x' | 'y' = direction === 'horizontal' ? 'x' : 'y';
  const otherProperty: 'x' | 'y' = direction === 'horizontal' ? 'y' : 'x';

  const groups: Node[][] = [];
  let currentGroup: Node[] = [sortedNodes[0]];

  for (let i = 1; i < sortedNodes.length; i++) {
    const prevNode = sortedNodes[i - 1];
    const currNode = sortedNodes[i];

    if (Math.abs(currNode.position[otherProperty] - prevNode.position[otherProperty]) < 50) {
      currentGroup.push(currNode);
    } else {
      groups.push(currentGroup);
      currentGroup = [currNode];
    }
  }
  groups.push(currentGroup);

  const result: Node[] = [];
  groups.forEach(group => {
    const positions = group.map(n => n.position[property]);
    const minPos = Math.min(...positions);
    const maxPos = Math.max(...positions);
    const totalSpacing = (group.length - 1) * spacing;
    const availableSpace = maxPos - minPos;
    const actualSpacing = totalSpacing > availableSpace ? availableSpace / (group.length - 1) : spacing;

    group.forEach((node, index) => {
      result.push({
        ...node,
        position: {
          ...node.position,
          [property]: minPos + index * actualSpacing
        }
      });
    });
  });

  return result;
};

export const autoLayout = (nodes: Node[], edges: any[], options: Partial<LayoutOptions> = {}): Node[] => {
  const opts: LayoutOptions = {
    type: 'hierarchical',
    direction: 'horizontal',
    spacing: { x: 200, y: 150 },
    ...options
  };

  if (nodes.length === 0) return nodes;

  const nodeMap = new Map<string, Node>();
  nodes.forEach(node => nodeMap.set(node.id, node));

  const adjacencyList = new Map<string, string[]>();
  nodes.forEach(() => adjacencyList.set(nodes.map(n => n.id)[0], []));
  edges.forEach(edge => {
    const targets = adjacencyList.get(edge.source) || [];
    targets.push(edge.target);
    adjacencyList.set(edge.source, targets);
  });

  const levels: Node[][] = [];
  const visited = new Set<string>();

  const startNodes = nodes.filter(n => !edges.some(e => e.target === n.id));
  
  if (startNodes.length === 0 && nodes.length > 0) {
    return nodes;
  }

  const queue: { node: Node; level: number }[] = startNodes.map(n => ({ node: n, level: 0 }));

  while (queue.length > 0) {
    const { node, level } = queue.shift()!;

    if (visited.has(node.id)) continue;
    visited.add(node.id);

    if (!levels[level]) levels[level] = [];
    levels[level].push(node);

    const children = adjacencyList.get(node.id) || [];
    children.forEach(childId => {
      const childNode = nodeMap.get(childId);
      if (childNode && !visited.has(childId)) {
        queue.push({ node: childNode, level: level + 1 });
      }
    });
  }

  const result: Node[] = [];
  levels.forEach((levelNodes, levelIndex) => {
    const otherProperty = opts.direction === 'horizontal' ? 'y' : 'x';
    const property = opts.direction === 'horizontal' ? 'x' : 'y';
    const spacing = opts.direction === 'horizontal' ? opts.spacing.x : opts.spacing.y;

    levelNodes.forEach((node, nodeIndex) => {
      const position = {
        x: node.position.x,
        y: node.position.y
      };

      position[property] = levelIndex * spacing;
      position[otherProperty] = nodeIndex * (spacing * 0.6);

      result.push({
        ...node,
        position
      });
    });
  });

  return result;
};

export const fitNodesToView = (nodes: Node[], padding: number = 50): { min: { x: number; y: number }; max: { x: number; y: number } } => {
  if (nodes.length === 0) {
    return { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } };
  }

  const minX = Math.min(...nodes.map(n => n.position.x));
  const minY = Math.min(...nodes.map(n => n.position.y));
  const maxX = Math.max(...nodes.map(n => n.position.x));
  const maxY = Math.max(...nodes.map(n => n.position.y));

  return {
    min: { x: minX - padding, y: minY - padding },
    max: { x: maxX + padding, y: maxY + padding }
  };
};
