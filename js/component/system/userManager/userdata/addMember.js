import React,{Component} from 'react';
import {Form, Button, Modal, Input} from 'antd';
import {UserRoleList} from '../../../public';

const FormItem=Form.Item;

class AddMember extends Component{
    state={
        loading: false,
        visible:false,
    }
    showAdd= () =>{
        this.setState({
            visible:true
        })
    }
    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
          this.setState({ loading: false, visible: false });
        }, 3000);
    }
    handleCancel = () => {
        this.setState({
          visible: false,
        });
       this.props.form.resetFields();
      }
      handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
           values.role=sessionStorage.getItem("role");
          }
        });
      }
    render(){
        const { visible,loading } = this.state;
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
        return (
            <span>
            <Button onClick={this.showAdd} style={{marginLeft:10}}>添加成员</Button>
            <Form onSubmit={this.handleSubmit}>
             <Modal
            title="添加成员"
            wrapClassName="vertical-center-modal"
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
                <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleSubmit}>
                  提交
                </Button>,
              ]}
            >
  
                <FormItem
                {...formItemLayout}
                label="姓名"
                hasFeedback
                >
                {getFieldDecorator('name', {
                    rules: [{
                    required: true, message: '请输入用户姓名!',
                    }],
                })(
                    <Input />
                )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="登录用户名"
                hasFeedback
                >
                {getFieldDecorator('loginname', {
                    rules: [{
                    required: true, message: '请输入登录用户名!',
                    }],
                })(
                    <Input />
                )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="手机号码"
                hasFeedback
                >
                {getFieldDecorator('emailandphone', {
                    rules: [
                    {
                    type: 'email', message: '请输入正确的邮箱地址!',
                    },
                    {
                    required: true, message: '请输入邮箱地址!',
                    }],
                })(
                    <Input />
                )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="默认密码"
                hasFeedback
                >
                {getFieldDecorator('defaultPwd')(<Input />)}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="员工编号"
                >
                {getFieldDecorator('workID')(<Input />)}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="用户角色"
                >
                {getFieldDecorator('role')(<UserRoleList defaultvalue={[]} />)}
                </FormItem>
            </Modal>
            </Form>
            </span>
        )
    }
}

const AddMemberForm=Form.create()(AddMember);

export default AddMemberForm;