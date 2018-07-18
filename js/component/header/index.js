import React,{Component} from 'react';
import {Menu,Icon,Dropdown} from 'antd';
import axios from 'axios';
import 'antd/dist/antd.css';
import {Link} from 'react-router-dom';
import config from '../../config';

import './header.less'

const outLogin=() =>{
    console.log(JSON.parse(sessionStorage.getItem('user')))
    axios.post(`${config.api_server}/sys/user/logout`,{
        id:JSON.parse(sessionStorage.getItem('user')).id,
        loginId:JSON.parse(sessionStorage.getItem('user')).loginId
    }).then(res =>{
        if(res.data.flag==='success'){
            sessionStorage.clear();
            location.href='/';
        }
    })
}

const menus = (
    <Menu>
      <Menu.Item onClick={outLogin}>
        退出登录
      </Menu.Item>
    </Menu>
);
let cc=0;
class SetNav extends Component{
    constructor(props){
        super(props);
        this.state={
            theme:'dark',
            disable:false,
            selectedKeys:sessionStorage.getItem('pid'),
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
    componentDidMount(){
    }
    handleClick=(v) =>{
            sessionStorage.setItem('selectedKeys',v.keyPath)
            sessionStorage.setItem('pid',v.key)
    }
    render(){
            return(
                <div className='header'>
                <div className='v3-logo' onClick={this.crazyClick}>
                <div className='logo' id='Logo'><img src={config.api_server+sessionStorage.getItem('logo')} /></div>
                <div className='name'>{sessionStorage.getItem('name')}</div>
                </div>
                <Menu theme={this.state.theme} onClick={this.handleClick} selectedKeys={[this.state.selectedKeys]}>
                    {
                        this.props.menu.map(item =>(
                                <Menu.Item key={item.id}>
                                    <Link disabled={item.id==this.state.selectedKeys?true:false} to={{
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
                <Dropdown overlay={menus} trigger={['click']}>
                    <a className="ant-dropdown-link big-line" href="#">
                    {JSON.parse(sessionStorage.getItem('user')).userName}<Icon style={{marginLeft:'8px'}} type="down" />
                    </a>
                </Dropdown>
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