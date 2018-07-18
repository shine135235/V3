import React,{Component} from 'react';
import axios from 'axios';
import QueueAnim from 'rc-queue-anim';
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
        axios.post(`${config.api_server}/sys/resource`,{
            resourceId:this.state.parentID,
            roleId:JSON.parse(sessionStorage.getItem('user')).lastUsedRole.id
        }).then(res =>{
            let rootKey=[]
            res.data.childs.map(item =>{
                rootKey.push(item.id)
            })
            this.setState({
                openKeys:[res.data.childs[0].id],
                defaultSelectedKeys:[sessionStorage.getItem('cid')===null?res.data.childs[0].childs?res.data.childs[0].childs[0].code!=''?res.data.childs[0].childs[0].id:res.data.childs[0].id:res.data.childs[0].id:sessionStorage.getItem('cid')],
                childs: res.data.childs,
            });
            sessionStorage.setItem('cid',res.data.childs[0].childs?res.data.childs[0].childs[0].code!=''?res.data.childs[0].childs[0].id:res.data.childs[0].id:res.data.childs[0].id)
            this.rootSubmenuKeys=rootKey
        })
    }
    rootSubmenuKeys=[];
    componentDidMount(){
        this.setState({
            loading:false
        })
    }
    componentWillUnmount(){
        sessionStorage.removeItem('cid');
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
    onEnd=() =>{
        sessionStorage.setItem('isOver',true)
    }
    render(){
        if(this.state.childs!=null&&this.state.childs.length>0){
            return (
                <div className='left-menu' id='leftMenu'>
                <QueueAnim
                component={Menu}
                componentProps={{
                    theme:'dark',
                    mode:'inline',
                    onOpenChange:this.openChange,
                    onSelect:this.handleClick,
                    openKeys:this.state.openKeys,
                    defaultSelectedKeys:this.state.defaultSelectedKeys
                }}
                id='aMenu'
                onEnd={this.onEnd}
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
                </QueueAnim>
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