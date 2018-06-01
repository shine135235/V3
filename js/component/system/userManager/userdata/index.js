import React,{Component} from 'react';
import axios from 'axios';
import {Table,Divider,Button,Icon } from 'antd';
import SetUserMsg from './setUser';

export default class UserList extends Component{
    constructor(props){
        super(props)
        this.state={
            data:[],
            setUser:false,
            Name:'1',
            workID:'1',
            role:[],
            job:'1',
            uid:'1'
        }
    }
    componentDidMount(){
        this.getUserList(1)
    }
    componentWillReceiveProps(){
        console.log(this.props.uid)
        this.getUserList(1)
    }
    getUserList=(pn) =>{
        console.log(this.props.uid)
        axios.get('http://172.16.6.5:9090/sys/user',{
            params:{
                pageNum:pn,
                pageSize:10,
                unitId:this.props.uid,
                roleId:this.props.rid,
                code:this.props.code
            }
        }).then(res =>{
            this.setState({
                data:res.data.page.datas
            })
            
        })
    }
    showSet=(record) =>{
        this.setState({
            setUser:true,
            Name:record.name,
            workID:record.workID,
            role:record.roleID,
            job:record.job,
            uid:record.id
        })
    }
    handleCancel = () => {
        this.setState({
            setUser: false,
            role:[]
        });
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
             <a href="javascript:void(0)" onClick={this.showSet.bind(this,record)}>设置</a>
             <Divider type="vertical" />
             <a href="javascript:void(0)" onClick={this.showSet.bind(this,record)}>删除</a>
            </span>
        )
        }
    ];
 
    render(){
        return(
            <div className="user-list">
            <div className='user-data-aide'>
            <Button type='primary'><Icon type="plus" /> 新增</Button>
            </div>
                <Table pagination={{ pageSize: 20 }} columns={this.userColumns} dataSource={this.state.data} />
                <SetUserMsg cannel={this.handleCancel} showMask={this.state.setUser} uid={this.state.uid} name={this.state.Name} workid={this.state.workID} role={this.state.role} job={this.state.job} />
            </div>
        )
    }

}