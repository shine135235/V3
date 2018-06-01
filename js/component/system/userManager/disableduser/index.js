import React,{Component} from 'react';
import {Table,Switch,message} from 'antd';
import axios from 'axios';
import config from '../../../../config';

export default class DisableUser extends Component{
    state={
        data:[]
    }
    changeUser=(record) =>{
        axios.put(`${config.api_server}/sys/user/start`,{
            id:record.id
        }).then(res =>{
            if(res.data.success){
                message.success('角色已启用!');
                this.props.reloadData(1,this.props.uid,this.props.rid,this.props.code)
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
            <Switch checkedChildren="启用" unCheckedChildren="禁用" onChange={this.changeUser.bind(this,record)}  />
        )
        }
    ];
    render(){
        return (
            <Table style={{width:'100%',float:'left'}} pagination={{ pageSize: 20 }} columns={this.userColumns} dataSource={this.props.data} />
        )
    }
}