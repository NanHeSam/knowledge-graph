// GraphComponent.js
import React, { useState } from 'react';
import ReactFlow, { 
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
 } from 'reactflow';
import 'reactflow/dist/style.css';
import { generateRandomGraph, convertData } from './utils';

function GraphComponent({ data }) {
  const [graphData, setGraphData] = useState(data);

  // Updates node positions when they're moved
  const onNodesChange = (changes) => {
    setGraphData((prev) => {
      const updatedNodes = prev.nodes.map((node) => {
        const change = changes.find((chg) => chg.id === node.id);
        return change ? { ...node, ...change } : node;
      });
      return { ...prev, nodes: updatedNodes };
    });
  };

  const fetchSubNodes = async (node) => {
    console.log(`Fetching sub-nodes for: ${node.data.label}`);
    const response = await fetch(`http://localhost:8000/add_to_node/${node.data.label}`);
    const subGraphData = await response.json();
  
    // Assuming convertData is a function that converts raw server data to React Flow-compatible data
    const extendedSubGraph = convertData(subGraphData);
  
    setGraphData((prevData) => {
      let label2idMap = {};
      let nodeAll = [...prevData.nodes];
      let edgeAll = [...prevData.edges];
  
      // Create a map to track existing nodes by label
      prevData.nodes.forEach((node) => {
        label2idMap[node.data.label] = node.id;
      });
  
      // Create a map to remap newly fetched node IDs to existing node IDs
      let newIdToOldIdMap = {};
  
      // Add new nodes or map to existing ones
      extendedSubGraph.nodes.forEach((newNode) => {
        if (label2idMap[newNode.data.label]) {
          newIdToOldIdMap[newNode.id] = label2idMap[newNode.data.label];
        } else {
          nodeAll.push(newNode);
        }
      });
  
      // Add edges, remapping IDs where necessary
      extendedSubGraph.edges.forEach((edge) => {
        if (newIdToOldIdMap[edge.source]) {
          edge.source = newIdToOldIdMap[edge.source];
        }
        if (newIdToOldIdMap[edge.target]) {
          edge.target = newIdToOldIdMap[edge.target];
        }
  
        // Ensure that the new edge does not duplicate any existing one
        if (!edgeAll.some(e => e.source === edge.source && e.target === edge.target)) {
          edgeAll.push(edge);
        }
      });
  
      return {
        nodes: nodeAll,
        edges: edgeAll,
      };
    });
  };
  
  const onNodeClick = (event, node) => {
    fetchSubNodes(node);
  };


  return (
    <div style={{ height: '500px', width: '100%' }}>
      <ReactFlow
        nodes={graphData.nodes}
        edges={graphData.edges}
        onNodeClick={onNodeClick}
        onNodesChange={onNodesChange}
        fitView
      >
       <Background />
       <MiniMap />
       <Controls />
      </ReactFlow>
    </div>
  );
}

export default GraphComponent;

