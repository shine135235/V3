import React,{Component} from 'react';
import axios from 'axios';
import {Menu,Icon} from 'antd';
import {Link} from 'react-router-dom';
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
            loading:false
        }
    }
    componentWillMount(){
        this.setState({
            loading:true
        })
    }
    componentDidMount(){
        axios.post('http://172.16.6.5:9090/sys/resource',{
            resourceId:this.state.parentID,
            roleId:JSON.parse(sessionStorage.getItem('user')).lastUsedRole.id
        }).then(res =>{
                   this.setState({
                       childs: res.data.childs,
                       loading:false
                   })
        })  
    }
    handleClick=() =>{

    }
 
    render(){
        if(this.state.childs!=null&&this.state.childs.length>0){
            return (
                <div className='left-menu'>
                <Menu theme='dark' mode="inline">
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
                                            item.childs.map(chunk =>(
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
                                            )) 
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