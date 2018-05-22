import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Modal,Form,Input,Select,message } from 'antd';
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
        data:[]
    }
      
    getSelectList = () =>{
        $axios.get('http://172.16.6.5:9090/sys/faultcategory/list').then((res) =>{
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
    //操作完成提示弹框
    success = () => {
        // success('操作成功!');
        message.success("添加字故障细类成功")
    };
    error = () => {
        message.error("添加字故障细类失败")
    }
    addHandleOk = (e) => {
         e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,values) => {
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
                url:"http://172.16.6.5:9090/sys/faultcategory",
                method:'post',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                data:{
                    "faultName":values.projects,
                    "parentId":values.faultName,
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
    // setSelectChange = ({datdas= ""}) =>{
    //      //eslint-disable-next-line
    //      console.log("fatvalue",datdas)
    //     this.setState({datdas})
    // }
    // afterClose = () => {
    //     sessionStorage.removeItem('selectValue');
    // }
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
                children.push(<Option key = {i} value = {bData[i].id}>{bData[i].faultname}</Option>);
           }
        }
        

        return (
            <span>
                <Button type="primary" onClick = {this.AddNews} icon="plus">新建</Button>
                <Modal
                    visible={this.state.addVisible}
                    title="添加故障细类"
                    onOk={this.addHandleOk}
                    onCancel={this.addHandleCancel}
                    onFieldsChange = {this.onFieldsChange}
                    // afterClose = {this.afterClose}
                    destroyOnClose={true}
                    footer={[
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
                            故障大类名称&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                            {getFieldDecorator('faultName', {
                                rules: [{ required: true, message: '请输入故障大类名称', whitespace: true}],
                            })(
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Please select"
                                    onChange={this.handleChange}
                                >
                                    {children}
                                </Select>
                                
                            )}
                        </FormItem>
                       
                        <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            故障细类名称&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                            {getFieldDecorator('projects', {
                                rules: [{ required: true, message: '请输入故障细类名称!',  whitespace: true }],
                            })(
                                <Input placeholder = "请输入故障细类名称"/>
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