import React,{Component} from 'react';
import { Button,Modal,Form,Select } from 'antd';
//  import Child from "./childTestEdit";
import './dictionaryAll.less';

// const { TextArea } = Input;
const Option = Select.Option;
// const InputGroup = Input.Group;
const FormItem = Form.Item;
// let uuid = 0;
// let data = [{"HC":"耗材"},{"WX":"网线"},{"ZW":"职位"}];

class EditDictionaryDetail extends Component{
    constructor(props){
        super(props)
        this.state={
            editLoading: false,
            editVisible: false,
            addVisible:false,
            idChild:0,
            dataSource:[],
            fromData:null,
            isOrNo:true,
            // addLoading:false,
            // parentID:this.props,
            childs:[],
            data : []
        }
    }
    componentDidMount(){
        //eslint-disable-next-line
        console.log("componentDidMount",this.state.data);
    }
    componentDidUpdate(){
       //eslint-disable-next-line
         console.log("EditDictionaryDetail",this.state.data);
    }
    changeChilc = (childs) =>{
        this.setState({childs})
    }
    changedataSource = (dataSource) =>{
        this.setState({dataSource})
    }
    isOrNoStyle = ({type = true}) =>{
        this.setState({isOrNo:type})
    }
    editHandleOk = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                //eslint-disable-next-line
              console.log('selectData:', values);
            }
          });
        //eslint-disable-next-line
         console.log('ChildData: ', this.state.childs.length);       
        //eslint-disable-next-line
         console.log('dataSource: ', this.state.dataSource);       
        if(this.state.childs.length == 0){
             this.setState({isOrNo:true });
        }else{
             this.setState({isOrNo:false });
            setTimeout(() => {
                this.setState({ editLoading: false, editVisible: false,dataSource:[]});
              //   this.props.form.resetFields();
              }, 3000);
        }    
    }

    editHandleCancel = () => {
        this.setState({ editVisible: false});
        //取消设置默认为空
       // this.changeChilc("[]");
    }

    handleChange = () => {   
    }
    handleBlur = () => {        
    }
    handleFocus = () => {
    }
    // remove = (k) => {
    //     const { form } = this.props;
    //     // can use data-binding to get
    //     const keys = form.getFieldValue('keys');
    //     // We need at least one passenger
    //     if (keys.length === 1) {
    //       return;
    //     }
    //     // can use data-binding to set
    //     form.setFieldsValue({
    //       keys: keys.filter(key => key !== k),
    //     });
    // }
    // add = () => {
    //     uuid++;
    //     const { form } = this.props;
    //     // can use data-binding to get
    //     const keys = form.getFieldValue('keys');
    //     const nextKeys = keys.concat(uuid);
    //     // can use data-binding to set
    //     // important! notify form to detect changes
    //     form.setFieldsValue({
    //       keys: nextKeys,
    //     });
    // }
    Edit = () => {
       this.props.form.setFields({
        dicName: {
             value: "jack",
           }
        });         
       this.setState({
          editVisible: true,
        });
        this.setState({
            data:[{"HC":"耗材1"},{"WX":"网线2"},{"ZW":"职位3"}],
        });
    }
    afterClose = () => {
        this.isOrNoStyle({})
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
                sm: { span: 16 },
            },
        };
        return (
            <span>
                <label href='javascript:void(0)'  onClick= {this.Edit}>编辑</label>
                <Modal
                    visible={this.state.editVisible}
                    title="字典项管理"
                    onOk={this.editHandleOk}
                    onCancel={this.editHandleCancel}
                    width={600}
                    afterClose={this.afterClose}
                    footer={[
                        <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;条目项标识用于后端存储,名称用于前端展示</span>,
                        <Button key="back" size="large" onClick={this.editHandleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.editLoading} onClick={this.editHandleOk}
                         disabled = {this.state.isOrNo}>保存</Button>
                    ]}
                >
                    {/* <WrappedRegistrationForm /> */}  
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            所属类别&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                        {getFieldDecorator('dicName', {
                            rules: [{ required: true, message: '请输入类别名称', whitespace: true }, {
                                validator: this.eventName,
                            }],
                        })(
                            <Select
                                showSearch
                                // style={{ width: 200 }}
                                placeholder="请选择"
                                optionFilterProp="children"
                                onChange={this.handleChange}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                id = "dicName"
                            >
                                <Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>
                                <Option value="tom">Tom</Option>
                            </Select>
                        )}
                        </FormItem>      
                    </Form>
                         {/* <Child  changeChilc={ childs =>this.changeChilc(childs)} childData = {this.state.data} changedataSource={ dataSource =>this.changedataSource(dataSource)} isOrNoStyle = {this.isOrNoStyle}/> */}
                </Modal>
            </span>
        )
    }
}
const WrappedRegistrationForm = Form.create()(EditDictionaryDetail);

export default WrappedRegistrationForm;