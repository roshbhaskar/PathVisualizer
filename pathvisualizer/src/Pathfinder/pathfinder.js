import React, {Component} from 'react';
import Node from './node/node.js';
import {dijkstra, getNodesInShortestPathOrder} from '../Algos/dijkstra.js';

//import {DragDropContext,Droppable,Draggable} from 'react-beautiful-dnd';
import './pathfinder.css';


//NO SOLUTION CASE - done
    // - EDIT BOARD IF NO SOLUTION -done
//CLEAR BOARD -done
//LOCK BOARD -done
//START FINISH CANT BE WALLED -done

// MOVING START AND END POINTS - done
//NAV BAR
//MORE ALGOS
//CSS :d

const START_NODE_ROW = 14;
const START_NODE_COL = 14;
const FINISH_NODE_ROW = 6;
const FINISH_NODE_COL = 6;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [], // the whole box
      mouseIsPressed: false,
      endPoints:false,
      row_start:4,
      col_start:2,
      row_finish: 4,
      col_finish: 2,
      changing_start : false,
      changing_finish : false,
      lock: false, // to lock the board while visualizing
      visited_arr: [], // all the nodes traversed by the algo
      shortest_path:[], //shortest path from start to end
      maze:[], //holds all the walls for the maze
    };
    
  }

  componentDidMount() {
    const grid = this.getGrid();
    this.setState({grid});

  }


  handleMouseDown(row, col) {
    
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    if(newGrid){
    const maze = [...this.state.maze,newGrid[1]]
    this.setState({grid: newGrid[0], mouseIsPressed: true , maze:maze});}
    
  }


  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    if(newGrid){
    const maze = [...this.state.maze,newGrid[1]]
    this.setState({grid: newGrid[0] , maze:maze});}
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
    this.setState({lock:true});//locking the start and end while visualizing
    const {grid} = this.state;
    //console.log("from viz",grid);
    const startNode = grid[this.state.row_start][this.state.row_finish];
    const finishNode =  grid[this.state.col_start][this.state.col_finish];
    //const startNode = grid[START_NODE_ROW][START_NODE_COL];
    //const finishNode =  grid[ FINISH_NODE_ROW][ FINISH_NODE_COL];
    console.log("VISITED",startNode,finishNode);
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    console.log("VISITED",visitedNodesInOrder);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    //console.log("SHORTEST",nodesInShortestPathOrder);
    if(finishNode.col===nodesInShortestPathOrder[0].col && finishNode.row===nodesInShortestPathOrder[0].row)
    {
      alert("NO SOLUTION Edit the board");
      this.setState({lock:false});//unlock it if there is no solution
    }
    else{
     
      this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
      console.log("finish",finishNode,"shortest",nodesInShortestPathOrder,visitedNodesInOrder);
      

     // this.setState({lock:false});
      this.setState({
        visited_arr:visitedNodesInOrder,
        shortest_path:nodesInShortestPathOrder,
        });
  
    }

    //console.log(this.state.shortest_path,"hi",nodesInShortestPathOrder);
  }


  //CREATING THE BOX
  getInitialGrid  ()  {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(this.getNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };


  //CREATE A NEW GRID/NODE
  /*
  createNode  (col, row)  {
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      //isStart: row === this.state.row_start && col === this.state.col_start,
      //isFinish: row === this.state.row_finish && col === this.state.col_finish,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };
*/
  getGrid  ()  {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(this.getNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };


  //CREATE A NEW GRID/NODE
  getNode  (col, row)  {
    return {
      col,
      row,
      //isStart: row === START_NODE_ROW && col === START_NODE_COL,
      //isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      isStart: row === this.state.row_start && col === this.state.row_finish,
      isFinish: row === this.state.col_start && col === this.state.col_finish,
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
    if(node.isFinish || node.isStart){
      return false;
    }
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return [newGrid,newNode];
  };

 

  shiftStartNode(row,col){

    if(this.state.changing_start){
      const newGrid = this.state.grid.slice();
      const old_node = newGrid[this.state.row_start][this.state.row_finish];
      const temp = {
        ...old_node,
        isStart:false
      }
      document.getElementById(`node-${this.state.row_start}-${this.state.row_finish}`).className =
      'node ';
      
      document.getElementById(`node-${row}-${col}`).className =
      'node node-start';
      //const newGrid = this.state.grid.slice();
      const node = newGrid[row][col];
      const newNode = {
        ...node,
        isStart: true,
      };
      newGrid[row][col] = newNode;
      newGrid[this.state.row_start][this.state.row_finish]=temp;
      this.setState({
        grid: newGrid,
        row_start:row,
        row_finish:col
      })
    }
  }
  
  shiftEndNode(row,col){
    if(this.state.changing_finish){
      const newGrid = this.state.grid.slice();
      const old_node = newGrid[this.state.col_start][this.state.col_finish];
      const temp = {
        ...old_node,
        isFinish:false
      }
      document.getElementById(`node-${this.state.col_start}-${this.state.col_finish}`).className =
      'node ';
      
      document.getElementById(`node-${row}-${col}`).className =
      'node node-finish';
      //const newGrid = this.state.grid.slice();
      const node = newGrid[row][col];
      const newNode = {
        ...node,
        isFinish: true,
      };
      newGrid[row][col] = newNode;
      newGrid[this.state.col_start][this.state.col_finish]=temp;
      this.setState({
        grid: newGrid,
        col_start:row,
        col_finish:col
      })
    }
  }

 

  //CLEAR BOARD - REMOVES ALL THE WALLS AND THE VISITED AND THE SHORTEST BUT NOT WHILE EXECUTING
  clearBoard() {
    
    this.setState({lock:false}); //unlock the board now for new paths
    const {visited_arr,maze,grid}=this.state;
    
    const grid_ = this.getGrid(); //get a new box
    this.setState({grid:grid_});

    for (let i = 0; i <= visited_arr.length; i++) { // get rid of the animations

      if (i === visited_arr.length) {
        console.log("SaWWdUDE");
        //console.log("Maze",this.state.maze);
        return;
      }
      setTimeout(() => {
        const node = visited_arr[i];
        //console.log("prob")
        console.log(node);
        /*if(node.row===0 && node.col ===0){
        document.getElementById(`node-${0}-${0}`).className =
          'node node-start';}
        else if(node.row===1 && node.col===2){
          document.getElementById(`node-${1}-${2}`).className =
          'node node-finish';}
        */
        if(node.isFinish )
        { 
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-finish';
        }
        else if (node.isStart)
        {
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-start';
        }
        else{
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node ';}
        
        
      }, 1 * i); 
     
    }
  }


  setStartNode(){
    this.setState({
      changing_start:!this.state.changing_start
    })
  }
  setEndNode(){
    this.setState({
      changing_finish:!this.state.changing_finish
    })
  }
  


  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
       
        <button onClick={() => this.setStartNode()}>
          {this.state.changing_start ? "Save" : "Change Start" }
        </button> 
        
        <button onClick={() => this.setEndNode()}>
         {this.state.changing_finish ? "Save" :" Change End"}
        </button>
        <button onClick={() => this.clearBoard()}>
          Clear Board
        </button>
        
            <button onClick={() => this.visualizeDijkstra()}>
                Visualize Dijkstra's Algorithm
                </button> : <div></div>
       
        <div className="grid" >
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  const {col_start,col_finish,row_start,row_finish} = this.state;
                  return (
                   
                    <div className="BOX" >
                     
                      <Node
                      //{//...provided.draggableProps}
                     // ref={provided.innerRef}
                      //{...provided.dragHandleProps}
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)}

                      shiftStartNode ={(row,col) => this.shiftStartNode(row,col)}
                      shiftEndNode ={(row,col) => this.shiftEndNode(row,col)}

                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                      lock={this.state.lock}
                      changing_start={this.state.changing_start}
                      changing_finish={this.state.changing_finish}
                      
                      ></Node>
                     
                    </div>
                   
                 
                  );
                })}
              </div>
            );
          })}
        </div>
         )
       
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