import React,{Component} from 'react';
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
            <Menus />
            <LeftMenu {...this.props}></LeftMenu>
            </span>
        )
    }
}

export default System;