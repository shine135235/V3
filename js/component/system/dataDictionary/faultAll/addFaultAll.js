import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Modal,Form,Input,Select,LocaleProvider,message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import config from '../../../../config';
// import WrappedRegistrationForm from "./test";
// import './eventCategory.less';
//  import SelectOne from "../../../publicSub/selectOne";

// const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;
class AddEventCategory extends Component{
    state = {
        addVisible:false,
        addLoading:false,
        rowCode:["DWLX"],
        data:[]
      }
      
      getSelectList = () =>{
        $axios.get(`${config.api_server}/pro/pList`).then((res) =>{
            if(res.data.page){
                if(res.data.page.datas.length != 0){
                    this.setState({data:res.data.page.datas})
                }  
            } 
        })
      }
    componentDidMount(){
        this.getSelectList();
    }
    componentDidUpdate(){
       
    }
    success = () => {
        message.success("编辑故障大类成功")
    };
    error = () => {
        message.error("编辑故障大类失败")
    }
    addHandleOk = (e) => {
         e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,values) => {
            //eslint-disable-next-line
            console.log("valuesvaluesvalues",values)
            let arr = [];
            let option = values.projects;
            for(let i = 0;i<option.length;i++){
                let opt = {};
                opt.id = option[i];
                arr.push(opt)
            }
            if (err) {
                return ;
            }
            this.setState({ addLoading: true});
            $axios({
                url:`${config.api_server}/sys/faultcategory`,
                method:'post',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                data:{
                    "faultName":values.faultName,
                    "projects":arr,
                }
            }).then((res) => {
                let datas = res.data.success;
                if(datas){
                    this.props.getParentListData({});
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
          });
    }
    handleChange = () => {
        
    }
    handleBlur = () => {
            
    }
    handleFocus = () => {
        
    }
    onFieldsChange = () =>{
        
    }
     handleChange = (value) => {
         //eslint-disable-next-line
        console.log(`selected ${value}`);
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
        const children = [];
        let bData = this.state.data;
        if(bData.length > 0){
            for (let i = 0; i < bData.length; i++) {
                children.push(<Option key = {i} value = {bData[i].id}>{bData[i].name}</Option>);
           }
        }
        
        
        return (
            <span>
                <Button type="primary" onClick = {this.AddNews} icon="plus">新建</Button>
                <Modal
                    visible={this.state.addVisible}
                    title="添加故障大类"
                    onOk={this.addHandleOk}
                    onCancel={this.addHandleCancel}
                    onFieldsChange = {this.onFieldsChange}
                    // afterClose = {this.afterClose}
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
                            大类名称&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                            {getFieldDecorator('faultName', {
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
                            关联项目&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                            {getFieldDecorator('projects', {
                                rules: [{ required: true, message: '请输入区域描述!', whitespace: true,type:"array" }],
                            })(
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Please select"
                                    onChange={this.handleChange}
                                >
                                    {children}
                                </Select>
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