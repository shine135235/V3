import React,{Component} from "react";
import {Button, Form, Modal, Input,Select,message,Row,Col,LocaleProvider} from "antd";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import $axios from 'axios';
import config from '../../../../../config';
import './index.less'

const FormItem = Form.Item;
const Option = Select.Option;
class EditSysProject extends Component {
    state = {
        loading: false,
        vendorData: [],
        vendorDataJF: [],
        vendorDataJL: [],
        data:[]
    }
    handleOk = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            //eslint-disable-next-line
            console.log('Received values of form: ', values);
            //eslint-disable-next-line
            console.log('rowId: ', this.props.rowId);
            let faultcategory = [];
            let option = values.faultName;
            for(let i = 0;i<option.length;i++){
                let opt = {};
                opt.id = option[i];
                faultcategory.push(opt)
            }
            this.setState({ loading: true });
            let id = this.props.rowId;
            let name = values.sysProjectNameEdit;
            let codename = values.sysProjectContractNoEdit;
            let quality = values.sysProjectCodeEdit;
            let first_party = values.sysProjectLeaderJFEdit;
            let supervisor = values.sysProjectLeaderJLEdit;
            let fphone = values.sysProjectJFPhoneEdit;
            let sphone = values.sysProjectJLPhoneEdit;
            let ids = values.sysProjectVendorEdit;
            if(ids === undefined){
                ids = "";
            }else{
                ids = ids.join(",");
            }
            //eslint-disable-next-line
            console.log('ids', ids);
            this.editSysProjectData({id,name,quality,codename,ids,first_party,supervisor,fphone,sphone,faultcategory})
        });
    }
    editSysProjectData = ({id = "",name = "",quality = "", codename = "",ids = [],first_party="",supervisor="",fphone="",sphone="",faultcategory=[]}) => {
        $axios.put(`${config.api_server}/pro/project`,{
            "id":id,
            "name":name,
            "quality":quality,
            "codename":codename,
            "ids":ids,
            "first_party":first_party,
            "supervisor":supervisor,
            "fphone":fphone,
            "sphone":sphone,
            "faultcategory":faultcategory
        }).then((json) => {
            // eslint-disable-next-line
            console.log(json);
            this.setState({ loading: false});
            if(json.data.success){
                this.success("编辑成功！");
                this.props.getListData({});
                this.props.changeVisibleEdit({ changeVisibleEdit: false });
                this.setState({ loading: false });
            }else if(!json.data.success && json.data.message==null){
                this.error("编辑失败！");
            }else{
                if(json.data.message.indexOf("项目") > -1 && json.data.message.indexOf("合同") == -1){
                    // eslint-disable-next-line
                    console.log("项目名称已存在");
                    this.props.form.setFields({
                        sysProjectNameEdit:{
                            value:name,
                            errors:[new Error("项目名称已存在，请重新填写！")]
                        },
                    })
                }else if(json.data.message.indexOf("合同") > -1 && json.data.message.indexOf("项目") == -1){
                    // eslint-disable-next-line
                    console.log("合同编号已存在");
                    this.props.form.setFields({
                        sysProjectContractNoEdit:{
                            value:codename,
                            errors:[new Error("合同编号已存在，请重新填写！")]
                        },
                    })
                }else if(json.data.message.indexOf("项目") > -1 && json.data.message.indexOf("合同") > -1){
                    // eslint-disable-next-line
                    console.log("doucunzai ");
                    this.props.form.setFields({
                        sysProjectContractNoEdit:{
                            value:codename,
                            errors:[new Error("合同编号已存在，请重新填写！")]
                        },
                        sysProjectNameEdit:{
                            value:name,
                            errors:[new Error("项目名称已存在，请重新填写！")]
                        },
                    })
                }
                this.error("编辑失败！");
            }
            // this.props.getListData({});
        })
    }
    success = (msg) => {
        message.success(msg);
    };
    error = (msg) => {
        message.error(msg);
    };
    handleCancel = () => {
        this.props.changeVisibleEdit({ changeVisibleEdit: false });
    }
    getUnitListData = () => {
        let uId = JSON.parse(sessionStorage.getItem("user")).unitId;
        $axios.post(`${config.api_server}/sys/user/selectlist`,{
            "unitid":uId
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
        $axios.post(`${config.api_server}/sys/user/selectlist`,{
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
        $axios.post(`${config.api_server}/sys/user/selectlist`,{
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
    getSelectList = () =>{
        $axios.get(`${config.api_server}/sys/faultcategory/list`).then((res) =>{
            if(res.data.page){
                if(res.data.page.datas.length != 0){
                    this.setState({data:res.data.page.datas})
                }  
            } 
        })
    }
    componentDidMount(){
       //获取参与人
       this.getUnitListData();
       //获取甲方负责人
       this.getUserJfData();
       //获取监理负责人
       this.getUserJLData();
       this.getSelectList();
    }
    // selectJL = () => {
    //     let jlData = this.state.vendorDataJL;
    //     let cur = this.props.form.ge
    // }
    selectJL = (curId) => {
        let jlData = this.state.vendorDataJL;
        let cur = curId;
        for(let i=0;i<jlData.length;i++){
            if(cur == jlData[i].id){
                this.props.form.setFieldsValue({
                    sysProjectJLPhoneEdit:jlData[i].phone
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
                    sysProjectJFPhoneEdit:jfData[i].phone
                })
            }
        }
    }
    render(){
        const { loading ,vendorData,vendorDataJF,vendorDataJL} = this.state;
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
        let serviceDeskUnit = this.props.first_party;
        for(let i = 0;i<vendorDataJF.length;i++){
            let item = vendorDataJF[i];
            vendorJFArr.push(
                <Option value={item.id} key={i}>{`${item.username}`}</Option>
            )  
        }
        if(serviceDeskUnit != ""){
            for(let i = 0;i<vendorDataJF.length;i++){
                if(vendorDataJF[i].id == serviceDeskUnit){
                    break;
                }else{
                    if(i == vendorDataJF.length - 1){
                        serviceDeskUnit = ""
                    }
                }
            }
        }
        let vendorJLArr = [];
        let supervisor = this.props.supervisor;
        for(let i = 0;i<vendorDataJL.length;i++){
            let item = vendorDataJL[i];
            vendorJLArr.push(
                <Option value={item.id} key={i}>{`${item.username}`}</Option>
            )
        }
        const children = [];
        let bData = this.state.data;
        let initialSlect = this.props.faultcategory;
        let intSelect = [];
        if(bData.length > 0){
            for (let i = 0; i < bData.length; i++) {
                children.push(<Option key = {i} value = {bData[i].id}>{bData[i].faultname}</Option>);
           }
            if(initialSlect.length != 0){
                for(let i = 0;i<initialSlect.length;i++){
                    for(let j = 0;j<bData.length;j++){
                        if(bData[j].id == initialSlect[i].id){
                            intSelect.push(initialSlect[i].id)
                            break;
                        }else{
                            continue
                        }
                    }    
                }
            }  
        }
        if(supervisor != ""){
            for(let i = 0;i<vendorDataJL.length;i++){
                if(vendorDataJL[i].id == supervisor){
                    break;
                }else{
                    if(i == vendorDataJL.length - 1){
                        supervisor = ""
                    }
                }
            }
        }
        return(
            <div className="sysProjectEdit">
                <Modal
                    visible={this.props.visibleEdit}
                    title="编辑项目"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose = {true}
                    width={650}
                    footer={[
                      <Button key="back" onClick={this.handleCancel}>取消</Button>,
                      <Button key="submit" type="primary" htmlType="submit" loading={loading} onClick={this.handleOk}>保存</Button>,
                    ]}
                >
                <LocaleProvider locale = {zhCN}>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label='项目名称'
                        >
                            {getFieldDecorator("sysProjectNameEdit",{
                                rules:[{
                                    required: true, message: '请填写项目名称!'
                                }],
                                initialValue: this.props.name,
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            事件大类&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                            {getFieldDecorator('faultName', {
                                initialValue: intSelect,
                                rules: [{ required: true, message: '请选择事件大类', whitespace: true,type:"array" }],
                            })(
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp="children"
                                    placeholder="请选择事件大类"
                                    onSelect={this.onSelect}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {children}
                                </Select>
                                
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='合同编号'
                        >
                            {getFieldDecorator("sysProjectContractNoEdit",{
                                initialValue: this.props.CodeName,
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
                            {getFieldDecorator("sysProjectCodeEdit",{
                                initialValue: this.props.quality,
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
                                    {getFieldDecorator("sysProjectLeaderJFEdit",{
                                        initialValue: serviceDeskUnit,
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
                                    {getFieldDecorator("sysProjectJFPhoneEdit",{
                                        initialValue: this.props.fphone,
                                        rules:[{
                                            required: true, message: '请填写联系电话!'
                                        }],
                                    })(
                                        <Input disabled={true}/>
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
                                    {getFieldDecorator("sysProjectLeaderJLEdit",{
                                        initialValue: supervisor,
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
                                    {getFieldDecorator("sysProjectJLPhoneEdit",{
                                        initialValue: this.props.sphone,
                                        rules:[{
                                            required: true, message: '请填写联系电话!'
                                        }],
                                    })(
                                        <Input disabled={true}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem
                            {...formItemLayout}
                            label='参与人'
                        >
                            {getFieldDecorator("sysProjectVendorEdit",{
                                initialValue:this.props.users,
                                rules:[{
                                    type:"array"
                                }]
                            })(
                                <Select  mode="multiple" placeholder="请选择参与人...">
                                    {
                                        // vendorData.map((item,i) =>{
                                        //     return (<Option key={i} value={item.id}>{item.name}</Option>)
                                        // })
                                        vendorArr
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                    </LocaleProvider> 
                </Modal>
            </div>
        )
    }
}

const editSysProject = Form.create()(EditSysProject);
export default editSysProject;
