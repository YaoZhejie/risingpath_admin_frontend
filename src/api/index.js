/* eslint-disable*/
import axios from 'axios'
import { get, post } from './http'

// =======================> 用户 API
//返回所有用户
export const getAllUser = (params) => post(`user/list/page`, params, { headers: { 'Content-Type': 'application/json' } })
// 更新用户信息
export const updateUserMsg = (params) => post(`user/update`, params, { headers: { 'Content-Type': 'application/json' } })
//删除用户
export const deleteUser = (params) => post(`user/delete`, params, { headers: { 'Content-Type': 'application/json' } })
//创建用户
export const addUser = (params) => post(`user/add`, params, { headers: { 'Content-Type': 'application/json' } })
// 返回指定ID的用户
export const getUserOfId = (id) => get(`user/detail?id=${id}`)
//用户登录
export const loginIn = (params) => post(`user/login`, params, { headers: { 'Content-Type': 'application/json' } })
//用户修改密码
export const updatePassword = (params) => post(`user/updatePassword`, params, { headers: { 'Content-Type': 'application/json' } })
//修改头像
export const updatePic = (params) => post(`user/updateUserPic`, params, { headers: { 'Content-Type': 'multipart/form-data' } })

// =======================> 学习资料 API

export const getAllLeranLink = (params) => post(`learn/allLearn`, params, { headers: { 'Content-Type': 'application/json' } })
//更新学习资料信息
export const addOrUpdate = (params) => post(`learn/addOrUpdate`, params, { headers: { 'Content-Type': 'application/json' } })
//删除学习资料信息
export const deleteLearn = (params) => post(`learn/delete`, params, { headers: { 'Content-Type': 'application/json' } })


// =======================> 学校 API
//返回所有学校信息
export const getAllSchool = (params) => post('school/list', params, { headers: { 'Content-Type': 'application/json' } })
//修改学校图标
export const updateSchoolPic = (params) => post(`school/updateSchoolPic`, params, { headers: { 'Content-Type': 'multipart/form-data' } })
//更新学校信息
export const addOrUpdateSchool = (params) => post(`school/addOrUpdate`, params, { headers: { 'Content-Type': 'application/json' } })
//删除学校信息，以及所带的专业信息，分数线信息
export const deleteSchool = (params) => post(`school/delete`, params, { headers: { 'Content-Type': 'application/json' } })

// =======================> 专业信息 API
//根据学校模糊查询分页
export const selectByPage = (params) => post(`professinfo/selectByPage`, params, { headers: { 'Content-Type': 'application/json' } })
//根据专业模糊查询
export const getProfessinfoLikeName = (params) => post(`professinfo/likeProfessinfo?professName`, params, { headers: { 'Content-Type': 'application/json' } })
//根据备注模糊查询
export const getProfessinfoLikeRemark = (params) => post(`professinfo/likeRemarks?remarks`, params, { headers: { 'Content-Type': 'application/json' } })
//根据学校模糊查询
export const getProfessinfoBySchool = (keywords) => get(`professinfo/likeSchoolName?schoolName=${keywords}`)
//根据院校id查询院校的专业
export const getProfessinfoBySchoolId = (params) => post(`professinfo/selectByPage`, params, { headers: { 'Content-Type': 'application/json' } })
//删除专业以及所在的分数线
export const deleteProfession = (proId) => post(`professinfo/delete/${proId}`)
//添加专业信息
export const insertProfession = (params) => post(`professinfo/insert`, params, { headers: { 'Content-Type': 'application/json' } })
//修改专业信息
export const updateProfession = (params) => post(`professinfo/update`, params, { headers: { 'Content-Type': 'application/json' } })

// =======================> 专业分数 API
//根据学校模糊查询
export const getScoreBySchool = (params) => post(`yearscore/scoreLikeSchoolName`, params, { headers: { 'Content-Type': 'application/json' } })
//根据专业模糊查询
export const getScoreLikeName = (params) => post(`yearscore/scoreLikeProfessinfo`, params, { headers: { 'Content-Type': 'application/json' } })
//根据备注模糊查询
export const getScoreLikeRemark = (params) => post(`yearscore/scoreLikeRemarks`, params, { headers: { 'Content-Type': 'application/json' } })
//根据学校专业id获取专业分数
export const getAllScoreBySchool = (sid, proId) => get(`yearscore/get/${sid}/${proId}`)
//删除分数
export const deleteScore = (sid) => post(`yearscore/delete/${sid}`)
//更新分数
export const updateScore = (params) => post(`yearscore/update`, params, { headers: { 'Content-Type': 'application/json' } })
//添加分数
export const addScore = (params) => post(`yearscore/save`, params, { headers: { 'Content-Type': 'application/json' } })

//========================>可视化页面API
//学校总数
export const allSchoolCount = () => get('/count/schoolCount')
//专业总数
export const allProfessinfoCount = () => get('count/professionCountRep')
//招生总数
export const allTotalPlan = () => get('count/allTotalPlan')
//民办院校数量
export const privateSchoolCount = () => get('count/privateSchoolCount')
//公办院校数量
export const publicSchoolCount = () => get('count/publicSchoolCount')
//民办招生数量
export const sumPrivateProfession = () => get('count/sumPrivateProfession')
//公办招生数量
export const sumPublicProfession = () => get('count/sumPublicProfession')
//各类专业招生数量
export const CountOfMajorsByType = () => get('count/getCountOfMajorsByType')

// =======================> 校长信箱 API

//获取所有信件
export const getAllLetter = (params) => post('letter/allLetter', params, { headers: { 'Content-Type': 'application/json' } })
//删除信箱信息
export const deleteLetter = (params) => post(`letter/delete`, params, { headers: { 'Content-Type': 'application/json' } })



//========================> 公告API
export const getNotice = () => post('notice/getNotice', params, { headers: { 'Content-Type': 'application/json' } })
//修改公告
export const updateNotice = (params) => post(`notice/addOrUpdate`, params, { headers: { 'Content-Type': 'application/json' } })
