import React,{Component} from 'react';
import {Form, Input, Button, Modal, Switch,message } from 'antd';
import axios from 'axios';
import AuthPower from '../../../authpower';
import {UserRoleList} from '../../../public';
import config from '../../../../config';


const FormItem=Form.Item;
// const TabPane = Tabs.TabPane;

 



class SetUserMsgForm extends Component{
    state={
        loading: false,
        reset:false,
        status:true
    }
    handleClick = () =>{
    }
    checkPhone=(rule, value, callback) =>{
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(value))){
            callback("手机号码有误，请重填");
        }else{
            callback();
        }
    }
    handleOk = () => {
        this.props.form.validateFields((err,values) =>{
            if(!err){
                this.setState({
                    loading:true
                })
                axios.put(`${config.api_server}/sys/user`,{
                    id:this.props.userid,
                    userName:values.name,
                    loginId:values.username,
                    unitId:this.props.unit,
                    phone:values.phone,
                    positionName:values.job,
                    isForbid:!this.state.status,
                    userRole:[
                        {
                            id:sessionStorage.getItem('role')?sessionStorage.getItem('role'):this.props.role
                        }
                    ]
                }).then(res =>{
                    if(res.data.success){
                        message.success('用户信息修改成功');
                        this.props.reloadData(1,this.props.unit,this.props.role,this.props.code)
                        this.props.cannel();
                        this.setState({
                            loading:false
                        })
                        sessionStorage.removeItem('role');
                    }else{
                        message.error(res.data.message)
                    }
                })
            }
        })
    }
    handleCancel = () => {
       this.props.cannel();
       //eslint-disable-next-line
       this.setState({
           reset:true
       })
     }
    switchChange=(e) =>{
        this.setState({
            status:e
        })
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
        console.log(this.props.role)
        return(
            <div>
            <Modal 
            title="成员设置"
            wrapClassName="vertical-center-modal"
            visible={this.props.showMask}
            onCancel={this.handleCancel}
            destroyOnClose={true}
            footer={[
                <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                  提交
                </Button>
              ]}
            >
            {/* <Tabs defaultActiveKey="1"> */}
                {/* <TabPane tab="基本信息设置" key="1"> */}
                <Form>
                 <FormItem
                 {...formItemLayout}
                 label="姓名"
                 hasFeedback
                 >
                 {getFieldDecorator('name', {
                    rules: [{
                    required: true, message: '请输入用户姓名!',
                    }],
                    initialValue:this.props.name
                })(
                    <Input />
                )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="用户名"
                >
                {getFieldDecorator('username',{
                    initialValue:this.props.loginid
                })(<Input disabled={true} />)}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="手机号码"
                >
                {getFieldDecorator('phone', {
                    rules: [{
                    required: true,whitespace:true, max:11,  message: '请输入手机号码!',
                    },{
                        validator:this.checkPhone
                    }],
                    initialValue:this.props.phone
                })(<Input />)}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="角色"
                >
                {getFieldDecorator('role')(<UserRoleList selectValue={this.props.role} uid={this.props.unit} self={this.props.myself} />)}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="职位"
                >
                {getFieldDecorator('job',{
                    initialValue:this.props.job
                })(<Input />)}
                </FormItem>
                <AuthPower>
                <FormItem
                 god='jyyh'
                {...formItemLayout}
                label="成员状态"
                >
                {getFieldDecorator('status',{
                    initialValue:true,
                })(<Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked onChange={this.switchChange} />)}
                </FormItem>
                </AuthPower>
                </Form>
                {/* </TabPane> */}
                {/* <TabPane tab="修改成员密码" key="2">
                <Input addonBefore="设置密码" type='password' placeholder="请输入新的密码" maxLength='16' />
                </TabPane> */}
            {/* </Tabs> */}
        </Modal>
        </div>         
        )
    }
}

const SetUserMsg=Form.create()(SetUserMsgForm)
export default  SetUserMsg