import React,{Component} from 'react';
// import $axios from 'axios';
import { Button,Modal,Form,Input,LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
// import WrappedRegistrationForm from "./test";
// import './eventCategory.less';
//  import SelectOne from "../../../publicSub/selectOne";

const { TextArea } = Input;
const FormItem = Form.Item;
class AddEventCategory extends Component{
    state = {
        addVisible:false,
        addLoading:false,
        rowCode:["DWLX"],
        data:[]
      }
    componentDidMount(){
    }
    componentDidUpdate(){
       
    }
   
    addHandleOk = (e) => {
         e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,values) => {
            //eslint-disable-next-line
            console.log("valuesvaluesvalues",values)
            if (err) {
                return ;
            }
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
        return (
                <Modal
                    visible={this.state.addVisible}
                    title="审核不通过原因"
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
                            描述&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                            {getFieldDecorator('textArea', {
                                rules: [{ required: false, message: '请输入区域描述!', whitespace: true,type:"array" }],
                            })(
                                <TextArea />
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