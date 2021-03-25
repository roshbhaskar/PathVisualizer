import React, { Component } from 'react';
import Node from './node/node.js';
import './pathfinder.css';
export default class Pathfinder extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    
    render() {
        return (
            <div>
                <Node></Node>
            </div>
        )
    }
}
