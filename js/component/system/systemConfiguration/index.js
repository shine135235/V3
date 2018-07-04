import React,{Component} from 'react';
import $axios from 'axios';
// import {History} from 'react-router-dom';
import { Form,Input,Select,Button,Switch,Upload,Icon,Modal,message,LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import config from '../../../config';
import "./index.less"

const FormItem = Form.Item;
const Option = Select.Option;
const outLogin=() =>{
    console.log(JSON.parse(sessionStorage.getItem('user')))
    $axios.post(`${config.api_server}/sys/user/logout`,{
        id:JSON.parse(sessionStorage.getItem('user')).id,
        loginId:JSON.parse(sessionStorage.getItem('user')).loginId
    }).then(res =>{
        if(res.data.flag==='success'){
            sessionStorage.clear();
            location.href='/';
        }
    })
}
class SystemConfiguration extends Component{
    state = {
        confirmDirty: false,
        previewVisible: false,
        icoPreviewVisible: false,
        previewImage: '',
        icoPreviewImage: '',
        fileList:[],
        fileLists:[],
        constructionUnit:"",
        deployArea:"",
        serviceDeskUnit:"",
        platformDisplayname:"",
        serviceDeskPhone:"",
        technicalSupportPhone:"",
        innitalId:"",
        canDistributionToEngineer:false,
        gzdq:"BSDQ",
        bsdqData:[],
        servicerListData:[],
        // upParam:{
        //     type:1
        // },
        pathss:"",
        icoPathss:""
    };
    getAllAreaList = () =>{ 
        $axios.get(`${config.api_server}/sys/dictitem/query/id?code=${this.state.gzdq}`).then((res) =>{
           if(res.data){
               this.setState({bsdqData:res.data.data})
                //eslint-disable-next-line
                // console.log('ssssssssssssssssssssssssss', res.data.data);
           }
       })
    }
    getServicerList = () =>{ 
        $axios.get(`${config.api_server}/sys/unit/serviceunit`).then((res) =>{
           if(res.data){
               this.setState({servicerListData:res.data.data})
           }
       })
    }
    getInnitialList = () =>{
        $axios.get(`${config.api_server}/sys/systemconfig`).then((res) =>{
            let newUrl = res.data.logoPath.replace(/\\/g,"/")
            let icoNewUrl = res.data.icon.replace(/\\/g,"/")
            let obj = {}
            obj.uid = 1
            obj.name = ""
            obj.status = "done"
            obj.url = `${config.api_server}${newUrl}`
            let newList = this.state.fileList
            newList.push(obj)

            let icoObj = {}
            icoObj.uid = 1
            icoObj.name = ""
            icoObj.status = "done"
            icoObj.url = `${config.api_server}${icoNewUrl}`
            let icoNewList = this.state.fileLists
            icoNewList.push(icoObj)
            // console.log("222222222222222",icoObj);
            if(res.data){
                this.setState({
                constructionUnitName:res.data.constructionUnitName,
                 deployArea:res.data.deployArea,
                 serviceDeskUnit:res.data.serviceDeskUnit,
                 platformDisplayname:res.data.platformDisplayname,
                 serviceDeskPhone:res.data.serviceDeskPhone,
                 technicalSupportPhone:res.data.technicalSupportPhone,
                 canDistributionToEngineer:res.data.canDistributionToEngineer,
                 innitalId: res.data.id,
                 pathss:res.data.logoPath,
                 icoPathss:res.data.icon,
                 fileList:newList,
                 fileLists:icoNewList,
                })
            }
        })
    }
    componentDidMount(){
        this.getAllAreaList();
       this.getInnitialList();
       this.getServicerList();
    }
    success = () => {
        // success('操作成功!');
        message.success("操作成功")
    };
    error = (error) => {
        message.error(error)
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {

            if (err) {
                return;
            }
            let bValue = values;
            bValue.id = this.state.innitalId;
            bValue.type = "shanxiaojun";
            bValue.logoPath = this.state.pathss
            bValue.icon = this.state.icoPathss
            $axios({
            url:`${config.api_server}/sys/systemconfig`,
            method:'post',
            headers: {
                'Content-type': 'application/json;charset=UTF-8'
            },
            data:bValue
            }).then((res) => {
                let datas = res.data.success;
                if(datas){
                    message.success("操作成功,请重新登录")
                    setTimeout(() => {
                        outLogin()
                    }, 2000);
                }else{
                    let error = ""
                    if(res.data.message && res.data.message != ""){
                        error = res.data.message
                    }else{
                        error = "操作失败"
                    }
                    setTimeout(() => {
                            this.error(error);
                    }, 1000);
                }
            })
        });
      }
    handleCancel = () => this.setState({ previewVisible: false })
    icoHandleCancel = () => this.setState({ icoPreviewVisible: false })
    handlePreview = (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        });
      }
    icoHandlePreview = (file) => {
        this.setState({
            icoPreviewImage: file.url || file.thumbUrl,
          icoPreviewVisible: true,
        });
      }
    beforeUpload = (file) =>{
        const isPNG = file.type === 'image/png';
        if(!isPNG){
            message.error('上传图片格为png!');
        }
        
    }
    icoBeforeUpload = (file) =>{
        if(file.name != "favicon.ico"){
            message.error('上传图片为favicon.ico!');
        }
    }
    handleChange = (info) => {
        let fileList = info.fileList;
        if(fileList.length >0){
            if(fileList[0].response){
                this.setState({pathss:fileList[0].response.path})
            }
        }else{
            this.setState({pathss:""}) 
        }
        fileList = fileList.filter((file) => {
          if (file.type) {
            return file.type === 'image/png';
          }
          return true;
        });
        this.setState({ fileList });
    }

    icoChange = (info) => {
        let fileLists = info.fileList;
        if(fileLists.length >0){
            if(fileLists[0].response){
                this.setState({icoPathss:fileLists[0].response.path})
            }
        }else{
            this.setState({icoPathss:""}) 
        }
        fileLists = fileLists.filter((file) => {
          if (file.type) {
            return file.type === 'image/x-icon';
          }
          return true;
        });
        this.setState({ fileLists });
    }
    checkPhone=(rule, value, callback) =>{
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(value)) && !(/^(\d3,4|\d{3,4}-)?\d{7,8}$/).test(value)){
            callback("手机号码有误，请重填");
        }else{
            callback();
        }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const { previewVisible,icoPreviewVisible, previewImage,icoPreviewImage, fileList,fileLists } = this.state;
        const uploadButton = (
        <div>
            <Icon type="plus" />
            <div className="ant-upload-text">上传图片</div>
        </div>
        );
        const icoUploadButton = (
        <div>
            <Icon type="plus" />
            <div className="ant-upload-text">上传图片</div>
        </div>
        );

        let bsda = [];
        let bsdqData = this.state.bsdqData; 
        if(bsdqData.length > 0){
            for(let i = 0;i<bsdqData.length;i++){
                bsda.push( <Option  key = {bsdqData[i].dictItemId} value={bsdqData[i].dictItemId}>{bsdqData[i].itemValue}</Option>)
            }
            
        }

        let servicerList = [];
        let serviceDeskUnit = this.state.serviceDeskUnit;
        let servicerListData = this.state.servicerListData;
        if(servicerListData.length > 0){
            for(let i = 0;i<servicerListData.length;i++){
                servicerList.push( <Option  key = {servicerListData[i].unitId} value={servicerListData[i].unitId}>{servicerListData[i].unitName}</Option>)
            }
            if(serviceDeskUnit != ""){
                for(let i = 0;i<servicerListData.length;i++){
                    if(servicerListData[i].unitId == serviceDeskUnit){
                        break;
                    }else{
                        if(i == servicerListData.length - 1){
                            serviceDeskUnit = ""
                        }
                    }
                }
            }  
        }
        return (
            <div className='systemConfig'>
                <div className='updatePwd_Content'>
                <LocaleProvider locale={zhCN}>
                <Form >
                    <FormItem
                        { ...formItemLayout}
                        label={(
                            <span>
                            建设单位&nbsp;
                            </span>
                        )}
                        hasFeedback
                    >   
                        {getFieldDecorator("constructionUnitName",{
                            initialValue:this.state.constructionUnitName,
                            rules: [{ required: false, message: '', whitespace: true }],
                        })(
                            <Input />
                        )}

                    </FormItem>
                    <FormItem
                        { ...formItemLayout}
                        label={(
                            <span>
                            部署大区&nbsp;
                            </span>
                        )}
                        hasFeedback
                    >   
                        {getFieldDecorator("deployArea",{
                            initialValue:this.state.deployArea,
                            rules: [{ required: false, message: '', whitespace: true }],
                        })(
                            <Select >
                                {bsda}
                            </Select>
                        )}

                    </FormItem>
                    <FormItem
                        { ...formItemLayout}
                        label={(
                            <span>
                            LOGO图片&nbsp;
                            </span>
                        )}
                    >   
                        {getFieldDecorator("logoPath",{
                            rules: [{ required: false, message: '', whitespace: true }],
                        })(
                            <div>
                                <Upload
                                action={`${config.api_server}/upload/resource/logo`}
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={this.handlePreview}
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChange}
                                // data={{
                                //    "type":"logo"
                                // }}
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                            <span>建议尺寸：长*宽大小为36*36，图片支持的格式：png</span>
                        </div>
                        )}

                    </FormItem>
                    <FormItem
                        { ...formItemLayout}
                        label={(
                            <span>
                            平台ICO图标&nbsp;
                            </span>
                        )}
                    >   
                        {getFieldDecorator("icologoPath",{
                            rules: [{ required: false, message: '', whitespace: true }],
                        })(
                            <div>
                                <Upload
                                action={`${config.api_server}/upload/resource/logo`}
                                listType="picture-card"
                                fileList={fileLists}
                                onPreview={this.icoHandlePreview}
                                beforeUpload={this.icoBeforeUpload}
                                onChange={this.icoChange}
                                // data={{
                                //    "type":"ico"
                                // }}
                            >
                                {fileLists.length >= 1 ? null : icoUploadButton}
                            </Upload>
                            <Modal visible={icoPreviewVisible} footer={null} onCancel={this.icoHandleCancel}>
                                <img alt="example" style={{ width: '100%' }} src={icoPreviewImage} />
                            </Modal>
                            <span>建议尺寸：长*宽大小为32*32，图片支持的格式:ico</span>
                        </div>
                        )}

                    </FormItem>
                    <FormItem
                        { ...formItemLayout}
                        label={(
                            <span>
                            总服务台单位&nbsp;
                            </span>
                        )}
                        hasFeedback
                    >   
                        {getFieldDecorator("serviceDeskUnit",{
                            initialValue:serviceDeskUnit,
                            // initialValue:"",
                            rules: [{ required: false, message: '', whitespace: true }],
                        })(
                            <Select >
                                {servicerList}
                            </Select>
                        )}

                    </FormItem>
                    <FormItem
                        { ...formItemLayout}
                        label={(
                            <span>
                            总服务台分配工单给各个工程师&nbsp;
                            </span>
                        )}
                    >   
                        {getFieldDecorator('canDistributionToEngineer', { valuePropName: 'checked',
                        initialValue:this.state.canDistributionToEngineer,    
                        })(
                            <Switch />
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout}
                        label={(
                            <span>
                            平台显示名称&nbsp;
                            </span>
                        )}
                        hasFeedback
                    >   
                        {getFieldDecorator("platformDisplayname",{
                            initialValue:this.state.platformDisplayname,
                            rules: [{ required: false, message: '', whitespace: true }],
                        })(
                            <Input />
                        )}

                    </FormItem>
                    <FormItem
                        { ...formItemLayout}
                        label={(
                            <span>
                            总服务台电话&nbsp;
                            </span>
                        )}
                        hasFeedback
                    >   
                        {getFieldDecorator("serviceDeskPhone",{
                            initialValue:this.state.serviceDeskPhone,
                            rules: [{ required: false, message: '', whitespace: true }, {
                                validator: this.checkPhone,
                            }],
                        })(
                            <Input />
                        )}

                    </FormItem>
                    <FormItem
                        { ...formItemLayout}
                        label={(
                            <span>
                            技术支持电话&nbsp;
                            </span>
                        )}
                        hasFeedback
                    >   
                        {getFieldDecorator("technicalSupportPhone",{
                            initialValue:this.state.technicalSupportPhone,
                            rules: [{ required: false, message: '', whitespace: true }, {
                                validator: this.checkPhone,
                            }],
                        })(
                            <Input />
                        )}

                    </FormItem>
                        <FormItem
                        wrapperCol={{ span: 12, offset: 8 }}
                        >
                            <Button type="primary" htmlType="submit" onClick = {this.handleSubmit}>保存</Button>
                        </FormItem>
                    </Form>
                    </LocaleProvider>
                </div>
            </div>
        )
    }
}


const SystemConfigurationForm = Form.create()(SystemConfiguration);
export default SystemConfigurationForm;
