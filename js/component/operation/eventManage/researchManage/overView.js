import React,{Component} from 'react';
import {Modal,Carousel} from 'antd';

export default class OverView extends Component{
    style={
        width:'100%',
        height:'300px',
        backgroundColor:'#000'
    }
    render(){
        return(
            <Modal
            title='aaa'
            visible={this.props.display}
            onCancel={this.props.cancel}
            >
                <Carousel sytle={this.style}>
                <div><h3>{this.props.overData[0]}</h3></div>
                <div><h3>{this.props.overData[1]}</h3></div>
                <div><h3>{this.props.overData[2]}</h3></div>
                <div><h3>{this.props.overData[3]}</h3></div>
                </Carousel>
            </Modal>
        )
    }
}