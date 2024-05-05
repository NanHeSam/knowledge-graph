// randomGraph.js

/**
 * Generates random graph data.
 * @param {number} numNodes - The number of nodes to generate.
 * @param {number} maxEdgesPerNode - Maximum number of edges per node.
 * @returns {Object} - An object containing arrays of nodes and edges.
 */
export function generateRandomGraph(numNodes = 10, maxEdgesPerNode = 3) {
    const nodes = [];
    const edges = [];
  
    // Generate nodes
    for (let i = 0; i < numNodes; i++) {
      nodes.push({ id: `${i}`, data: { label: `Node ${i}` }, position: { x: Math.random() * 400, y: Math.random() * 400 } });
    }
  
    // Generate edges
    nodes.forEach((node, index) => {
      const numEdges = Math.floor(Math.random() * maxEdgesPerNode) + 1;
  
      for (let j = 0; j < numEdges; j++) {
        const targetIndex = Math.floor(Math.random() * numNodes);
        if (targetIndex !== index) {
          edges.push({ id: `e${index}-${targetIndex}`, source: node.id, target: nodes[targetIndex].id });
        }
      }
    });
  
    return { nodes, edges };
  }
  


export function convertData(data) {
    const nodes = [];
    const edges = [];

    // Convert nodes
    data.nodes.forEach((node) => {
        nodes.push({ id: node.id, data: { label: node.name }, position: { x: Math.random() * 400, y: Math.random() * 400 } });
    });

    // Convert edges
    data.edges.forEach((edge) => {
        const sourceNode = data.nodes.find((node) => node.name === edge.source);
        const targetNode = data.nodes.find((node) => node.name === edge.target);

        if (sourceNode && targetNode) {
            edges.push({ id: edge.id, source: sourceNode.id, target: targetNode.id });
        }
    });

    return { nodes, edges };
}
