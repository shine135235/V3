import React,{Component} from 'react';
import {Icon,Menu,Tabs,Table,Divider,Button,Popconfirm,message } from 'antd';
import axios from 'axios';
import AuthPower from '../../../authpower';
import Adduser from './addUser';
import SetUserMsg from './setUser';
// import UserPower from '../userPower';
import DisableUser from '../disableduser';
import config from '../../../../config';

const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;

export default class RoleAndCompany extends Component{
    state={
        deptData:[],
        data:[],
        disable:[],
        setUser:false,
        addmask:false,
        selectedKeys:[],
        defaultOpenKeys:[],
        activeKey:'member'
    }
    componentDidMount(){
        this.getUnitList()
    }
    getUnitList=() =>{
        axios.post(`${config.api_server}/sys/user/unitrole`,{
            params:{
                userID:'001'
            }
        }).then(res =>{
            this.setState({
                deptData:res.data,
                selectedKeys:[`${res.data[0].unitRole[0].id}-${res.data[0].id}`],
                defaultOpenKeys:[`${res.data[0].id}-${res.data[0].code}`],
                uid:res.data[0].id,
                rid:res.data[0].unitRole[0].id,
                code:res.data[0].code
            })
            this.getUserList(1,res.data[0].id,res.data[0].unitRole[0].id,res.data[0].code);
        })
    }
    getUserList=(pn,uid,rid,cod) =>{
        this.setState({
            activeKey:'member'
        })
        axios.get(`${config.api_server}/sys/user`,{
            params:{
                pageNum:pn,
                pageSize:10,
                unitId:uid,
                roleId:rid,
                code:cod
            }
        }).then(res =>{
            this.setState({
                data:res.data.page.datas
            })
            axios.get(`${config.api_server}/sys/user`,{
            params:{
                pageNum:pn,
                pageSize:10,
                unitId:uid,
                roleId:rid,
                code:cod,
                isForbid :true
            }
        }).then(res =>{
            this.setState({
                disable:res.data.page.datas
            })
        })
        })
    }
    handleClick =(e) =>{
        this.getUserList(1,e.keyPath[1].split('-')[0],e.key.split('-')[0],e.keyPath[1].split('-')[1])
        this.setState({
            rid:e.key.split('-')[0],
            code:e.keyPath[1].split('-')[1]
        })
    }
    showSet=(record) =>{
        this.setState({
            setUser:true,
            userID:record.id,
            Name:record.username,
            loginid:record.loginid,
            phone:record.phone,
            role:record.roleID,
            job:record.positionname,
        })
    }
    delConfirm=(record) => {
        axios.delete(`${config.api_server}/sys/user`,{
            data:{
                id:record.id
            } 
        }).then(res =>{
            if(res.data.success){
                message.success('用户删除成功!');
                this.getUserList(1,this.state.uid,this.state.rid,this.state.code);
                this.getForbidUser(1,this.state.uid,this.state.rid,this.state.code)
            }else{
                message.error(res.data.message)
            }
        })
    }
    shwoAdd=(e) =>{
        e.stopPropagation();
        this.setState({
            uid:e.target.id,
            addmask:true
        })
        sessionStorage.setItem('uid',e.target.id)
    }
    handleCancel = () => {
        this.setState({
            setUser: false,
            addmask:false
        });
        sessionStorage.removeItem('role')
    }
    tabChange=(e) =>{
        this.setState({
            activeKey:e
        })
    }
    userColumns=[
        {
        title:"姓名",
        key:"1",
        dataIndex:"username"
        },{
        title:"用户名",
        dataIndex:"loginid"
        },{
        title:"手机号",
        dataIndex:"phone"
        },{
        title:"操作",
        key:"id",
        render:(text,record) =>(
            <span>
             <AuthPower><a href="javascript:void(0)" god='bjcy' onClick={this.showSet.bind(this,record)}>设置</a></AuthPower>
             <Divider type="vertical" />
             <AuthPower>
             <Popconfirm god='sccy' title="删除后已禁用账户里打开此账户,确定删除吗?" placement='bottom' onConfirm={this.delConfirm.bind(this,record)} okText="删除" cancelText="取消">
             <a href="javascript:void(0)">删除</a>
            </Popconfirm>
            </AuthPower>
            </span>
        )
        }
    ];
    render(){
        if(this.state.deptData.length>0){
            return(
                <div className='role-content'>
                <div className='department'>
                    <div className='depart-search'>
                    </div>
                        <Menu
                        defaultSelectedKeys={this.state.selectedKeys}
                        defaultOpenKeys={this.state.defaultOpenKeys}
                        forceSubMenuRender={true}
                        mode="inline"
                        style={{height:'100%'}}
                        onClick={this.handleClick}
                        >
                        {
                            this.state.deptData.map(item =>{
                                return(
                                <SubMenu key={item.id===null?`-${item.code}`:`${item.id}-${item.code}`} title={<span><AuthPower><Icon type="plus-circle-o" id={item.id} onClick={this.shwoAdd} god='xzcy' /></AuthPower>{item.name}</span>}>
                                    {
                                        item.unitRole.map(list =>{
                                            return(
                                                <Menu.Item key={`${list.id==''?111:list.id}-${item.id}`} id={`${list.id===null?list.code:list.id}`}>{list.name}</Menu.Item>
                                            )
                                        })
                                    }
                                </SubMenu>
                                )
                            })
                        }
                        </Menu>
               </div>
               <div className='user-group'>
                    <Tabs activeKey={this.state.activeKey} onChange={this.tabChange}>
                        <TabPane tab="成员管理" key='member'>
                        <div className="user-list">
                        <div className='user-data-aide'>
                        <AuthPower><Button god='drcy'><Icon type="upload" /> 导入</Button></AuthPower>
                        <AuthPower><Button god='dccy'><Icon type="download" /> 导出</Button></AuthPower>
                        </div>
                            <Table style={{width:'100%',float:'left'}} pagination={{ pageSize: 20 }} columns={this.userColumns} dataSource={this.state.data} />
                            <Adduser cannel={this.handleCancel} reloadData={this.getUnitList} show={this.state.addmask} role={this.state.rid} unit={this.state.uid} code={this.state.code} />
                            <SetUserMsg cannel={this.handleCancel} reloadData={this.getUnitList} showMask={this.state.setUser} userid={this.state.userID}  name={this.state.Name} loginid={this.state.loginid} phone={this.state.phone} role={this.state.rid} unit={this.state.uid} code={this.state.code} job={this.state.job} />
                        </div>
                        </TabPane>
                        <TabPane tab="已禁用帐号" key='disabled'>
                            <DisableUser data={this.state.disable} reloadData={this.getUserList} rid={this.state.rid} uid={this.state.uid} code={this.state.code}  />
                        </TabPane>
                        <TabPane tab="数据权限" key='data'>
                        333
                        </TabPane>
                    </Tabs>
                </div>
               </div>
            )
        }else{
            return null
        }
    }
}