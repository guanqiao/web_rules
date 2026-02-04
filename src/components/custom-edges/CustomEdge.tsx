import React, { memo } from 'react';
import { BaseEdge, EdgeProps, getBezierPath, useReactFlow } from '@xyflow/react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const CustomEdge = memo(({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected
}: EdgeProps) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: selected ? '#ff4d4f' : '#b1b1b7',
          strokeWidth: selected ? 3 : 2,
        }}
      />
      <foreignObject
        width={40}
        height={40}
        x={labelX - 20}
        y={labelY - 20}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={onEdgeClick}
            style={{
              display: selected ? 'flex' : 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              borderRadius: '50%',
              width: 28,
              height: 28,
              minWidth: 28,
              padding: 0,
            }}
          />
        </div>
      </foreignObject>
    </>
  );
});

CustomEdge.displayName = 'CustomEdge';

export default CustomEdge;
