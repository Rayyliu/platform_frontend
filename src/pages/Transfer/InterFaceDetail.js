import React from "react";
import {
    Button,
    Form,
    Select,
    Icon,
    Input,
    message,
    Collapse,
    Radio,
    Switch,
    Table,
    Popconfirm,
} from "antd";
import {del, get, post} from "../../utils/ajax";
import RadioGroup from "antd/es/radio/group";
import EditableCell from "./EditableCell";
let  Option  = Select.Option;
@Form.create()
class InterFaceDetail extends React.Component{
    state = {
        fields: {
            headerDetail: '',
            body: '',
            path:'',
            method:'',
            sign:false,
        },
        comps:[],
        // isShowPanel:false
        dataSource:[
            {
                key: '0',
                params: 'Edward King 0',
                except: '32',
                rule: 'London, Park Lane no. 0',
            },
            {
                key: '1',
                params: 'Edward King 1',
                except: '32',
                rule: 'London, Park Lane no. 1',
            },
        ],
        count: 2,

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
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields },
        }));
    };
    onTabChange = (key, type) => {
        console.log(key, type);
        this.setState(
            { [type]: key }
            );
    };

    //断言页面
    handleDelete = key => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter(item => item.key !== key),
        });
    };

    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };

    handleSave = row => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        this.setState({
            dataSource: newData,
        });
    };

    render() {

         const columns =[{
            title: '参数',
            dataIndex: 'params',
            width: '30%',
            editable: true,
        },{
            title: '期望值',
            dataIndex: 'except',
            width: '30%',
            editable: true,
        },{
            title: '校验规则',
            dataIndex: 'rule',
            // render:()=>
            //     this.state.dataSource.length >= 1 ?(
            //         <Select placeholder="请选择" style={{width: "29%"}}>
            //             <Select.Option value="equal">equal</Select.Option>})}
            //             <Select.Option value="contain">contain</Select.Option>})}
            //         </Select>):null,
        },{
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record) =>
                this.state.dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        }]


        const { getFieldDecorator} = this.props.form;
        const { comps,dataSource } = this.state;
        const { Panel } = Collapse;
        const {isShowPanel,fields} = this.props


        //编写断言页面
        const EditableContext = React.createContext();
        const EditableRow = ({ form, index, ...props }) => (
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        );
        const EditableFormRow = Form.create()(EditableRow);
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const column = columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });



        const CustomizedForm = Form.create({
            name: 'global_state',
            onFieldsChange(props, changedFields) {
                props.onChange(changedFields);
            },
            mapPropsToFields(props) {
                console.log("detail+props=="+JSON.stringify(props))
                return {
                    headerDetail: Form.createFormField({
                        ...props.headerDetail,
                        value: props.headerDetail,
                    }),
                    body: Form.createFormField({
                        ...props.body,
                        value: props.body,
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
                };
            },
            onValuesChange(_, values) {
                console.log("values==="+JSON.stringify(values));
            },
        })(
            props => {
                const { getFieldDecorator } = props.form;
                return (
                    <Collapse bordered="true" >
                        <Panel
                            header={fields.interfaceName}
                            disabled = {isShowPanel}>
                    {/*<Form layout="inline" >*/}
                        <Form.Item label="HeaderDetail">
                            {getFieldDecorator('headerDetail', {
                                rules: [{ required: true, message: 'HeaderDetail is required!' }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="Path">
                            {getFieldDecorator('path', {
                                rules: [{ required: true, message: 'Path is required!' }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="Body">
                            {getFieldDecorator('body', {
                                rules: [{ required: true, message: 'Body is required!' }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="提取参数Parameter">
                                {getFieldDecorator('parameter', {
                                    // rules: [{ required: true, message: 'parameter is required!' }],
                                    initialValue:''
                                })(<Input />)}
                        </Form.Item>

                        <Form.Item label="断言">
                                {getFieldDecorator('assertion', {
                                    // rules: [{ required: true, message: 'Assertion is required!' }],
                                    initialValue:''
                                })(
                                    <div>
                                        <Button
                                            onClick={this.handleAdd}
                                            type="primary"
                                            style={{
                                                marginBottom: 16,
                                            }}
                                        >add a row
                                        </Button>
                                    <Table components={components}
                                           rowClassName={() => 'editable-row'}
                                           bordered
                                           dataSource={dataSource}
                                           columns={column}
                                    />
                                    </div>
                                )}
                        </Form.Item>

                        <Form.Item label="签名">
                            {getFieldDecorator('sign', {
                                // rules: [{ required: true, message: 'Assertion is required!' }],
                                initialValue:''
                            })(
                                <Switch  checkedChildren="启用" unCheckedChildren="废弃" checked={fields.sign}  />
                            )}
                        </Form.Item>

                        <Form.Item label={'请求方式'}>
                            {getFieldDecorator('method', {
                                validateFirst: true,
                                rules: [
                                    { required: true, message: '请求方式必选!'}
                                ],
                            })(
                                <RadioGroup  onChange={this.onMethodChange} value={fields.method}>
                                    <Radio key="get" value={"get"}>get</Radio>
                                    <Radio key="post" value={"post"}>post</Radio>
                                    <Radio key="delete" value={"delete"}>delete</Radio>
                                    <Radio key="put" value={"put"}>put</Radio>
                                </RadioGroup>
                            )
                            }
                        </Form.Item>

                    {/*</Form>*/}
                        </Panel>
                    </Collapse>
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
