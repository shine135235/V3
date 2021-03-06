import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Modal,Form,Input,message,LocaleProvider,Icon,Tooltip } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import config from '../../../../config';
// import WrappedRegistrationForm from "./test";
// import './eventCategory.less';

const { TextArea } = Input;
const FormItem = Form.Item;
class AddEventCategory extends Component{
    state = {
        addVisible:this.props.addVisible,
        addLoading:false,
        alertVisible:false
      }
    componentDidMount(){

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
        message.success("添加字典类别成功")
    };
    error = (error) => {
        message.error(error)
    }
    addData = (values) =>{
        $axios({
            url:`${config.api_server}/sys/dict/add`,
            method:'post',
            headers: {
                'Content-type': 'application/json;charset=UTF-8'
            },
            data:values
        }).then((res) => {
            let datas = res.data.success;
            if(datas){
                let pageNum = 1;
                let pageSize = 10;
                this.props.getParentListData({pageNum,pageSize});
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
                    error = "添加字典类别失败"
                }
                setTimeout(() => {
                        this.error(error);
                }, 1000);
            }
        })  
    }
    addHandleOk = (e) => {
         e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            //eslint-disable-next-line
            // console.log("valuesvaluesvalues",values)
            if (err) {
                //eslint-disable-next-line
                //  console.log("get单位类型",11111111111111111)
                return;
            }
            let bdata = this.props.dataList;
            let value = this.props.form.getFieldValue('categoryCode');
            if(bdata.length > 0){
                for(let i = 0;i<bdata.length;i++){
                    if(value == bdata[i].categoryCode){
                        this.props.form.setFields({
                            categoryCode:{
                                value:value,
                                errors: [new Error('编码已存在')],
                            }
                        })
                        return;
                    }             
                }
            }  
            this.setState({ addLoading: true});
            this.addData(values);
        });      
    }
    addHandleCancel = () => {
        this.setState({ addVisible: false });
    }

    AddNew = () => {
        this.setState({
           addVisible: true,
           editVisible: false,
          });
    }
    handleBlur = () =>{
        let bdata = this.props.dataList;
        let value = this.props.form.getFieldValue('categoryCode');
        if(bdata.length > 0){
            for(let i = 0;i<bdata.length;i++){
                if(value == bdata[i].categoryCode){
                    this.props.form.setFields({
                        categoryCode:{
                             value:value,
                            errors: [new Error('编码已存在')],
                        }
                    })
                }             
            }
        }    
    }
    afterClose = () =>{
        // this.props.form.setFields({
        //     categoryCode:{
        //          value:"",     
        //     },
        //     name:{
        //         value:"", 
        //     },
        //     describeCode:{
        //         value:"", 
        //     }
        // })
        this.setState({ addLoading: false});
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
        return (
            <span>
                <Button type="primary" onClick = {this.AddNew} icon="plus">新建</Button>
                <Modal
                    visible={this.state.addVisible}
                    title="新建字典类别"
                    onOk={this.addHandleOk}
                    onCancel={this.addHandleCancel}
                    destroyOnClose={true}
                    afterClose = {this.afterClose}
                    footer={[
                        // <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;建议类别编码格式统一为拼音首字母大写</span>,
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
                            类别名称&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                        {getFieldDecorator('name', {
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
                            rules: [{ required: true, message: '请输入类别编码', whitespace: true }, {
                                validator: this.eventCode,
                            }],
                        })(
                            <Input placeholder = "如：ZCLB" onBlur={this.handleBlur}/>
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
                            rules: [{ required: false, message: '请输入事件类型描述!', whitespace: true }],
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