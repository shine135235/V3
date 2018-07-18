import React,{Component} from 'react';
import $axios from 'axios'
import { Button,Modal,Form,Input,LocaleProvider,message,Tooltip,Icon} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import config from '../../../../config';
// import WrappedRegistrationForm from "./test";
// import './eventCategory.less';

const { TextArea } = Input;
const FormItem = Form.Item;
class Editchild extends Component{
    state = {
        editVisible:false,
        editLoading:false,
        // alertVisible:false
      }
    handleSubmit = (e) => {
        e.preventDefault();
    }
    success = (success) => {
        message.success(success)
    };
    error = (error) => {
        message.error(error)
    }
    editHandleOk = (e) => {
         e.preventDefault();
         let obj = {id: this.props.record.id};
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return ;
            }
            let parm = Object.assign(values,obj);
            this.setState({ editLoading: true});
            $axios({
                url:`${config.api_server}/sys/area/update`,
                method:'post',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                data:parm
            }).then((res) => {
                let datas = res.data.success;
                if(datas){
                    setTimeout(() => {
                        this.props.getDataList({pageNum:1,pageSize:10,param:""})
                        this.props.changeT({editLoading: false, editVisible: false});
                    }, 1000);  
                    setTimeout(() => {
                        let success = "编辑片区成功"
                                this.success(success);
                    }, 1000);
                }else{
                    this.setState({ editLoading: false});
                    let error = ""
                    if(res.data.message && res.data.message != ""){
                        error = res.data.message
                    }else{
                        error = "编辑片区失败"
                    }
                    setTimeout(() => {
                        this.error(error);
                    }, 1000);
                }
           })
        });  
    }

    editHandleCancel = () => {
        this.setState({editVisible:false})
        this.props.changeT({editVisible:false});
    }
    eventCodeName = (rule, value, callback) =>{
        let cat =/^[A-Z]+$/;
        if(cat.test(value)){
            callback()
        }else{
            callback('建议代号格式区域名称拼音首字母大写')
        }  
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const text = <span>代号为区域名称拼音首字母大写</span>;
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
        let recordDataV = this.props.record; 
        // //eslint-disable-next-line
         //console.log("recordDataVrecordDataV1",recordDataV);
        if(recordDataV.id){
            nameValue = recordDataV.areaName;
            categoryCodeV = recordDataV.code;
            description = recordDataV.areaDesc
        }
        return (
            <span>
                <Modal
                    visible={this.props.editVisible}
                    title="编辑片区"
                    onOk={this.editHandleOk}
                    onCancel={this.editHandleCancel}
                    destroyOnClose={true}
                    footer={[
                        <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;建议代号格式区域名称拼音首字母大写</span>,
                        <Button key="back" size="large" onClick={this.editHandleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" htmlType="submit" loading={this.state.addLoading} onClick={this.editHandleOk}>
                        保存
                        </Button>,
                    ]}
                >
                <LocaleProvider local={zhCN}>
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
                             initialValue:nameValue,
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
                            <Tooltip placement="top" title={text}>
                                    <Icon type="info-circle-o"  className = "iTip" />
                            </Tooltip>
                            </span>
                        )}
                        hasFeedback
                        >
                        {getFieldDecorator('code', {
                             initialValue:categoryCodeV,
                            rules: [{ required: true, message: '请输入代号', whitespace: true }, {
                                validator: this.eventCodeName,
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
                            initialValue:description,
                            rules: [{ required: false, message: '请输入区域描述!', whitespace: true }],
                        })(
                            <TextArea rows={4} />
                        )}
                        </FormItem>
                    </Form>
                    </LocaleProvider>
                </Modal> 
            </span>
        )
    }
}
const WrappedRegistrationForm = Form.create()(Editchild);

export default WrappedRegistrationForm;