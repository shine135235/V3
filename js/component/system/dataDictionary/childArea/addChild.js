import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Modal,Form,Input } from 'antd';
// import WrappedRegistrationForm from "./test";
// import './eventCategory.less';

const { TextArea } = Input;
const FormItem = Form.Item;
class Addchild extends Component{
    state = {
        addVisible:this.props.addVisible,
        addLoading:false,
        alertVisible:false
      }
    componentDidMount(){

    }
    componentDidUpdate(){
       
    }
    handleSubmit = (e) => {
        e.preventDefault();
        // this.props.form.validateFieldsAndScroll((err, values) => {
        //   if (!err) {
        //       //eslint-disable-next-line
        //     console.log('Received values of form: ', values);
        //   }
        // });
    }
    //操作完成提示弹框
    success = () => {
        // success('操作成功!');
        const modal = Modal.success({
            title: '操作成功',
            content: '添加字典类别管理成功',
          });
          setTimeout(() => modal.destroy(), 2000);
    };

     error = () => {
        Modal.error({
          title: '操作失败',
          content: '添加字典类别失败',
        });
      }
    addHandleOk = (e) => {
        this.setState({ addLoading: true});
         e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            //eslint-disable-next-line
            console.log("test",values);
          if (!err) {
                $axios({
                    url:"http://172.16.6.11:9090/sys/area/add",
                    method:'post',
                    headers: {
                        'Content-type': 'application/json;charset=UTF-8'
                    },
                    data:values
                }).then((res) => {
                    let datas = res.data.success;
                    if(datas){
                        this.props.getDataList({});
                            setTimeout(() => {
                                this.success();
                            }, 3000);
                    }else{
                        setTimeout(() => {
                            this.error();
                        }, 3000);
                    }
                })
            }            
        });
        setTimeout(() => {
          this.setState({ addLoading: false, addVisible: false});
        }, 3000);    
    }
    addHandleCancel = () => {
        this.setState({ addVisible: false });
    }

    AddNew = () => {
        this.setState({
           addVisible: true,
           editVisible: false,
          });
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
            <span>
                <Button type="primary" onClick = {this.AddNew} icon="plus">新建</Button>
                <Modal
                    visible={this.state.addVisible}
                    title="新建片区"
                    onOk={this.addHandleOk}
                    onCancel={this.addHandleCancel}
                    footer={[
                        <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;类别编码格式统一为拼音首字母</span>,
                        <Button key="back" size="large" onClick={this.addHandleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" htmlType="submit" loading={this.state.addLoading} onClick={this.addHandleOk}>
                        保存
                        </Button>,
                    ]}
                >
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            区域名称&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输区域名称', whitespace: true }, {
                                validator: this.eventName,
                            }],
                        })(
                            <Input placeholder = "请输区域名称"/>
                        )}
                        </FormItem>
                        <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            代号&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                        {getFieldDecorator('code', {
                            rules: [{ required: true, message: '请输入代号', whitespace: true }, {
                                validator: this.eventName,
                            }],
                        })(
                            <Input placeholder = "请输入代号"/>
                        )}
                        </FormItem>
                        <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            描述&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                        {getFieldDecorator('areaDesc', {
                            rules: [{ required: false, message: '请输入区域描述!', whitespace: true }],
                        })(
                            <TextArea rows={4} />
                        )}
                        </FormItem>
                    </Form>
                </Modal> 
            </span>
        )
    }
}
const WrappedRegistrationForm = Form.create()(Addchild);

export default WrappedRegistrationForm;