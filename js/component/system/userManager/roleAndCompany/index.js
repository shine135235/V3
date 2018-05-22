import React,{Component} from 'react';
import {Icon,Menu,Input,Tabs} from 'antd';
import axios from 'axios';
import UserList from '../userdata'
// import UserPower from '../userPower';
import DisableUser from '../disableduser';
//const CompanyProvider=React.createContext();

const Search = Input.Search;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;

class RightContent extends Component{
    render(){
        return(
        <div className='user-group'>
            <Tabs defaultActiveKey="1">
                <TabPane tab="成员管理" key="1">
                    <UserList pid={this.props.pid} deptID={this.props.deptID} companyID={this.props.companyID[1]} />
                </TabPane>
                <TabPane tab="已禁用帐号" key="2">
                    <DisableUser pid={this.props.pid} deptID={this.props.deptID} companyID={this.props.companyID[1]} />
                </TabPane>
                <TabPane tab="数据权限" key="3">
                333
                </TabPane>
            </Tabs>
        </div>
        )
    }
}

export default class RoleAndCompany extends Component{
    state={
        deptID:'001001',
        deptData:[],
        companyID:['001001','001'],
        rootSubmenuKe:[],
        pageTag:""
    }
    componentDidMount(){
        axios.post('http://172.16.6.5:9090/sys/user/unitrole',{
            params:{
                userID:'001'
            }
        }).then(res =>{
            this.setState({
                deptData:res.data
            })
        })
    }
    handleClick =(e) =>{
        this.setState({
            deptID:e.key,
            companyID:e.keyPath
        });
        switch(this.props.pid){
            case "1":
            console.log("企业成员")
            break;
            case "3":
            console.log("禁用帐号")
            break;
        }
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
                        // onSelect={this.handleChange}
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
               <RightContent pid={this.props.pid} deptID={this.state.deptID} companyID={this.state.companyID} />
               </div>
            )
        }else{
            return null
        }
    }
}