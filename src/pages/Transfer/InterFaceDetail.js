import React from "react";
import {
    Button,
    Form,
    Input,
    message,
    Collapse,
    Radio,
    Switch,
    Icon,
    Popconfirm
} from "antd";
import {del, get, post} from "../../utils/ajax";
import RadioGroup from "antd/es/radio/group";
import EditableTable from "./EditableTable";
import EditBodyTabs from "./EditBodyTabs";

const {TextArea} = Input
var bodyArr=[]
var fileArr=[]
var changedParameters={}
var extractValue
@Form.create()
class InterFaceDetail extends React.Component{
    constructor(props) {
        super(props);
    this.state = {
        fields: {
            headerdetail: '',
            body: [],
            path: '',
            method: '',
            sign: false,
            header:false,
            signEntity:'',
            assertDataSource:[],
            extract:[],
            signAttribute:''
        },
        isDestroyInactivePanel:true,
        fieldArr:[]
    };
    }


    /***
     * 组件挂载后触发
     */
    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
        // this.setState({
        //     fieldArr:this.props.fieldArrs
        // })

    }

    /**
     * 表单提交
     * */
    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.createTransfer(values)
            }
        });
    };
    createTransfer = async (values) => {
        values.storeImgS = this.state.storeImgs;
        const res = await post('/transfers', {
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
    /**
     * 表单取消
     * */
    handleCancel= ()=>{
        //删除已经上传的所有图片
        if (JSON.stringify(this.state.img) !== '{}'){
            this.removeImg(this.state.img.key);
        }
        const imgs = this.state.imgs;
        if (imgs.length !== 0){
            const keys = [];
            for(let i = 0; i < imgs.length; i++){
                keys.push(imgs[i].key);
            }
            del('/upload/deletes', {keys: keys});
        }
        this.props.transferList();
    };




    handleFormChange = changedFields => {
        // console.log("handleFormChangechangedFields==="+JSON.stringify(changedFields))
        // this.setState(({ fields }) => ({
        //     fields: { ...fields, ...changedFields },
        // }));
    };
    onTabChange = (key, type) => {
        console.log(key, type);
        this.setState(
            { [type]: key }
            );
    };


    genExtra = (fieldArrs,index,fields) => (
        <Icon
            type="close"
            style={{ color: 'red' }}
            onClick={() => {
                console.log("进入genExtra方法")
                // console.log("被删除的values==="+JSON.stringify(fields))
                // console.log("arrIndex==="+JSON.stringify(index))
                // console.log("删除之前的fieldArrs==="+JSON.stringify(fieldArrs))
                // fieldArrs.splice(index,1)
                // console.log("删除之后的fieldArrs==="+JSON.stringify(fieldArrs))
                //If you don't want click extra trigger collapse, you can prevent this:
                //         this.setState({
                //         isDestroyInactivePanel:false,
                //         fieldArr:fieldArrs
                // })

                //注意：this.setState方法的执行，是异步的，在调用完this.setState之后，又想立即拿到state值，需要使用this.setState({},callback)
                this.setState({
                    isDestroyInactivePanel:false,
                },function () {
                    this.props.callback("delete",'','','',index)
                })
            }}
        />
    );


    test=()=>{
        console.log("进入到test方法了")
        console.log("this.form==="+this.form)
        console.log("dataSource==="+this.form.state.dataSource)
    }





    submit=()=> {
        // console.log("this.bodyForm.state.dataSource.body==="+JSON.stringify(this.bodyForm.state.dataSource.body))
        // var a = this.bodyForm.state.dataSource
        // bodyArr=bodyArr.concat(a)
        // console.log("bodyArr==="+JSON.stringify(bodyArr))
        // console.log("this.form.state.dataSource==="+JSON.stringify(this.bodyForm.state.dataSource))
        console.log("changedParameters==="+JSON.stringify(changedParameters))
        // this.setState(({ fields }) => ({
        //     fields: {
        //         extract:changedParameters
        //     },
        // }),function () {
        //     console.log("this.state.fields==="+JSON.stringify(this.state.fields))
        // });
        this.state.fieldArr.splice(0,this.state.fieldArr.length)
        console.log("this.state.fieldArr==="+JSON.stringify(this.state.fieldArr))
        console.log("this.form.state.dataSource==="+JSON.stringify(this.form.state.dataSource))
        console.log("changedParameters的长度==="+changedParameters.length)
        if(changedParameters.length>0){
        this.setState({
            fields: {
                assertDataSource: this.form.state.dataSource,
                body: this.bodyForm.state.dataSource,
                extract:changedParameters.extract.value
                // headerdetail:this.props.fields.headerdetail,
                // path: this.props.fields.path,
                // method: this.props.fields.method,
                // sign: this.props.fields.sign,
                // header:this.props.fields.header,
                // signEntity:this.props.fields.signEntity,
            },
            // fieldArr:this.state.fieldArr.push(this.state.fields)
        },function() {
            console.log("submit-assertDataSource===" + JSON.stringify(this.state.fields.assertDataSource))
            console.log("submit-interfacedetail-fields===" + JSON.stringify(this.state.fields))
            console.log("submit-interfacedetail-extract===" + JSON.stringify(this.state.fields.extract))
            console.log("submit-interfacedetail-fieldArr===" + JSON.stringify(this.state.fieldArr))
            // this.updateFieldArr(this.state.fields)
            console.log("this.props.index==="+this.props.index)
            console.log("this.state.fields.body==="+JSON.stringify(this.state.fields.body))

                this.props.callback("submit", "body", this.state.fields.body, "", "",this.props.index)
            console.log("this.state.fields.assertDataSource==="+JSON.stringify(this.state.fields.assertDataSource))

                this.props.callback("submit", "assertDataSource", "", this.state.fields.assertDataSource, "",this.props.index)

            this.props.callback("submit", "extract", "", "", this.state.fields.extract,this.props.index)
            console.log("this.state.fields.extract==="+JSON.stringify(this.state.fields.extract))


        })}else {
            this.setState({
                fields: {
                    assertDataSource: this.form.state.dataSource,
                    body: this.bodyForm.state.dataSource,
                    // headerdetail:this.props.fields.headerdetail,
                    // path: this.props.fields.path,
                    // method: this.props.fields.method,
                    // sign: this.props.fields.sign,
                    // header:this.props.fields.header,
                    // signEntity:this.props.fields.signEntity,
                },
                // fieldArr:this.state.fieldArr.push(this.state.fields)
            },function() {
                console.log("submit-assertDataSource===" + JSON.stringify(this.state.fields.assertDataSource))
                console.log("submit-interfacedetail-fields===" + JSON.stringify(this.state.fields))
                console.log("submit-interfacedetail-extract===" + JSON.stringify(this.state.fields.extract))
                console.log("submit-interfacedetail-fieldArr===" + JSON.stringify(this.state.fieldArr))
                // this.updateFieldArr(this.state.fields)
                console.log("this.props.index==="+this.props.index)
                console.log("this.state.fields.body==="+JSON.stringify(this.state.fields.body))

                this.props.callback("submit", "body", this.state.fields.body, "", "",this.props.index)
                console.log("this.state.fields.assertDataSource==="+JSON.stringify(this.state.fields.assertDataSource))

                this.props.callback("submit", "assertDataSource", "", this.state.fields.assertDataSource, "",this.props.index)

                this.props.callback("submit", "extract", "", "", this.state.fields.extract,this.props.index)
                console.log("this.state.fields.extract==="+JSON.stringify(this.state.fields.extract))
        })}

        // this.updateFieldArr(this.state.fields)
    }

    updateFieldArr=(value)=>{


        console.log("valueeeee==="+JSON.stringify(value))

        fileArr.push(value)
        this.setState({
            fieldArr:fileArr
        },function () {
            console.log("updateFieldArr+fieldArr==="+JSON.stringify(this.state.fieldArr))
        })
        // this.props.callback(fileArr)
    }

    bodySubmit=()=>{
        setTimeout(()=>{
        this.setState({
            fields:{
                body:this.bodyForm.state.dataSource
            }
        })
        console.log("bodyForm-body==="+JSON.stringify(this.bodyForm.state.dataSource))
        console.log("interfacedetail-body==="+JSON.stringify(this.state.fields.body))
    },10)
    }
    render() {


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

        const {isDestroyInactivePanel} = this.state
        const { getFieldDecorator} = this.props.form;
        const { Panel } = Collapse;
        const {isShowPanel,fields,fieldArrs,index} = this.props
        const CustomizedForm = Form.create({
            name: 'global_state',
            onFieldsChange(props, changedFields) {
                changedParameters=changedFields;
                extractValue=changedParameters.extract.value
                console.log("changedFields==="+JSON.stringify(changedFields))
                console.log("changedParameters==="+JSON.stringify(changedParameters))
                props.onChange(changedFields);
            },
            mapPropsToFields(props,changedParameters) {
                console.log("detail+props=="+JSON.stringify(props))
                console.log("changedParameters=="+JSON.stringify(changedParameters))
                return {
                    headerdetail: Form.createFormField({
                        ...props.headerdetail,
                        value:  props.headerdetail,
                    }),
                    body: Form.createFormField({
                        ...props.body,
                        value: props.body,
                    }),
                    extract: Form.createFormField({
                        // ...props.extract,
                        value: JSON.stringify(extractValue),
                    }),
                    path: Form.createFormField({
                        ...props.path,
                        value: props.path,
                    }),
                    method: Form.createFormField({
                        ...props.method,
                        value: props.method,
                    }),
                    sign: Form.createFormField({
                        ...props.sign,
                        value: props.sign,
                    }),
                    signAttribute: Form.createFormField({
                    ...props.signAttribute,
                    value: props.signAttribute,
                }),
                    header: Form.createFormField({
                        ...props.header,
                        value: props.header,
                    }),
                    signEntity: Form.createFormField({
                    ...props.signEntity,
                    value: JSON.stringify( props.signEntity),
                }),
                };
            },
            onValuesChange(_, values) {
                console.log("values==="+JSON.stringify(values));
            },
        })(
            props => {
                const { getFieldDecorator } = props.form;
                const {body,assertDataSource}=this.state.fields
                const {fields} = this.props
                return (
                    <>
                        {isDestroyInactivePanel ?
                        <Collapse bordered={false}
                              // onChange={this.callback}
                              >
                        <Panel
                            header={fields.interfaceName}
                            disabled = {isShowPanel}
                            extra ={this.genExtra(fieldArrs,index,fields)}
                        >

                        <Form.Item label="header">
                            {getFieldDecorator('header', {
                                // rules: [{ required: true, message: 'Assertion is required!' }],
                                initialValue:''
                            })(
                                <Switch  checkedChildren="设置" unCheckedChildren="不设置" checked={fields.header}  />
                            )}
                        </Form.Item>

                        <Form.Item label="headerdetail">
                            {getFieldDecorator('headerdetail', {
                                rules: [{ required: true, message: 'headerdetail is required!' }],
                            })(<
                                Input   disabled={!fields.header}  placeholder={"{}"}
                            />)}
                        </Form.Item>

                        <Form.Item label="Path">
                            {getFieldDecorator('path', {
                                rules: [{ required: true, message: 'Path is required!' }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label={'请求方式'}>
                            {getFieldDecorator('method', {
                                validateFirst: true,
                                rules: [
                                    { required: true, message: '请求方式必选!'}
                                ],
                            })(
                                <RadioGroup
                                    // onChange={this.onMethodChange}
                                    value={fields.method}>
                                    <Radio key="get" value={"get"}>get</Radio>
                                    <Radio key="post" value={"post"}>post</Radio>
                                    <Radio key="delete" value={"delete"}>delete</Radio>
                                    <Radio key="put" value={"put"}>put</Radio>
                                </RadioGroup>
                            )
                            }
                        </Form.Item>


                        <Form.Item label="签名">
                            {getFieldDecorator('sign', {
                                // rules: [{ required: true, message: 'Assertion is required!' }],
                                initialValue:''
                            })(
                                <Switch  checkedChildren="有" unCheckedChildren="无" checked={fields.sign}  />
                            )}
                        </Form.Item>

                        <Form.Item label="签名属性">
                            {getFieldDecorator('signAttribute', {
                                // rules: [{ required: true, message: 'Assertion is required!' }],
                                initialValue:''
                            })(
                                <Input disabled={!fields.sign}/>
                            )}
                        </Form.Item>

                        <Form.Item label="签名字段">
                            {getFieldDecorator('signEntity', {
                                // rules: [{ required: true, message: 'Assertion is required!' }],
                                initialValue:''
                            })(
                                <TextArea  disabled={!fields.sign} defaultValue="没有签名则禁用" />
                            )}
                        </Form.Item>

                        <Form.Item label="Body">
                            {getFieldDecorator('body', {
                                rules: [{ required: true, message: 'Body is required!' }],
                            })(
                                <EditBodyTabs bodySubmit={this.bodySubmit}
                                              onRef={(ref) => { this.bodyForm = ref; }}
                                              body={body}
                                              ifassertDataSource={assertDataSource}/>
                            )}
                        </Form.Item>

                        <Form.Item label="提取参数">
                                {getFieldDecorator('extract', {
                                    // rules: [{ required: true, message: 'parameter is required!' }],
                                    initialValue:''
                                })(<Input placeholder={"[]"}/>)}
                        </Form.Item>

                        <Form.Item label="断言">
                                {getFieldDecorator('assertion', {
                                    // rules: [{ required: true, message: 'Assertion is required!' }],
                                    initialValue:''
                                })(

                                    <EditableTable submit={this.submit}
                                                   onRef={(ref) => { this.form = ref; }}
                                                   assertDataSource={assertDataSource}/>

                                )}
                        </Form.Item>

                            {/*<div>*/}
                            {/*<Button onClick={this.test}/>*/}
                            {/*<EditableTable onRef={(ref) => { this.form = ref; }}/>*/}
                            {/*</div>*/}
                    {/*</Form>*/}
                            <Form.Item {...tailFormItemLayout}>
                            <Button  type="primary" icon="check" {...fields} onClick={this.submit}>
                                提交
                            </Button>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                            :null
                        }
                        </>
                );
            });
        return(
            <div>
                {/*{comps.map(comp =>{*/}
                    {/*return <CustomizedForm key={comp} {...fields} />*/}
                {/*})}*/}
                {/*<Button onClick={()=>this.setState({comps:comps.concat([Date.now()])})}>加组件</Button>*/}
                <CustomizedForm {...fields} onChange={this.handleFormChange}/>
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


export default InterFaceDetail;
