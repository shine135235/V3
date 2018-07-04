import 'braft-editor/dist/braft.css'
import React,{Component} from 'react';
// import BraftEditor from 'braft-editor'
import {Button,Form,Input,LocaleProvider,message,Col,Row} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
 import $axios from 'axios';
import config from '../../../../config'

// const { TextArea } = Input;
const FormItem = Form.Item;
// const Option = Select.Option;
const { TextArea } = Input;
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
            data:[],
            fileList: [],
            DuId:"",
            tableDisplay:'table',
            thData:JSON.parse(this.props.detailData.excelData).thData,
            tdData:JSON.parse(this.props.detailData.excelData).tdData
        }
    }
    
    getTyoeList = () =>{
        $axios.get(`${config.api_server}/sys/unit/serviceunit`).then((res) =>{
            //eslint-disable-next-line
           // console.log("啊啊啊啊啊啊啊啊啊啊啊啊啊",res)
            if(res.data){
                if(res.data.length != 0){
                    this.setState({data:res.data})
                }
                
            } 
        })
    }
    
    componentDidMount(){
        this.getTyoeList();
    }
    receiveRaw = () => {
     //   console.log("recieved Raw content", content);
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
    onInsert = (val) =>{
        console.log("sssssssssssssssss",val)
    }
    
    success = () => {
        message.success("操作成功")
    };
    error = () => {
        message.error("操作失败")
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            //eslint-disable-next-line
           console.log("adddddddddddddd",values)
          
          if (err) {
              return
            //console.log('Received values of form: ', values);
          }
        //   const rangeTimeValue = values['range-time-picker'];
        //   const value = {
        //     ...values,
        //     'range-time-picker': [
        //       rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
        //       rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
        //     ]
        //   };
          let bValue = values;
          bValue.textContent = values.solvingSteps
          bValue.faultPhenomenon = "I wana say "
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
        //eslint-disable-next-line
        console.log("sssssssssss",childData);
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
        //eslint-disable-next-line
        //console.log("schoolNameschoolNameschoolNameschoolName",childData);
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
        let fileList = info.fileList;
        //eslint-disable-next-line
 
        if(fileList[0].type !== "application/vnd.ms-excel"){
            message.error('文件类型不对，请重新上传!');
            return false;
        }
        fileList = fileList.filter((file) => {
            //console.log('ccccccccccccccccccc ', file); 
            return file.uid !== this.state.DuId;
        });
        this.setState({ fileList });   
    }
    handlePreview = (file) => {
        console.log("ssssssssssssss",file);
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      });
    }
    beforeUpload = (file) => {
        //eslint-disable-next-line
        console.log('11111111111 ',file);
        // if( file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && file.type !== "application/vnd.ms-excel" ){
        //     message.error('文件类型不对，请重新上传!');
        //     return false;
        // }
    }
    render(){  
        const { getFieldDecorator} = this.props.form;
        // let option =[];
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
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
          const formItemLayoutWithOutLabel2 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6},
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 17 },
            },
          };
          let unitList = [];
          if(this.props.detailData.researchList.length > 0){
              let researchList = this.props.detailData.researchList
              for(let i = 0;i<researchList.length;i++){
                unitList.push(
                    <Row gutter = {24}>
                        <Col span = {12} key = {1} >
                            <FormItem
                            {...formItemLayoutWithOutLabel1}
                            label={(
                                <span>
                                调研单位&nbsp;
                                </span>
                            )}
                            hasFeedback
                            >
                                {getFieldDecorator(`unit${i}`, {
                                    initialValue:researchList[i].researchUnit,
                                    rules: [{ required: true, message: '请输入调研单位', whitespace: true }, {
                                        validator: this.eventName,
                                    }],
                                })(
                                    <Input  key = {"unit"+i} placeholder = "请输入发文机构"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span = {11} key = {2}>
                            <FormItem
                            {...formItemLayoutWithOutLabel1}
                            label={(
                                <span>
                                负责人&nbsp;
                                </span>
                            )}
                            hasFeedback
                            >
                                {getFieldDecorator(`person${i}`, {
                                    initialValue:researchList[i].principalName,
                                    rules: [{ required: true, message: '请输负责人', whitespace: true }, {
                                        validator: this.eventName,
                                    }],
                                })(
                                    <Input key = {"person"+i}  placeholder = "请输入发文机构"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>,
                    <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                        调研参与人&nbsp;
                        </span>
                    )}
                    hasFeedback
                    >
                        {getFieldDecorator(`addPerson${i}`, {
                            initialValue:researchList[i].currentPeopleName,
                            rules: [{ required: false, message: '请输入调研参与人', whitespace: true }, {
                                validator: this.eventName,
                            }],
                        })(
                            <Input key = {"addPerson"+i} placeholder = "请输入发文机构"/>
                        )}
                    </FormItem>
                )
              }
          }
          let schoolList = [];
          console.log("11111",this.props.detailData.researchUnit);
          if(this.props.detailData.researchUnit.length > 0){
              let researchSchoolList = this.props.detailData.researchUnit;
            for(let i = 0;i<researchSchoolList.length;i++){
                schoolList.push(
                    <Row gutter = {24} style = {{"display":"inline-block","width":"100%"}}>
                            <Row style= {{"marginBottom":"40px"}}>
                                <Col span = {12} key = {1} >
                                    <FormItem
                                    {...formItemLayoutWithOutLabel1}
                                    label={(
                                        <span>
                                        学校名称&nbsp;
                                        </span>
                                    )}
                                    hasFeedback
                                    >
                                        {getFieldDecorator(`school${i}`, {
                                            initialValue:researchSchoolList[i].schoolName,
                                            rules: [{ required: false, message: '请输入学校名称', whitespace: true }, {
                                                validator: this.eventName,
                                            }],
                                        })(
                                            <Input key = {"school"+i}  placeholder = ""/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span = {12} key = {2}>
                                    <FormItem
                                    {...formItemLayoutWithOutLabel2}
                                    label={(
                                        <span>
                                        学校负责人&nbsp;
                                        </span>
                                    )}
                                    hasFeedback
                                    >
                                        {getFieldDecorator(`schoolPerson${i}`, {
                                            initialValue:researchSchoolList[i].schoolContact,
                                            rules: [{ required: false, message: '请输入学校负责人', whitespace: true }, {
                                                validator: this.eventName,
                                            }],
                                        })(
                                            <Input key = {"schoolPerson"+i} placeholder = "请输入学校负责人"/>
                                        )}
                                    </FormItem>
                                </Col>                  
                            </Row>                                
                        </Row>
              )
            }
        }
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
                                    initialValue:this.props.detailData.theme,
                                    rules: [{ required: true, message: '请输入调研主题', whitespace: true }, {
                                        validator: this.eventName,
                                    }],
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
                                    initialValue:this.props.detailData.target,
                                    rules: [{ required: true, message: '请输入调研目的', whitespace: true }, {
                                        validator: this.eventName,
                                    }],
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
                                    initialValue:this.props.detailData.content,
                                    rules: [{ required: true, message: '请输入调研内容', whitespace: true }, {
                                        validator: this.eventName,
                                    }],
                                })(
                                    <Input  key = "researchContent" placeholder = "请输入调研内容"/>
                                )}
                            </FormItem>
                            <Row gutter = {24}>
                                <Col span = {12} key = {1} >
                                    <FormItem
                                    {...formItemLayoutWithOutLabel1}
                                    label={(
                                        <span>
                                        开始日期&nbsp;
                                        </span>
                                    )}
                                    hasFeedback
                                    >
                                        {getFieldDecorator('startTime', {
                                            initialValue:this.props.detailData.startDateTime,
                                            rules: [{ required: true, message: '', whitespace: true }, {
                                                validator: this.eventName,
                                            }],
                                        })(
                                            <Input  key = "startTime" placeholder = ""/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span = {11} key = {2}>
                                    <FormItem
                                    {...formItemLayoutWithOutLabel1}
                                    label={(
                                        <span>
                                        结束日期&nbsp;
                                        </span>
                                    )}
                                    hasFeedback
                                    >
                                        {getFieldDecorator('endTime', {
                                            initialValue:this.props.detailData.endDateTime,
                                            rules: [{ required: true, message: '', whitespace: true }, {
                                                validator: this.eventName,
                                            }],
                                        })(
                                            <Input  key = "endTime" placeholder = ""/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
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
                                            initialValue:this.props.detailData.contactPeople,
                                            rules: [{ required: true, message: '请输入联系人', whitespace: true }, {
                                                validator: this.eventName,
                                            }],
                                        })(
                                            <Input key = "pepole" placeholder = ""/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span = {11} key = {2}>
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
                                            initialValue:this.props.detailData.contactPhone,
                                            rules: [{ required: true, message: '请输入联系电话', whitespace: true }, {
                                                validator: this.eventName,
                                            }],
                                        })(
                                            <Input key = "phone" placeholder = ""/>
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
                                    initialValue:this.props.detailData.organization,
                                    rules: [{ required: true, message: '请输入发文机构', whitespace: true }, {
                                        validator: this.eventName,
                                    }],
                                })(
                                    <Input  key = "jigou" placeholder = "请输入发文机构"/>
                                )}
                            </FormItem>
                            {unitList}
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
                                <Button type="primary" htmlType="submit" onClick = {this.goBack}>返回</Button>
                            </FormItem>
                        </Form>
                    </LocaleProvider>
                </div>
        )
    }
}
const WrappedRegistrationForm = Form.create()(AddKnowledge);

export default WrappedRegistrationForm;