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
            for(col=0; col<57 ; ++col){
                    currentRow.push([]);
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
                    return <>
                    {row.map((node,nodeID) => <Node></Node>)}
                    </>
                })}
            </div>
        )
    }
}
