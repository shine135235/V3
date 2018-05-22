import React,{Component} from 'react';
import { Button,Modal,Form,Select,Icon,Input,Col} from 'antd';
import './dictionaryAll.less';

const Option = Select.Option;
const FormItem = Form.Item;
let uuid = 0;  
class EditDictionaryDetailTest extends Component{
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
            data :[],
            changedataSource:[],
            flag:false,
            addKey:true
        }
    }
    componentDidMount(){
        
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
        this.props.changeT({editVisible:false,addVisible:false})  
    }

    editHandleCancel = () => {
        // this.setState({ editVisible: false});
        this.setState({editVisible:false})
        this.props.changeT({editVisible:false});
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
    remove = (k) => {
        //eslint-disable-next-line
        // console.log('remove item' + k);
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const keys2 = keys.filter(key => key !== k);
        const childData = [];
        for (let index = 0; index < keys2.length; index++) {
        const  obj = {};
            obj.itmeKey = form.getFieldValue('dicName' + keys2[index]);
            obj.itemValue = form.getFieldValue('dicName' + keys2[index] + '2');
            childData.push(obj)
        }
        //eslint-disable-next-line
        // console.log("sssssssssss",childData);
        this.setState({changedataSource:childData});
        this.setState({isOrNo:false});
        // We need at least one passenger
        if (keys.length === 1) {
        return;
        }
        // can use data-binding to set
        form.setFieldsValue({
        keys: keys.filter(key => key !== k),
        // keys: [],
        });
    }
    add = () => {
        if(this.state.addKey == true){
            if( this.props.data1.length> 0){
                uuid = this.props.data1.length;
            }else{
                uuid++;
            }
          this.setState({addKey:false})  
        }else{
            uuid++;
        }       
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
    afterClose = () => {
        this.isOrNoStyle({});
        this.props.form.getFieldDecorator('keys',{initialValue:[]});
        let realOj = this.props.data1;
        let arrK = [];
        if(realOj.length != 0){
            for(let i = 0;i<realOj.length;i++){
                arrK.push(i);
            }
            //this.props.form.getFieldDecorator('keys',{initialValue:arrK});
            
        }else{
            //this.props.form.getFieldDecorator('keys',{initialValue:[]});
        }
        this.props.form.setFieldsValue({
            keys:arrK,
            // keys: [],
            });
        //eslint-disable-next-line
    }
    showSet =() =>{
        //eslint-disable-next-line
       this.setState({
        editVisible:true
       })
    }
    render(){
        const { getFieldDecorator,getFieldValue } = this.props.form;
       // let count = 1;
        //eslint-disable-next-line
        console.log("count",this.props.record);
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
            };
        let arrK = [];
        let realOj = this.props.data1;
        let type = "";
        if(this.props.record.dictKey){
            type = this.props.record.dictKey
        }
        if(realOj.length != 0){
            //eslint-disable-next-line
            console.log("realOjrealOj",realOj);
            for(let i = 0;i<realOj.length;i++){
                arrK.push(i);
            }
            //eslint-disable-next-line
            console.log("arrKarrKarrK",arrK);
            getFieldDecorator('keys',{initialValue:arrK});
        }else{
            getFieldDecorator('keys',{initialValue:[]});
        }
        let keys = getFieldValue('keys');
        //eslint-disable-next-line
        console.log("keyskeyskeys",keys);
        const formItems = keys.map((k) => {            
            let itemKey = "";
            let itemValue = "";
            //eslint-disable-next-line
            console.log("itemKeyitemKey",itemKey);
            if(realOj.length > 0){
                for(let key in realOj[k]){
                    itemKey = key;
                    itemValue = realOj[k][key];
                }
                 //eslint-disable-next-line
                 console.log("itemKeyitemKey",itemKey);
                 //eslint-disable-next-line
                 console.log("itemValueitemValue",itemValue);
            }
            return (
                <FormItem
                {... formItemLayout}
                label={'条目项标识-名称'}
                required={false}
                key={k}
                >
                    {/* <FormItem
                    {...formItemLayout}
                    label="Validating"
                    hasFeedback
                    validateStatus="validating"
                    // help="The information is being validated..."
                    >
                    <Cascader defaultValue={['1']} options={[]} />
                    </FormItem> */}
                    {<FormItem 
                        style = {{"display":"inline-block"}}
                        // label="inline"
                        {...formItemLayout}
                        >
                            <Col span={11}>
                                <FormItem >
                                    {getFieldDecorator(`dicName${k}`, {
                                            initialValue:itemKey,
                                            rules: [{ required: true, message: '请输入条目', whitespace: true }],
                                        })(
                                            <Input placeholder="条目"  />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={2}>
                                <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                -
                                </span>
                            </Col>
                            <Col span={11}>
                                <FormItem>
                                    {getFieldDecorator(`dicName${k}2`, {
                                        initialValue:itemValue,
                                            rules: [{ required: true, message: '请输入名称', whitespace: true }],
                                        })(
                                            <Input placeholder="名称" />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </FormItem>
                    }
                    {keys.length > 1 ? (
                        <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        disabled={keys.length === 1}
                        onClick={() => this.remove(k)}
                        />
                    ) : null}
                </FormItem>
            );
        }); 
        return (
            <span> 
                {/* <label href='javascript:void(0)'  onClick= {() =>{
                    this.props.showModal
                    this.showSet()
                }}>编辑</label> */}
                <Modal
                    visible={this.props.editVisible}
                    title="编辑字典项管理"
                    onOk={this.editHandleOk}
                    onCancel={this.editHandleCancel}
                    width={600}
                    afterClose={this.afterClose}
                    footer={[
                        <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;条目项标识用于后端存储,名称用于前端展示</span>,
                        <Button key="back" size="large" onClick={this.editHandleCancel}>取消</Button>,
                        <Button key="submit" type="primary" htmlType='submit' size="large" loading={this.state.editLoading} onClick={this.editHandleOk}
                         disabled = {this.state.isOrNo}>保存</Button>
                    ]}
                >
                
                    {/* <WrappedRegistrationForm /> */}  
                    <Form>
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
                             initialValue:type,
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
                   
                        {formItems}
                    
                    <FormItem {...formItemLayoutWithOutLabel}>
                    <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                        <Icon type="plus" /> 增加条目
                    </Button>
                    </FormItem>
                         {/* <Child  changeChilc={ childs =>this.changeChilc(childs)} childData = {this.state.data} changedataSource={ dataSource =>this.changedataSource(dataSource)} isOrNoStyle = {this.isOrNoStyle}/> */}
                </Modal>
            </span>
        )
    }
}
const WrappedRegistrationForm = Form.create()(EditDictionaryDetailTest);

export default WrappedRegistrationForm;