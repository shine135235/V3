import React,{Component} from 'react';
import { Button, Form, Select, Input,  Row, Col, Upload, Icon, Modal, DatePicker, 
    LocaleProvider, message
} from 'antd';
import moment from 'moment';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import $axios from 'axios';
import config from '../../../../../config';
import './index.less'


const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class AddWorkOrder extends Component {
    state = {
        showCollapse:"none",
        previewVisible: false,
        previewImage: '',
        fileList: [],
        resouseData:[],
        faultCategoryData:[],
        faultItemData:[],
        faultTypeData:[],
        projectdata:[],
        serviceUnitdata:[],
        userUnitdata:[],
        slaListdata:[],
        slaLevelData:[],
        handlerData:[],
        handlerDataTZ:[],
        UploadFlg:false,
        showList:"none",
        isRequired:false,
        gzdlID:'',
        unitDisable:false,
        defaultUnitValue:'',
        nowPro:''
    }
    goBack = () => { 
        this.props.changeShowType('list')
    }
    submitFunc = (e) => {
        e.preventDefault();
        this.props.form.validateFields({ force: true },(err, values) => {
            if (err) {
                return;
            }
            let faultSource = values.faultResouse;//故障来源
            let faultTheme = values.faultTheme;//故障主题
            let workOrderDesc = values.faultDescription;//工单描述
            let unitId = values.faultUnit;//流转单位
            let faultSourceUnit = values.faultReportedUnit;//故障来源单位
            let reportPeopleFault = values.faultPerson;  //报障人
            let contactPhone = values.faultPersonPhone; //联系电话
            let projectId = "";   //项目名称
            let faultCategoryId = "";  //故障大类
            let faultCategoryDetailId = "";  //故障细类
            let faultType = "";  //故障类型
            let slaId = "";    //sla 协议
            let slaTimeLevelId = "";    //sla 等级
            let appointmentTime =values.faultTime?values.faultTime.format('YYYY-MM-DD HH:mm:ss'):'';  //预约时间
            let currentHandle = "";//处理人
            let faultPicture = [];// 保存的图片路径
            let status = "2";  //状态
            let relevantPeople = "";// 需要通知的相关人
            if(this.state.isRequired){
                projectId = values.faultProject;
                faultCategoryId = values.faultCategory;
                faultCategoryDetailId = values.faultItem;
                faultType = values.faultType;
                slaId = values.faultService;
                slaTimeLevelId = values.faultServiceLevel;
                currentHandle = values.faultDealPeople;
                let rP = values.faultRelevantPerson;
                if(rP != undefined){
                    relevantPeople = rP.join(",");
                }
                status = "3"
            }
            let pic = this.state.fileList;
            if(pic.length > 0){
                for(let i = 0;i<pic.length;i++){
                    faultPicture.push(pic[i].response.path);
                }
            }
            faultPicture = faultPicture.join(",");
            console.log("故障添加的所有值",values);
            this.addWorkOrder({faultSource,faultTheme,workOrderDesc,unitId,faultSourceUnit,reportPeopleFault,contactPhone,projectId,faultCategoryId,faultCategoryDetailId,faultType,slaId,slaTimeLevelId,appointmentTime,currentHandle,faultPicture,status,relevantPeople})
        });
    }

    addWorkOrder = ({faultSource = "",faultTheme = "",workOrderDesc = "",unitId = "",faultSourceUnit = "",reportPeopleFault = "",contactPhone = "",projectId = "",faultCategoryId = "",faultCategoryDetailId = "",faultType = "",slaId = "",slaTimeLevelId = "",appointmentTime = "",currentHandle = "",faultPicture = "",status = "",relevantPeople = "",}) => {
        $axios.post(`${config.api_server}/ops/workorder/creation`,{
            "faultSourceId":faultSource,//故障来源
            "faultTheme":faultTheme,//故障主题
            "workOrderDesc":workOrderDesc,//工单描述
            "unitId":unitId,//流转单位
            "faultSourceUnitId":faultSourceUnit,//故障来源单位
            "reportPeopleFault":reportPeopleFault,  //报障人
            "contactPhone":contactPhone, //联系电话
            "projectId":projectId,   //项目名称
            "faultCategoryId":faultCategoryId,  //故障大类
            "faultCategoryDetailId":faultCategoryDetailId,  //故障细类
            "faultTypeId":faultType, //故障类型
            "slaId":slaId,    //sla 协议
            "slaTimeLevelId":slaTimeLevelId,    //sla 等级
            "appointmentTime":appointmentTime,  //预约时间
            "currentHandleId":currentHandle,//处理人
            "faultPicture":faultPicture,// 保存的图片路径
            "status":status,  //状态
            "relevantPeople":relevantPeople,// 需要通知的相关人
        }).then((json) => {
            // eslint-disable-next-line
            console.log("工单添加",json);
            if(json.data.success){
                this.success("添加成功！");
                this.props.changeShowType('list');
                this.props.refreshData(1);
            }else{
                this.error("添加失败！");
            }
        })
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    componentWillMount(){
        this.getOrderSouse();
        this.getServiceUnit();
        this.getUserUnit();
        this.getSlaList();
        let isOpen = sessionStorage.getItem("isOpen");
        if(isOpen == "true"){
            this.setState({
                showList:"block",
                isRequired:true,
                unitDisable:true,
                defaultUnitValue:sessionStorage.getItem('deskUnitId')
            })
        }else{
            this.setState({
                showList:"none",
                isRequired:false
            })
        }
    }
    componentDidMount () {
        if(this.state.defaultUnitValue!=''){
            this.getProject(this.state.defaultUnitValue)
        }
    }
    addThemeValue = (value) => {
        let isDeskUnit = sessionStorage.getItem("isDeskUnit");
        let deskUnitId = sessionStorage.getItem("deskUnitId");
        let isOpen = sessionStorage.getItem("isOpen");
        console.log(value==deskUnitId)
        if(isOpen == "true"){
            this.setState({
                showList:"block",
                isRequired:true
            });
            this.getProject(value);
        }else{
            if(isDeskUnit == "true" && isOpen == "false" && value == deskUnitId ){
                this.setState({
                    showList:"block",
                    isRequired:true
                })
                this.getProject(value);
            }else{
                this.setState({
                    showList:"none",
                    isRequired:false
                })
            }
        }
        
        this.props.form.setFields({
            faultProject:{
                value:undefined,
            },
            faultCategory:{
                value:undefined,
            },
            faultItem:{
                value:undefined,
            },
            faultType:{
                value:undefined,
            },
            faultService:{
                value:undefined,
            },
            // faultTime:{
            //     value:undefined,
            // },
            faultServiceLevel:{
                value:undefined,
            },
            faultDealPeople:{
                value:undefined,
            },
            faultRelevantPerson:{
                value:undefined,
            },
        })
    }
    getOrderSouse = () => {
        $axios.get(`${config.api_server}/sys/dictitem/query/id`).then((json) => {
            let resouseData = json.data.data;
            this.setState({resouseData})
        })
    }
    getProject = (uid) => {
        $axios.get(`${config.api_server}/pro/prolist`,{
            params:{
                unitId:uid
            }
        }).then((json) => {
            // eslint-disable-next-line
            console.log("getProject",json)
            let projectdata = json.data.data;
            this.setState({projectdata})
            
        })
    }
    getServiceUnit = () => {
        $axios.get(`${config.api_server}/sys/unit/serviceunit`).then((json) => {
            let serviceUnitdata = json.data.data;
            this.setState({serviceUnitdata})
        })
    }
    getUserUnit = () => {
        $axios.get(`${config.api_server}/sys/unit/userunit`).then((json) => {
            let userUnitdata = json.data.data;
            this.setState({userUnitdata})
        })
    }
    getSlaList = () => {
        $axios.get(`${config.api_server}/ops/sla/slalist`).then((json) => {
            let slaListdata = json.data.data;
            this.setState({slaListdata})
        })
    }
    getFaultCategory = (fid) => {
        console.log(fid)
        $axios.get(`${config.api_server}/sys/faultcategory/list`,{
            params:{
                projectId:fid
            }
        }).then((json) => {
            let faultCategoryData = json.data.page.datas;
            this.setState({faultCategoryData})
        })
    }
    getfaultItemData = (value) => {
        $axios.get(`${config.api_server}/sys/faultcategory/sublist`,{
            params:{
                parentId:value
            }
        }).then((json) => {
            // eslint-disable-next-line
            console.log("getFaultCategory",json)
            let faultItemData = json.data.page.datas;
            this.setState({faultItemData})
        })
    }
    getSlaLevelData = (value) => {
        $axios.get(`${config.api_server}/ops/sla/id/${value}`).then((json) => {
            // eslint-disable-next-line
            console.log("getSlaLevelData",json)
            let slaLevelData = json.data.data.list;
            this.setState({slaLevelData})
        })
    }
    getfaultType = (value) => {
        let falutcategorypid = this.props.form.getFieldValue("faultCategory");
        $axios.get(`${config.api_server}/sys/faulttype/list?falutcategoryid=${value}&falutcategorypid=${falutcategorypid}`).then((json) => {
            // eslint-disable-next-line
            console.log("getFaultCategory",json)
            let faultTypeData = json.data.page.datas;
            this.setState({faultTypeData})
        })
    }
    getFaultItem = (value) => {
        this.props.form.setFieldsValue({
            // faultTheme:themeValue,
            faultItem:undefined,
            faultType:undefined
        })
        this.getfaultItemData(value)
    }
    checkUnitValue=() =>{
        let unitValue=this.props.form.getFieldValue("faultUnit");
        if(unitValue==undefined){
            this.props.form.setFields({
                faultUnit:{
                    value:undefined,
                    errors:[new Error("请选择流转单位")]
                }
            })
        }
    }
    checkProjectValue=() =>{
        let projectValue=this.props.form.getFieldValue("faultProject");
        if(projectValue==undefined){
            this.props.form.setFields({
                faultProject:{
                    value:undefined,
                    errors:[new Error("请选择项目")]
                }
            })
        }
    }
    checkFaultCategoryValue = () => {
        let faultcategory = this.props.form.getFieldValue("faultCategory");
        if(faultcategory == undefined){
            this.props.form.setFields({
                faultCategory:{
                    value:undefined,
                    errors:[new Error("请选择事件大类")]
                }
            })
        }
    }
    checkFaultItemValue = () => {
        let faultItem = this.props.form.getFieldValue("faultItem");
        if(faultItem == undefined){
            this.props.form.setFields({
                faultItem:{
                    value:undefined,
                    errors:[new Error("请选择事件细类")]
                }
            })
        }
    }
    checkSlaLevel = () => {
        let faultService = this.props.form.getFieldValue("faultService");
        if(faultService == undefined){
            this.props.form.setFields({
                faultService:{
                    value:undefined,
                    errors:[new Error("请选择服务协议")]
                }
            })
        }
    }
    getFaultType = (value) => {
        // let faultItemData = this.state.faultItemData;
        // let faultCategoryData = this.state.faultCategoryData;
        // let serviceUnitdata = this.state.serviceUnitdata;
        // let faultUnitValue = this.props.form.getFieldValue("faultUnit");
        // let categoryValue = this.props.form.getFieldValue("faultCategory");
        // let themeValue = "";
        // let faultCategoryValue = '';
        // let serviceUnitValue = '';
        // let faultItemValue = ""
        // for(let i = 0;i<serviceUnitdata.length;i++){
        //     let item = serviceUnitdata[i];
        //     if(item.unitId == faultUnitValue){
        //         serviceUnitValue = item.unitName+"处理中"
        //     }
        // }
        // for(let i = 0;i<faultCategoryData.length;i++){
        //     let item = faultCategoryData[i];
        //     if(item.id == categoryValue){
        //         faultCategoryValue = "/"+item.faultname
        //     }
        // }
        // for (let i = 0; i < faultItemData.length; i++) {
        //     let item = faultItemData[i];
        //     if(value == item.id){
        //         faultItemValue = "-"+item.faultname;
        //     }
            
        // }
        // themeValue = serviceUnitValue+faultCategoryValue+faultItemValue;
        this.props.form.setFieldsValue({
            // faultTheme:themeValue,
            faultType:undefined
        })
        this.getfaultType(value);
    }
    getSlaLevel = (value) => {
        this.props.form.setFieldsValue({
            faultServiceLevel:undefined
        })
        this.getSlaLevelData(value);
    }
    
    getHandler = () => {
        let faultUnit = this.props.form.getFieldValue("faultUnit");
        let faultProject = this.props.form.getFieldValue("faultProject");
        if(faultUnit !== undefined && faultProject !== undefined){
            // $axios.get(`${config.api_server}/sys/user/workuserlist?projectId=${faultProject}&unitId=${faultUnit}&type=handler`).then((json) => {
            //     // eslint-disable-next-line
            //     console.log("workuserlisthandler",json);
            //     let handlerData = json.data;
            //     this.setState({handlerData})
            // });
            // $axios.get(`${config.api_server}/sys/user/workuserlist?projectId=${faultProject}&unitId=${faultUnit}`).then((json) => {
            //     // eslint-disable-next-line
            //     console.log("workuserlist",json);
            //     let handlerDataTZ = json.data;
            //     this.setState({handlerDataTZ})
            // });
        }else{

            if(faultUnit == undefined){
                this.props.form.setFields({
                    faultUnit:{
                        value:undefined,
                        errors:[new Error("请选择流转单位")]
                    }
                })
            }
            if(faultProject == undefined){
                this.props.form.setFields({
                    faultProject:{
                        value:undefined,
                        errors:[new Error("请选择项目")]
                    }
                })
            }
            if(faultUnit == undefined && faultProject == undefined){
                this.props.form.setFields({
                    faultProject:{
                        value:undefined,
                        errors:[new Error("请选择项目")]
                    },
                    faultUnit:{
                        value:undefined,
                        errors:[new Error("请选择流转单位")]
                    }
                })
            }
        }

    }
    getHandlerAndTZ = (value) => {
        this.props.form.resetFields(['faultCategory','faultItem','faultType'])    
        let faultUnit = this.props.form.getFieldValue("faultUnit");
        // let faultProject = this.props.form.getFieldValue("faultProject");
        $axios.get(`${config.api_server}/sys/user/workuserlist`,{
            params:{
                projectId:value,
                unitId:faultUnit,
                type:'handler'
            }
        }).then((json) => {
            let handlerData = json.data;
            this.setState({handlerData})
        });
        this.getFaultCategory(value);
        $axios.get(`${config.api_server}/sys/user/workuserlist`,{
            params:{
                projectId:value,
                unitId:faultUnit
            }
        }).then((json) => {
            let handlerDataTZ = json.data;
            this.setState({handlerDataTZ})
        });
    }
    handleChange = (info) => {
        console.log(info)
        if(info.file.type==='image/jpeg' || info.file.type==='image/png'){
            this.setState({ fileList:info.fileList })
            
        }else{
            message.error('上传图片格式有误,请重新上传!')
            return ;
        }
    };
    beforeUpload=(file) => {
        console.log(file)
        let fileSize = file.size/1024;
        if(fileSize > 5125){
            this.error("图片过大，请重新上传！");
            this.setState({UploadFlg:true});
            return;
        }else{
            this.setState({UploadFlg:false})
        }
    }
    error = (con) => {
        message.error(con)
    }
    success = (con) => {
        message.success(con)
    }
    render(){
        const { previewVisible, previewImage, fileList, resouseData,faultCategoryData,faultItemData,faultTypeData,projectdata,serviceUnitdata,userUnitdata,slaListdata,slaLevelData,handlerData,handlerDataTZ } = this.state;
        const {getFieldDecorator} = this.props.form;
        const uploadButton = (
        <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
        </div>
        );
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 2 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 10 },
            },
        };
        const formItemLayoutTime = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
              },
        };
        const formItemLayout1 = {
            labelCol: {
            //   xs: { span: 12 },
            //   sm: { span: 2 },
            span:4,
            },
            wrapperCol: {
            //   xs: { span: 12 },
            //   sm: { span: 10 },
            span:20
            },
        };
        return(
            <div className='addWorkOrder'>
            <LocaleProvider locale={zhCN}>
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="故障来源"
                    >
                        {getFieldDecorator('faultResouse', {
                            rules: [{
                                required: true,
                                message: '请选择故障来源',
                            }],
                        })(
                            <Select placeholder="请选择故障来源..." showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {
                                    resouseData.map((item,index) => {
                                        return <Option key={index} value={item.dictItemId}>{item.itemValue}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="故障主题"
                    >
                        {getFieldDecorator('faultTheme', {
                            rules: [{
                                required: true,
                                message: '请填写故障主题',
                            }],
                        })(
                            <Input placeholder="请填写故障主题..."/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="故障描述"
                    >
                        {getFieldDecorator('faultDescription', {
                            rules: [{
                                required: true,
                                message: '请填写故障描述',
                            }],
                        })(
                            <TextArea rows={4} />
                        )}
                    </FormItem>
                    <Row style={{"marginTop":"12px"}}>
                        <Col span={12}>
                            <FormItem
                                {...formItemLayout1}
                                label="报障单位"
                            >
                                {getFieldDecorator('faultReportedUnit', {
                                    rules: [{
                                        required: true,
                                        message: '请选择报障单位',
                                    }],
                                })(
                                    <Select placeholder="请选择报障单位..." showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        {
                                            userUnitdata.map((item,index) => {
                                                return <Option key={index} value={item.unitId}>{item.unitName}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            
                        </Col>
                        <Col span={12}>
                        <FormItem
                                {...formItemLayout1}
                                label="报障人"
                            >
                                {getFieldDecorator('faultPerson', {
                                    rules: [{
                                        required: true,
                                        message: '请填写报障人',
                                    }],
                                })(
                                    <Input placeholder='请填写报障人...'/>
                                )}
                            </FormItem>
                            
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                        <FormItem
                                {...formItemLayout1}
                                label="联系电话"
                            >
                                {getFieldDecorator('faultPersonPhone', {
                                    rules: [{
                                        required: true,
                                        message: '请填写联系电话',
                                    }],
                                })(
                                    <Input placeholder='请填写联系电话...'/>
                                )}
                            </FormItem>
                            
                        </Col>
                        <Col span={12}>
                        <FormItem
                                {...formItemLayout1}
                                label="流转单位"
                            >
                                {getFieldDecorator('faultUnit', {
                                    rules: [{
                                        required: true,
                                        message: '请选择流转单位',
                                    }],
                                    initialValue:this.state.defaultUnitValue
                                })(
                                    <Select placeholder="请选择流转单位..." showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} 
                                    onSelect={this.addThemeValue}
                                    disabled={this.state.unitDisable}
                                    >
                                        {
                                            serviceUnitdata.map((item,index) => {
                                                return <Option key={index} value={item.unitId}>{item.unitName}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            
                        </Col>
                    </Row>
                    <Row>
                    <Col span={12}>
                                <FormItem
                                        {...formItemLayoutTime}
                                        label="预约时间"
                                    >
                                        {getFieldDecorator('faultTime', {
                                            rules: [{
                                                required: this.state.isRequired,
                                                message: '请选择预约时间',
                                            }],
                                            initialValue:moment(new Date())
                                        })(
                                                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{"width":"100%"}}/>
                                        )}
                                </FormItem>
                        </Col>
                    </Row>
                    <Row style={{"display":this.state.showList}}>
                        <Col span={12}>
                        <FormItem
                                {...formItemLayout1}
                                label="项目名称"
                            >
                                {getFieldDecorator('faultProject', {
                                    rules: [{
                                        required: this.state.isRequired,
                                        message: '请选择项目名称',
                                    }],
                                })(
                                    <Select placeholder="请选择项目名称..." onFocus={this.checkUnitValue} showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange = {this.getHandlerAndTZ}>
                                        {
                                            projectdata.map((item,index) => {
                                                return <Option key={index} value={item.proId}>{item.proName}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            
                        </Col>
                        <Col span={12}>
                        <FormItem
                                {...formItemLayout1}
                                label="事件大类"
                            >
                                {getFieldDecorator('faultCategory', {
                                    rules: [{
                                        required: this.state.isRequired,
                                        message: '请选择事件大类',
                                    }],
                                })(
                                    <Select placeholder="请选择事件大类..." showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onFocus={this.checkProjectValue} onChange = {this.getFaultItem}>
                                        {
                                            faultCategoryData.map((item,index) => {
                                                return <Option key={index} value={item.id}>{item.faultname}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            
                        </Col>
                    </Row>
                    <Row style={{"display":this.state.showList}}>
                        <Col span={12}>
                        <FormItem
                                {...formItemLayout1}
                                label="事件细类"
                            >
                                {getFieldDecorator('faultItem', {
                                    rules: [{
                                        required: this.state.isRequired,
                                        message: '请选择事件细类',
                                    }],
                                })(
                                    <Select placeholder="请选择事件细类..." showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onFocus={this.checkFaultCategoryValue} onChange={this.getFaultType}>
                                        {
                                            faultItemData.map((item,index) => {
                                                return <Option key={index} value={item.id}>{item.faultname}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                        <FormItem
                                {...formItemLayout1}
                                label="事件类型"
                            >
                                {getFieldDecorator('faultType', {
                                    rules: [{
                                        required: this.state.isRequired,
                                        message: '请选择事件类型',
                                    }],
                                })(
                                    <Select placeholder="请选择事件类型..." showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onFocus={this.checkFaultItemValue} 
                                    // onSelect={this.themeTypeV}
                                    >
                                        {
                                            faultTypeData.map((item,index) => {
                                                return <Option key={index} value={item.id}>{item.typename}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            
                        </Col>
                    </Row>
                    <Row style={{"display":this.state.showList}}>
                        <Col span={12}>
                        <FormItem
                                {...formItemLayout1}
                                label="服务协议"
                            >
                                {getFieldDecorator('faultService', {
                                    rules: [{
                                        required: this.state.isRequired,
                                        message: '请选择服务协议',
                                    }],
                                })(
                                    <Select placeholder="请选择服务协议..." showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={this.getSlaLevel}>
                                        {
                                            slaListdata.map((item,index) => {
                                                return <Option key={index} value={item.id}>{item.name}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            
                        </Col>
                        <Col span={12}>
                        <FormItem
                                {...formItemLayout1}
                                label="服务级别"
                            >
                                {getFieldDecorator('faultServiceLevel', {
                                    rules: [{
                                        required: this.state.isRequired,
                                        message: '请选择服务级别',
                                    }],
                                })(
                                    <Select placeholder="请选择服务级别..." showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onFocus={this.checkSlaLevel}>
                                        {
                                            slaLevelData.map((item,index) => {
                                                return <Option key={index} value={item.id}>{item.serviceLevelName}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            
                        </Col>
                    </Row>
                    <Row style={{"display":this.state.showList}}>
                        
                        <Col span={12}>
                        <FormItem
                                {...formItemLayout1}
                                label="处理人"
                            >
                                {getFieldDecorator('faultDealPeople', {
                                    rules: [{
                                        required: this.state.isRequired,
                                        message: '请选择处理人',
                                    }],
                                })(
                                    <Select placeholder="请选择处理人..." showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onFocus={this.getHandler}>
                                        {
                                            handlerData.map((item,index) => {
                                                return <Option key={index} value={item.loginId}>{`${item.username}(${item.rolename})`}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem
                        {...formItemLayout}
                        label='上传图片'
                    >
                        
                            <div className="clearfix">
                            {getFieldDecorator("faultPicture")(
                                <Upload
                                    accept="image/jpeg,image/png,image/gif,image/bmp"
                                    action={`${config.api_server}/upload/resource/commonupload`}
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                    data={{type:"workorder"}}
                                    beforeUpload={this.beforeUpload}
                                >
                                    {fileList.length >= 3 ? null : uploadButton}
                                </Upload>
                            )}
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                          </div>
                        <div>可以上传3张图片，单张小于5M。图片支持的格式有：jpg,bmp,png,gif</div>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='通知相关人'
                        style={{"display":this.state.showList}}
                    >
                        {getFieldDecorator("faultRelevantPerson",{
                            rules:[{
                                type:"array"
                            }]
                        })(
                            <Select onSelect={this.setTz} mode="multiple" placeholder="请选择相关人..." showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {
                                    handlerDataTZ.map((item,index) => {
                                        return <Option key={index} value={item.id}>{`${item.username}(${item.rolename})`}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>


                    <FormItem
                        wrapperCol={{ span: 12, offset: 2 }}
                    >
                        <Button type="primary" htmlType="submit" onClick={this.submitFunc}>提交</Button>
                        <Button onClick={this.goBack} style={{"marginLeft":"2%"}}>返回</Button>
                    </FormItem>
                </Form>
                </LocaleProvider>
            </div>
        )
    }
}

const addWorkOrder = Form.create()(AddWorkOrder);
export default addWorkOrder;
