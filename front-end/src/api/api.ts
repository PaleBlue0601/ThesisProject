import axios from '@/utils/request'

// login
export const sendEmailCode = (data = {}) => {
  return axios.request({
    url: '/email',
    method: 'post',
    data
  })
}

export const login = (data = {}) => {
  return axios.request({
    url: '/login',
    method: 'post',
    data
  })
}

export const register = (data = {}) => {
  return axios.request({
    url: '/register',
    method: 'post',
    data
  })
}

// user
export const getUserInfo = (data = {}) => {
  return axios.request({
    url: '/getuserinfo',
    method: 'post',
    data
  })
}

export const updateUserInfo = (data = {}) => {
  return axios.request({
    url: '/updateuserinfo',
    method: 'post',
    data
  })
}

export const userInfoAchievement = (data = {}) => {
  return axios.request({
    url: '/userinfo/achievement',
    method: 'post',
    data
  })
}

// file
export const fileUpload = (data = {}) => {
  return axios.request({
    url: '/file/upload',
    method: 'post',
    data
  })
}

export const fileDelete = (data = {}) => {
  return axios.request({
    url: '/file/delete',
    method: 'post',
    data
  })
}

// deliverAddress
export const getAddressList = (data = {}) => {
  return axios.request({
    url: '/getaddresslist',
    method: 'post',
    data
  })
}

export const addAddress = (data = {}) => {
  return axios.request({
    url: '/addaddress',
    method: 'post',
    data
  })
}

export const updateAddress = (data = {}) => {
  return axios.request({
    url: '/updateaddress',
    method: 'post',
    data
  })
}

export const deleteAddress = (data = {}) => {
  return axios.request({
    url: '/deleteaddress',
    method: 'post',
    data
  })
}

// PeopleObject
export const addPeopleObject = (data = {}) => {
  return axios.request({
    url: '/addpeopleobject',
    method: 'post',
    data
  })
}

export const getPeopleObjcetList = (data = {}) => {
  return axios.request({
    url: '/getpeopleobjcetlist',
    method: 'post',
    data
  })
}

export const updatePeopleObjcet = (data = {}) => {
  return axios.request({
    url: '/updatepeopleobjcet',
    method: 'post',
    data
  })
}

export const deletePeopleObjcet = (data = {}) => {
  return axios.request({
    url: '/deletepeopleobjcet',
    method: 'post',
    data
  })
}

// Home
export const search = (data = {}) => {
  return axios.request({
    url: '/search',
    method: 'post',
    data
  })
}

export const getHomeListData = (data = {}) => {
  return axios.request({
    url: '/gethomelistdata',
    method: 'post',
    data
  })
}

// ObjectDetail
export const getoObjectInfo = (data = {}) => {
  return axios.request({
    url: '/getobjectinfo',
    method: 'post',
    data
  })
}

export const objectDetailView = (data = {}) => {
  return axios.request({
    url: '/objectdetail/views',
    method: 'post',
    data
  })
}

export const objectDetailLikes = (data = {}) => {
  return axios.request({
    url: '/objectdetail/likes',
    method: 'post',
    data
  })
}

export const objectDetailChecklike = (data = {}) => {
  return axios.request({
    url: '/objectdetail/checklike',
    method: 'post',
    data
  })
}

export const objectDetailExchange = (data = {}) => {
  return axios.request({
    url: '/objectdetail/exchange',
    method: 'post',
    data
  })
}

// objectExchange
export const objectExchangeGetListData = (data = {}) => {
  return axios.request({
    url: '/objectexchange/getlistdata',
    method: 'post',
    data
  })
}

export const agreeExhange = (data = {}) => {
  return axios.request({
    url: '/objectexchange/agreeexhange',
    method: 'post',
    data
  })
}

export const cancelExhange = (data = {}) => {
  return axios.request({
    url: '/objectexchange/cancelexhange',
    method: 'post',
    data
  })
}

export const objectexchangeDelete = (data = {}) => {
  return axios.request({
    url: '/objectexchange/delete',
    method: 'post',
    data
  })
}

// chat
export const chatSendMsg = (data = {}) => {
  return axios.request({
    url: '/chat/sendmsg',
    method: 'post',
    data
  })
}

export const chatGetRetainMsg = (data = {}) => {
  return axios.request({
    url: '/chat/getretainmsg',
    method: 'post',
    data
  })
}

// usermanagement
export const getuserinfos = (data = {}) => {
  return axios.request({
    url: '/usermanagement/getuserinfos',
    method: 'post',
    data
  })
}
export const statusedit = (data = {}) => {
  return axios.request({
    url: '/usermanagement/statusedit',
    method: 'post',
    data
  })
}

// userComplain
export const userComplain = (data = {}) => {
  return axios.request({
    url: '/usercomplain/complain',
    method: 'post',
    data
  })
}

export const getComplains = (data = {}) => {
  return axios.request({
    url: '/usercomplain/getcomplains',
    method: 'post',
    data
  })
}

export const deleteComplain = (data = {}) => {
  return axios.request({
    url: '/usercomplain/delete',
    method: 'post',
    data
  })
}