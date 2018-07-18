import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Modal,Form,Input,message,LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import config from '../../../../config';
// import WrappedRegistrationForm from "./test";
// import './eventCategory.less';

// const Option = Select.Option;
const FormItem = Form.Item;
class AddEventCategory extends Component{
    state = {
        editVisible:false,
        editLoading:false,
        alertVisible:false,
        data:[]
    }
    getSelectList = () =>{
        $axios.get(`${config.api_server}/pro/prolist?unitId=${sessionStorage.getItem('deskUnitId')}`).then((res) =>{
            if(res.data.data){
                if(res.data.data.length != 0){
                    console.log("11111111111111111111",res.data.data);
                    this.setState({data:res.data.data})
                }  
            } 
        })
    }
    componentDidMount(){
        this.getSelectList();  
    }  
    success = () => {
        message.success("编辑事件大类成功")
    };
    error = (error) => {
        message.error(error)
    }
    editHandleOk = (e) => {
         e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
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
                method:'put',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                data:{
                    "id":this.props.record.id,
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
                        this.props.changeT({editLoading: false, editVisible: false})
                        this.setState({ editLoading: false, editVisible: false});
                    }, 1000);
                    setTimeout(() => {
                        this.success();
                    }, 1000);
                }else{
                    this.setState({ editLoading: false});
                    let error = ""
                    if(res.data.message && res.data.message != ""){
                         error = res.data.message
                    }else{
                        error = "编辑事件大类失败"
                    }
                    setTimeout(() => {
                            this.error(error);
                    }, 1000);
                }
           })
        });
    }
    editHandleCancel = (e) => {
        e.preventDefault;
        this.setState({ editVisible: false });
        this.props.changeT({editVisible:false});
    }
    afterClose = () => {
        this.setState({recordData:[]})
    }
    onSelect = (value) => {
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
        // const children = [];
        // let bData = this.state.data;
        // let initialSlect = this.props.initialSlect;
        // let intSelect = [];
        // if(bData.length > 0){
        //     for (let i = 0; i < bData.length; i++) {
        //         children.push(<Option key = {i} value = {bData[i].proId}>{bData[i].proName}</Option>);
        //    }
        //     if(initialSlect.length != 0){
        //         for(let i = 0;i<initialSlect.length;i++){
        //             for(let j = 0;j<bData.length;j++){
        //                 if(bData[j].proId == initialSlect[i]){
        //                     intSelect.push(initialSlect[i])
        //                     break;
        //                 }else{
        //                     continue
        //                 }
        //             }    
        //         }
        //     }  
        // }
        let name = "";
        name = this.props.name;
        return (
            <Modal
                visible={this.props.editVisible}
                title="事件大类编辑"
                onOk={this.addHandleOk}
                onCancel={this.editHandleCancel}
                destroyOnClose={true}
                afterClose={this.afterClose}
                footer={[
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
                        事件大类名称&nbsp;
                        </span>
                    )}
                    hasFeedback
                    >
                    {getFieldDecorator('faultName', {
                        initialValue:name,
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
                        initialValue:intSelect,
                        rules: [{ required: true, message: '请选择关联项目',type :"array"}],
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
        )     
    }
}
const WrappedRegistrationForm = Form.create()(AddEventCategory);

export default WrappedRegistrationForm;