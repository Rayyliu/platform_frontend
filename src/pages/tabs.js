import React from 'react'
import LoadableComponent from '../utils/LoadableComponent'
const Account = LoadableComponent(import('./Setting/Account'), true);
const Permission = LoadableComponent(import('./Setting/Permission'), true);
const Role = LoadableComponent(import('./Setting/Role'), true);
const Menu = LoadableComponent(import('./Setting/Menu'), true);
const Home = LoadableComponent(import('./Home/index'), true);
const Banners = LoadableComponent(import('./Banners/index'), true);
const Generalize = LoadableComponent(import('./Platform/Generalize'), true);
const Stick = LoadableComponent(import('./Platform/Stick/index'), true);
const Trade = LoadableComponent(import('./Trade/index'), true);
const Order = LoadableComponent(import('./Orders/index'), true);
const Transfer = LoadableComponent(import('./Transfer/index'), true);

const menu = [
    {
        name: '首页',
        icon: 'home',
        key: 'Home'
    },
    {
        name: 'Banner列表',
        icon: 'fund',
        key: 'Banner'
    },
    {
        name: '行业类目',
        icon: 'bars',
        key: 'Trade'
    },
    {
        name: '订单管理',
        icon: 'bar-chart',
        key: 'Order'
    },
    {
        name: '发布信息',
        icon: 'dot-chart',
        key: 'Transfer'
    },
    {
        name: '平台设置',
        icon: 'chrome',
        key: 'Platform',
        children: [
            {
                name: '推广设置',
                icon: 'fullscreen',
                key: 'Generalize',
            },
            {
                name: '置顶设置',
                icon: 'caret-up',
                key: 'Stick',
            }
        ]
    },
    {
        name: '系统设置',
        icon: 'setting',
        key: 'Setting',
        children: [
            {
                name: '菜单设置',
                icon: 'menu',
                key: 'Menu',
            },
            {
                name: '权限设置',
                icon: 'paper-clip',
                key: 'Permission',
            },
            {
                name: '角色管理',
                icon: 'robot',
                key: 'Role',
            },
            {
                name: '账号管理',
                icon: 'contacts',
                key: 'Account',
            }
        ]
    }
];

const tabs = {
    Home: <Home />,
    Banner:<Banners />,
    Order: <Order />,
    Trade: <Trade />,
    Transfer: <Transfer />,
    Generalize: <Generalize />,
    Stick: <Stick />,

    Menu: <Menu />,
    Permission: <Permission/>,
    Role: <Role />,
    Account: <Account />,
};

export {
    menu,
    tabs
}
