import React,{Component} from 'react';
import DataClass from './dataClass';
import './index.less';

export default class DataDictionary extends Component{
    constructor(props){
        super(props);
        this.state={
            pannelID:"9904"
        }
    }
    render(){
        return (
            <DataClass pid={this.state.pannelID}></DataClass>
        )
    }
}