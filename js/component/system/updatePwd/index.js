import React,{Component} from 'react';
import axios from 'axios';
import { Form, Input, Button, message} from 'antd';
import config from '../../../config';
import './index.less'


const FormItem = Form.Item;
class UpdatePwd extends Component{
    state = {
        confirmDirty: false
    };
    componentDidMount(){
    }
    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                axios.post(`${config.api_server}/sys/user/setpwd`,{
                    loginId:values.userName,
                    oldPwd:btoa(values.oldPassword),
                    newPwd:btoa(values.confirm)
                }).then(res =>{
                    if(res.data.success){
                        message.success('密码修改成功,请重新登录!');
                        this.props.history.push("/login")
                    }else{
                        message.error(res.data.message)
                    }
                })
            }
        });
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入密码不一致!');
        } else {
            callback();
        }
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }
    checkOldPwd = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
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
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                span: 24,
                offset: 0,
                },
                sm: {
                span: 14,
                offset: 4,
                },
            },
        };
        return (
            <div className='updatePwd'>
                    <div className='updatePwd_Content'>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem
                                {...formItemLayout}
                                label="用户名"
                                hasFeedback
                            >
                                {getFieldDecorator('userName', {
                                        rules: [
                                            // {type: 'email', message: 'The input is not valid E-mail!',}, 
                                            {required: true}
                                        ],
                                        initialValue:JSON.parse(sessionStorage.getItem('user')).loginId
                                    })(
                                        <Input  disabled={true}/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="原密码"
                                hasFeedback
                            >
                                {getFieldDecorator('oldPassword', {
                                    rules: [
                                        {required: true, message: '请输入您正在使用的密码!',}, 
                                        {validator: this.checkOldPwd,}
                                    ],
                                })(
                                    <Input type="password" />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="新密码"
                                hasFeedback
                            >
                                {getFieldDecorator('password', {
                                    rules: [
                                        {required: true,min:6,max:16, message: '密码最小6位,最大16位!',}, 
                                        {validator: this.checkConfirm,}
                                    ],
                                })(
                                    <Input type="password" />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="确认密码"
                                hasFeedback
                            >
                                {getFieldDecorator('confirm', {
                                    rules: [
                                        {required: true, min:6,max:16, message: '密码最小6位,最大16位'}, 
                                        {validator: this.checkPassword}
                                    ],
                                })(
                                    <Input type="password" onBlur={this.handleConfirmBlur} />
                                )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                            </FormItem>
                        </Form>
                    </div>
            </div>
        )
    }
}


const updatePwd = Form.create()(UpdatePwd);
export default updatePwd;
