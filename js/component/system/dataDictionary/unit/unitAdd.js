import React,{Component} from 'react';
import axios from 'axios';
import { Button,Modal,Form,Input,Row,Col,LocaleProvider,message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
// import WrappedRegistrationForm from "./test";
// import './eventCategory.less';
 import SelectOne from "../../../publicSub/selectOne";
 import config from '../../../../config';

const { TextArea } = Input;
const FormItem = Form.Item;
class AddEventCategory extends Component{
    state = {
        addVisible:false,
        addLoading:false,
        rowCode:["DWLX"],
        // datdas:"",
        reset:true,
        listData:[]
      }
      
    componentDidMount(){
    }
    componentDidUpdate(){
       
    }
    handleSubmit = (e) => {
        e.preventDefault();
    }
    //操作完成提示弹框
    success = () => {
        // success('操作成功!');
        message.success("添加服务单位成功")
    };
    error = (error) => {
        message.error(error)
    }
    addHandleOk = (e) => {
         e.preventDefault();
        this.props.form.validateFieldsAndScroll(['name','pepole','phone','adds','describeCode'],(err) => {

            if(!sessionStorage.getItem('selectValue')){
                this.props.form.setFields({
                    categoryCode:{
                        value:"",
                        errors: [new Error('请选择单位类型')],
                    }
                })
            }else{
                this.props.form.setFields({
                    categoryCode:{
                        value:"",
                    }
                })
            }
            let values = {
                "name":this.props.form.getFieldValue("name"),
                "principal":this.props.form.getFieldValue("pepole"),
                "principalPhone":this.props.form.getFieldValue("phone"),
                "address":this.props.form.getFieldValue("adds"),
                "note":this.props.form.getFieldValue("describeCode"),
                "unitType":sessionStorage.getItem('selectValue'),
                "unitCode":"1",
            }
        if (err) {
            return ;
        }
        this.setState({ addLoading: true});
            axios({
                url:`${config.api_server}/sys/unit/add`,
                method:'post',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                data:values
            }).then((res) => {
                let datas = res.data.success;
                if(datas){
                    this.props.getDataList({pageNum:1,pageSize:10,param:""});
                    setTimeout(() => {
                        this.setState({ addLoading: false, addVisible: false});
                    }, 1000);
                    setTimeout(() => {
                        this.success();
                    }, 1000);
                }else{
                    this.setState({ addLoading: false});
                    let error = ""
                    if(res.data.message && res.data.message != ""){
                        error = res.data.message
                    }else{
                        error = "添加服务单位失败"
                    }
                    setTimeout(() => {
                            this.error(error);
                    }, 1000);
                }
           })
        });     
    }
    addHandleCancel = () => {
        this.setState({
            addVisible: false,
            reset:true
        });
    }

    AddNews = () => {
        this.setState({
           addVisible: true,
           editVisible: false,
          });
    }
    handleChange = () => {
        
    }
    handleBlur = () => {
       
        
    }
    handleFocus = () => {
        

    }
    afterClose = () => {
        sessionStorage.removeItem('selectValue');
    }
    onFieldsChange = () =>{
        
    }
    checkPhone=(rule, value, callback) =>{
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(value)) && !(/^(\d3,4|\d{3,4}-)?\d{7,8}$/).test(value)){
            callback("手机号码有误，请重填");
        }else{
            callback();
        }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const formItemLayoutWithOutLabel = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 11 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 13 },
            },
          };
          
        return (
            <span>
                <Button type="primary" onClick = {this.AddNews} icon="plus">新建</Button>
                <Modal
                    visible={this.state.addVisible}
                    title="添加服务单位"
                    onOk={this.addHandleOk}
                    onCancel={this.addHandleCancel}
                    onFieldsChange = {this.onFieldsChange}
                    afterClose = {this.afterClose}
                    destroyOnClose={true}
                    footer={[
                        // <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;类别编码格式统一为拼音首字母大写</span>,
                        <Button key="back" size="large" onClick={this.addHandleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" htmlType="submit" loading={this.state.addLoading} onClick={this.addHandleOk}>
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
                                单位名称&nbsp;
                                </span>
                            )}
                            hasFeedback
                            >
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: '请输入单位名称', whitespace: true }, {
                                        validator: this.eventName,
                                    }],
                                })(
                                    <Input placeholder = "请输入单位名称"/>
                                )}
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                单位类型&nbsp;
                                </span>
                            )}
                            hasFeedback
                            >
                                {getFieldDecorator('categoryCode', {
                                    //   initialValue:"",
                                    rules: [{ required: true, message: '请选择单位类型', whitespace: true }, {
                                        validator: this.eventName,
                                    }],
                                })(
                                    <SelectOne rowCode = {this.state.rowCode}/>
                                )}
                            </FormItem>
                            {/* <SelectOne rowCode = {this.state.rowCode} setSelectChange = {this.setSelectChange} reset={this.state.reset} /> */}
                            <Row>
                                <Col span = {11} key = {1} >
                                    <FormItem
                                    style = {{"display":"inline-block"}}
                                    {...formItemLayoutWithOutLabel}
                                    label={(
                                        <span>
                                        负责人&nbsp;
                                        </span>
                                    )}
                                    hasFeedback
                                    >
                                        {getFieldDecorator('pepole', {
                                            rules: [{ required: true, message: '请输入负责人', whitespace: true }, {
                                                validator: this.eventName,
                                            }],
                                        })(
                                            <Input placeholder = "请输入负责人"/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span = {12} key = {2}  style = {{"display":"inline-block"}}>
                                    <FormItem
                                    style = {{"display":"inline-block"}}
                                    {...formItemLayoutWithOutLabel}
                                    label={(
                                        <span>
                                        联系电话&nbsp;
                                        </span>
                                    )}
                                    hasFeedback
                                    >
                                        {getFieldDecorator('phone', {
                                            rules: [{ required: true, message: '请输入联系电话', whitespace: true }, {
                                                validator: this.checkPhone,
                                            }],
                                        })(
                                            <Input placeholder = "请输入联系电话"/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            
                            <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                详细地址&nbsp;
                                </span>
                            )}
                            hasFeedback
                            >
                                {getFieldDecorator('adds', {
                                    rules: [{ required: true, message: '请输入详细地址', whitespace: true }, {
                                        validator: this.eventName,
                                    }],
                                })(
                                    <Input placeholder = "请输入详细地址"/>
                                )}
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                备注&nbsp;
                                </span>
                            )}
                            hasFeedback
                            >
                                {getFieldDecorator('describeCode', {
                                    rules: [{ required: false, message: '请输入备注信息!', whitespace: true }],
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
const WrappedRegistrationForm = Form.create()(AddEventCategory);

export default WrappedRegistrationForm;