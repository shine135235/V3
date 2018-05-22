import React,{Component} from 'react';
import axios from 'axios';
import { Button,Modal,Form,Input,Row,Col} from 'antd';
// import WrappedRegistrationForm from "./test";
// import './eventCategory.less';
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
        const modal = Modal.success({
            title: '操作成功',
            content: '添加单位成功',
          });
          setTimeout(() => modal.destroy(), 2000);
    };

     error = () => {
        Modal.error({
          title: '操作失败',
          content: '添加单位失败',
        });
      }
      editHandleOk = (e) => {
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
                "principal":this.props.form.getFieldValue("principal"),
                "principalPhone":this.props.form.getFieldValue("principalPhone"),
                "address":this.props.form.getFieldValue("address"),
                "note":this.props.form.getFieldValue("note"),
                "unitType":sessionStorage.getItem('selectValue'),
                "id":this.props.recordId
            }
            //eslint-disable-next-line
           console.log('valuesvaluesvaluesvalues ', values);
            //eslint-disable-next-line
           console.log('selectValueselectValueselectValue ', sessionStorage.getItem('selectValue'));
        //    values.categoryCode = sessionStorage.getItem('selectValue');
            if (err) {
                return ;
            }
            this.setState({ editLoading: true});
            axios({
                url:"http://172.16.6.11:9090/sys/unit/update",
                method:'post',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                data:values
            }).then((res) => {
                let datas = res.data.success;
                if(datas){
                    this.props.getDataList({})
                    setTimeout(() => {
                        this.props.changeT({editLoading: false, editVisible: false})  
                        this.setState({ editLoading: false, editVisible: false});
                    }, 3000); 
                    setTimeout(() => {
                        this.success();
                    }, 3000);
                }else{
                    setTimeout(() => {
                        this.setState({ editLoading: false});
                        this.error();
                    }, 3000);
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
        //   let nameValue = "";
        //  let principalPhone = "";
        //  let principal = "";
        //  let note = "";
        //  let address = "";
        //  let unitType = "";
        //  let editData = this.props.editData;
        //  if(editData.id){
        //     nameValue = editData.name;
        //     principalPhone = editData.principalPhone;
        //     principal = editData.principal;
        //     note = editData.note;
        //     unitType = editData.unitType;
        //     address  = editData.address;
        // }
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
                                // <Select
                                //     showSearch
                                //     onChange={this.handleChange}
                                //     onFocus={this.handleFocus}
                                //     onBlur={this.handleBlur}
                                // >
                                //     {option}
                                // </Select>
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
                                            validator: this.eventName,
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
                </Modal> 
            </span>
        )
    }
}
const WrappedRegistrationForm = Form.create()(AddEventCategory);

export default WrappedRegistrationForm;