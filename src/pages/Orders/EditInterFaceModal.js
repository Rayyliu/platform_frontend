import React from 'react'
import {Modal, Form, Upload, Icon, message, Input, Switch, InputNumber, Radio,Select} from 'antd'
import {del, post, put,get} from "../../utils/ajax";
import {createFormField} from '../../utils/util'
import RadioGroup from "antd/es/radio/group";
import {isAuthenticated} from "../../utils/session";
import jwt_decode from "jwt-decode";


const form = Form.create({
    //表单回显
    mapPropsToFields(props) {
        return createFormField(props.interFace)
    }
});

// const jwt = require('jsonwebtoken');


@form
class EditInterFaceModal extends React.Component {
    state = {

        boolean:{
            sign:false,
            header:false,
            mock:false
        },
        uploading: false,
        img:{},
        interfaces:[],
        sign:false
    };

    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                console.log("values==="+JSON.stringify(values))
                this.editInterFace(values)

            }
        })
    };
    onCancel = () => {
        this.props.onCancel();
    };
    editInterFace = async (values) => {
        const id = this.props.form.getFieldValue('id');
        let cook =isAuthenticated();
        var user = jwt_decode(cook)
        console.log("cook==="+JSON.stringify(cook))
        var email = JSON.stringify(user.sub)
        console.log("email==="+email)
        //遍历decoded
        // let temArr = Object.keys(user)
        // console.log(temArr)
        // for(let key in decoded){
        //     console.log("key==="+key)
        //     console.log("value==="+decoded[key])
        // }


        // var username=""
        // for(){
        //
        // }
        const res = await post('/interface/edit', {
            ...values,
            id: id,
            lastUpdateUser:email
            // Authorization: `${isAuthenticated()}`,
        });
        if (res.code === 0) {
            message.success('修改成功');
            // this.setState({
            //     img:{}
            // });
            // await this.queryProject()
            console.log("已进入editProject方法内，接下来调用getProjects方法")
            // await this.props.getProjects()
            this.props.getInterfaces()
            this.onCancel()
            // await this.getProjects()
            // this.props.onCancel()
        }
    };

    componentDidMount() {
        this.queryInterFaces();
        // this.queryInterFace()
    }


    /***
     * 去重查询项目名称
     */
    queryInterFaces = async () =>{
        const res = await get('/project/queryDistProject')
        if(res.code === 0) {
            this.setState({
                interfaces:res.data
            })
        }else {
            message.error("调用queryDistProject接口失败，查询项目失败")
        }
    }


    /**
     * 转换上传组件表单的值
     */
     _normFile = (e) => {
        if (e.file.response && e.file.response.data) {
            return e.file.response.data.url
        } else {
            return ''
        }
    };

    handleChange=(value)=> {
        console.log("interfacevalue==="+JSON.stringify(value))
        this.setState({
            boolean: {
                sign: value
            }
        })
    }

    render() {
        const {TextArea} = Input
        const {interfaces} = this.state;

        const { visible } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
        };
        return (
            <Modal
                onCancel={this.onCancel}
                visible={visible}
                width={550}
                title='编辑接口'
                centered
                onOk={this.handleOk}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'接口名称'}>
                        {getFieldDecorator('interfaceName',{
                            validateFirst: true,
                            rules: [
                                { required: true, message: '接口名称不能为空' }
                            ]
                        })(
                            <Input
                                maxLength={256}
                                placeholder="请输入测试环境"
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={'所属项目'}>
                        {getFieldDecorator('project', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '项目不能为空' }
                            ],
                            initialValue : "",
                        })(
                            <Select placeholder="请选择" style={{width:"29%"}}>
                                {interfaces.map((item) => {
                                    return <Select.Option value={item}>{item}</Select.Option>})}
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item label={'接口路径'}>
                        {getFieldDecorator('path',{
                            validateFirst: true,
                            rules: [
                                { required: true, message: 'url不能为空' }
                            ]
                        })(
                            <Input
                                maxLength={256}
                                placeholder="请输入rul"
                            />
                        )}
                    </Form.Item>

                    <Form.Item label={'请求方式'}>
                        {getFieldDecorator('method',{
                            // getValueFromEvent:this._normFile(),
                            validateFirst: true,
                            rules: [
                                { required: true, message: '请求方式必填' }
                            ],
                        })(
                            <RadioGroup  onChange={this.onMethodChange} value={this.state.method}>
                                <Radio key="get" value={"get"}>get</Radio>
                                <Radio key="post" value={"post"}>post</Radio>
                                <Radio key="delete" value={"delete"}>delete</Radio>
                                <Radio key="put" value={"put"}>put</Radio>
                            </RadioGroup>
                        )}
                    </Form.Item>

                    {/*<Form.Item label={'端口号'}>*/}
                    {/*{getFieldDecorator('port', {*/}
                    {/*validateFirst: true,*/}
                    {/*rules: [*/}
                    {/*{ required: true, message: '端口号不能为空' }*/}
                    {/*],*/}
                    {/*initialValue : "",*/}
                    {/*})(*/}
                    {/*<InputNumber placeholder={"8080"}/>*/}
                    {/*)}*/}
                    {/*</Form.Item>*/}
                    <Form.Item label={'传输方式'}>
                        {getFieldDecorator('mode', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '数据传输方式不能为空' }
                            ],
                            initialValue : "",
                        })(
                            <RadioGroup  onChange={this.onModeChange} value={this.state.mode} defaultValue={1}>
                                <Radio key="json" value="json">json</Radio>
                                <Radio key="data" value="data">data</Radio>
                            </RadioGroup>
                        )}
                    </Form.Item>
                    {/*<Form.Item label={'跳过'}>*/}
                    {/*{getFieldDecorator('jump', {*/}
                    {/*// validateFirst: true,*/}
                    {/*// rules: [*/}
                    {/*//     { required: true, message: '环境描述不能为空' }*/}
                    {/*// ],*/}
                    {/*initialValue : "",*/}
                    {/*})(*/}
                    {/*<Input/>*/}
                    {/*)}*/}
                    {/*</Form.Item>*/}

                    <Form.Item label={'是否签名'}>
                        {getFieldDecorator('sign',{
                            // initialValue: true,
                            valuePropName: 'checked'
                        })(
                            <Switch checkedChildren="签名" unCheckedChildren="不签名"  onChange={this.handleChange} />
                        )}
                    </Form.Item>

                    <Form.Item label={'签名属性'}>
                        {getFieldDecorator('signAttribute',{
                            initialValue: true
                        })(
                            <Input  disabled={!this.state.boolean.sign} placeholder={"签名属性值"}/>
                        )
                        }
                    </Form.Item>

                    <Form.Item label={'签名字段'}>
                        {getFieldDecorator('signEntity',{
                        })(
                            <TextArea disabled={!this.state.boolean.sign}
                                // disabled={!this.state.sign}
                                      placeholder={"接口签名则需填写签名所需字段"}/>
                        )}
                    </Form.Item>

                    <Form.Item label={'header'}>
                        {getFieldDecorator('header',{
                            valuePropName: 'checked'
                        })(
                            <Switch checkedChildren="设置" unCheckedChildren="不设置" defaultChecked/>
                        )}
                    </Form.Item>

                    <Form.Item label={'是否mock'}>
                        {getFieldDecorator('mock',{
                            valuePropName: 'checked'
                        })(
                            <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked/>
                        )}
                    </Form.Item>

                    <Form.Item label="接口描述"  help="对接口功能进行描述">
                        {getFieldDecorator('description', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '接口描述不能为空' }
                            ],
                            initialValue : "",
                        })(
                            <Input type="textarea" placeholder="随便写" {...getFieldDecorator('description')}/>
                        )}
                    </Form.Item>

                    {/*<Form.Item label={'请求header'}>*/}

                    {/*/!*<div className="header">*!/*/}
                    {/*/!*header参数及值*!/*/}
                    {/*/!*</div>*!/*/}
                    {/*<div>*/}
                    {/*<div>*/}
                    {/*{headerComps}*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*/!*<Button type='primary' icon='plus-square' onClick={this.addline}>添加行</Button>*!/*/}
                    {/*/!*&emsp;*!/*/}
                    {/*/!*<Button shape='primary' icon='plus-square' >添加JSON</Button>*!/*/}

                    {/*</Form.Item>*/}

                    {/*<Form >*/}
                    {/*<div className="ant-descriptions-title">*/}
                    {/*请求header*/}
                    {/*</div>*/}
                    {/*<div>*/}
                    {/*<div>*/}
                    {/*{headerComps}*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*</Form>*/}

                    <Form.Item  label='请求header'>
                        {getFieldDecorator('headerdetail', {
                            validateFirst: true,
                            // rules: [
                            //     { required: true, message: '接口描述不能为空' }
                            // ],
                            initialValue : "",
                        })(
                            <TextArea placeholder={"{}"}/>
                        )}
                        {/*<Input type="textarea" placeholder="备注"/>*/}

                    </Form.Item>


                    {/*<Form.Item label={'请求body'}>*/}

                        {/*/!*<Button type='primary' icon='plus-square' onClick={()=>this.toggleShowCreateModal(true)}>添加行</Button>*!/*/}
                        {/*/!*<Button type='primary' icon='plus-square' onClick={()=>this.addline()}>添加行</Button>*!/*/}
                        {/*/!*&emsp;*!/*/}
                        {/*/!*<Button shape='primary' icon='plus-square' >添加JSON</Button>*!/*/}
                        {/*{getFieldDecorator('body', {*/}
                            {/*validateFirst: true,*/}
                            {/*// rules: [*/}
                            {/*//     { required: true, message: '接口描述不能为空' }*/}
                            {/*// ],*/}
                            {/*initialValue : "",*/}
                        {/*})(*/}
                            {/*<TextArea/>*/}
                        {/*)}*/}
                    {/*</Form.Item>*/}
                    {/*<HeaderModal visible = {isShowCreateModal} toggleVisible={this.toggleShowCreateModal}/>*/}
                </Form>
            </Modal>

        );
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
    },
};

export default EditInterFaceModal
