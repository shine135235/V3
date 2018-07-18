import React,{Component} from 'react';
import {Form, Input, Button, Modal, Switch, Select, message,Alert } from 'antd';
import axios from 'axios';
import AuthPower from '../../../authpower';
import config from '../../../../config';

const FormItem=Form.Item;
const Option = Select.Option;

class UserRoles extends Component{
    state={
        sp:[]
    }
    componentWillMount(){
        axios.get(`${config.api_server}/sys/role/selectlist`,{
            params:{
                unitId:sessionStorage.getItem('uid')
            }
        }).then(res =>{
            this.setState({
                sp:res.data
            })
        })
    }
    onSelect=(value) =>{
        this.props.selects(value)
    }
    render(){
        return (
        <Select key='role'  style={{width:"100%"}}  placeholder="请为该人员设置角色" onSelect={this.onSelect}>
                {
                    this.state.sp.map((item,i) =>{
                        return (
                            <Option key={`role${i}`} value={item.id}>{item.name}</Option>
                        )
                    })  
                }
        </Select>
        )
    }
}

class AdduserForm extends Component{
    state={
        loading:false,
        status:true,
        sp:[],
        roleValue:''
    }
    switchChange=(e) =>{
        this.setState({
            status:e
        })
    }
    checkPhone=(rule, value, callback) =>{
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(value))){
            callback("手机号码有误，请重填");
        }else{
            callback();
        }
    }
    checkUserName=(rule,value,callback) =>{
        if(!(/[a-zA-Z0-9_@-]$/.test(value))){
            callback('只能输入英文字母,数字,合法字符')
        }else{
            callback();
        }
    }
    // checkPassword=(rule,value,callback) =>{
    //     if(!(/[A-Z]|[a-z]|[0-9]|[`~!@#$%^&*()+=]$/.test(value))){
    //         callback('只能输入英文字母,数字,字符')
    //     }else{
    //         callback();
    //     }
    // }
    handleOk=() =>{
        this.props.form.validateFields((err,values)=>{
            if(!err){
                this.setState({
                    loading:true
                })
                axios.post(`${config.api_server}/sys/user`,{
                    userName:values.name,
                    loginId:values.username,
                    unitId:this.props.unit,
                    phone:values.phone,
                    isForbid:!this.state.status,
                    userRole:[
                        {
                            id:values.role
                        }
                    ]
                }).then(res =>{
                    if(res.data.success){
                        message.success('添加成功');
                        this.props.reloadData(1,this.props.unit,this.props.role,this.props.code)
                        this.props.cannel();
                        this.setState({
                            loading:false
                        })
                    }else{
                        message.error(res.data.message);
                        this.setState({
                            loading:false
                        })
                    }
                })
            }else{
                this.setState({
                    loading:false
                })
            }
        })
    }
    handleCancel = () => {
        this.props.cannel();
    }
    selectChange=(value) =>{
        this.props.form.setFields({
            role: {
              value:value
            },
          });
          sessionStorage.setItem('addUser',`${value}-${this.props.unit}`)
    }
    render(){
        const { getFieldDecorator } = this.props.form;
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
        return(
            <Modal
            title="新增用户"
            wrapClassName="vertical-center-modal"
            visible={this.props.show}
            onCancel={this.handleCancel}
            destroyOnClose='true'
            footer={[
                <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                  提交
                </Button>
              ]}
            >
            <Form>
                 <FormItem
                 {...formItemLayout}
                 label="姓名"
                 hasFeedback
                 >
                 {getFieldDecorator('name', {
                    rules: [{
                    required: true,whitespace:true,  message: '请输入用户姓名!',
                    }]
                })(
                    <Input />
                )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="用户名"
                >
                {getFieldDecorator('username', {
                    rules: [
                    {
                    required: true,whitespace:true, min:3, max:16,  message: '请输入3-16位用户名'
                    },{
                        validator:this.checkUserName
                    }
                ]
                })(<Input maxLength={16} />)}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="手机号码"
                >
                {getFieldDecorator('phone', {
                    rules: [{
                    required: true,whitespace:true, max:11,  message: '请输入手机号码',
                    },{
                        validator:this.checkPhone
                    }]
                })(<Input />)}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="用户角色"
                >
                {getFieldDecorator('role', {
                    rules: [{
                    required: true,message: '请为用户设置一个角色!',
                    }]
                })(
                    <UserRoles selects={this.selectChange} />
                )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="职位"
                >
                {getFieldDecorator('job')(<Input />)}
                </FormItem>
                <AuthPower>
                <FormItem
                 god='jyyh'
                {...formItemLayout}
                label="成员状态"
                >
                {getFieldDecorator('status')(<Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked={true} onChange={this.switchChange} />)}
                </FormItem>
                </AuthPower>
                </Form>
                <Alert message="新增用户默认密码为 123456" type="info" showIcon  />
            </Modal>
        )
    }
}

const Adduser=Form.create()(AdduserForm)
export default  Adduser