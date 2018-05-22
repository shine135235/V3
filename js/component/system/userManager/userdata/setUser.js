import React,{Component} from 'react';
import {Form, Input, Button, Modal, Tabs } from 'antd';
import {UserRoleList} from '../../../public';

const FormItem=Form.Item;
const TabPane = Tabs.TabPane;

class BaseUser extends Component{
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
                label="员工编号"
                >
                {getFieldDecorator('workID',{
                    initialValue:this.props.workid
                })(<Input />)}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="角色"
                >
                {getFieldDecorator('role')(<UserRoleList selectValue={this.props.role} />)}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="职位"
                >
                {getFieldDecorator('job',{
                    initialValue:this.props.job
                })(<Input />)}
                </FormItem>
                </Form>
        )
    }
}

const BaseUserMsg=Form.create()(BaseUser)

 
export default class SetUserMsg extends Component{
    state={
        loading: false,
        reset:false
    }
    handleClick = () =>{
    }
    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
          this.setState({ loading: false, visible: false });
        }, 3000);
    }
    handleCancel = () => {
       this.props.cannel();
       //eslint-disable-next-line
       this.setState({
           reset:true
       })
     }
    handleBan = () => {
        //eslint-disable-next-line
       console.log(this.modal);
    }
    handleSubmit = () =>{
    }
 
    render(){

        return(
            <div>
            <Modal 
            ref={(modal) =>{this.modal=modal}}
            title="成员设置"
            wrapClassName="vertical-center-modal"
            visible={this.props.showMask}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
                <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                  提交
                </Button>,
                <Button key="ban" size="large" onClick={this.handleBan}>
                禁用
              </Button>,
              ]}
            >
            <Tabs defaultActiveKey="1">
                <TabPane tab="基本信息设置" key="1">
                <BaseUserMsg name={this.props.name} workid={this.props.workid} role={this.props.role} job={this.props.job} reset={this.state.reset} />
                </TabPane>
                <TabPane tab="修改成员密码" key="2">
                <Input addonBefore="设置密码" type='password' placeholder="请输入新的密码" maxLength='16' />
                </TabPane>
            </Tabs>
        </Modal>
        </div>         
        )
    }
}

 