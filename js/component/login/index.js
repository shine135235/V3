import React,{Component} from 'react';
import axios from 'axios';
import { Form, Icon, Input, Button, Checkbox,message,Alert } from 'antd';
import 'antd/dist/antd.css';
import './login.less';
import config from '../../config';

axios.defaults.timeout=60000;
axios.defaults.headers.bjswsc=sessionStorage.getItem('token')?sessionStorage.getItem('token'):'';
axios.defaults.withCredentials=true;//请求时将cookie带入header中
axios.interceptors.request.use(config =>{
  if(config.validateStatus(200)){
    return config
  }
},err =>{
  message.error(err)
})
axios.interceptors.response.use(function(response){
  if(response.data.code==1){
    sessionStorage.clear();
    location.href='/Login';
  }else{
    return response
  }
})
const FormItem = Form.Item;

class LoginForm extends Component {
    constructor(props){
      super(props)
      this.state = {
        addLoading:false,
        axiosSend:true,
        alertShow:false,
        errMessage:'检测中...'
      }
    }
    handleSubmit = (e) => {
      e.preventDefault();
        let userForm=this.props.form.getFieldsValue(['userName','password']);
        if(userForm.userName!=undefined && userForm.userName!=''){
          if(userForm.password!=undefined && userForm.password!=''){
            if(this.state.axiosSend){
              this.setState({
                axiosSend:false,
                addLoading: true
              })
              axios.post(`${config.api_server}/sys/user/login`,{
                 userName:userForm.userName,
                 passWord:btoa(userForm.password)
              }).then(res =>{
                console.log(res.data)
                if(res.data.flag==='success'){
                  message.success('登录成功!');
                  sessionStorage.setItem('isLogin',true);
                  sessionStorage.setItem("user",JSON.stringify(res.data.info)); 
                  sessionStorage.setItem("v2IP",JSON.stringify(res.data.v2.IP)); 
                  sessionStorage.setItem("v2UserName",userForm.userName);  
                  sessionStorage.setItem("v2Pwd",btoa(userForm.password));
                  sessionStorage.setItem('token',res.data.info.token);
                  sessionStorage.setItem('logo',res.data.logopath);
                  sessionStorage.setItem('name',res.data.platformdisplayname);
                  //sessionStorage.setItem("isDeskUnit",JSON.stringify(res.data.info.totalDeskUnit)); 
                  sessionStorage.setItem("isDeskUnit",JSON.stringify(res.data.info.isTotalDeskUnit)); 
                  sessionStorage.setItem("deskUnitId",JSON.stringify(res.data.info.unitId).replace(/"/g,""));  
                  sessionStorage.setItem("isOpen",JSON.stringify(res.data.info.userRole[0].isOpen));  
                  this.props.history.push('/Home');
                }else{
                  this.setState({
                    alertShow:true,
                    errMessage:res.data.message,
                    axiosSend:true,
                    addLoading:false
                  })
                  setTimeout(() =>{
                    this.setState({
                      alertShow:false,
                      errMessage:'检测中...'
                    })
                  },2000)
                }
              }).catch(error =>{
                if (error.request) {
                  alert('登录失败,请求已超时,请检查网络链接或刷新后重试!');
                  if(error.request.readyState == 4 && error.request.status == 0){
                     //请求错误时,重新请求写这里
                  }
              } else {
                  console.log('Error', error.message);
              }
              })
          }
      }else{
        this.setState({
          alertShow:true,
          errMessage:'请输入密码',
          axiosSend:true,
          addLoading:false
        })
        setTimeout(() =>{
          this.setState({
            alertShow:false,
            errMessage:'检测中...'
          })
        },2000)
      }
    }else{
      this.setState({
        alertShow:true,
        errMessage:'请输入用户名',
        axiosSend:true,
        addLoading:false
      })
      setTimeout(() =>{
        this.setState({
          alertShow:false,
          errMessage:'检测中...'
        })
      },2000)
    }
    }
 
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
          <div className='login-wrap'>
          <div className='login-content'>
          <div className='login-left'>
          <img src='/js/component/login/loginico.png' />
          </div>
          <div className='login-right'>
          <div className='login-title'>帐号登录</div>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [{ required: false, message: '请输入用户名!' }],
            })(
              <Input size='large' prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: false, message: '请输入密码!' }],
            })(
              <Input size='large' prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>下次自动登录</Checkbox>
            )}
            <Button size='large' type="primary" htmlType="submit" className="login-form-button" loading={this.state.addLoading}>
              登录
            </Button>
            <Alert style={{marginTop:'10px',visibility:this.state.alertShow?'visible':'hidden'}} message={this.state.errMessage} type="error" />
          </FormItem>
        </Form>
        </div>
        </div>
        {this.props.children}
        </div> 
      );
    }
  }
  
  const Login = Form.create()(LoginForm);

  export default Login;