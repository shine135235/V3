import React,{Component} from 'react';
import Menus from '../header'
import LeftMenu from '../submenu'

export default class Operation extends Component {
    render(){
        return(
            <span>
            <Menus />
            <LeftMenu {...this.props}></LeftMenu>
            </span>
        )
    }
}