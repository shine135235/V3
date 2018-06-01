import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Modal,Form,Input,Row,Col,Select,message,LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import SelectOne from "../../../publicSub/selectOne";
import config from '../../../../config';
// import WrappedRegistrationForm from "./test";
import './index.less';

const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
class AddEventCategory extends Component{
    state = {
        editVisible:false,
        editLoading:false,
        rowCode:["BXXZ"],
        areaCode:["SSPQ"],
        data:[]
      }
    componentDidMount(){
        $axios.get(`${config.api_server}/sys/area/arealist`).then((res) =>{
                   
            if(res.data.data){
                if(res.data.data.length != 0){
                    this.setState({data:res.data.data})
                }
            } 
        })
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
        message.success("添加用户单位成功")
    };
    error = () => {
        message.error("添加用户单位失败")
    }
    addHandleOk = (e) => {
        this.setState({ editLoading: true});
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(['name','area','pepole','phone','adds','describeCode'],(err) => {
            if(!sessionStorage.getItem('selectValue')){
                this.props.form.setFields({
                    categoryCode:{
                        value:"",
                        errors: [new Error('请选择单位性质')],
                    }
                })
            }else{
                this.props.form.setFields({
                    categoryCode:{
                        value:"",
                    }
                })
            }
            //eslint-disable-next-line
            console.log('this.props.form.getFieldValue("area")', this.props.form.getFieldValue("area"));
            let values = {
                "name":this.props.form.getFieldValue("name"),
                "areaId":this.props.form.getFieldValue("area"),
                "address":this.props.form.getFieldValue("adds"),
                "principal":this.props.form.getFieldValue("pepole"),
                "principalPhone":this.props.form.getFieldValue("phone"),
                "note":this.props.form.getFieldValue("describeCode"),
                "unitType":sessionStorage.getItem('selectValue'),
                "lng":"116.472181",
                "lat":"39.92603",
                "id":this.props.recordId
            }
            if (err) {
                return ;
            }
            this.setState({ editLoading: true});
            $axios({
                url:`${config.api_server}/sys/unit/update/userunit`,
                method:'post',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                data:values
            }).then((res) => {
                let datas = res.data.success;
                if(datas){
                    this.props.getSchoolDataList({})
                    setTimeout(() => {
                        this.props.changeT({editLoading: false, editVisible: false})  
                        this.setState({ editLoading: false, editVisible: false});
                    }, 1000);
                    setTimeout(() => {
                        this.success();
                    }, 1000);
                }else{
                    setTimeout(() => {
                        this.error();
                    }, 3000);
                }
           })
        });
        setTimeout(() => {
          this.setState({ editLoading: false, editVisible: false});
        }, 3000);    
    }
    addHandleCancel = () => {
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
        let option =[];
        let bData = this.state.data;
        if(bData.length > 0){
                    //eslint-disable-next-line
            // console.log('1111111111111111111111 ', this.props.area);
            option =  bData.map((item,k)=>{
                return(
                    <Option key = {k} value={item.areaId}>{item.areaName}</Option>
                ) 
            })     
        }
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        // const formItemLayoutWithOutLabel = {
        //     labelCol: {
        //         xs: { span: 24 },
        //         sm: { span: 11 },
        //     },
        //     wrapperCol: {
        //       xs: { span: 24 },
        //       sm: { span: 13 },
        //     },
        //   };
          const formItemLayoutWithOutLabel1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8},
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
          };
        return (
            <span>
                <Modal
                    visible={this.props.editVisible}
                    title="添加用户单位"
                    onOk={this.addHandleOk}
                    onCancel={this.addHandleCancel}
                    width = {700}
                    destroyOnClose={true}
                    footer={[
                        // <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;类别编码格式统一为拼音首字母大写</span>,
                        <Button key="back" size="large" onClick={this.addHandleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" htmlType="submit" loading={this.state.editLoading} onClick={this.addHandleOk}>
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
                                initialValue:this.props.nameValue,
                                rules: [{ required: true, message: '请输名称', whitespace: true }, {
                                    validator: this.eventName,
                                }],
                            })(
                                <Input placeholder = "请输名称"/>
                            )}
                        </FormItem>
                        <Row gutter={24}>
                            <Col span = {10} key = {1} offset = {1}>
                            <FormItem
                                {...formItemLayoutWithOutLabel1}
                                label={(
                                    <span>
                                    单位性质&nbsp;
                                    </span>
                                )}
                                hasFeedback
                                >
                                    {getFieldDecorator('categoryCode', {
                                        initialValue:this.props.unitType,
                                        rules: [{ required: true, message: '请单位性质', whitespace: true }, {
                                            validator: this.eventName,
                                        }],
                                    })(
                                        <SelectOne rowCode = {this.state.rowCode} values = {this.props.unitType} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span = {11} key = {2} >
                                <FormItem
                                {...formItemLayoutWithOutLabel1}
                                label={(
                                    <span>
                                    所属片区&nbsp;
                                    </span>
                                )}
                                hasFeedback
                                >
                                    {getFieldDecorator('area', {
                                        initialValue:this.props.area,
                                        rules: [{ required: true, message: '请选择片区', whitespace: true }, {
                                            validator: this.eventName,
                                        }],
                                    })(
                                        <Select
                                        showSearch
                                        onChange={this.handleChange}
                                        onFocus={this.handleFocus}
                                        onBlur={this.handleBlur}
                                    >
                                        {option}   
                                    </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span = {10} key = {1}  offset = {1}>
                                <FormItem
                                {...formItemLayoutWithOutLabel1}
                                label={(
                                    <span>
                                    负责人&nbsp;
                                    </span>
                                )}
                                hasFeedback
                                >
                                    {getFieldDecorator('pepole', {
                                        initialValue:this.props.principal,
                                        rules: [{ required: true, message: '请输负责人', whitespace: true }, {
                                            validator: this.eventName,
                                        }],
                                    })(
                                        <Input placeholder = "请输负责人"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span = {11} key = {2}  >
                                <FormItem
                                {...formItemLayoutWithOutLabel1}
                                label={(
                                    <span>
                                    联系电话&nbsp;
                                    </span>
                                )}
                                hasFeedback
                                >
                                    {getFieldDecorator('phone', {
                                        initialValue:this.props.principalPhone,
                                        rules: [{ required: true, message: '请输联系电话', whitespace: true }, {
                                            validator: this.eventName,
                                        }],
                                    })(
                                        <Input placeholder = "请输联系电话"/>
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
                            {getFieldDecorator('describeCode', {
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