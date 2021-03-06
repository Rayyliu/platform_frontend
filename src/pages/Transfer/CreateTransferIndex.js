import React from "react";
import {Button, Divider, Form,Select, Icon, Input, InputNumber, message, Collapse,Radio,Spin,Alert} from "antd";
import {del, get, post} from "../../utils/ajax";
import {isAuthenticated} from "../../utils/session";
import options from './cities'
import InterFaceDetail from "./InterFaceDetail";
import jwt_decode from "jwt-decode";
const { Option } = Select;

let fieldArr=[];
let valuesArr=[]
@Form.create()
class CreateTransferIndex extends React.Component{
    state = {
        projects:[],
        interfaces:[],
        fields:[{

        }],
        interfaceName:{},
        caseName:'',
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
        this.queryInterFaces();
        this.queryProject()
    }

    /***
     * 组件生命周期之结束
     */
    componentWillUnmount(){
        fieldArr=[]
        valuesArr=[]
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
        console.log("更新后的fields==" + JSON.stringify(this.state.fields))
    }



    onGetValue = async ()=> {
        console.log("interfaceName===" + JSON.stringify(this.state.interfaceName))
        if (this.state.interfaceName == null||this.state.interfaceName =="") {
            message.error('请先选择接口')
        } else {
            const res = await get('/interface/findByName', {
                interfaceName: this.state.interfaceName
            });
            console.log("res==="+JSON.stringify(res))
            if (res.code === 0) {
                console.log("data===="+JSON.stringify(res.data))
                console.log("fieldArr==="+JSON.stringify(fieldArr.push(res.data)))
                this.setState({
                    fields: fieldArr,
                    isShowPanel: false
                })
                console.log("更新后的fields==" + JSON.stringify(this.state.fields))
            } else {
                message.error(res.msg || '没有接口信息，无法新增')
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
                console.log("values==="+JSON.stringify(values))
                console.log("this.child.state==="+JSON.stringify(this.child.state))
                console.log("this.state.fields==="+JSON.stringify(this.state.fields))
                console.log("this.child.state.fields.body==="+JSON.stringify(this.child.state.fields.body))
                this.setState({
                    fields: fieldArr
                },function () {
                    console.log("fieldArrlast==="+JSON.stringify(this.state.fields))
                    // for( var valuess of this.child.state.fieldArr){
                    for( var valuess of this.state.fields){
                        // values.interfaceId=valuess.id
                        // values.headerDetail = valuess.headerdetail
                        // values.header = valuess.header
                        // // values.body = this.state.fields.body
                        // values.body = JSON.stringify(valuess.body)
                        // values.path = valuess.path
                        // values.method = valuess.method
                        // values.interFaceName = valuess.interfaceName
                        // values.sign = valuess.sign
                        // values.signEntity=valuess.signEntity
                        // // values.assertionEntity=JSON.parse(this.child.state.fields.assertDataSource)
                        // values.assertionContent=JSON.stringify(this.child.state.fields.assertDataSource)
                        let cook =isAuthenticated();
                        var user = jwt_decode(cook)
                        console.log("cook==="+JSON.stringify(cook))
                        var email = JSON.stringify(user.sub)
                        console.log("email==="+email)

                        console.log("数组的values==="+JSON.stringify(valuess))
                        console.log("this.child.state.fields.body==="+JSON.stringify(this.child.state.fields.body))
                        console.log("valuess.body==="+JSON.stringify(valuess.body))
                        valuesArr.push({
                            interfaceId: valuess.id,
                            headerDetail:valuess.headerdetail,
                            header : valuess.header,
                            // values.body = this.state.fields.body
                            // body : JSON.stringify(this.child.state.fields.body),
                            body : JSON.stringify(valuess.body),
                            path : valuess.path,
                            method : valuess.method,
                            interFaceName : valuess.interfaceName,
                            caseName:values.caseName,
                            description:values.description,
                            project:values.project,
                            // extract:JSON.stringify(valuess.extract),
                            extract:valuess.extract,
                            sign : valuess.sign,
                            signAttribute:valuess.signAttribute,
                            signEntity : JSON.stringify(valuess.signEntity),
                            // values.assertionEntity=JSON.parse(this.child.state.fields.assertDataSource)
                            assertionContent:JSON.stringify(valuess.assertDataSource),
                            lastExecuteUser:email,
                            add:true,
                            valid:true
                        })
                        console.log("valuesArr==="+JSON.stringify(valuesArr))
                    }
                    this.createCaseAndExecute(valuesArr)
                })
                // console.log("valuesArr==="+JSON.stringify(valuesArr))
            }
        });

    };
    createCaseAndExecute = async (valuesArr) => {



        // console.log("调试的values==="+JSON.stringify(valuesArr))
        // var valuesJson=JSON.stringify(valuesArr)
        console.log("valuesJson==="+JSON.stringify(valuesArr))
        // valuesArr.storeImgS = this.state.storeImgs;
        const res = await post('/single/case/execute', {
            valuesArr,
            // lastExecuteUser:email,
            // add:true,
            // valid:true
        });
        console.log("调用结果res==="+JSON.stringify(res))
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
        const { fields} = this.state;
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

        const { projects,interfaces } = this.state;
        const { getFieldDecorator} = this.props.form;

        return(
            <div style={{marginTop:'10px'}}>
                <Spin spinning={this.state.loading}>
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
                        {getFieldDecorator('description', {
                            rules: [
                                { required: true, message: '描述用例设计的场景!'}
                                ],
                        })(
                            <TextArea/>
                            )
                        }
                    </Form.Item>
                    <Divider
                        dashed
                    >
                        {/*<p>以上内容固定不变</p>*/}
                        选择用例执行
                    </Divider>


                    <Form.Item label={'选择用例'}>
                        {getFieldDecorator('caseStep', {
                            rules: [
                                { required: true, message: '请选择用例!', whitespace: true}
                            ],
                        })(
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="请选择用例!"
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

                    <div>
                     {/*<InterFaceDetail isShowPanel={isShowPanel}*/}
                                     {/*fields={fields}*/}
                                     {/*onRef={(ref) => { this.child = ref; }}*/}
                    {/*/>*/}
                        {fields.map((fields,index)=>{
                            console.log("index=="+index)
                            return(
                                <InterFaceDetail
                                    callback={(type,module,body,assertDataSource,extract,key)=>{

                                        console.log("key==="+key)
                                        console.log("callbackfieldArr=="+JSON.stringify(fieldArr))
                                        if(type==="submit") {
                                            if(module==="body") {
                                                console.log("fieldArr[key].body==="+fieldArr[key].body)
                                                fieldArr[key].body = body;
                                                console.log("after-fieldArr[key].body==="+JSON.stringify(fieldArr[key].body))
                                                console.log("fieldArr[key]==" + JSON.stringify(fieldArr))
                                            }else if(module==="assertDataSource"){
                                                console.log("assertDataSource==="+JSON.stringify(assertDataSource))
                                                console.log("fieldArr[key].assertDataSource==="+fieldArr[key].assertDataSource)
                                                fieldArr[key].assertDataSource = assertDataSource;
                                                console.log("after-fieldArr[key].assertDataSource==="+JSON.stringify(fieldArr[key].assertDataSource))
                                                console.log("fieldArr[key]==" + JSON.stringify(fieldArr))
                                            }else if(module==="extract"){
                                                console.log("extract==="+JSON.stringify(extract))
                                                console.log("fieldArr[key].extract==="+fieldArr[key].extract)
                                                fieldArr[key].extract = extract;
                                                console.log("after-fieldArr[key].extract==="+JSON.stringify(fieldArr[key].extract))
                                                console.log("fieldArr[key]==" + JSON.stringify(fieldArr))
                                            }

                                        }else if(type==="delete"){
                                            console.log("beforefieldArr[key]==" + JSON.stringify(fieldArr))
                                            fieldArr.splice(key,1)
                                            console.log("afterfieldArr[key]==" + JSON.stringify(fieldArr))
                                        }

                                    }}
                                    isShowPanel={isShowPanel}
                                                 fields={fields}
                                                 fieldArrs={fieldArr}
                                                 index={index}
                                                 onRef={(ref) => { this.child = ref; }}
                        />
                            )
                        })}
                    </div>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="default" onClick={this.handleCancel}>
                            取消
                        </Button>
                        &emsp;
                        <Button type="primary"
                                icon="reload"
                                // disabled={true}
                                onClick={this.handleSubmit}>
                            调试
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


export default CreateTransferIndex;
