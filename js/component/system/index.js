import React,{Component} from 'react';
import {Spin} from 'antd';
import Menus from '../header';
import LeftMenu from '../submenu';


class System extends Component{
    state = { loading: false }
    componentWillMount(){
        this.setState({
            loading:true
        })
    }
    componentDidMount(){
        this.setState({
            loading:false
        })
    }
    render(){
        return(
            <span>
            <Spin size='large' style={{width:'100%',height:'auto',position:'absolute',top:'60px',bottom:'0',backgroundColor:'#001529',zIndex:'9'}}  spinning={this.state.loading} />
            <Menus />
            <LeftMenu {...this.props}></LeftMenu>
            </span>
        )
    }
}

export default System;