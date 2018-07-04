import React,{Component} from 'react';
import LzEditor from 'react-lz-editor';
import config from '../../config';

export default class TestCom extends Component{
    
    render(){
        const uploadProps = {
          action: `${config.api_server}/upload/resource/logo`,
          onChange: this.onChange,
          listType: 'picture',
          //fileList: this.state.responseList,
          data: (file) => {
              console.log(file)
          },
          multiple: true,
          //beforeUpload: this.beforeUpload,
          showUploadList: true
        }
        return (
           <div>
               <LzEditor active={true} uploadProps={uploadProps} lang="zh-cn"/>
           </div>
        )
    }
}