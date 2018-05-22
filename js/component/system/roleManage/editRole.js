import React,{Component} from 'react';
import axios from 'axios';
import {Modal,Form, Input,Button,message} from 'antd';

const FormItem=Form.Item;
class EditRoleFrom extends Component{
    constructor(props){
        super(props)
        this.state = { 
            visible:false
        }
    }
    componentWillReceiveProps(){
        this.setState({
        visible:this.props.show
        })
    }
    handleOk = () => {
        axios.put('http://172.16.6.5:9090/sys/role',{
            id:this.props.id,
            name:this.props.form.getFieldValue('role'),
            isOpean:this.props.public
        }).then(res =>{
        if(res.data.success){
            message.success('角色修改成功');
            this.props.hide();
            this.props.reloadData();
        }else{
            message.error(res.data.message)
        }
        })
    }
    handleCancel = () => {
    this.props.hide()
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
        return (
         
                <Modal
                title='编辑角色'
                visible={this.props.show}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                onClick={this.handleClick}
                destroyOnClose={true}
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
                    label="角色名称"
                    hasFeedback
                    >
                    {getFieldDecorator('role', {
                        rules: [{
                        required: true, message: '请输入角色名称!',
                        }],
                        initialValue:this.props.name
                    })(
                        <Input />
                    )}
                    </FormItem>
                  </Form>
                </Modal>
            
        )
    }
}

const EditRole =Form.create()(EditRoleFrom)

export default EditRole;