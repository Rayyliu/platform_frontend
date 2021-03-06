import React from 'react'
import {get, toeknGet} from "../utils/ajax";

// 虽然用户信息放在localStorage也可以全局使用，但是如果放在localStorage中，用户信息改变时页面不会实时更新
export const SET_USER = 'SET_USER';
export const SET_WELCOME = 'SET_WELCOME';
export const SET_MENUS = 'SET_MENUS';
export function setUser(user) {
    return {
        type: SET_USER,
        user
    }
}

/**
 * 定义一个函数（Action Creators）来生成action，此函数是一个pure function，它最后会返回一个action对象，
 * Action 需要通过 store.dispatch() 方法来发送
 * @param data
 * @returns {{type: string, statistic: *}}
 */
function setWelcome(data) {
    return {
        type: SET_WELCOME,
        statistic: data
    }
}
function setMenus(data) {
    return {
        type: SET_MENUS,
        menus: data
    }
}
//异步action，从后台获取用户信息
export function getUser(token) {
    return async function (dispatch) {
        // const res = await toeknGet('/session',token);
        // dispatch(setUser(res.data || {}))
        dispatch(setUser(token || {}))
    }
}
//加载菜单
export function initMenus(token) {
    return async function (dispatch) {
        // const res = await toeknGet('/menu',token);
        // dispatch(setMenus(res.data || {}))
        dispatch(setMenus(token || {}))
    }
}

//首页统计数据获取
export function getWelcome() {
    return async function (dispatch) {
        const res = await get('/welcome');
        dispatch(setWelcome(res.data || {}))
    }
}
