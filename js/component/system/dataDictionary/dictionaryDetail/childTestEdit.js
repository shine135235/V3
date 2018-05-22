import React,{Component} from 'react';
import { Form, Input, Icon, Button,Col } from 'antd';
// import './dictionaryAll.less';

const FormItem = Form.Item;

let uuid = 0;
// let realObj={};
// let realKeys={};
class DynamicFieldSet extends Component {
    state = {
        realObj:{},
        realKeys:{}
    }
    componentDidMount(){
        //eslint-disable-next-line
        console.log("childMOnd",this.props.childData);
        //eslint-disable-next-line
        console.log("childMOndform",this.props.form);
        
        let childData = this.props.childData;
        // let realData={};
         let realObj1={};
        for(let keys in childData){
            for(let key in childData[keys]){
                realObj1[`dicName${keys}`]={
                        value:key
                    };
                    realObj1[`dicName${keys}2`]={
                        value:childData[keys][key]
                    };
            }
        }        
        //eslint-disable-next-line
        console.log(realObj1)
        uuid = childData.length-1;     
       this.props.form.setFields(realObj1);
    }
    componentDidUpdate(){
        //eslint-disable-next-line
        console.log("childUpdata",this.props.childData);
        //eslint-disable-next-line
        console.log("forms status",this.props);
    }
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
        this.props.changedataSource(childData);
        this.props.isOrNoStyle({type:false});
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
    changeData = (e) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        if (!err) {
            //eslint-disable-next-line
            //console.log('changeDatachangeDatachangeData', values);
            this.props.changeChilc(values)
        }
        else{
                //eslint-disable-next-line
            console.log('exist err');
        }
        });
    }

    render() {
        //eslint-disable-next-line
        //console.log("realObj is :",this.props.childData);
        const { getFieldDecorator, getFieldValue } = this.props.form;
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
        let realOj = this.props.childData;
        if(realOj.length != 0){
            for(let i = 0;i<realOj.length;i++){
                arrK.push(i);
            }
        }
        //eslint-disable-next-line
        //console.log("arrK",arrK);
        //this.props.form.setFields(realOj);
        getFieldDecorator('keys', { initialValue: [] });
        // getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        //eslint-disable-next-line                                                                                                             
        //console.log("编辑lebel下标",keys);
        const formItems = keys.map((k) => {
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
            <span onChange = {this.changeData}>
            {formItems}
            <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                <Icon type="plus" /> 添加新条目
            </Button>
            </FormItem>
            {/* <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="primary" htmlType="submit">Submit</Button>
            </FormItem> */}
        {/* </Form> */}
        </span>
        );    
    }
}
const WrappedDynamicFieldSet = Form.create()(DynamicFieldSet);
export default WrappedDynamicFieldSet;