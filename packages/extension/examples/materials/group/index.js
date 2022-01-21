const lf = new window.LogicFlow({
  container: document.querySelector('#app'),
  edgeTextDraggable: true,
  nodeTextDraggable: true,
  grid: {
    type: 'dot',
    size: 20,
  },
  keyboard: {
    enabled: true,
  },
  snapline: true,
  stopScrollGraph: true,
  stopZoomGraph: true,
  stopMoveGraph: true,
});
lf.setMenuByType({
  type: 'group',
  menu: [
    {
      text: '收缩',
      callback(group) {

        // ui改变
        const nodeModel = lf.getNodeModelById(group.id);
        const { x, y, width, height } = nodeModel.getData();
        nodeModel.width = 100;
        nodeModel.height = 60;
        console.log(nodeModel);

        const shrinkProperty = {
          groupNode: {
            x, y, width, height,
          },
        };
        const { nodes, edges } = lf.getGraphData();
        // 处理节点
        if (group.children && group.children.length) {
          // 分组内有节点再进行遍历
          // 遍历所有节点，在分组内的， 暂存&删除
          const innerNodes = {};
          nodes.forEach(item => {
            if (group.children.indexOf(item.id) > -1) {
              innerNodes[item.id] = lf.graphModel.getElement(item.id);
              lf.deleteNode(item.id);
            }
          });
          const innerEdges = {};
          edges.forEach(item => {
            const startInGroup = group.children.indexOf(item.sourceNodeId) > -1;
            const endInGroup = group.children.indexOf(item.targetNodeId) > -1;
            if (startInGroup || endInGroup) {
              innerEdges[item.id] = lf.graphModel.getElement(item.id);
              if (startInGroup && !endInGroup) {
                // 从分组内向外的边
                lf.addEdge({
                  sourceNodeId: group.id,
                  targetNodeId: item.targetNodeId,
                });
              }
              if (!startInGroup && endInGroup) {
                // 从外部指向分组内的
                lf.addEdge({
                  sourceNodeId: item.sourceNodeId,
                  targetNodeId: group.id,
                });
              }
              lf.deleteEdge(item.id);
            }
          });
          shrinkProperty.innerNodes = innerNodes;
          shrinkProperty.innerEdges = innerEdges;
        }
        lf.setProperties(group.id, shrinkProperty);
        nodeModel.width = 100;
        nodeModel.height = 60;
        console.log(shrinkProperty);
        console.log(nodeModel.getProperties());
      },
    },
    {
      text: '展开',
      callback(group) {
        console.log(group);
        const nodeModel = lf.getNodeModelById(group.id);

      },
    },
  ],
});
lf.render({
  nodes: [
    {
      id: 'c_1',
      type: 'circle',
      x: 100,
      y: 100,
    },
    {
      id: 'c_2',
      type: 'circle',
      x: 300,
      y: 200,
    },
    {
      id: 'c_3',
      type: 'group',
      x: 650,
      y: 200,
    },
    {
      id: 'c_4',
      type: 'rect',
      x: 1000,
      y: 200,
    },
  ],
  edges: [
    {
      id: 'e_1',
      type: 'polyline',
      pointsList: [
        {
          x: 140,
          y: 100,
        },
        {
          x: 200,
          y: 100,
        },
        {
          x: 200,
          y: 200,
        },
        {
          x: 250,
          y: 200,
        },
      ],
      sourceNodeId: 'c_1',
      targetNodeId: 'c_2',
    },
    {
      id: 'e_2',
      type: 'polyline',
      pointsList: [
        {
          x: 350,
          y: 200,
        },
        {
          x: 950,
          y: 200,
        },
      ],
      sourceNodeId: 'c_2',
      targetNodeId: 'c_4',
    },
  ],
});
document.querySelector('#selectBtn').addEventListener('click', () => {
  lf.openSelectionSelect();
});
// 初始化拖入功能
document.querySelector('#rect').addEventListener('mousedown', () => {
  lf.dnd.startDrag({
    type: 'group',
  });
});
