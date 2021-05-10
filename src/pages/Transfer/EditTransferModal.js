import React from "react";
import {Button, Cascader, Form,Select, Icon, Input, InputNumber, message, Collapse,Radio,Spin,Switch} from "antd";
import {tokenPostServer, get, post, postDataUrl} from "../../utils/ajax";
import {isAuthenticated} from "../../utils/session";
import EditableTable from "./EditableTable";
import EditBodyTabs from "./EditBodyTabs";
import jwt_decode from "jwt-decode";
import {createFormField} from "../../utils/util";
import RadioGroup from "antd/es/radio/group";
const { Option } = Select;
// import { CaretRightOutlined } from '@ant-design/icons';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const form = Form.create({
    //表单回显
    mapPropsToFields(props) {
        return createFormField(props.useCase)
    }
});

// @Form.create()
@form
class EditTransferModal extends React.Component{
    state = {
        projects:[],
        interfaceDetail:{},
        fields:{},
        interfaceName:'',
        isShowPanel:true,
        result:{
            success:false,
            errorCode:{},
            execute:false,
            message:'',
        },
        loading:false,

        uploading: false,
        img:{},
        //多图上传
        imgs:[],
        storeImgs:[],
        previewVisible: false,
        previewImage: '',
        fileList: [],
        tradeList:[]
    };
    componentDidMount() {
        this.queryInterFace();
        this.queryProject()
    }

    /***
     * 去重查询项目名称
     */
    queryProject = async () =>{
        const res = await get('/project/queryDistProject')
        if(res.code === 0) {
            this.setState({
                projects:res.data
            })
        }else {
            message.error("调用queryDistProject接口失败，查询项目失败")
        }
    }

    //读取缓存，且比较时间戳是否过期
    // sessionStorageGet = name => {
    //     const storage = sessionStorage.getItem(name);
    //     return storage;
    // };


    /***
     * 查询接口详细信息
     */
    queryInterFace = async () =>{

        var jsessionid = sessionStorage.getItem("sessionId")

        // var jsessionid = localStorage.getItem("sessionId")
        console.log("jsessionid==="+JSON.stringify(jsessionid))
        console.log("useCase==="+JSON.stringify(this.props.useCase))
        const res = await get('/interface/findByName',{
            interfaceName:this.props.useCase.interfaceName,
            jsessionid: jsessionid
        })
        if(res.code === 0) {
            this.setState({
                interfaceDetail:res.data
            })
            console.log("interfaceDetail==="+JSON.stringify(this.state.interfaceDetail))
        }else {
            message.error("调用queryByName接口失败，查询接口失败")
        }
    }

    handleChange=(value)=>{
        console.log("handleChange+value==="+JSON.stringify(value))
        this.setState({
            interfaceName:value
        })
    }

