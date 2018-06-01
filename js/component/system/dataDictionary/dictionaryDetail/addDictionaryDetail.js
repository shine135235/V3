import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Modal,Form,Select,LocaleProvider,message } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
 import Child from "./childTest";
 import config from '../../../../config';
//  import SelectOne from "./selectOne";
import './dictionaryAll.less';

// const { TextArea } = Input;
const Option = Select.Option;
// const InputGroup = Input.Group;
const FormItem = Form.Item;
let uuid = 0;
class AddDictionaryDetail extends Component{
    constructor(props){
        super(props)
        this.state={
            // editLoading: false,
            // editVisible: false,
            addVisible:false,
            idChild:0,
            dataSource:[],
            fromData:null,
            addLoading:false,
            // parentID:this.props,
             childs:[],
             data:[],
             rowCode:["GZJB"]
        }
    }
    getSelectList = () =>{
        $axios.get(`${config.api_server}/sys/dict/query/list`).then((res) =>{
            if(res.data.data){
                if(res.data.data.length != 0){
                    this.setState({data:res.data.data})
                }
                //eslint-disable-next-line
                // console.log("啊啊啊啊啊啊啊啊啊啊啊啊啊",res)
            } 
        })
    }
    componentDidMount(){
        // this.props.getDataList({pageNum,pageSize})
        this.getSelectList();
       
    }
    componentDidUpdate(){
       
    }
    changeChilc = (childs) =>{
        this.setState({childs})
    }
    //操作完成提示弹框
    success = () => {
        // success('操作成功!');
        message.success("添加用户单位成功")
    };
    error = () => {
        message.error("添加用户单位失败")
    }
    addHandleOk = () => {
        let obj=null;
        let childDate = this.state.childs;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ addLoading: true });
                obj = values.dicName;
                for(let i = 0;i<childDate.length;i++){
                childDate[i].sysDictId = obj;
                }
                childDate = JSON.stringify(childDate);
                $axios({
                    url:`${config.api_server}/sys/dictitem/add/batch`,
                    method:'post',
                    headers: {
                        'Content-type': 'application/json;charset=UTF-8'
                    },
                    data:childDate
                }).then((res) => {
                    let datas = res.data.success;
                    if(datas){
                        this.props.getDataList({})
                        setTimeout(() => {
                            this.setState({ addLoading: false, addVisible: false});
                        }, 1000);
                        setTimeout(() => {
                            this.success();
                        }, 1000);
                    }else{
                        setTimeout(() => {
                            this.error();
                        }, 1000);
                    }
                })    
            }
        });    
    }
    addHandleCancel = () => {
        this.setState({ addVisible: false });
    }
    AddNew = () => {
        this.setState({
           addVisible: true,
           dataSource:[]
          });
    }

    handleChange = () => {
        
    }
    handleBlur = () => {
       
        
    }
    handleFocus = () => { 
        this.getSelectList();
    }

    remove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
          return;
        }
        // can use data-binding to set
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
    }
    
    add = () => {
        uuid++;
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
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
        let option =[];
        let bData = this.state.data;
        if(bData.length > 0){
            option =  bData.map((item,k)=>{
                return(
                    <Option key = {k} value={item.id}>{item.name}</Option>
                ) 
            })     
        }
        return (
            <span>
                <Button type="primary" onClick = {this.AddNew} icon="plus">新建</Button>
                <Modal
                    visible={this.state.addVisible}
                    title="字典项管理"
                    onOk={this.addHandleOk}
                    onCancel={this.addHandleCancel}
                    destroyOnClose={true}
                    width={600}
                    footer={[
                        <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;条目项标识用于后端存储,名称用于前端展示</span>,
                        <Button key="back" size="large" onClick={this.addHandleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.addLoading}  onClick={this.addHandleOk} >
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
                                onChange={this.handleChange}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                            >
                                {option}   
                            </Select>
                        )}
                        </FormItem>      
                    </Form>
                    </LocaleProvider>
                    <Child  changeChilc={ childs =>this.changeChilc(childs)} />
                    
                </Modal>
            </span>
        )
    }
}
const WrappedRegistrationForm = Form.create()(AddDictionaryDetail);

export default WrappedRegistrationForm;