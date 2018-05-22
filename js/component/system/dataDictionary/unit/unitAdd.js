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
        addVisible:false,
        addLoading:false,
        rowCode:["DWLX"],
        // datdas:"",
        reset:true,
        listData:[]
      }
      
    componentDidMount(){
        // $axios.get('http://172.16.6.11:9090/sys/dict/query/list').then((res) =>{
        //     if(res.data.data){
        //         if(res.data.data.length != 0){
        //             this.setState({data:res.data.data})
        //         }
        //         //eslint-disable-next-line
        //         console.log("啊啊啊啊啊啊啊啊啊啊啊啊啊",res)
        //     } 
        // })
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
            //eslint-disable-next-line
           console.log('valuesvaluesvaluesvalues ', values);
            //eslint-disable-next-line
           console.log('selectValueselectValueselectValue ', sessionStorage.getItem('selectValue'));
        //    values.categoryCode = sessionStorage.getItem('selectValue');
        if (err) {
            return ;
        }
        this.setState({ addLoading: true});
            axios({
                url:"http://172.16.6.11:9090/sys/unit/add",
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
                        this.setState({ addLoading: false, addVisible: false});
                    }, 1000);
                    setTimeout(() => {
                        this.success();
                    }, 1000);
                }else{
                    this.setState({ addLoading: false});
                    setTimeout(() => {
                        this.error();
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
    // setSelectChange = ({datdas= ""}) =>{
    //      //eslint-disable-next-line
    //      console.log("fatvalue",datdas)
    //     this.setState({datdas})
    // }
    afterClose = () => {
        sessionStorage.removeItem('selectValue');
    }
    onFieldsChange = () =>{
        
    }
    render(){
        //eslint-disable-next-line
        // console.log("wwwwwwwwwwwww",selectdata)
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
                <Button type="primary" onClick = {this.AddNews} icon="plus">新建</Button>
                <Modal
                    visible={this.state.addVisible}
                    title="添加单位"
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
                            {getFieldDecorator('categoryCode', {
                                //   initialValue:"",
                                rules: [{ required: true, message: '请输入单位类型', whitespace: true }, {
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
                                    {getFieldDecorator('phone', {
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
                            {getFieldDecorator('adds', {
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