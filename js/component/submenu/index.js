import React,{Component} from 'react';
import axios from 'axios';
import {Menu,Icon} from 'antd';
import {Link} from 'react-router-dom';
import config from '../../config'
import './index.less'

const MenuItemGroup=Menu.ItemGroup;
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
            openKeys:[],
            defaultSelectedKeys:sessionStorage.getItem('cid')===null?[]:[sessionStorage.getItem('cid')]
        }
    }
    componentWillMount(){
        this.setState({
            loading:true
        })
    }
    rootSubmenuKeys=[];
    componentDidMount(){
        axios.post(`${config.api_server}/sys/resource`,{
            resourceId:this.state.parentID,
            roleId:JSON.parse(sessionStorage.getItem('user')).lastUsedRole.id
        }).then(res =>{
            let rootKey=[]
            res.data.childs.map(item =>{
                rootKey.push(item.id)
            })
            this.setState({
                childs: res.data.childs,
                loading:false
            })
            this.rootSubmenuKeys=rootKey
        })  
    }
    handleClick=(e) =>{
        this.setState({
            cid:e.key
        })
        sessionStorage.setItem('cid',e.key);
    }
    openChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        console.log(latestOpenKey)
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ 
                openKeys:[openKeys]
             });
        } else {
            this.setState({
            openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
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
                openKeys={this.state.openKeys}
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
                                                    <MenuItemGroup key={chunk.id} title={<span><Icon type={chunk.icon} /><span>{chunk.menu}</span></span>}>
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
                                                    </MenuItemGroup>
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