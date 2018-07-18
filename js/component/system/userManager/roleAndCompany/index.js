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


console.log(sessionStorage.getItem('cid'))

export default class RoleAndCompany extends Component{
    state={
        deptData:[],
        data:[],
        disable:[],
        setUser:false,
        addmask:false,
        selectedKeys:[],
        defaultOpenKeys:[],
        activeKey:'member',
        self:false,
        ok:'',
        total:20
    }
    componentDidMount(){
        this.getUnitList()
    }
    getUnitList=(pn,uid,rid,cod) =>{
        axios.post(`${config.api_server}/sys/user/unitrole`,{
            params:{
                userID:'001'
            }
        }).then(res =>{
            this.setState({
                deptData:res.data,
                selectedKeys:sessionStorage.getItem('addUser')?[sessionStorage.getItem('addUser')]:[`${res.data[0].unitRole[0].id}-${res.data[0].id}`],
                ok:`${res.data[0].id}`,
                defaultOpenKeys:[`${res.data[0].id}-${res.data[0].code}`],
                uid:this.state.uid==undefined?res.data[0].id:this.state.uid,
                rid:this.state.rid==undefined?res.data[0].unitRole[0].id:this.state.rid,
                code:this.state.code==undefined?res.data[0].code:this.state.code,
            })
            this.getUserList(pn?pn:1,uid?uid:res.data[0].id,rid?rid:sessionStorage.getItem('addUser')?sessionStorage.getItem('addUser').split('-')[0]:res.data[0].unitRole[0].id,cod?cod:res.data[0].code);
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
                data:res.data.page.datas,
                total:res.data.page.totalRecord
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
        if(e.key.split('-')[1]==this.state.ok && e.key.split('-')[0]==this.state.rid){
              console.log('不要重复操作!')
        }else{
            this.getUserList(1,e.keyPath[1].split('-')[0],e.key.split('-')[0],e.keyPath[1].split('-')[1])
                this.setState({
                    ok:e.key.split('-')[1],
                    rid:e.key.split('-')[0],
                    uid:e.keyPath[1].split('-')[0],
                    code:e.keyPath[1].split('-')[1]
            })
        }
    }
    showSet=(record) =>{
        this.setState({
            self:false,
            setUser:true,
            userID:record.id,
            Name:record.username,
            loginid:record.loginid,
            phone:record.phone,
            role:record.roleID,
            job:record.positionname,
        })
        if(record.id==JSON.parse(sessionStorage.getItem('user')).id){
            this.setState({
                self:true,
            })
        }        
    }
    delConfirm=(record) => {
        if(record.id!=JSON.parse(sessionStorage.getItem('user')).id){
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
        }else{
            message.error('不能删除当前登录用户!')
        }
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
    pageChange=(v) =>{
        this.getUserList(v,this.state.uid,this.state.rid,this.state.code)
    }
    resetPwd=(record) =>{
         axios.post(`${config.api_server}/sys/user/resetpwd`,{
            loginId:record.loginid
         }).then(res =>{
             if(res.data.success){
                 message.success(`${record.loginid}的密码已被重置为:123456`)
             }else{
                message.error('服务器错误!') 
             }
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
            <AuthPower>
             <Popconfirm god='czmm' title="确定将用户密码重置为123456?" placement='bottom' onConfirm={this.resetPwd.bind(this,record)} okText="确定" cancelText="取消">
             <a href="javascript:void(0)">重置密码</a>
             </Popconfirm>
             </AuthPower>
             <Divider type="vertical" />
             <AuthPower><a href="javascript:void(0)" god='bjcy' onClick={this.showSet.bind(this,record)}>编辑</a></AuthPower>
             <Divider type="vertical" />
             <AuthPower>
             <Popconfirm god='sccy' title="删除后在已禁用账户里打开此账户,确定删除吗?" placement='bottom' onConfirm={this.delConfirm.bind(this,record)} okText="删除" cancelText="取消">
             <a href="javascript:void(0)">删除</a>
            </Popconfirm>
            </AuthPower>
            </span>
        )
        }
    ];
    render(){
        const pagination = {
            total:this.state.total,
            onChange:this.pageChange
        }
        if(this.state.deptData.length>0){
            return(
                <div className='role-content' sytle={{display:sessionStorage.getItem('isOver')?'block':'none'}}>
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
                                <SubMenu key={item.id===null?`-${item.code}`:`${item.id}-${item.code}`} title={item.code==2?<span>{item.name}</span>:<span><AuthPower><Icon type="plus-circle-o" id={item.id} onClick={this.shwoAdd} god='xzcy' /></AuthPower>{item.name}</span>}>
                                    {
                                        item.unitRole.map(list =>{
                                            return(
                                                <Menu.Item title={list.name} key={`${list.id==''?111:list.id}-${item.id}`} id={`${list.id===null?list.code:list.id}`}>{list.name}</Menu.Item>
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
                            <Table style={{width:'100%',float:'left'}} pagination={pagination} columns={this.userColumns} dataSource={this.state.data} />
                            <Adduser cannel={this.handleCancel} reloadData={this.getUnitList} show={this.state.addmask} role={this.state.rid} unit={this.state.uid} code={this.state.code} />
                            <SetUserMsg cannel={this.handleCancel} reloadData={this.getUnitList} showMask={this.state.setUser} userid={this.state.userID}  name={this.state.Name} loginid={this.state.loginid} phone={this.state.phone} role={this.state.rid} unit={this.state.uid} code={this.state.code} job={this.state.job} myself={this.state.self} />
                        </div>
                        </TabPane>
                        <TabPane tab="已禁用帐号" key='disabled'>
                            <DisableUser data={this.state.disable} reloadData={this.getUserList} rid={this.state.rid} uid={this.state.uid} code={this.state.code}  />
                        </TabPane>
                        <TabPane tab="数据权限" key='data' disabled={true}>
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