import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Modal,Form,Input,Row,Col,Select,message,LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import SelectOne from "../../../publicSub/selectOne";
import SchoolMap from "./schoolMap";
import config from '../../../../config';
// import WrappedRegistrationForm from "./test";
import './index.less';

const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
class AddEventCategory extends Component{
    state = {
        editVisible:false,
        editLoading:false,
        rowCode:["BXXZ"],
        areaCode:["SSPQ"],
        data:[],
        prentsData:"",
        getChPoint:"",
      }
    componentDidMount(){
        $axios.get(`${config.api_server}/sys/area/arealist`).then((res) =>{
                   
            if(res.data.data){
                if(res.data.data.length != 0){
                    this.setState({data:res.data.data})
                }
            } 
        })
    }
    componentDidUpdate(){
       
    }
    handleSubmit = (e) => {
        e.preventDefault();
    }
    //操作完成提示弹框
    success = () => {
        // success('操作成功!');
        message.success("编辑用户单位成功")
    };
    error = (error) => {
        message.error(error)
    }
    addHandleOk = (e) => {
        this.setState({ editLoading: true});
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(['name','area','pepole','phone','adds','describeCode',"schoolCode"],(err) => {
            if (err) {
                return ;
            }
            if(!sessionStorage.getItem('selectValue')){
                this.props.form.setFields({
                    categoryCode:{
                        value:"",
                        errors: [new Error('请选择单位性质')],
                    }
                })
            }else{
                this.props.form.setFields({
                    categoryCode:{
                        value:"",
                    }
                })
            }
           let addValue = this.state.prentsData;
           let lng = "";
           let lat = "";
            if(addValue.lat){
                lng = addValue.lng;
                lat = addValue.lat;
            }else{
                lng = this.props.lng;
                lat = this.props.lat;
            }
            let values = {
                "name":this.props.form.getFieldValue("name"),
                "schoolCode":this.props.form.getFieldValue("schoolCode"),
                "areaId":this.props.form.getFieldValue("area"),
                "address":this.props.form.getFieldValue("adds"),
                "principal":this.props.form.getFieldValue("pepole"),
                "principalPhone":this.props.form.getFieldValue("phone"),
                "note":this.props.form.getFieldValue("describeCode"),
                "unitType":sessionStorage.getItem('selectValue'),
                "lng":lng,
                "lat":lat,
                "id":this.props.recordId
            }
            this.setState({ editLoading: true});
            $axios({
                url:`${config.api_server}/sys/unit/update/userunit`,
                method:'post',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                data:values
            }).then((res) => {
                let datas = res.data.success;
                if(datas){
                    this.props.getSchoolDataList({pageNum:1,pageSize:10,param:""})
                    setTimeout(() => {
                        this.props.changeT({editLoading: false, editVisible: false})  
                        this.setState({ editLoading: false, editVisible: false});
                    }, 1000);
                    setTimeout(() => {
                        this.setState({ editLoading: false});
                        this.success();
                    }, 1000);
                }else{
                    this.setState({ editLoading: false});
                    let error = ""
                    if(res.data.message && res.data.message != ""){
                        error = res.data.message
                    }else{
                    error = "编辑用户单位失败"
                    }
                    setTimeout(() => {
                            this.error(error);
                    }, 1000);
                }
           })
        });
        setTimeout(() => {
          this.setState({ editLoading: false, editVisible: false});
        }, 3000);    
    }
    addHandleCancel = () => {
        this.props.changeT({editVisible:false});
    }

