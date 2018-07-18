import React,{Component} from 'react';
// import BraftEditor from 'braft-editor'
import {Button,Form,Input,LocaleProvider,message,DatePicker,Col,Row,Icon,Select,Upload,Cascader } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import $axios from 'axios';
import moment from 'moment';
import config from '../../../../config';
import OverView from './overView';

// const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const RangePicker = DatePicker.RangePicker;
// let _this;
let uuid = 0;
let school = 0;

// const insertHTML = _this.editorInstance.insertHTML()
class AddKnowledge extends Component{
    constructor(props){
        super(props)
        // _this = this
        this.state={
            addVisible: false,
            responseList: [],
            unitData:this.props.unitData,
            unitPeople:{},
            fileList: [],
            DuId:"",
            unitId:1,
            nowKey:1,
            tableDisplay:'table',
            thData:JSON.parse(this.props.detailData.excelData).thData,
            tdData:JSON.parse(this.props.detailData.excelData).tdData,
            overShow:false,
            overData:[]
        }
        
    }
    getSchool=() =>{
        $axios.get(`${config.api_server}/sys/unit/userunit`).then(res =>{
            console.log(res.data.data);
            let schoolArray=[],peopleArray=[];
            let schoolObj=new Object(),peopleObj= new Object();
            res.data.data.map(item =>{
                schoolObj.value=item.unitId;
                schoolObj.label=item.unitName;
                peopleObj.value=item.principal;
                peopleObj.label=item.principal
                peopleArray.push(peopleObj);
                schoolObj.children=peopleArray;
                peopleArray=[];
                schoolArray.push(schoolObj);
                peopleObj=new Object();
                schoolObj=new Object();
                
            })
            this.setState({
                school:schoolArray
            })
        })
    }
    componentWillMount(){
        console.log(this.props.detailData)
    }
    componentWillUnmount(){
        uuid = 0;
        school = 0;
    }
    componentDidMount(){
        this.getSchool();
        this.props.detailData.researchList.map((items)=>{
            this.add();
            let unitPeoples=[];
            let people=new Object();
            let setValue={}
            this.state.unitData.map(item =>{
                if(item.value==items.researchUnitId){
                    item.children.map(chunk =>{
                        if(chunk.value!=items.principal){
                            people.name=chunk.label;
                            people.id=chunk.value;
                            unitPeoples.push(people);
                            people=new Object();
                        }  
                    })
                }
            });
            this.fields[`dyr${uuid}`]=unitPeoples;
            setValue[ `dyr${uuid}`]={
                value:[]
            }
            this.props.form.setFields(setValue);
            console.log(this.fields)
            this.setState({
                unitPeople:this.fields
            })
        })
        this.props.detailData.researchUnit.map(() =>{
            this.addSchool()
        });
    }
    receiveRaw = () => {
     
    }
    fields={};
    unitChange=(value) =>{
        let unitPeoples=[];
        let people=new Object();
        let setValue={}
        this.state.unitData.map(item =>{
             if(item.value==value[0]){
                item.children.map(chunk =>{
                    if(chunk.value!=value[1]){
                        people.name=chunk.label;
                        people.id=chunk.value;
                        unitPeoples.push(people);
                        people=new Object();
                    }  
                })
             }
        });
        this.fields[`dyr${this.state.nowKey}`]=unitPeoples;
        setValue[ `dyr${this.state.nowKey}`]={
            value:[]
        }
        this.props.form.setFields(setValue);
        console.log(this.fields)
        this.setState({
            unitPeople:this.fields
        })
    }
    casFoucs =(event) =>{
        let now=event.target.children[1].getAttribute('os');
        this.setState({
           nowKey:now
        })
    }
    schoolChange=(value) =>{
        console.log(value)
    }
    AddNews = () => {
        this.setState({
           addVisible: true,
        });
    } 
    addHandleCancel = () =>{
        this.setState({
            addVisible: false,
         });
    }
    goBack = () =>{
        this.props.changeShowType({})
    }
    handleSubmit = (e) => {
        e.preventDefault();
        let unitArray=[],schoolArray=[];
        let unitObj={},schoolObj={};
        let peopleString=""
        this.props.form.validateFields((err, values) => {
            values.keys.map(index =>{
                unitObj.researchUnitId=values[`dydw${index}`][0];
                unitObj.principal=values[`dydw${index}`][1];
                values[`dyr${index}`].map(item =>(
                    peopleString+=item+','
                ))
                unitObj.currentPeople=peopleString;
                unitArray.push(unitObj);
                peopleString="";
                unitObj=new Object();
            })
            values.schools.map(index =>{
                schoolObj.schoolId=values[`school${index}`][0],
                schoolObj.schoolContact=values[`school${index}`][1]
                schoolArray.push(schoolObj);
                schoolObj=new Object();
            })
            if(!err){
                let excelDatas={
                    thData:this.state.thData,
                    tdData:this.state.tdData
                }
                $axios.put(`${config.api_server}/ops/researchInfo`,{
                    id:this.props.detailData.id,
                    theme:values.researchTitle,
                    target:values.researchAction,
                    content:values.researchContent,
                    startDateTime:values.time[0],
                    endDateTime:values.time[1],
                    organization:values.jigou,
                    contactPeople:values.pepole,
                    contactPhone:values.phone,
                    researchList:unitArray,
                    researchSchoolList:schoolArray,
                    excelData:JSON.stringify(excelDatas)
                }).then(res =>{
                    if(res.data.success){
                        message.success('更新成功!');
                        this.goBack();
                        this.props.reloadData({})
                    }else{
                        message.error(res.data.message)
                    }
                })
            }
        });
    } 
 
    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const keys2 = keys.filter(key => key !== k);
        const childData = [];
        for (let index = 0; index < keys2.length; index++) {
           const  obj = {};
            obj.itemKey = form.getFieldValue('dicName' + keys2[index]);
            obj.itemValue = form.getFieldValue('dicName' + keys2[index] + '2');
            childData.push(obj)
        }
        if (keys.length === 1) {
          return;
        }
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
    }

    removeSchool = (k) => {
        const { form } = this.props;
        const schools = form.getFieldValue('schools');
        const keys2 = schools.filter(key => key !== k);
        const childData = [];
        for (let index = 0; index < keys2.length; index++) {
           const  obj = {};
            obj.itemKey = form.getFieldValue('schoolName' + keys2[index]);
            obj.itemValue = form.getFieldValue('schoolName' + keys2[index] + '2');
            childData.push(obj)
        }
        if (schools.length === 1) {
          return;
        }
        form.setFieldsValue({
            schools: schools.filter(key => key !== k),
        });
    }
    add = () => {
        uuid++;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        form.setFieldsValue({
          keys: nextKeys,
        });
    }
    addSchool = () => {
        school++;
        const { form } = this.props;
        const schools = form.getFieldValue('schools');
        const nextKeys = schools.concat(school);
        form.setFieldsValue({
            schools: nextKeys,
        });
    }
    handleChange = (info) => {
            if(info.file.type=='application/vnd.ms-excel' || info.file.type=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
                //判断文件类型为xls或xlsx或csv
                let fileList =info.fileList;
                let th=[],td=[];

                fileList = fileList.slice(-1);//取最新上传的一个文件
                this.setState({ fileList});
                fileList.map(item =>{
                    if(item.response){
                        fileList[0].response.data.map((items,index) =>{
                            if(index==0){
                                th.push(items)
                            }else{
                                td.push(items)
                            }
                        });
                        console.log(th)
                        this.setState({
                            thData:th[0],
                            tdData:td
                        })
                    }
                })
            }else{
                message.error('文件类型不对，请重新上传!');
                return false;
            }        
    }
    removeTable=() =>{
        this.setState({
            thData:[],
            tdData:[]
        })
    }
    getUnitPeople=(value) =>{
        $axios.post(`${config.api_server}/sys/user/selectlist`,{
            unitId:value
        }).then(res =>{
            this.setState({
                uintPeople:res.data
            })
        })
    }
    handlePreview = (file) => {
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      });
    }
    range=(start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      }
    disabledDate=(current) =>{
        return current && current < moment().subtract(1,'days').endOf('day');
      }
    disabledRangeTime=(_, type) => {
        if (type === 'start') {
            return {
            disabledHours: () => this.range(0, 60).splice(4, 20),
            disabledMinutes: () => this.range(30, 60),
            disabledSeconds: () => [55, 56],
            };
        }
        return {
            disabledHours: () => this.range(0, 60).splice(20, 4),
            disabledMinutes: () => this.range(0, 31),
            disabledSeconds: () => [55, 56],
        };
     }
    overView=() =>{
        
        let allDyr=[]
        for(let i=0;i<uuid;i++){
            this.props.form.getFieldValue(`dyr${i+1}`).map(item =>{
                allDyr.push(item)
            })
        }
        this.setState({
            overShow:true,
            overData:allDyr
        })
    }
    overViewcancel=() =>{
        this.setState({
            overShow:false
        })
    }
    render(){
        const {  fileList } = this.state;     
        const { getFieldDecorator,getFieldValue} = this.props.form;
        // let option =[];
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 21 },
            },
        }; 
        const formItemLayoutWithOutLabel1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6},
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 18 },
            },
          };
          const formItemLayoutWithOutLabel = {
            wrapperCol: {
              xs: { span: 24, offset: 0 },
              sm: { span: 20, offset: 6 },
            },
          };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k) => {
            return (
              <FormItem
                required={true}
                key={k}
              >      
                      {<Row gutter = {24} style = {{"display":"inline-block","width":"100%"}}>
                            <Row  gutter = {24}>
                                <Col span = {12} key = {1} >
                                    <FormItem
                                    {...formItemLayoutWithOutLabel1}
                                    label={(
                                        <span>
                                        调研负责人&nbsp;
                                        </span>
                                    )}
                                    hasFeedback
                                    >
                                        {getFieldDecorator(`dydw${k}`, {
                                            rules: [
                                                        { required: true, message: '请选择调研单位和负责人' }
                                                   ],
                                            initialValue:this.props.detailData.researchList[k-1]?[this.props.detailData.researchList[k-1].researchUnitId,this.props.detailData.researchList[k-1]?this.props.detailData.researchList[k-1].principal:null]:null
                                        })(
                                            <Cascader options={this.state.unitData} placeholder="请选择调研单位和负责人" onChange={this.unitChange} onFocus={this.casFoucs} os={k} />
                                        )}
                                    </FormItem>
                                </Col> 
                                <Col span = {10} key = {2}>
                                <FormItem
                                    {...formItemLayoutWithOutLabel1}
                                    label={(
                                        <span>
                                        调研人&nbsp;
                                        </span>
                                    )}
                                    >
                                        {getFieldDecorator(`dyr${k}`, {
                                            rules: [{ required: true, message: '请选择调研人'}],
                                            initialValue:this.props.detailData.researchList[k-1]?this.props.detailData.researchList[k-1].currentPeople.split(','):[]
                                        })(
                                                <Select mode='multiple' onFocus={this.peopleChange}>
                                                     {
                                                         this.state.unitPeople[`dyr${k}`]?this.state.unitPeople[`dyr${k}`].map(item =>(
                                                             <Option key={item.id}>{item.name}</Option>
                                                         )):null
                                                     }
                                                </Select>
                                        )}

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
                        </Row>

                  }
              </FormItem>
            );
          });


        getFieldDecorator('schools', { initialValue: [] });
        const schools = getFieldValue('schools');
        const schoolValue = schools.map((k) => {
            return (
              <FormItem
                required={true}
                key={k}
              >      
                      {<Row gutter = {24} style = {{"display":"inline-block","width":"100%"}}>
                            <Row>
                                <Col span = {12} key = {1} >
                                    <FormItem
                                    {...formItemLayoutWithOutLabel1}
                                    label={(
                                        <span>
                                        学校负责人&nbsp;
                                        </span>
                                    )}
                                    hasFeedback
                                    >
                                        {getFieldDecorator(`school${k}`, {
                                            rules: [{ required: true, message: '请选择学校和负责人' }],
                                            initialValue:this.props.detailData.researchUnit[k-1]?[this.props.detailData.researchUnit[k-1].schoolId,this.props.detailData.researchUnit[k-1]?this.props.detailData.researchUnit[k-1].schoolContact:null]:null
                                        })(
                                            <Cascader options={this.state.school} placeholder="请选择学校和负责人"  />
                                        )}
                                    </FormItem>
                                </Col>                
                            </Row>                                
                        </Row>
                  }
                  {schools.length > 1 ? (
                      <Icon
                      className="dynamic-deleteSchool-button"
                      type="minus-circle-o"
                      disabled={schools.length === 1}
                      onClick={() => this.removeSchool(k)}
                      />
                  ) : null}
              </FormItem>
            );
          });
        const rangeConfig = {
            rules: [{ type: 'array', required: true, message: '请选择日期!' }],
            initialValue:[moment(this.props.detailData.startDateTime),moment(this.props.detailData.endDateTime)]
          };
          
        return (
                <div className='data-class-overKnow'>
                 <LocaleProvider locale = {zhCN}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                调研主题&nbsp;
                                </span>
                            )}
                            hasFeedback
                            >
                                {getFieldDecorator('researchTitle', {
                                    rules: [{ required: true, message: '请输入调研主题', whitespace: true }, {
                                        //validator: this.eventName,
                                    }],
                                    initialValue:this.props.detailData.theme
                                })(
                                    <Input  key = "researchTitle" placeholder = "请输入调研主题"/>
                                )}
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                调研目的&nbsp;
                                </span>
                            )}
                            hasFeedback
                            >
                                {getFieldDecorator('researchAction', {
                                    rules: [{ required: true, message: '请输入调研目的', whitespace: true }, {
                                        //validator: this.eventName,
                                    }],
                                    initialValue:this.props.detailData.target
                                })(
                                    <TextArea row = {4} placeholder = "请输入调研目的"/>
                                )}
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                调研内容&nbsp;
                                </span>
                            )}
                            hasFeedback
                            >
                                {getFieldDecorator('researchContent',{
                                    rules: [{ required: true, message: '请输入调研内容', whitespace: true }, {
                                        validator: this.eventName,
                                    }],
                                    initialValue:this.props.detailData.content
                                })(
                                    <Input  key = "researchContent" placeholder = "请输入调研内容"/>
                                )}
                            </FormItem>
                            <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                日期选择&nbsp;
                                </span>
                            )}
                            >
                                {getFieldDecorator('time', rangeConfig)(
                                    <RangePicker
                                    disabledDate={this.disabledDate}
                                    // disabledTime={this.disabledRangeTime}
                                    showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: ['', moment('23:59:59', 'HH:mm:ss')]
                                    }}
                                    format="YYYY-MM-DD HH:mm:ss" />
                                )}
                               
                            </FormItem>
                            <Row gutter = {24}>
                                <Col span = {12} key = {1} >
                                    <FormItem
                                    {...formItemLayoutWithOutLabel1}
                                    label={(
                                        <span>
                                        联系人&nbsp;
                                        </span>
                                    )}
                                    hasFeedback
                                    >
                                        {getFieldDecorator('pepole', {
                                            rules: [{ required: true, message: '请输入联系人', whitespace: true }, {
                                                validator: this.eventName,
                                            }],
                                            initialValue:this.props.detailData.contactPeople
                                        })(
                                            <Input placeholder = "请输入联系人"/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span = {12} key = {2}>
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
                                                validator: this.eventName,
                                            }],
                                            initialValue:this.props.detailData.contactPhone
                                        })(
                                            <Input placeholder = "请输入联系电话"/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <FormItem
                                {...formItemLayout}
                                label={(
                                    <span>
                                    发文机构&nbsp;
                                    </span>
                                )}
                                hasFeedback
                                >
                                {getFieldDecorator('jigou', {
                                    rules: [{ required: true, message: '请输入发文机构', whitespace: true }, {
                                        validator: this.eventName,
                                    }],
                                    initialValue:this.props.detailData.organization
                                })(
                                    <Input  key = "jigou" placeholder = "请输入发文机构"/>
                                )}
                            </FormItem>
                            
                             
                            {formItems}
                            <FormItem {...formItemLayoutWithOutLabel}>
                                <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                                <Icon type='plus' /> 调研单位
                                </Button>
                            </FormItem>

                            {schoolValue}
                            <FormItem {...formItemLayoutWithOutLabel}>
                                <Button type="dashed" onClick={this.addSchool} style={{ width: '60%' }}>
                                <Icon type='plus' /> 学校
                                </Button>
                            </FormItem>

                            <FormItem
                                { ...formItemLayout}
                                label={(
                                    <span>
                                    上传附件&nbsp;
                                    </span>
                                )}
                            >   
                                {getFieldDecorator("updateFile",{
                                    initialValue:"",
                                    rules: [{ required: false, message: '', whitespace: true }],
                                })(
                                    <div>
                                        <div style = {{width:"100%"}}>
                                            <Upload 
                                            action={`${config.api_server}/ops/excelFile`}
                                            onChange = {this.handleChange}
                                            onRemove={this.removeTable}
                                            fileList={fileList}
                                            >
                                                <Button>
                                                <Icon type="upload" /> 上传附件
                                                </Button>
                                                <span>上传文件格式为xls或xlsx或csv文件</span>
                                            </Upload>
                                        </div>
                                        
                                    </div>
                                )}
                            </FormItem>
                            <table className='table-data' style={{display:`${this.state.tableDisplay}`}}>
                            <thead>
                                <tr>
                                     {
                                         this.state.thData.map((item,index) =>(
                                             item==''?null:<th key={index}>{item}</th>
                                         ))
                                     }
                                </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.tdData.map((item,i) =>(
                                            <tr key={i}>
                                                {
                                                item.map((items,index) =>(
                                                    items==''?null:<td key={index}>{items}</td>
                                                ))
                                                }
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            <FormItem
                            wrapperCol={{ span: 12,offset : 2}}
                            >
                                {/* <Button type="primary" style = {{"marginRight":"20px"}} onClick={this.overView}>预览</Button> */}
                                <OverView display={this.state.overShow} cancel={this.overViewcancel} overData={this.state.overData}></OverView>
                                <Button type="primary" htmlType="submit" onClick = {this.handleSubmit} style = {{"marginRight":"20px"}}>保存</Button>
                                <Button type="primary" onClick = {this.goBack}>返回</Button>
                            </FormItem>
                        </Form>
                    </LocaleProvider>
                </div>
        )
    }
}
const WrappedRegistrationForm = Form.create()(AddKnowledge);

export default WrappedRegistrationForm;