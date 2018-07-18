import React,{Component} from 'react';
import axios from 'axios';
import { Button,Modal,Form,Input,Row,Col,LocaleProvider,message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
// import WrappedRegistrationForm from "./test";
// import './eventCategory.less';
import config from '../../../../config';
 import SelectOne from "../../../publicSub/selectOne";

const { TextArea } = Input;
const FormItem = Form.Item;
class AddEventCategory extends Component{
    state = {
        editVisible:false,
        editLoading:false,
        rowCode:["DWLX"]
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
        message.success("编辑服务单位成功")
    };
    error = (error) => {
        message.error(error)
    }
      editHandleOk = (e) => {
          console.log(this.props.unitType);
         e.preventDefault();
        this.props.form.validateFieldsAndScroll(['name','pepole','phone','adds','describeCode'],(err) => {
            let unitType = ""
            // if(!sessionStorage.getItem('selectValue')){
            //     unitType = this.props.unitType;
            //     this.props.form.setFields({
            //         categoryCode:{
            //             value:"",
            //             errors: [new Error('请选择单位类型')],
            //         }
            //     })
            // }else{
            //     this.props.form.setFields({
            //         categoryCode:{
            //             value:"",
            //         }
            //     })
            // }
            if(!sessionStorage.getItem('selectValue')){
                unitType = this.props.unitType;
            }else{
                unitType = sessionStorage.getItem('selectValue')
            }


            let values = {
                "name":this.props.form.getFieldValue("name"),
                "principal":this.props.form.getFieldValue("principal"),
                "principalPhone":this.props.form.getFieldValue("principalPhone"),
                "address":this.props.form.getFieldValue("address"),
                "note":this.props.form.getFieldValue("note"),
                "unitType":unitType,
                "id":this.props.recordId
            }
            if (err) {
                return ;
            }
            this.setState({ editLoading: true});
            axios({
                url:`${config.api_server}/sys/unit/update`,
                method:'post',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                data:values
            }).then((res) => {
                let datas = res.data.success;
                if(datas){
                    this.props.getDataList({pageNum:1,pageSize:10,param:""})
                    setTimeout(() => {
                        this.props.changeT({editLoading: false, editVisible: false})  
                        this.setState({ editLoading: false, editVisible: false});
                    }, 3000); 
                    setTimeout(() => {
                        this.success();
                    }, 3000);
                }else{
                    this.setState({ editLoading: false});
                    let error = ""
                    if(res.data.message && res.data.message != ""){
                        error = res.data.message
                    }else{
                    error = "编辑服务单位失败"
                    }
                    setTimeout(() => {
                            this.error(error);
                    }, 1000);
                }
           })
        });
           
    }
    editHandleCancel = () => {
         this.props.changeT({editVisible:false});
    }

    AddNews = () => {
        this.setState({
            editVisible: true,
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
    checkPhone=(rule, value, callback) =>{
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(value)) && !(/^(\d3,4|\d{3,4}-)?\d{7,8}$/).test(value)){
            callback("手机号码有误，请重填");
        }else{
            callback();
        }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        // let option =[];
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
                <Modal
                    visible={this.props.editVisible}
                    title="编辑单位"
                    onOk={this.editHandleOk}
                    onCancel={this.editHandleCancel}
                    afterClose = {this.afterClose}
                    destroyOnClose={true}
                    footer={[
                        // <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;类别编码格式统一为拼音首字母大写</span>,
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
                            名称&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                            {getFieldDecorator('name', {
                                initialValue:this.props.nameValue,
                                rules: [{ required: true, message: '请输名称', whitespace: true }, {
                                    validator: this.eventName,
                                }],
                            })(
                                <Input placeholder = "请输名称"/>
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
                            {getFieldDecorator('unitType', {
                                initialValue:this.props.unitType,
                                rules: [{ required: true, message: '请输入单位类型', whitespace: true }, {
                                    validator: this.eventName,
                                }],
                            })(
                                <SelectOne rowCode = {this.state.rowCode} values = {this.props.unitType}/>
                            )}
                        </FormItem>
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
                                    {getFieldDecorator('principal', {
                                        initialValue:this.props.principal,
                                        rules: [{ required: true, message: '请输负责人', whitespace: true }, {
                                            validator: this.eventName,
                                        }],
                                    })(
                                        <Input placeholder = "请输名称"/>
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
                                    {getFieldDecorator('principalPhone', {
                                        initialValue:this.props.principalPhone,
                                        rules: [{ required: true, message: '请输联系电话', whitespace: true }, {
                                            validator: this.checkPhone,
                                        }],
                                    })(
                                        <Input placeholder = "请输名称"/>
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
                            {getFieldDecorator('address', {
                                initialValue:this.props.address,
                                rules: [{ required: true, message: '请输名称', whitespace: true }, {
                                    validator: this.eventName,
                                }],
                            })(
                                <Input placeholder = "请输名称"/>
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
                            {getFieldDecorator('note', {
                                initialValue:this.props.note,
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
const WrappedRegistrationForm = Form.create()(AddEventCategory);

export default WrappedRegistrationForm;