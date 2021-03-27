import React, {Component} from 'react';
import Node from './node/node.js';
import {dijkstra, getNodesInShortestPathOrder} from '../Algos/dijkstra.js';

import './pathfinder.css';


//NO SOLUTION CASE - done
//CLEAR BOARD -done
// MOVING START AND END POINTS 
//NAV BAR
//MORE ALGOS
//CSS :d

const START_NODE_ROW = 0;
const START_NODE_COL = 0;
const FINISH_NODE_ROW = 1;
const FINISH_NODE_COL = 2;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [], // the whole box
      mouseIsPressed: false,
      endPoints:false,
      row_start:null,
      col_start:null,
      row_finish: null,
      col_finish: null,
      visited_arr: [], // all the nodes traversed by the algo
      shortest_path:[], //shortest path from start to end
      maze:[], //holds all the walls for the maze
    };
    
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({grid});
    this.setState({row_start:1});
  }

  handleMouseDown(row, col) {
    
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    const maze = [...this.state.maze,newGrid[1]]
    this.setState({grid: newGrid[0], mouseIsPressed: true , maze:maze});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    const maze = [...this.state.maze,newGrid[1]]
    this.setState({grid: newGrid[0] , maze:maze});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  //ANIMATE ALL THE VISITED NODES OF THIS ALGO - CAN BE USED FOR ALL ALGOS
  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder); //once you hit the last node i.e the finish node; animate the path
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  //ANIMATE THE SHORTEST PATH ONLY - CAN BE USED FOR ALL AGLOS
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  
  //VISUALIZING DIJKSTRA
  visualizeDijkstra() {
    const {grid} = this.state;
    console.log("from viz",grid);
    //const startNode = grid[this.state.row_start][this.state.col_start];
    //const finishNode =  grid[this.state.row_finish][this.state.col_finish];
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode =  grid[ FINISH_NODE_ROW][ FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    console.log("VISITED",visitedNodesInOrder);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    console.log("SHORTEST",nodesInShortestPathOrder);
    if(finishNode.col===nodesInShortestPathOrder[0].col && finishNode.row===nodesInShortestPathOrder[0].row)
    {
      alert("NO SOLUTION");
    }
    else{
      this.lockBoard();//locking the start and end while visualizing
      this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
      console.log("finish",finishNode,"shortest",nodesInShortestPathOrder,visitedNodesInOrder);
      }

   
    this.setState({
      visited_arr:visitedNodesInOrder,
      shortest_path:nodesInShortestPathOrder,
      
    });
    console.log(this.state.shortest_path,"hi",nodesInShortestPathOrder);
    
   

  }

  //CREATING THE BOX
  getInitialGrid  ()  {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(this.createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  //CREATE A NEW GRID/NODE
  createNode  (col, row)  {
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  //TOGGLING THE WALL
  getNewGridWithWallToggled  (grid, row, col)  {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return [newGrid,newNode];
  };

  //REMOVEING ALL THE WALLS FOOEVVAA
  removeWalls  (grid, row, col)  {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: false,
    };
    newGrid[row][col] = newNode;
    
    return newGrid;
  };

  //LOCK BOARD WHILE VISUALIZING
  lockBoard(){

  }

  //CLEAR BOARD - REMOVES ALL THE WALLS AND THE VISITED AND THE SHORTEST BUT NOT WHILE EXECUTING
  clearBoard() {
    
    const {visited_arr,maze,grid}=this.state;
    
    const grid_ = this.getInitialGrid();
    this.setState({grid:grid_});

    for (let i = 0; i <= visited_arr.length; i++) { // this is for the visited nodes or grids by the algo

      if (i === visited_arr.length) {
        console.log("SaWWdUDE");
        //console.log("Maze",this.state.maze);
        return;
      }
      setTimeout(() => {
        const node = visited_arr[i];
        //console.log("prob")
        console.log(node);
        if(node.row===0 && node.col ===0){
        document.getElementById(`node-${0}-${0}`).className =
          'node node-start';}
        else if(node.row===1 && node.col===2){
          document.getElementById(`node-${1}-${2}`).className =
          'node node-finish';}
        else{
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-unvisit';}
        
        
      }, 1 * i); 
     
    }
  }


  setStartNode(){

  }
  setEndNode(){

  }
  none(){

  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        
        <button onClick={() => this.setStartNode()}>
          Set start Node
        </button>
        <button onClick={() => this.setEndNode()}>
          Set end Node
        </button>
        <button onClick={() => this.clearBoard()}>
          Clear Board
        </button>
        
            <button onClick={() => this.visualizeDijkstra()}>
                Visualize Dijkstra's Algorithm
                </button> : <div></div>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  const {col_start,col_finish,row_start,row_finish} = this.state;
                  return (
                    <div className="BOX">
                      <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                    </div>
                  
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}
/*
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
*/
/*
    componentDidMount() {
        const nodes=[];
        let row=0;
        let col=0;
        for( row = 0;row <18;++row){
            const currentRow=[];
            for(col=0; col<50 ; ++col){
                const currentNode = { //this is an object every node will have
                    col, //col no
                    row, // row no
                    isStart: row===9 && col ===8, //isStart is true only when row is 9 and col is 8 else false
                    isFinish : row ===9 && col ===42,
                };
                    currentRow.push(currentNode);
            }
            nodes.push(currentRow);// nodes list got all the node 
            console.log(nodes);
        }
        this.setState({nodes});
    }
    render() {
        const {nodes} = this.state;
        return (
            <div className="grid">
                {nodes.map((row,rowID)=>{ // each row
                    return (
                    <div key={rowID}>
                    {row.map((node,nodeID) =>  // each box
                    {
                        const {isStart,isFinish}=node; // getting the values of isStart or Finish to check if to render a start or end or normal node
                        return (
                        <Node 
                        key = {nodeID} 
                        isStart={isStart}
                        isFinish={isFinish} 
                        test = {'SaWdUde'}></Node>
                        );
                    })}
                    </div>
                );
                })}
            </div>
        )
    }
}
*/