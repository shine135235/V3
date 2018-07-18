import React,{Component} from 'react';
import $axios from 'axios';
import { Button,Modal,Form,Input,Row,Col,Select,LocaleProvider,message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import SelectOne from "../../../publicSub/selectOne";
import SchoolMap from "./schoolMap";
import config from '../../../../config';

// import WrappedRegistrationForm from "./test";
import './index.less';

let _this;
const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
class AddEventCategory extends Component{
    constructor(props){
        super(props);
        _this = this;
        this.state = {
            addVisible:false,
            addLoading:false,
            mapVisible:false,
            data:[],
            prentsData:"",
            searchData:"",
            getChPoint:"",
            prentssetLat:"",
            rowCode:["BXXZ"],
            areaCode:["SSPQ"]
          }
    }  
    componentDidMount(){
        $axios.get(`${config.api_server}/sys/area/arealist`).then((res) =>{
            if(res.data.data){
                if(res.data.data.length != 0){
                    this.setState({data:res.data.data})
                }
                //eslint-disable-next-line
               // console.log("啊啊啊啊啊啊啊啊啊啊啊啊啊",res)
            } 
        })
    }
    componentDidUpdate(){
       
    }
    success = () => {
        message.success("添加用户单位成功")
    };
    error = (error) => {
        message.error(error)
    }
    addHandleOk = (e) => {
         e.preventDefault();
        this.props.form.validateFieldsAndScroll(['name','area','pepole','phone','adds','describeCode','schoolCode'],(err) => {
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
           //  console.log("ddddddddddddddddddddddd",typeof(addValue));
            let values = {
                "name":this.props.form.getFieldValue("name"),
                "schoolCode":this.props.form.getFieldValue("schoolCode"),
                "areaId":this.props.form.getFieldValue("area"),
                "address":this.props.form.getFieldValue("adds"),
                "principal":this.props.form.getFieldValue("pepole"),
                "principalPhone":this.props.form.getFieldValue("phone"),
                "note":this.props.form.getFieldValue("describeCode"),
                "unitType":sessionStorage.getItem('selectValue'),
                "lng":addValue.lng,
                "lat":addValue.lat,
                "unitCode":"2",
            }
            if (err) {
                return ;
            }    
            this.setState({ addLoading: true});
            $axios({
                url:`${config.api_server}/sys/unit/add`,
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
                        error = "添加用户单位失败"
                    }
                    setTimeout(() => {
                            this.error(error);
                    }, 1000);
                }
            })
        });      
    }
    addHandleCancel = () => {
        this.setState({ addVisible: false });
    }

    AddNews = () => {
        this.setState({
            addVisible: true,
            editVisible: false,
        });
    }
    handleChange = () => {
        
    }
    handleBlur = () => {
       
    }
    handleFocus = () => {     

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
    mapChange = ({mapVisible=false}) =>{
        this.setState({mapVisible})
    }
    prentsData = (value) =>{
        //eslint-disable-next-line
        console.log("prentsDataprentsDataprentsData",value)
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
        console.log("valuevaluevaluevaluevalue",value)
        if(value != ""){
            this.setState({getChPoint:value})
            this.props.form.setFields({
                adds:{
                    value:value
                }
            })
        }  
    }

    prentssetLat = (value) =>{
        this.setState({prentssetLat:value})
    }
    addOnBlur = (value) =>{
        let inptValue = value.target.value;
        let addsVal =  _this.props.form.getFieldValue("adds"); 
        let BMap = window.BMap;
        var map = new BMap.Map("addressMap");
        var point = new BMap.Point(116.331398,39.897445);
        map.enableScrollWheelZoom(true);
        map.centerAndZoom(point,12);
         // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();  
        // 将地址解析结果显示在地图上,并调整地图视野         
        myGeo.getPoint(inptValue, function(point){
            if (point) {
                map.centerAndZoom(point, 16);    
                 //eslint-disable-next-line
                console.log("pointpointpointpointpoint",point)            
                 _this.setState({prentsData:point})
                // map.addOverlay(new BMap.Marker(point));
                _this.props.form.setFields({
                    adds:{
                        value: addsVal,
                        // errors:[new Error("您选择地址没有解析到结果!")]
                    }
                })
            }else{        
                _this.props.form.setFields({
                    adds:{
                        value: addsVal,
                        errors:[new Error("您选择地址没有解析到结果!")]
                    }
                })
            }
        }, "北京市"); 
    }
    checkPhone=(rule, value, callback) =>{
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(value)) && !(/^(\d3,4|\d{3,4}-)?\d{7,8}$/).test(value)){
            callback("电话号码有误，请重填");
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
        let option =[];
        let bData = this.state.data;
        if(bData.length > 0){
            option =  bData.map((item,k)=>{
                return(
                    <Option key = {k} value={item.areaId}>{item.areaName}</Option>
                ) 
            })     
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
                <Button type="primary" onClick = {this.AddNews} icon="plus">新建</Button>
                <Modal
                    visible={this.state.addVisible}
                    title="添加用户单位"
                    onOk={this.addHandleOk}
                    onCancel={this.addHandleCancel}
                    afterClose = {this.afterClose}
                    width = {650}
                    destroyOnClose={true}
                    footer={[
                        // <span key style = {{"display":"inline-block","marginRight":"20px","color":"#BA55D3"}}>提示:&nbsp;类别编码格式统一为拼音首字母大写</span>,
                        <Button key="back" size="large" onClick={this.addHandleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" htmlType="submit" loading={this.state.addLoading} onClick={this.addHandleOk}>
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
                                rules: [{ required: true, message: '请输入学校编号', whitespace: true }, {
                                    validator: this.schoolCode,
                                }],
                            })(
                                <Input placeholder = "请输入学校编号"/>
                            )}
                        </FormItem>
                    </Row >
                        <Row >
                            <Col span = {10} key = {1} style = {{"marginLeft":"2.8%"}} >
                            <FormItem
                                {...formItemLayoutWithOutLabel1}
                                label={(
                                    <span>
                                    办学性质&nbsp;
                                    </span>
                                )}
                                hasFeedback
                                >
                                    {getFieldDecorator('categoryCode', {
                                        rules: [{ required: true, message: '请选择办学性质', whitespace: true }, {
                                            validator: this.eventName,
                                        }],
                                    })(
                                        <SelectOne rowCode = {this.state.rowCode} />
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
                                        rules: [{ required: true, message: '请选择片区', whitespace: true }, {
                                            validator: this.eventName,
                                        }],
                                    })(
                                        // <SelectOne rowCode = {this.state.areaCode}/>
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            onSelect={this.onSelect} 
                                        >
                                            {option}   
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row >
                            <Col span = {10} key = {1} style = {{"marginLeft":"2.8%"}} >
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
                            <Col span = {20} key = {1} style = {{"marginLeft":"2.8%"}}>
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
                                        rules: [{ required: true, message: '请输入详细地址', whitespace: true }, {
                                            validator: this.eventName,
                                        }],
                                    })(
                                        <Input placeholder = "请输入详细地址" onBlur = {this.addOnBlur}/>
                                    )}{
                                        
                                    }
                                </FormItem>
                            </Col>
                            <Col span = {2} key = {11}>
                            
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
                                rules: [{ required: false, message: '请输入区域描述!', whitespace: true }],
                            })(
                                <TextArea rows={4} />
                            )}
                        </FormItem>
                    </Form>
                    </LocaleProvider>
                </Modal>
                <div style = {{"width":"100px","height":"100opx","display":"none"}} id = "addressMap"></div>
            </span>
        )
    }
}
const WrappedRegistrationForm = Form.create()(AddEventCategory);

export default WrappedRegistrationForm;