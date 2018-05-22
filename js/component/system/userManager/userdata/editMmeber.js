import React,{Component} from 'react';
import { Button, Modal, Form} from 'antd';
import {UserRoleList} from '../../../public';

const FormItem=Form.Item;

class EditModal extends Component{
    state={
        loading: false,
        visible:false
    }
    showEdit= () =>{
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
        return(
            <span>
            <Button id='editRole' style={{display:'none'}} onClick={this.showEdit} ref={(button) =>{this.editBtn=button}}>调整角色</Button>
            <Modal
            title="调整角色"
            wrapClassName="vertical-center-modal"
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
                <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>
                  提交
                </Button>,
              ]}
            >
            <FormItem
                {...formItemLayout}
                label="用户角色"
                >
                {getFieldDecorator('role')(<UserRoleList />)}
                </FormItem>
            </Modal>
            </span>
        )
    }
}

const EditMemberForm=Form.create()(EditModal);

export default EditMemberForm;
