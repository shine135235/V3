import React,{Component} from 'react';
import axios from 'axios';
import {Menu,Icon} from 'antd';
import {Link} from 'react-router-dom';
import config from '../../config'
import './index.less'


const SubMenu=Menu.SubMenu;
export default class LeftMenu extends Component{
    constructor(props){
        super(props)
        this.state={
            parentID:sessionStorage.getItem('pid'),
            parentIcon:null,
            parentName:null,
            childs:[],
            loading:false,
            defaultOpenKeys:sessionStorage.getItem('oid')===null?[]:sessionStorage.getItem('oid').split(','),
            defaultSelectedKeys:sessionStorage.getItem('cid')===null?[]:[sessionStorage.getItem('cid')]
        }
    }
    componentWillMount(){
        this.setState({
            loading:true
        })
    }
    componentDidMount(){
        axios.post(`${config.api_server}/sys/resource`,{
            resourceId:this.state.parentID,
            roleId:JSON.parse(sessionStorage.getItem('user')).lastUsedRole.id
        }).then(res =>{
            this.setState({
                childs: res.data.childs,
                loading:false
            })
            sessionStorage.setItem('cid',res.data.childs[0].id)
        })  
    }
    handleClick=(e) =>{
        sessionStorage.setItem('cid',e.key);
        // this.setState({
        //     defaultSelectedKeys:[e.key],
        // })
    }
    openChange=(e) =>{
        console.log(e)
        sessionStorage.setItem('oid',e)
    }
    render(){
        if(this.state.childs!=null&&this.state.childs.length>0){
            return (
                <div className='left-menu'>
                <Menu 
                theme='dark' 
                mode="inline"
                onOpenChange={this.openChange}
                onSelect={this.handleClick}
                defaultOpenKeys={this.state.defaultOpenKeys}
                defaultSelectedKeys={this.state.defaultSelectedKeys}
                >
                    {
                        this.state.childs.map(item =>{
                            if(item.childs===null || item.pathname!=''){
                                return (
                                    <Menu.Item key={item.id} component={item.pathname}>
                                    <Link to={{
                                                    pathname:`${this.props.match.url}/${item.pathname}`,
                                                    state:{
                                                        id:`${item.id}`
                                                    }
                                                }}>
                                    <Icon type={item.icon} />{item.menu}
                                    </Link>
                                    </Menu.Item>
                                )
                            }else{
                                return (
                                        <SubMenu key={item.id} title={<span><Icon type={item.icon} /><span>{item.menu}</span></span>}>
                                        {
                                            item.childs.map(chunk =>{
                                                if(chunk.childs===null || chunk.pathname!=''){
                                                    return(
                                                    <Menu.Item key={chunk.id}>     
                                                        <Link to={{
                                                            pathname:`${this.props.match.url}/${chunk.pathname}`,
                                                            state:{
                                                                id:`${chunk.id}`
                                                            }
                                                        }}>
                                                        <Icon type={chunk.icon} />{chunk.menu}
                                                        </Link>
                                                    </Menu.Item>
                                                    )
                                                }else{
                                                    return(
                                                    <SubMenu key={chunk.id} title={<span><Icon type={chunk.icon} /><span>{chunk.menu}</span></span>}>
                                                        {
                                                            chunk.childs.map(list =>(
                                                                <Menu.Item key={list.id}>     
                                                                    <Link to={{
                                                                        pathname:`${this.props.match.url}/${list.pathname}`,
                                                                        state:{
                                                                            id:`${list.id}`
                                                                        }
                                                                    }}>
                                                                    <Icon type={list.icon} />{list.menu}
                                                                    </Link>
                                                                </Menu.Item>
                                                            ))
                                                        }
                                                    </SubMenu>
                                                    )
                                                }    
                                            })
                                        }
                                        </SubMenu>                                
                                )
                            }
                     })
                    }
                </Menu>
                </div>
            )
        }else{
            return (
                <Menu>
                    
                </Menu>
            )
        }
        
    }
}