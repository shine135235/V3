import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Modal,Form,Input,LocaleProvider,message,Tooltip,Icon} from 'antd';
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
    //操作完成提示弹框
    success = () => {
        message.success("编辑字典类别成功")
    };
    error = (error) => {
        message.error(error)
    }

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
                    let pageNum = 1;
                    let pageSize = 10;
                    this.props.getParentListData({pageNum,pageSize});
                    // this.props.getParentListData({});
                    setTimeout(() => {
                        this.props.changeT({editLoading: false, editVisible: false})  
                        this.setState({ editLoading: false, editVisible: false});
                    }, 1000);
                    setTimeout(() => {
                        this.success();
                    }, 1000);
                }else{
                    this.setState({ editLoading: false});
                    let error = ""
                    if(res.data.message && res.data.message != ""){
                        error = res.data.message
                    }else{
                    error = "编辑字典类别失败"
                    }
                    setTimeout(() => {
                            this.error(error);
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
    eventCode = (rule, value, callback) =>{
        if(!(/^[A-Z]+$/g.test(value))){
            callback("类别编码建议为名称首字母大写");
        }else{
            callback();
        }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const text = <span>格式统一为名称拼音首字母大写</span>;
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
                title="编辑字典类别"
                onOk={this.addHandleOk}
                onCancel={this.editHandleCancel}
                destroyOnClose={true}
                afterClose={this.afterClose}
                footer={[
                    <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;建议类别编码格式统一为拼音首字母大写</span>,
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
                            <Tooltip placement="top" title={text}>
                                    <Icon type="info-circle-o"  className = "iTip" />
                            </Tooltip>
                        </span>
                    )}
                    hasFeedback
                    >
                    {getFieldDecorator('categoryCode', {
                        initialValue:categoryCodeV,
                        rules: [{ required: true, message: '请输入类别编码', whitespace: true }, {
                            validator: this.eventCode,
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