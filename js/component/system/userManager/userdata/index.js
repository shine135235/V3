import React,{Component} from 'react';
import axios from 'axios';
import {Table,Divider } from 'antd';
import SetUserMsg from './setUser';

export default class UserList extends Component{
    constructor(props){
        super(props)
        this.state={
            data:[],
            openKyes:this.props.openKyes,
            setUser:false,
            Name:'1',
            workID:'1',
            role:[],
            job:'1',
            uid:'1'
        }
    }
    showSet=(record) =>{
        //eslint-disable-next-line
        console.log(record)
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
        dataIndex:"name"
        },{
        title:"工号",
        dataIndex:"workID"
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
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            //eslint-disable-next-line
          　console.log(`选择的行数: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
         
        }
      };
    userList=() =>{
        axios.get('/data/yhgl/userlist.json',{
            params:{
                cid:this.props.companyID,
                pid:this.props.deptID
            }
        }).then(res =>{
            this.setState({
                data:res.data
            })
        })
    }
    componentDidMount(){
        this.userList() 
    }
    
    render(){
        return(
            <div className="user-list">
                <Table rowSelection={this.rowSelection} pagination={{ pageSize: 20 }} columns={this.userColumns} dataSource={this.state.data} />
                <SetUserMsg cannel={this.handleCancel} showMask={this.state.setUser} uid={this.state.uid} name={this.state.Name} workid={this.state.workID} role={this.state.role} job={this.state.job} />
            </div>
        )
    }

}