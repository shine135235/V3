import React,{Component} from 'react';
import { Form, Input, Icon, Button,Col } from 'antd';

const FormItem = Form.Item;

let uuid = 0;
class DynamicFieldSet extends Component {
  remove = (k) => {
    //eslint-disable-next-line
    console.log('remove item' + k);
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const keys2 = keys.filter(key => key !== k);
    //eslint-disable-next-line
    console.log(keys2);
    const childData = [];
    for (let index = 0; index < keys2.length; index++) {
        // const element = array[index];
       const  obj = {};
        obj.itemKey = form.getFieldValue('dicName' + keys2[index]);
        obj.itemValue = form.getFieldValue('dicName' + keys2[index] + '2');
        //eslint-disable-next-line
       // console.log("" + val1 + "," + val2);
        childData.push(obj)
    }
    //eslint-disable-next-line
    console.log("sssssssssss",childData);
    this.props.changeChilc(childData);
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
    //eslint-disable-next-line
    // console.log(form.getFieldsValue());
//    this.handleSubmit();
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

//   handleSubmit = (e) => {
//     e.preventDefault();
//     this.props.form.validateFields((err, values) => {
//       if (!err) {
//            //eslint-disable-next-line
//         console.log('child___Remove ', values);
//         this.props.changeChilc(values)
//       }
//     });
//   }
  changeData = () =>{
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    //eslint-disable-next-line
    console.log(keys);
    const childData = [];
    for (let index = 0; index < keys.length; index++) {
        // const element = array[index];
       const  obj = {};
        obj.itemKey = form.getFieldValue('dicName' + keys[index]);
        obj.itemValue = form.getFieldValue('dicName' + keys[index] + '2');
        //eslint-disable-next-line
       // console.log("" + val1 + "," + val2);
        childData.push(obj)
    }
    //eslint-disable-next-line
    console.log("sssssssssss",childData);
    this.props.changeChilc(childData);

    // e.preventDefault();
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //        //eslint-disable-next-line
    //     console.log('changeDatachangeDatachangeData', values);
    //        //eslint-disable-next-line
    //     console.log('changeDatachangeDatachangeData', values.keys);

    //     this.props.changeChilc(values)
    //   }
    //   else{
    //         //eslint-disable-next-line
    //       console.log('exist err');
    //   }
    // });
  }
  entryValue = (rule, value, callback) =>{
    const bValue =  value;
    if(bValue){
        if(/^[A-Z]+$/.test(bValue)){
            callback("请输入大写首字母")
        }
    }else{
        callback("请输入条目")
    }
  }
  eventName = (rule, value, callback) =>{
    const bValue =  value;
    if(bValue){
      if(/^[A-Z]+$/.test(bValue)){
        callback("请输入大写首字母")
      }
    }else{
      callback("请输入名称")
    }
  }
  render() {
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
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    //eslint-disable-next-line
    console.log("新建lebel下标",keys);
    const formItems = keys.map((k) => {
      return (
        <FormItem
          {... formItemLayout}
          label={'条目项标识-名称'}
          required={true}
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
                                    <Input placeholder="条目" />
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
       {/* <Form onSubmit={this.handleSubmit}> */}
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> 增加条目
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