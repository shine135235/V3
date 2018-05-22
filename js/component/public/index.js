import React,{Component} from 'react';
import {Select} from 'antd';
import axios from 'axios';

const Option = Select.Option;
//eslint-disable-next-line
const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };

//获取角色列表
export class UserRoleList extends Component{
    state={
        sp:[]
    }
    componentDidMount(){
        axios.get('/data/yhgl/depart.json').then(res =>{
            this.setState({
                sp:res.data[0].childDept
            })
        })
    }
    handleChange(value){
        sessionStorage.setItem('role',value)
    }
    render(){
       if(this.state.sp!=null){
           return (
               <Select key='role' defaultValue={this.props.selectValue} style={{width:"100%"}} mode={this.props.mode} onChange={this.handleChange} allowClear={true}  placeholder="请为该人员设置角色">
                   {
                     this.state.sp.map((item,i) =>{
                         return (
                             <Option key={`role${i}`} value={item.deptID}>{item.deptName}</Option>
                         )
                     })  
                   }
               </Select>
           )
       }else{
           return (
               <Select>
                   <Option>111</Option>
               </Select>
           )
       }
    }
}

//获取项目列表
export class ProjectList extends Component{
    constructor(props){
        super(props)
        this.state={
            project:[],
        }
    }
    componentDidMount(){
        axios.get('http://172.16.6.9:9090/pro/pList').then(res =>{
            this.setState({
                project:res.data.page.datas
            })
        })
    }
    handelChange=(v) =>{
        sessionStorage.setItem('projectID',v)
    }
    render(){
        return (
                <Select key='project' mode={this.props.mode}  defaultValue={this.props.values} style={{width:"100%"}}  placeholder="请选择项目" onChange={this.handelChange}>
                {
                    this.state.project.map((item,i) =>{
                        return(
                            <Option key={`project${i}`} value={item.id}>{item.name}</Option>
                        )
                    })
                }
            </Select>
        )
    }
}
