import React,{Component} from 'react';
import {Select} from 'antd';
import axios from 'axios';
import config from '../../config';

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
        axios.get(`${config.api_server}/sys/role/selectlist`,{
            params:{
                unitId:this.props.uid?this.props.uid:''
            }
        }).then(res =>{
            this.setState({
                sp:res.data
            })
        })
    }
    handleChange(value){
        sessionStorage.setItem('role',value)
    }
    render(){
       if(this.state.sp.length>0){
           return (
               <Select key='role' disabled={this.props.self?this.props.self:false} defaultValue={this.props.selectValue} style={{width:"100%"}} mode={this.props.mode} onChange={this.handleChange}  placeholder="请为该人员设置角色">
                   {
                     this.state.sp.map((item,i) =>{
                         return (
                             <Option key={`role${i}`} value={item.id}>{item.name}</Option>
                         )
                     })
                   }
               </Select>
           )
       }else{
           return (
               <Select placeholder='请选择角色'></Select>
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
        axios.get(`${config.api_server}/pro/pList`).then(res =>{
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
