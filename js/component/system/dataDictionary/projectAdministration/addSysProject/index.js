import React,{Component} from "react";
import {Button, Form, Modal, Input,Select,message,Row,Col} from "antd";
import $axios from 'axios';
import './index.less'

const FormItem = Form.Item;
const Option = Select.Option;
class AddSysProject extends Component {
    state = {
        loading: false,
        visible: false,
        vendorData: [],
        vendorDataJF: [],
        vendorDataJL: [],
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    getUnitListData = () => {
        let uid = JSON.parse(sessionStorage.getItem("user")).unitId;
        //eslint-disable-next-line
        console.log("uid",uid);
        $axios.post(`http://172.16.6.5:9090/sys/user/selectlist`,{
            "unitid":uid
        }).then((json) => {
            //eslint-disable-next-line
            console.log("参与人",json);
            let vendorData = json.data;
            this.setState({
                vendorData,
            })
        })
    }
    getUserJfData = () => {
        // let userId = sessionStorage.getItem("user").id;
        $axios.post(`http://172.16.6.5:9090/sys/user/selectlist`,{
            // "unitid":userId,
            "unitcode":3,
            "unittype":"JSDW"
        }).then((json) => {
            //eslint-disable-next-line
            console.log("甲方",json);
            let vendorDataJF = json.data;
            this.setState({
                vendorDataJF,
            })
        })
    }
    getUserJLData = () => {
        // let userId = sessionStorage.getItem("user").id;
        $axios.post(`http://172.16.6.5:9090/sys/user/selectlist`,{
            // "unitid":userId,
            "unitcode":1,
            "unittype":"JLDW"
        }).then((json) => {
            //eslint-disable-next-line
            console.log("监理",json);
            let vendorDataJL = json.data;
            this.setState({
                vendorDataJL,
            })
        })
    }
    componentDidMount(){
        //获取参与人
        this.getUnitListData();
        //获取甲方负责人
        this.getUserJfData();
        //获取监理负责人
        this.getUserJLData();
    }
    handleOk = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            
            this.setState({ loading: true });
            //eslint-disable-next-line
            console.log('Received values of form: ', values);
            let name = values.sysProjectName;
            let quality = values.sysProjectCode;
            let codename = values.sysProjectContractNo;
            let first_party = values.sysProjectLeaderJF;
            let supervisor = values.sysProjectLeaderJL;
            let fphone = values.sysProjectJFPhone;
            let sphone = values.sysProjectJLPhone;
            let ids = values.sysProjectVendor;
            if(ids === undefined){
                ids = "";
            }else{
                ids = ids.join(",");
            }
            //eslint-disable-next-line
            console.log('vendor', ids);
            this.addSysProjectData({name,quality,codename,ids,first_party,supervisor,fphone,sphone});
        });
    }
    addSysProjectData = ({name = '',quality = '',codename = '',ids = [],first_party="",supervisor="",fphone="",sphone=""}) => {
        $axios.post(`http://172.16.6.9:9090/pro/project`,{
            "name":name,
            "quality":quality,
            "codename":codename,
            "ids":ids,
            "first_party":first_party,
            "supervisor":supervisor,
            "fphone":fphone,
            "sphone":sphone,
        }).then((json) => {
            if(json.data.success){
                this.success("添加成功！");
                this.props.getListData({});
                this.setState({ loading: false, visible: false });
            }else if(!json.data.success && json.data.message == null){
                this.setState({ loading: false});
                this.error(`添加失败！`);
            }else{
                this.setState({ loading: false});
                
                if(json.data.message.indexOf("项目") > -1 && json.data.message.indexOf("合同") == -1){
                    // eslint-disable-next-line
                    console.log("项目名称已存在");
                    this.props.form.setFields({
                        sysProjectName:{
                            value:name,
                            errors:[new Error("项目名称已存在，请重新填写！")]
                        },
                    })
                }else if(json.data.message.indexOf("合同") > -1 && json.data.message.indexOf("项目") == -1){
                    // eslint-disable-next-line
                    console.log("合同编号已存在");
                    this.props.form.setFields({
                        sysProjectContractNo:{
                            value:codename,
                            errors:[new Error("合同编号已存在，请重新填写！")]
                        },
                    })
                }else if(json.data.message.indexOf("项目") > -1 && json.data.message.indexOf("合同") > -1){
                    // eslint-disable-next-line
                    console.log("doucunzai ");
                    this.props.form.setFields({
                        sysProjectContractNo:{
                            value:codename,
                            errors:[new Error("合同编号已存在，请重新填写！")]
                        },
                        sysProjectName:{
                            value:name,
                            errors:[new Error("项目名称已存在，请重新填写！")]
                        },
                    })
                }
                this.error(`添加失败！`);
            }
        })
    }
    success = (msg) => {
        message.success(msg);
    };
    error = (msg) => {
        message.error(msg);
    };
    handleCancel = () => {
        this.setState({ visible: false });
    }
    selectJL = (curId) => {
        let jlData = this.state.vendorDataJL;
        let cur = curId;
        for(let i=0;i<jlData.length;i++){
            if(cur == jlData[i].id){
                this.props.form.setFieldsValue({
                    sysProjectJLPhone:jlData[i].phone
                })
            }
        }
    }
    selectJF = (curId) =>{
        let jfData = this.state.vendorDataJF;
        let cur = curId;
        for(let i=0;i<jfData.length;i++){
            if(cur == jfData[i].id){
                this.props.form.setFieldsValue({
                    sysProjectJFPhone:jfData[i].phone
                })
            }
        }
    }
    render(){
        const { visible, loading ,vendorData,vendorDataJF,vendorDataJL} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const formItemLayoutWithOutLabel1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 9},
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 15 },
            },
          };
        let vendorArr = [];
        for(let i = 0;i<vendorData.length;i++){
            let item = vendorData[i];
            vendorArr.push(
                <Option value={item.id} key={i}>{`${item.username}(${item.rolename})`}</Option>
            )
        }
        let vendorJFArr = [];
        for(let i = 0;i<vendorDataJF.length;i++){
            let item = vendorDataJF[i];
            vendorJFArr.push(
                <Option value={item.id} key={i}>{`${item.username}`}</Option>
            )
        }
        let vendorJLArr = [];
        for(let i = 0;i<vendorDataJL.length;i++){
            let item = vendorDataJL[i];
            vendorJLArr.push(
                <Option value={item.id} key={i}>{`${item.username}`}</Option>
            )
        }
        // eslint-disable-next-line
        console.log("vendorJLArr",vendorJLArr);
        return(
            <div className="sysProjectNew">
                <Button type="primary" onClick = {this.showModal} icon="plus">新建</Button>
                <Modal
                    visible={visible}
                    title="新建项目"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width = {650}
                    destroyOnClose = {true}
                    footer={[
                      <Button key="back" onClick={this.handleCancel}>取消</Button>,
                      <Button key="submit" type="primary" htmlType="submit" loading={loading} onClick={this.handleOk}>保存</Button>,
                    ]}
                >
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label='项目名称'
                        >
                            {getFieldDecorator("sysProjectName",{
                                rules:[{
                                    required: true, message: '请填写项目名称!'
                                }]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='合同编号'
                        >
                            {getFieldDecorator("sysProjectContractNo",{
                                rules:[{
                                    required: true, message: '请填写合同编号!'
                                }]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='质保情况'
                        >
                            {getFieldDecorator("sysProjectCode",{
                                rules:[{
                                    required: true, message: '请选择质保情况!'
                                }],
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择质保情况..."
                                    optionFilterProp="children"
                                    // onChange={handleChange}
                                    // onFocus={handleFocus}
                                    // onBlur={handleBlur}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value="1">保内</Option>
                                    <Option value="0">保外</Option>
                                    <Option value="2">不确定</Option>
                                </Select>
                            )}
                        </FormItem>
                        <Row>
                            <Col span={10} style={{"marginLeft":"1%"}}>
                                <FormItem
                                    {...formItemLayoutWithOutLabel1}
                                    label='甲方负责人'
                                >
                                    {getFieldDecorator("sysProjectLeaderJF",{
                                        rules:[{
                                            required: true, message: '请选择甲方负责人!'
                                        }],
                                    })(
                                        <Select
                                            showSearch
                                            placeholder="请选择甲方负责人..."
                                            optionFilterProp="children"
                                            // onChange={handleChange}
                                            // onFocus={handleFocus}
                                            // onBlur={handleBlur}
                                            onSelect={this.selectJF}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {vendorJFArr}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={11} style={{"marginLeft":"3%"}}>
                                <FormItem
                                    {...formItemLayoutWithOutLabel1}
                                    label='联系电话'
                                >
                                    {getFieldDecorator("sysProjectJFPhone",{
                                        rules:[{
                                            required: true, message: '请填写联系电话!'
                                        }],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10} style={{"marginLeft":"1%"}}>
                                <FormItem
                                    {...formItemLayoutWithOutLabel1}
                                    label='监理负责人'
                                >
                                    {getFieldDecorator("sysProjectLeaderJL",{
                                        rules:[{
                                            // required: true, message: '请选择甲方负责人!'
                                            required: true, message: '请选择监理负责人!'
                                        }],
                                    })(
                                        <Select
                                            showSearch
                                            placeholder="请选择监理负责人..."
                                            optionFilterProp="children"
                                            // onChange={handleChange}
                                            // onFocus={handleFocus}
                                            // onBlur={handleBlur}
                                            onSelect = {this.selectJL}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {vendorJLArr}
                                        </Select>
                                        // <Input/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={11} style={{"marginLeft":"3%"}}>
                                <FormItem
                                    {...formItemLayoutWithOutLabel1}
                                    label='联系电话'
                                >
                                    {getFieldDecorator("sysProjectJLPhone",{
                                        rules:[{
                                            required: true, message: '请填写联系电话!'
                                        }],
                                    })(
                                        <Input/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem
                            {...formItemLayout}
                            label='参与人'
                        >
                            {getFieldDecorator("sysProjectVendor",{
                                rules:[{
                                    type:"array"
                                }]
                            })(
                                <Select  mode="multiple" placeholder="请选择参与单位...">
                                    {vendorArr}
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

const addSysProject = Form.create()(AddSysProject);
export default addSysProject;