    onGetValue = async ()=> {
        console.log("interfaceName===" + JSON.stringify(this.state.interfaceName))
        if (this.state.interfaceName == null||this.state.interfaceName =="") {
            message.error('请先选择接口')
        } else {
            const res = await get('/interface/findByName', {
                interfaceName: this.state.interfaceName
            });
            if (res.code === 0) {
                res.data.signEntity=JSON.stringify(res.data.signEntity)
                this.setState({
                    fields: res.data,
                    isShowPanel: false
                })
                console.log("fields==" + JSON.stringify(this.state.fields))
            } else {
                message.error(res.msg || '没有行业信息，无法新增')
            }
        }
    };
    /**
     * 表单提交
     * */
    handleSubmit = () => {
        this.setState({
            loading:true
        })
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.id=this.props.useCase.id
                this.createCaseAndExecute(values)
            }
        });

    };
    createCaseAndExecute = async (values) => {
        var jsessionid = sessionStorage.getItem("sessionId")
        // var  job = JSON.parse(jsessionid)
        // console.log("job==="+JSON.stringify(job))
        // var jsid = job.data
        console.log("jsessionid==="+JSON.stringify(jsessionid))
        // let cook =isAuthenticated();
        // var user = jwt_decode(cook)
        // console.log("cook==="+JSON.stringify(cook))
        // var email = JSON.stringify(user.sub)
        // console.log("email==="+email)

        values.storeImgS = this.state.storeImgs;
        values.jsessionid = jsessionid
        console.log("编辑保存的values==="+JSON.stringify(values))


        const res = await tokenPostServer('/execute/update', {
        // const res = await post('/execute/update', {
            ...values,
            // jsessionid: jsid,
            // lastExecuteUser:email,
        });
        console.log("res==="+JSON.stringify(res))
        if (res.code === 0) {
            message.success('接口调用成功');
            setTimeout(()=> {
                    this.setState({
                            result:{
                                success:res.success,
                                errorCode:res.errorCode,
                                execute:res.execute,
                                message:res.message,
                            },
                            loading:false,

                            img:{},
                            imgs:{},
                            storeImgs:[],
                            fileList:[],
                            tradeList:[]
                        }
                    )
                    this.props.transferList();
                },1500
            )


        }
    };

    render() {
        const {TextArea} = Input
        const { Panel } = Collapse;
        const { fields } = this.state;
        const {useCase} = this.props;
        const { isShowPanel } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 7,
                },
            },
        };

        const { previewVisible, previewImage,projects,interfaceDetail } = this.state;
        const { uploading } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        return(
            <div style={{marginTop:'10px'}}>
                <Spin spinning={this.state.loading}>
                    <Form {...formItemLayout}>
                        <Form.Item label={'用例名称'}>
                            {getFieldDecorator('caseName', {
                                rules: [{ required: true, message: '请输入用例名称' }],
                            })(
                                <Input placeholder={"用例名称"} disabled={true}/>
                            )}
                        </Form.Item>
                        <Form.Item label="所属项目">
                            {getFieldDecorator('project', {
                                rules: [{ required: true, message: '请选择所属项目' }]
                            })(
                                <Select placeholder="请选择" style={{width:"29%"}} disabled={true}>
                                    {projects.map((item) => {
                                        return <Select.Option value={item}>{item}</Select.Option>})}
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label={'用例描述'}>
                            {getFieldDecorator('description', {
                                rules: [
                                    { required: true, message: '描述用例设计的场景!'}
                                ],
                            })(
                                <TextArea/>
                            )
                            }
                        </Form.Item>



                        <Form.Item label={'接口名'}>
                            {getFieldDecorator('interfaceName', {
                                rules: [
                                    { required: true, message: '请选择接口!', whitespace: true}
                                ],
                            })(
                                <Input placeholder={"接口名称"} disabled={true}/>
                            )
                            }
                        </Form.Item>
                        <Form.Item label="HeaderDetail">
                            {getFieldDecorator('headerDetail', {
                                rules: [{ required: true, message: 'HeaderDetail is required!' }],
                            })(<Input placeholder={"{}"} disabled={true}/>)}
                        </Form.Item>

                        <Form.Item label="Path">
                            {getFieldDecorator('path', {
                                rules: [{ required: true, message: 'Path is required!' }],
                            })(<Input disabled={true}/>)}
                        </Form.Item>

                        <Form.Item label="Body">
                            {getFieldDecorator('body', {
                                rules: [{ required: true, message: 'Body is required!' }],
                            })(
                                (<TextArea />)
                            )}
                        </Form.Item>

                        <Form.Item label="提取参数Parameter">
                            {getFieldDecorator('parameter', {
                                // rules: [{ required: true, message: 'parameter is required!' }],
                                initialValue:''
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="断言">
                            {getFieldDecorator('assertionContent', {
                                // rules: [{ required: true, message: 'Assertion is required!' }],
                                initialValue:''
                            })(
                                <TextArea />
                            )}
                        </Form.Item>

                        <Form.Item label="签名">
                            {getFieldDecorator('sign', {
                                // rules: [{ required: true, message: 'Assertion is required!' }],
                                initialValue:''
                            })(
                                <Switch  checkedChildren="有" unCheckedChildren="无" checked={fields.sign}  />
                            )}
                        </Form.Item>

                        <Form.Item label="签名字段">
                            {getFieldDecorator('signEntity', {
                                // rules: [{ required: true, message: 'Assertion is required!' }],
                                initialValue:''
                            })(
                                <TextArea  disabled={!fields.sign} defaultValue="没有签名则禁用"/>
                            )}
                        </Form.Item>

                        <Form.Item label="header">
                            {getFieldDecorator('header', {
                                // rules: [{ required: true, message: 'Assertion is required!' }],
                                initialValue:''
                            })(
                                <Switch  checkedChildren="设置" unCheckedChildren="不设置" checked={fields.header}  />
                            )}
                        </Form.Item>

                        <Form.Item label={'请求方式'}>
                            {getFieldDecorator('method', {
                                validateFirst: true,
                                initialValue: interfaceDetail.method,
                                rules: [
                                    { required: true, message: '请求方式必选!'}
                                ],
                            })(
                                <RadioGroup
                                    // onChange={this.onMethodChange}
                                     disabled={true}>
                                    <Radio key="get" value={"get"} >get</Radio>
                                    <Radio key="post" value={"post"}>post</Radio>
                                    <Radio key="delete" value={"delete"}>delete</Radio>
                                    <Radio key="put" value={"put"}>put</Radio>
                                </RadioGroup>
                            )
                            }
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="default" onClick={this.handleCancel}>
                                取消
                            </Button>
                            &emsp;
                            <Button type="primary" icon="reload"  onClick={this.handleSubmit}>
                                保存
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
                {/*<Button onClick={this.test}/>*/}
                {/*<InterFaceDetail fields={fields} onRef={(ref) => { this.child = ref; }}/>*/}
                {/*<CustomizedForm {...fields} onChange={this.handleFormChange()}/>*/}
                {/*<pre className="language-bash">{JSON.stringify(fields,null,2)}</pre>*/}
            </div>
        )
    }
}
const styles = {
    urlUploader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 250,
        height: 150,
        backgroundColor: '#fff'
    },
    icon: {
        fontSize: 28,
        color: '#999'
    },
    url: {
        maxWidth: '100%',
        maxHeight: '100%',
    }
};


export default EditTransferModal;
