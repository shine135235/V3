import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Modal,Form,Select,LocaleProvider,message,Col,Input,Icon,Row,Tooltip } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
//  import Child from "./childTest";
 import config from '../../../../config';
//  import SelectOne from "./selectOne";
import './index.less';

// const { TextArea } = Input;
const Option = Select.Option;
// const InputGroup = Input.Group;
const FormItem = Form.Item;
// let uuid = 0;
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
             rowCode:["GZJB"],
             childKey:[],
             uuid:0
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
       console.log("uuiduuid:",this.state.uuid)
    }
    changeChilc = (childs) =>{
        this.setState({childs})
    }
    childKey = (childKey) =>{
        this.setState({childKey})
    }
    //操作完成提示弹框
    success = () => {
        // success('操作成功!');
        message.success("添加字典项成功")
    };
    error = (error) => {
        message.error(error)
    }
    addHandleOk = () => {
        let dName=null;
        this.props.form.validateFieldsAndScroll((err, values) => {
            let childDate=[];
            if (!err) {
                dName = values.dicName;
                for(let i = 0;i<values.keys.length;i++){
                    const  obj = {};
                    obj.itemKey = this.props.form.getFieldValue('dicName' + values.keys[i]);
                    obj.itemValue = this.props.form.getFieldValue('dicName' + values.keys[i] + '2');
                    childDate.push(obj);
                    childDate[i].sysDictId = dName;
                }
                this.setState({ addLoading: true });
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
                        let pageNum = 1;
                        let pageSize = 10;
                        this.props.getDataList({pageNum,pageSize})
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
                            error = "添加字典项失败"
                        }
                        setTimeout(() => {
                                this.error(error);
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
        this.add();
        this.setState({
           addVisible: true,
           dataSource:[]
          });
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
        let uuid = this.state.uuid
        uuid++;
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        this.setState({uuid:uuid})
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }
    removeData = () =>{
        const { form } = this.props;
        this.setState({uuid:0})
        form.setFieldsValue({
            keys: [],
        });
    }
    eventCode = (rule, value, callback) =>{
        if(!(/^[A-Z]+$/g.test(value))){
            callback("条目内容建议为名称首字母大写");
        }else{
            callback();
        }
    }
    render(){
        const { getFieldDecorator,getFieldValue } = this.props.form;
        const text = <span>条目格式统一为名称拼音首字母大写</span>;
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
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
              xs: { span: 24, offset: 0 },
              sm: { span: 20, offset: 6 },
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

        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        //eslint-disable-next-line
        //console.log("新建lebel下标",keys);
        const formItems = keys.map((k) => {
          return (
            <FormItem
              {... formItemLayout}
              label={(
                <span>
                条目标识-名称&nbsp;
                    <Tooltip placement="top" title={text}>
                        <Icon type="info-circle-o"  className = "iTip" />
                    </Tooltip>
                </span>
            )}
              required={true}
              key={k}
            >    
                {
                    <Row gutter = {24} style = {{"display":"inline-block","width":"100%"}}>
                        <Col span={10}>
                            <FormItem >
                                {getFieldDecorator(`dicName${k}`, {
                                        rules: [{ required: true, message: '请输入条目标识', whitespace: true }, {
                                          validator: this.eventCode,
                                      }],
                                    })(
                                        <Input placeholder="条目标识" />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={1}>
                            <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                            -
                            </span>
                        </Col>
                        <Col span={10}>
                            <FormItem>
                                {getFieldDecorator(`dicName${k}2`, {
                                        rules: [{ required: true, message: '请输入名称', whitespace: true }],
                                    })(
                                        <Input placeholder="请输入名称" />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span = {2}>
                            {
                                keys.length > 1 ? (
                                    <Icon
                                    className="dynamic-delete-button"
                                    type="minus-circle-o"
                                    disabled={keys.length === 1}
                                    onClick={() => this.remove(k)}
                                    />
                                ) : null
                            }
                        </Col>  
                    </Row>
                }
            </FormItem>
          );
        });
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
                    afterClose = {this.removeData}
                    footer={[
                        // <span key style = {{"display":"inline-block","marginRight":"50px","color":"#BA55D3"}}>提示:&nbsp;建议条目项标识格式统一为名称拼音首字母大写</span>,
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
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onFocus={this.handleFocus}
                            >
                                {option}   
                            </Select>
                        )}
                        </FormItem>      
                    </Form>
                    </LocaleProvider>
                        {formItems}
                        <FormItem {...formItemLayoutWithOutLabel}>
                        <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                            <Icon type="plus" /> 增加条目
                        </Button>
                        </FormItem>
                    {/* <Child  changeChilc={ childs =>this.changeChilc(childs)} childKey = {this.childKey}/>   */}
                </Modal>
            </span>
        )
    }
}
const WrappedRegistrationForm = Form.create()(AddDictionaryDetail);

export default WrappedRegistrationForm;