    AddNews = () => {
        this.setState({
            editVisible: true,
        });
    }
    afterClose = () => {
        sessionStorage.removeItem('selectValue');
    }
    addrMassage = () =>{
        let searchdata = this.props.form.getFieldValue("adds");
        //eslint-disable-next-line
        //console.log("wwwwwwwwwwwwwwwwwwwwww",searchdata)
        if(searchdata != ""){
            this.setState({searchData:searchdata,mapVisible:true})
        }else{
            this.setState({searchData:this.props.form.getFieldValue("name"),mapVisible:true})
        }       
    }
    prentsData = (value) =>{
        //eslint-disable-next-line
        //console.log("prentsDataprentsDataprentsData",value)
        if(value && value != "" ){
            let arr = value.split(",")
            let obj = {}
            obj.lng = arr[0]
            obj.lat = arr[1]
            //console.log("prentsDataprentsDataprentsData",obj)
            this.setState({prentsData:obj})
            // this.props.form.setFields({
            //     ""
            // })
        }else{
            message.success("没有选择地理位置")
        }
        
    }
    getChPoint = (value) =>{
        //eslint-disable-next-line
        //console.log("valuevaluevaluevaluevalue",value)
        if(value != ""){
            this.setState({getChPoint:value})
            this.props.form.setFields({
                adds:{
                    value:value
                }
            })
        }  
    }
    checkPhone=(rule, value, callback) =>{
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(value)) && !(/^(\d3,4|\d{3,4}-)?\d{7,8}$/).test(value)){
            callback("手机号码有误，请重填");
        }else{
            callback();
        }
    }
    schoolCode = (rule, value, callback) =>{
        if(!(/^[0-9]*$/.test(value))){
            callback("学校编号必须为数字");
        }else{
            callback();
        } 
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        // let option =[];
        let option =[];
        let bData = this.state.data;
        let initialSlect = this.props.area;
        if(bData.length > 0){
            option =  bData.map((item,k)=>{
                return(
                    <Option key = {k} value={item.areaId}>{item.areaName}</Option>
                ) 
            }) 
            if(initialSlect != ""){
                for(let i = 0;i<bData.length;i++){
                    if(bData[i].areaId == initialSlect){
                        break;
                    }else{
                        if(i == bData.length - 1){
                            initialSlect = ""
                        }
                    }
                }
            }    
        }
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
        const formItemLayoutWithOutLabel = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 20 },
            },
          };
          const formItemLayoutWithOutLabel1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8},
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
          };
        return (
            <span>
                <Modal
                    visible={this.props.editVisible}
                    title="编辑用户单位"
                    onOk={this.addHandleOk}
                    onCancel={this.addHandleCancel}
                    width = {650}
                    afterClose = {this.afterClose}
                    destroyOnClose={true}
                    footer={[
                        // <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;类别编码格式统一为拼音首字母大写</span>,
                        <Button key="back" size="large" onClick={this.addHandleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" htmlType="submit" loading={this.state.editLoading} onClick={this.addHandleOk}>
                        保存
                        </Button>,
                    ]}
                >
                <LocaleProvider locale={zhCN}>
                    <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            单位名称&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                            {getFieldDecorator('name', {
                                initialValue:this.props.nameValue,
                                rules: [{ required: true, message: '请输入名称', whitespace: true }, {
                                    validator: this.eventName,
                                }],
                            })(
                                <Input placeholder = "请输入名称"/>
                            )}
                        </FormItem>
                        </Row >
                        <Row>
                        <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            学校编号&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                            {getFieldDecorator('schoolCode', {
                                initialValue:this.props.schoolCode,
                                rules: [{ required: true, message: '请输入学校编号', whitespace: true }, {
                                    validator: this.schoolCode,
                                }],
                            })(
                                <Input placeholder = "请输入学校编号"/>
                            )}
                        </FormItem>
                    </Row >
                        <Row >
                            <Col span = {10} key = {1}  style = {{"marginLeft":"2.8%"}}>
                            <FormItem
                                {...formItemLayoutWithOutLabel1}
                                label={(
                                    <span>
                                    单位性质&nbsp;
                                    </span>
                                )}
                                hasFeedback
                                >
                                    {getFieldDecorator('categoryCode', {
                                        initialValue:this.props.unitType,
                                        rules: [{ required: true, message: '请选择单位性质', whitespace: true }, {
                                            validator: this.eventName,
                                        }],
                                    })(
                                        <SelectOne rowCode = {this.state.rowCode} values = {this.props.unitType} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span = {11} key = {2} style = {{"marginLeft":"1.4%"}}>
                                <FormItem
                                {...formItemLayoutWithOutLabel1}
                                label={(
                                    <span>
                                    所属片区&nbsp;
                                    </span>
                                )}
                                hasFeedback
                                >
                                    {getFieldDecorator('area', {
                                        initialValue:initialSlect,
                                        rules: [{ required: true, message: '请选择片区', whitespace: true }, {
                                            validator: this.eventName,
                                        }],
                                    })(
                                        <Select
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {option}   
                                    </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row >
                            <Col span = {10} key = {1}   style = {{"marginLeft":"2.8%"}}>
                                <FormItem
                                {...formItemLayoutWithOutLabel1}
                                label={(
                                    <span>
                                    负责人&nbsp;
                                    </span>
                                )}
                                hasFeedback
                                >
                                    {getFieldDecorator('pepole', {
                                        initialValue:this.props.principal,
                                        rules: [{ required: true, message: '请输入负责人', whitespace: true }, {
                                            validator: this.eventName,
                                        }],
                                    })(
                                        <Input placeholder = "请输入负责人"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span = {11} key = {2} style = {{"marginLeft":"1.4%"}} >
                                <FormItem
                                {...formItemLayoutWithOutLabel1}
                                label={(
                                    <span>
                                    联系电话&nbsp;
                                    </span>
                                )}
                                hasFeedback
                                >
                                    {getFieldDecorator('phone', {
                                        initialValue:this.props.principalPhone,
                                        rules: [{ required: true, message: '请输入联系电话', whitespace: true }, {
                                            validator: this.checkPhone,
                                        }],
                                    })(
                                        <Input placeholder = "请输入联系电话"/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span = {20} key = {1}  style = {{"marginLeft":"2.8%"}}>
                                <FormItem
                                {...formItemLayoutWithOutLabel}
                                label={(
                                    <span>
                                    详细地址&nbsp;
                                    </span>
                                )}
                                hasFeedback
                                >
                                    {getFieldDecorator('adds', {
                                        initialValue:this.props.address,
                                        rules: [{ required: true, message: '请输入详细地址', whitespace: true }, {
                                            validator: this.eventName,
                                        }],
                                    })(
                                        <Input placeholder = "请输入详细地址" onBlur = {this.addOnBlur}/>
                                    )}{
                                        
                                    }
                                </FormItem>
                            </Col>
                            <Col span = {2} key = {11} >
                            
                                <SchoolMap  mapVisible = {this.state.mapVisible} mapChange = {this.mapChange} searchData = {this.state.searchData} addrMassage = {this.addrMassage} prentsData={this.prentsData}  prentssetLat={this.prentssetLat} getChPoint = {this.getChPoint}/>
                            </Col>
                        </Row>
                        <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                            备注&nbsp;
                            </span>
                        )}
                        hasFeedback
                        >
                            {getFieldDecorator('describeCode', {
                                initialValue:this.props.note,
                                rules: [{ required: false, message: '请输入区域描述!', whitespace: true }],
                            })(
                                <TextArea rows={4} />
                            )}
                        </FormItem>
                    </Form>
                    </LocaleProvider>
                </Modal> 
            </span>
        )
    }
}
const WrappedRegistrationForm = Form.create()(AddEventCategory);

export default WrappedRegistrationForm;