import React, { Component } from 'react';
import Node from './node/node.js';
import './pathfinder.css';

export default class Pathfinder extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             nodes: []
        }
    }
    componentDidMount() {
        const nodes=[];
        let row=0;
        let col=0;
        for( row = 0;row <18;++row){
            const currentRow=[];
            for(col=0; col<50 ; ++col){
                const currentNode = {
                    col,
                    row,
                    isStart: row===9 && col ===8,
                    isFinish : row ===9 && col ===42,
                };
                    currentRow.push(currentNode);
            }
            nodes.push(currentRow);
            console.log(nodes);
        }
        this.setState({nodes});
    }
    render() {
        const {nodes} = this.state;
        return (
            <div className="grid">
                {nodes.map((row,rowID)=>{
                    return (
                    <div key={rowID}>
                    {row.map((node,nodeID) => 
                    {
                        const {isStart,isFinish}=node;
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
