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
        $axios.get(`${config.api_server}/pro/prolist?unitId=${sessionStorage.getItem('deskUnitId')}`).then((res) =>{
            if(res.data.data){
                if(res.data.data.length != 0){
                    console.log("get selecetList",res.data.data);
                    this.setState({data:res.data.data})
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
        message.success("新建事件大类成功")
    };
    error = (error) => {
        message.error(error)
    }
    addHandleOk = (e) => {
         e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,values) => {
            //eslint-disable-next-line
            //console.log("valuesvaluesvalues",values)
            // let arr = [];
            // let option = values.projects;
            // for(let i = 0;i<option.length;i++){
            //     let opt = {};
            //     opt.id = option[i];
            //     arr.push(opt)
            // }
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
                    // "projects":arr,
                }
            }).then((res) => {
                let datas = res.data.success;
                if(datas){
                    let pageNum = 1;
                    let pageSize = 10;
                    this.props.getParentListData({pageNum,pageSize,search:""})
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
                        error = "新建事件大类失败"
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
          });
    }
    handleBlur = () => {
            
    }
    handleFocus = (value) => {
        console.log("2222222222222",value);
    }
    onFieldsChange = () =>{
        
    }
    onSelect = (value) => {
        console.log("11111111111111",value);
        let bData = this.state.data;
        console.log(bData)
        if(bData.length > 0){
            for (let i = 0; i < bData.length; i++) {
                if(value == bData[i].proId){
                    this.props.form.setFieldsValue({
                        projects:bData[i].proName
                    })
                }
           }
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
        const children = [];
        let bData = this.state.data;
        // console.log(bData)
        if(bData.length > 0){
            for (let i = 0; i < bData.length; i++) {
                children.push(<Option key = {i} value = {bData[i].proId}>{bData[i].proName}</Option>);
           }
        }
        
        
        return (
            <span>
                <Button type="primary" onClick = {this.AddNews} icon="plus">新建</Button>
                <Modal
                    visible={this.state.addVisible}
                    title="添加事件大类"
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
                            事件大类名称&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                            {getFieldDecorator('faultName', {
                                rules: [{ required: true, message: '请输入事件大类名称', whitespace: true }, {
                                    validator: this.eventName,
                                }],
                            })(
                                <Input placeholder = "请输入事件大类名称"/>
                            )}
                        </FormItem>
                       
                        {/* <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            关联项目&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                            {getFieldDecorator('projects', {
                                rules: [{ required: true, message: '请选择关联项目!', whitespace: true,type:"array" }],
                            })(
                                <Select
                                    mode="multiple"
                                    showSearch
                                    optionFilterProp="children"
                                    style={{ width: '100%' }}
                                    placeholder=""
                                    onSelect={this.onSelect}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {children}
                                </Select>
                            )}
                        </FormItem> */}
                    </Form>
                    </LocaleProvider>
                </Modal> 
            </span>
        )
    }
}
const WrappedRegistrationForm = Form.create()(AddEventCategory);

export default WrappedRegistrationForm;