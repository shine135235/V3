import React,{Component} from 'react';
import $axios from 'axios';
// import {History} from 'react-router-dom';
import { Form,Input,Select,Button,Switch,Upload,Icon,Modal,message,LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import config from '../../../config';
import "./index.less"

const FormItem = Form.Item;
const Option = Select.Option;
class SystemConfiguration extends Component{
    state = {
        confirmDirty: false,
        previewVisible: false,
        previewImage: '',
        fileList:[
        ],
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
        pathss:""
    };
    getAllAreaList = () =>{ 
        $axios.get(`${config.api_server}/sys/dictitem/query/id?code=${this.state.gzdq}`).then((res) =>{
           if(res.data){
               this.setState({bsdqData:res.data.data})
                //eslint-disable-next-line
                //console.log('ssssssssssssssssssssssssss', res.data.data);
           }
       })
    }
    getServicerList = () =>{ 
        $axios.get(`${config.api_server}/sys/unit/serviceunit`).then((res) =>{
           if(res.data){
               this.setState({servicerListData:res.data.data})
                //eslint-disable-next-line
                //console.log('ssssssssssssssssssssssssss', res.data.data);
           }
       })
    }
    getInnitialList = () =>{
        $axios.get(`${config.api_server}/sys/systemconfig`).then((res) =>{
            //eslint-disable-next-line
            //console.log('resresresresresres', res.data.logoPath);
            let newUrl = res.data.logoPath.replace(/\\/g,"/")
                //eslint-disable-next-line
            //console.log('resresresresresres', newUrl);
            let obj = {}
            obj.uid = 1
            obj.name = ""
            obj.status = "done"
            obj.url = `${config.api_server}${newUrl}`
            let newList = this.state.fileList
            newList.push(obj)
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
                 fileList:newList
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
    error = () => {
        message.error("操作失败")
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {

            if (err) {
                return;
            // console.log('Received values of form: ', values);
            }
            let bValue = values;
            bValue.id = this.state.innitalId;
            bValue.type = "shanxiaojun";
            //eslint-disable-next-line
            //console.log('11111111111111111111', bValue.logoPath);
            bValue.logoPath = this.state.pathss

            // if(this.props.form.getFieldValue("logoPath") == "undefined"){
            //     bValue.logoPath = this.state.pathss
            // } 
             //eslint-disable-next-line
            //console.log('2222222222222222222', bValue);
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
                    // this.props.getDataList({});
                    setTimeout(() => {
                        this.setState({ addLoading: false, addVisible: false});
                    }, 1000);
                    setTimeout(() => {
                        this.success();
                    }, 1000);
                }else{
                    this.setState({ addLoading: false});
                    setTimeout(() => {
                        this.error();
                    }, 1000);
                }
            })
        });
      }
    handleCancel = () => this.setState({ previewVisible: false })
    handlePreview = (file) => {
        //eslint-disable-next-line
           // console.log('filefilefilefilefile', file);
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        });
      }
    beforeUpload = (file) =>{
        const isPNG = file.type === 'image/png';
        if(!isPNG){
            message.error('上传图片格为png!');
        }
        
    }
    handleChange = (info) => {
        let fileList = info.fileList;
        //eslint-disable-next-line
       //console.log('handleChangefileList ', fileList);
        if(fileList.length >0){
            if(fileList[0].response){
                this.setState({pathss:fileList[0].response.path})
    //             // 图片地址 后面加时间戳是为了避免缓存
    //             var img_url = `${fileList[0].response.path}?`+Date.parse(new Date());
    //             // 创建对象
    //             var img = new Image();
    //             // 改变图片的src
    //             img.src = img_url;
    //             // 加载完成执行
    //             img.onload = function(){
    //             // 打印
    //             //eslint-disable-next-line
    //                 console.log('width:'+img.width+',height:'+img.height);
    //             };
            }
        }
        fileList = fileList.filter((file) => {
          if (file.type) {
            return file.type === 'image/png';
          }
          return true;
        });
        this.setState({ fileList });
      }
      listData = (file) =>{
        //eslint-disable-next-line
        console.log('filefilefilefilefilefilefile ', file);
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
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
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
        let servicerListData = this.state.servicerListData;
        if(servicerListData.length > 0){
            for(let i = 0;i<servicerListData.length;i++){
                servicerList.push( <Option  key = {servicerListData[i].unitId} value={servicerListData[i].unitId}>{servicerListData[i].unitName}</Option>)
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
                                action="http://172.16.6.5:9090/upload/resource/logo"
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={this.handlePreview}
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChange}
                                data={{
                                   "type":"shanyejun"
                                }}
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
                            总服务台单位&nbsp;
                            </span>
                        )}
                        hasFeedback
                    >   
                        {getFieldDecorator("serviceDeskUnit",{
                            initialValue:this.state.serviceDeskUnit,
                            rules: [{ required: false, message: '', whitespace: true }],
                        })(
                            <Select >
                                {servicerList}
                            </Select>
                        )}

                    </FormItem>
                    {/* <FormItem
                        { ...formItemLayout}
                        label={(
                            <span>
                            总服务台角色&nbsp;
                            </span>
                        )}
                        hasFeedback
                    >   
                        {getFieldDecorator("peploe",{
                            initialValue:"",
                            rules: [{ required: false, message: '', whitespace: true }],
                        })(
                            <Select >
                                <Option value="1">服务台一号</Option>
                                <Option value="2">服务台二号</Option>
                                <Option value="3">服务台三号</Option>
                            </Select>
                        )}

                    </FormItem> */}
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
                            rules: [{ required: false, message: '', whitespace: true }],
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
                            rules: [{ required: false, message: '', whitespace: true }],
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
