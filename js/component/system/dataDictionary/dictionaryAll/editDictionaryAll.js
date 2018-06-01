import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Modal,Form,Input,LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import config from '../../../../config';
// import WrappedRegistrationForm from "./test";
// import './eventCategory.less';

const { TextArea } = Input;
const FormItem = Form.Item;
class AddEventCategory extends Component{
    state = {
        editVisible:false,
        editLoading:false,
        alertVisible:false
    }
    Edit = () => {
        this.props.form.setFields({
            name: {
              value: this.props.recordData.name,
            },
            categoryCode: {
                value: this.props.recordData.categoryCode,
            },
            describeCode: {
                value: this.props.recordData.description,
            },
          });
        this.setState({
           editVisible: true
         });    
    } 
    success = () => {                       //操作完成提示弹框
        const modal = Modal.success({       // success('操作成功!');
            title: '操作成功',
            content: '编辑字典类别管理成功',
          });
          setTimeout(() => modal.destroy(), 1000);
    };
    error = () => {
        const modal = Modal.error({         // success('操作成功!');
            title: '操作失败',
            content: '编辑字典类别管理失败',
          });
          setTimeout(() => modal.destroy(), 2000);
    };

    editHandleOk = (e) => {
         e.preventDefault();
         let obj = {id: this.props.recordData.id};
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return ;
            }
            let parm = Object.assign(values,obj);
            this.setState({ editLoading: true});
            $axios({
                url:`${config.api_server}/sys/dict/update`,
                method:'post',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                data:parm
            }).then((res) => {
                let datas = res.data.success;
                if(datas){
                    this.props.getParentListData({});
                    setTimeout(() => {
                        this.props.changeT({editLoading: false, editVisible: false})  
                        this.setState({ editLoading: false, editVisible: false});
                    }, 1000);
                    setTimeout(() => {
                        this.success();
                    }, 1000);
                }else{
                    this.setState({ editLoading: false});
                    setTimeout(() => {
                        this.error();
                    }, 1000);
                }
            })
        });
    }
    editHandleCancel = (e) => {
        e.preventDefault;
        this.setState({ editVisible: false });
        this.props.changeT({editVisible:false});
    }
    afterClose = () => {
        this.setState({recordData:[]})
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
         let nameValue = "";
         let categoryCodeV = "";
         let description = "";
         let recordDataV = this.props.recordData; 
        if(recordDataV.id){
            nameValue = this.props.recordData.name;
            categoryCodeV = this.props.recordData.categoryCode;
            description = this.props.recordData.description
        }
        return (
            <Modal
                visible={this.props.editVisible}
                title="编辑字典类别管理"
                onOk={this.addHandleOk}
                onCancel={this.editHandleCancel}
                destroyOnClose={true}
                afterClose={this.afterClose}
                footer={[
                    <Button key="back" size="large" onClick={this.editHandleCancel}>取消</Button>,
                    <Button key="submit" type="primary" size="large" htmlType="submit" loading={this.state.editLoading} onClick={this.editHandleOk}>
                    保存
                    </Button>,
                ]}
            >
            <LocaleProvider locale={zhCN}>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                        类别名称&nbsp;
                        </span>
                    )}
                    hasFeedback
                    >
                    {getFieldDecorator('name', {
                        initialValue:nameValue,
                        rules: [{ required: true, message: '请输入类别名称', whitespace: true }, {
                            validator: this.eventName,
                        }],
                    })(
                        <Input placeholder = "如：资产类别"/>
                    )}
                    </FormItem>
                    <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                        类别编码&nbsp;
                        </span>
                    )}
                    hasFeedback
                    >
                    {getFieldDecorator('categoryCode', {
                        initialValue:categoryCodeV,
                        rules: [{ required: true, message: '请输入类别编码', whitespace: true }, {
                            validator: this.eventName,
                        }],
                    })(
                        <Input placeholder = "如：ZCLB"/>
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
                    {getFieldDecorator('describeCode', {
                        initialValue:description,
                        rules: [{ required: false, message: '请输入事件类型描述!', whitespace: true }],
                    })(
                        <TextArea rows={4} />
                    )}
                    </FormItem>
                </Form>
                </LocaleProvider>
            </Modal>
        )     
    }
}
const WrappedRegistrationForm = Form.create()(AddEventCategory);

export default WrappedRegistrationForm;