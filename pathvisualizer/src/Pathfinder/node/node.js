import React, {Component} from 'react';

import './node.css';

export default class Node extends Component {
  render() {
    const {
      col,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
    } = this.props;
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : '';

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}></div>
    );
  }
}



/*import React, { Component } from 'react'
import './node.css';
export default class Node extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    
    render() {
        const {isFinish,isStart} = this.props;
        const extraClassName = isFinish // if Finsh is true then class name will be changed to node-finish
        ? 'node-finish'
        : isStart
        ? 'node-start'
        : '';
        return (
            <div className={`node ${extraClassName}`}>
              
            </div>
        )
    }
}

export const DEFAULT_NODE = {
    row: 0,
    col: 0,
}
*/