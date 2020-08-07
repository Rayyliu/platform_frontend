import React from "react";
import {Button, Cascader, Form,Select, Icon, Input, InputNumber, message, Collapse,Radio} from "antd";
import {del, get, post} from "../../utils/ajax";
import {isAuthenticated} from "../../utils/session";
import options from './cities'
import InterFaceDetail from "./InterFaceDetail";
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

@Form.create()
class CreateTransferIndex extends React.Component{
    state = {
        projects:[],
        interfaces:[],
        fields:{},
        interfaceName:'',
        isShowPanel:true,

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
        this.queryInterFaces();
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

    /***
     * 查询接口详细信息
     */
    queryInterFaces = async () =>{
        const res = await get('/interface/queryDistInterFace')
        if(res.code === 0) {
            this.setState({
                interfaces:res.data
            })
        }else {
            message.error("调用queryDistInterFace接口失败，查询接口失败")
        }
    }

    handleChange=(value)=>{
        console.log("handleChange+value==="+JSON.stringify(value))
        this.setState({
            interfaceName:value
        })
}

    onGetValue = async ()=>{
        console.log("interfaceName==="+JSON.stringify(this.state.interfaceName))
        const res = await get('/interface/findByName',{
            interfaceName:this.state.interfaceName
        });
        if (res.code === 0){
            this.setState({
                fields: res.data,
                isShowPanel:false
            })
            console.log("fields=="+JSON.stringify(this.state.fields))
        }else{
            message.error(res.msg || '没有行业信息，无法新增')
        }
    };
    /**
     * 表单提交
     * */
    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.headerDetail = this.state.fields.headerdetail
                values.body = this.state.fields.body
                values.path = this.state.fields.path
                values.method = this.state.fields.method
                values.interFaceName = this.state.fields.interfaceName
                values.sign = this.state.fields.sign
                this.createCaseAndExecute(values)
            }
        });

    };
    createCaseAndExecute = async (values) => {
        console.log("values==="+JSON.stringify(values))
        values.storeImgS = this.state.storeImgs;
        const res = await post('/single/case/execute', {
            ...values
        });
        if (res.code === 0) {
            message.success('新增成功');
            this.setState({
                    img:{},
                    imgs:{},
                storeImgs:[],
                fileList:[],
                tradeList:[]
                }
            );
            this.props.transferList();
        }
    };

    // handleCreate = () => {
    //     console.log(this.formRef.getItemsValue());     //6、调用子组件的自定义方法getItemsValue。注意：通过this.formRef 才能拿到数据
    //     this.props.getFormRef(this.formRef.getItemsValue());
    //     this.props.closeModal(false);
    // }
    //
    // saveFormRef = formRef => {
    //     this.formRef = formRef;
    // };


    render() {
        const {TextArea} = Input
        const { Panel } = Collapse;
        const { fields } = this.state;
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

        const { previewVisible, previewImage,projects,interfaces } = this.state;
        const { uploading } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        return(
            <div style={{marginTop:'10px'}}>
                <Form {...formItemLayout}>
                    <Form.Item label={'用例名称'}>
                        {getFieldDecorator('caseName', {
                            rules: [{ required: true, message: '请输入用例名称' }],
                        })(
                            <Input placeholder={"用例名称"}/>
                        )}
                    </Form.Item>
                    <Form.Item label="所属项目">
                        {getFieldDecorator('project', {
                            rules: [{ required: true, message: '请选择所属项目' }]
                        })(
                            <Select placeholder="请选择" style={{width:"29%"}}>
                                {projects.map((item) => {
                                    return <Select.Option value={item}>{item}</Select.Option>})}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label={'用例描述'}>
                        {getFieldDecorator('caseDescription', {
                            rules: [
                                { required: true, message: '描述用例设计的场景!'}
                                ],
                        })(
                            <TextArea/>
                            )
                        }
                    </Form.Item>



                    <Form.Item label={'添加步骤'}>
                        {getFieldDecorator('caseStep', {
                            rules: [
                                { required: true, message: '请选择接口!', whitespace: true}
                            ],
                        })(
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="请选择接口!"
                                optionFilterProp="children"
                                onChange={this.handleChange}

                            >
                                {interfaces.map((item) => {
                                    return <Select.Option value={item}>{item}</Select.Option>})}
                            </Select>,
                        )

                        }
                        <div>
                            <Button type='primary' onClick={this.onGetValue}>选择</Button>
                        </div>
                    </Form.Item>
                    <InterFaceDetail isShowPanel={isShowPanel}
                                     fields={fields}
                                     // wrappedComponentRef={(form) => this.formRef = form}
                                     wrappedComponentRef={this.saveFormRef}
                    />

                    <Form.Item {...tailFormItemLayout}>
                        <Button type="default" onClick={this.handleCancel}>
                            取消
                        </Button>
                        &emsp;
                        <Button type="primary" onClick={this.handleSubmit}>
                            调试
                        </Button>
                    </Form.Item>
                </Form>
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


export default CreateTransferIndex;
