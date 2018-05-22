import React , {Component} from "react";
import { Modal, Button, Form, Input, message } from "antd"
import $axios from "axios";
import "./index.less";

const FormItem = Form.Item;
class AddSensitiveModal extends Component {
    state = {
        loading: false,
        visible:false,
    }
    success = () => {
        message.success('添加成功');
    };
    error = () => {
        message.error('添加失败');
    };
    showAddSensitiveModal = () => {
        this.setState({visible:true});
    }
    addSensitiveData = (name) => {
        $axios.post(`http://172.16.6.9:9090/app/sensitive?name=${name}`).then((json) => {
            // eslint-disable-next-line
            console.log(json);
            if(json.data.success == true){
                this.props.getListData({});
                this.success();
            }else{
                this.error();
            }
        })
    }
    handleOk = (e) => {
        e.preventDefault();
        this.setState({ loading: true });
        this.props.form.validateFields((err, values) => {
            if (err) {
                this.setState({ loading: false });
                return;
            }
            // eslint-disable-next-line
            console.log('Received values of form: ', values);
            this.addSensitiveData(values.sensitiveName)
            this.setState({ loading: false, visible: false });
        });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    afterClose = () => {
        this.props.form.setFields({
            sensitiveName:{
                value:"",
                errors:null,
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="addSensitiveModal">
                <Button type="primary" icon="plus" onClick={this.showAddSensitiveModal}>新增</Button>
                <Modal
                    visible={this.state.visible}
                    title="新建敏感词"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    afterClose={this.afterClose}
                    footer={[
                        <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" htmlType="submit" loading={this.state.loading} onClick={this.handleOk}>保存</Button>,
                    ]}
                >
                        <FormItem
                            label="敏感词"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                        >
                            {getFieldDecorator('sensitiveName', {
                                rules: [{ required: true, message: '请输入敏感词!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                </Modal>
            </div>
            
        )
    }
}

const addSensitiveModal = Form.create()(AddSensitiveModal);
export default addSensitiveModal;
