import React,{Component} from 'react';
import {Icon,Menu,Input} from 'antd';
import axios from 'axios';


const Search = Input.Search;
const SubMenu = Menu.SubMenu;

export default class RoleAndCompany extends Component{
    state={
        deptID:'001001',
        deptData:[],
        rootSubmenuKe:[],
        openKeys:[],
        pageTag:""
    }
    componentDidMount(){
        axios.get('/data/yhgl/depart.json').then(res =>{
            this.setState({
                deptData:res.data
            })
        })
    }
    handleClick =(e) =>{
        this.setState({
            deptID:e.key,
            openKeys:e.keyPath
        })
        //eslint-disable-next-line
        console.log(this.state.openKeys)
    }
    render(){
   
        if(this.state.deptData.length>0){
            return(
                <div className='role-content'>
                <div className='department'>
                    <div className='depart-search'>
                    <Search placeholder="input search text" />
                    </div>
                        <Menu
                        defaultSelectedKeys={['001001']}
                        defaultOpenKeys={['001']}
                        mode="inline"
                        style={{height:'100%'}}
                        onClick={this.handleClick}
                        >
                        {
                            this.state.deptData.map(item =>{
                                return(
                                <SubMenu key={`${item.deptID}`} title={<span><Icon type='layout' /><span>{item.deptName}</span></span>}>
                                    {
                                        item.childDept.map(list =>{
                                            return(
                                                <Menu.Item key={`${list.deptID}`} id={`${list.deptID}`}>{list.deptName}</Menu.Item>
                                            )
                                        })
                                    }
                                </SubMenu>
                                )
                            })
                        }
                        </Menu>
               </div>
               </div>
            )
        }else{
            return null
        }
    }
}