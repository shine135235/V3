import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Modal,Form,Input,Row,Col,Select} from 'antd';
import SelectOne from "../../../publicSub/selectOne";
import SchoolMap from "./schoolMap";

// import WrappedRegistrationForm from "./test";
import './index.less';

const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
class AddEventCategory extends Component{
    state = {
        addVisible:false,
        addLoading:false,
        mapVisible:false,
        data:[],
        rowCode:["BXXZ"],
        areaCode:["SSPQ"]
      }
    componentDidMount(){
        $axios.get('http://172.16.6.11:9090/sys/area/arealist').then((res) =>{
            if(res.data.data){
                if(res.data.data.length != 0){
                    this.setState({data:res.data.data})
                }
                //eslint-disable-next-line
                // console.log("啊啊啊啊啊啊啊啊啊啊啊啊啊",res)
            } 
        })
    }
    componentDidUpdate(){
       
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
            let values = {
                "name":this.props.form.getFieldValue("name"),
                "areaId":this.props.form.getFieldValue("area"),
                "address":this.props.form.getFieldValue("adds"),
                "principal":this.props.form.getFieldValue("pepole"),
                "principalPhone":this.props.form.getFieldValue("phone"),
                "note":this.props.form.getFieldValue("describeCode"),
                "unitType":sessionStorage.getItem('selectValue'),
                "lng":"116.472181",
                "lat":"39.92603"
            }
            if (err) {
                return ;
            }    
            this.setState({ addLoading: true});
            $axios({
                url:"http://172.16.6.11:9090/sys/unit/add",
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
                        this.setState({ addLoading: false, addVisible: false});
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
           
    }
    addHandleCancel = () => {
        this.setState({ addVisible: false });
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
    mapShow = () =>{
        this.setState({mapVisible:true})
    }
    mapChange = ({mapVisible=false}) =>{
        this.setState({mapVisible})
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        let option =[];
        let bData = this.state.data;
        if(bData.length > 0){
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
        const formItemLayoutWithOutLabel = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 20 },
            },
          };
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
                <Button type="primary" onClick = {this.AddNews} icon="plus">新建</Button>
                <Modal
                    visible={this.state.addVisible}
                    title="添加用户单位"
                    onOk={this.addHandleOk}
                    onCancel={this.addHandleCancel}
                    afterClose = {this.afterClose}
                    width = {650}
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
                            单位名称&nbsp;
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
                        <Row gutter={24}>
                            <Col span = {10} key = {1} offset = {1}>
                            <FormItem
                                {...formItemLayoutWithOutLabel1}
                                label={(
                                    <span>
                                    办学性质&nbsp;
                                    </span>
                                )}
                                hasFeedback
                                >
                                    {getFieldDecorator('categoryCode', {
                                        rules: [{ required: true, message: '请选择单位性质', whitespace: true }, {
                                            validator: this.eventName,
                                        }],
                                    })(
                                        <SelectOne rowCode = {this.state.rowCode} />
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
                                        rules: [{ required: true, message: '请选择片区', whitespace: true }, {
                                            validator: this.eventName,
                                        }],
                                    })(
                                        // <SelectOne rowCode = {this.state.areaCode}/>
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
                                        rules: [{ required: true, message: '请输联系电话', whitespace: true }, {
                                            validator: this.eventName,
                                        }],
                                    })(
                                        <Input placeholder = "请输联系电话"/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span = {20} key = {1}  offset = {1}>
                                <FormItem
                                {...formItemLayoutWithOutLabel}
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
                                    )}{
                                        
                                    }
                                </FormItem>
                            </Col>
                            <Col span = {2} key = {11}>
                                <SchoolMap  mapVisible = {this.state.mapVisible} mapChange = {this.mapChange}/>
                            </Col>
                        </Row>
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