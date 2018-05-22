import React,{Component} from 'react';
import {Menu,Icon,Select} from 'antd';
import axios from 'axios';
import 'antd/dist/antd.css';
import {Link} from 'react-router-dom';

import './header.less'

axios.defaults.withCredentials=true;

const Option=Select.Option;
let cc=0;
class SetNav extends Component{
    constructor(props){
        super(props);
        this.state={
            theme:'dark',
            selectedKeys:this.props.selectedKeys?this.props.selectedKeys:sessionStorage.getItem('selectedKeys')===null?['5109AE81528211E8A4FB02004C4F4F51']:sessionStorage.getItem('selectedKeys'),
            userData:JSON.parse(sessionStorage.getItem('user'))
        }
    }
    crazyClick(){
        cc++;
        if(cc==50){
            alert("别闹!")
        } else if(cc>60){
            alert("既然如此,我就给你一个惩罚!");
            window.location.href="about:blank";
            window.close();
        }
    }
    handleClick=(v) =>{
       sessionStorage.setItem('selectedKeys',v.keyPath)
       sessionStorage.setItem('pid',v.key)
    }
   
    render(){
            return(
                <div className='header'>
                <div className='v3-logo' onClick={this.crazyClick}></div>
                <Menu theme={this.state.theme} onClick={this.handleClick} selectedKeys={[this.state.selectedKeys]}>
                    {
                        this.props.menu.map(item =>(
                                <Menu.Item key={item.id}>
                                    <Link to={{
                                        pathname:`${item.pathname}`,
                                        state:{
                                            id:`${item.id}`
                                        }
                                    }}>
                                    <Icon type={item.icon} />{item.menu}
                                    </Link>
                                </Menu.Item>
                        ))
                    }
                </Menu>
                <div className='user-role'>
                <Select defaultValue={this.state.userData.lastUsedRole.id} style={{ width: 120,right:'10%'}}>
                    {
                        this.state.userData.userRole.map((item,i) =>(
                            <Option key={`ur${i}`} value={item.id}>{item.name}</Option> 
                        ))
                    }
                </Select>
                </div>
                </div>
            )
        
    }
}

export default class Menus extends Component{
    constructor(props){
        super(props)
        this.state={
            menu:JSON.parse(sessionStorage.getItem('user')),
            submenu:[]
        }
    }
    componentDidMount(){
        
    }
    render(){
        return (
          <SetNav selectedKeys={this.props.selectedKeys}  menu={this.state.menu.lastUsedRole.resource}></SetNav>
        )
    }
}