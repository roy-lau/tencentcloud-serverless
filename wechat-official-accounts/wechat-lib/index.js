const request = require('request-promise'),
    // formstream = require('formstream'),
    fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    { sign } = require('./util'),

    // 接口文档 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183
    base = 'https://api.weixin.qq.com/cgi-bin/',
    api = {
        accessToken: base + 'token?grant_type=client_credential',
        // 临时素材相关接口
        temporary: {
            upload: base + 'media/upload?',
            fetch: base + 'media/get?'
        },
        // 永久 素材相关的接口列表
        permanent: {
            upload: base + 'material/add_material?',
            uploadNews: base + 'material/add_news?',
            uploadNewsPic: base + 'media/uploadimg?',
            fetch: base + 'material/get_material?',
            del: base + 'material/del_material?',
            update: base + 'material/update_news?',
            count: base + 'material/get_materialcount?',
            batch: base + 'material/batchget_material?'
        },
        // 标签相关的接口列表
        tag: {
            create: base + 'tags/create?',
            fetch: base + 'tags/get?',
            update: base + 'tags/update?',
            del: base + 'tags/delete?',
            fetchUsers: base + 'user/tag/get?',
            batchTag: base + 'tags/members/batchtagging?',
            batchUnTag: base + 'tags/members/batchuntagging?',
            getTagList: base + 'tags/getidlist?'
        },
        // 用户相关的接口列表
        user: {
            remark: base + 'user/info/updateremark?',
            info: base + 'user/info?',
            batchInfo: base + 'user/info/batchget?',
            fetchUserList: base + 'user/get?',
            getBlackList: base + 'tags/members/getblacklist?',
            batchBlackUsers: base + 'tags/members/batchblacklist?',
            batchUnblackUsers: base + 'tags/members/batchunblacklist?'
        },
        // 菜单相关的接口
        menu: {
            create: base + 'menu/create?',
            get: base + 'menu/get?',
            del: base + 'menu/delete?',
            addCondition: base + 'menu/addconditional?',
            delCondition: base + 'menu/delconditional?',
            getInfo: base + 'get_current_selfmenu_info?'
        },
        ticket: {
            get: base + 'ticket/getticket?'
        }
    }


module.exports = class Wechat {
    constructor(opts) {
        this.opts = Object.assign({}, opts)
        this.appID = opts.appID
        this.appSecret = opts.appSecret
        this.getAccessToken = opts.getAccessToken
        this.saveAccessToken = opts.saveAccessToken
        this.getTicket = opts.getTicket
        this.saveTicket = opts.saveTicket

        this.fetchAccessToken()
    }

    /**
     * 简单的封装下 request
     * @param  {[type]} options 传入的对象
     * @return {[type]}         响应 || 错误信息
     */
    async request (options) {
        options = Object.assign({}, options, { json: true })

        try {
            const response = await request(options)

            if (response.errcode) return `\n错误code：${response.errcode} 内容: ${response.errmsg}`
            return response

        } catch (error) {
            console.error(error)
        }
    }

    /**
     * 获取 AccessToken
     * @return {[String]} access_token
     */
    async fetchAccessToken () {
        let data = await this.getAccessToken()
        // 验证 access_token 是否已存在
        // 如果不存在，则更新 access_token
        // 如果存在 保存 access_token 并并返回 access_token
        if (!this.isValidToken(data, 'access_token')) {
            data = await this._updateAccessToken()
        }

        console.log("剩余时间 >>", data.expires_in - Date.now())
        await this.saveAccessToken(data)

        return data
    }

    /**
     * 更新获取  access_token
     * @return {Object} [返回 access_token 对象 ]
     * @description {
     *      access_token: "",  // 微信服务器返回的 access_token
     *      expires_in: 1596425721280 // 过期时间
     *  }
     */
    async _updateAccessToken () {
        // 拼接微信获取 access_token 的 url
        const url = api.accessToken + '&appid=' + this.appID + '&secret=' + this.appSecret

        const data = await this.request({ url: url })

        // 当前时间
        const now = (new Date().getTime())
        // 更新 accessToken 的时间 = 当前时间 + 过期时间 - 2s
        // 注： 2s 考虑到网络延迟 等一些情况（提前2s刷新）
        const expiresIn = now + (data.expires_in - 20) * 1000

        // 更新 access_token 过期时间
        data.expires_in = expiresIn

        return data
    }
    /**
     * 获取 js-ticket（js票据）
     * @param {String} token 
     */
    async fetchTicket (token) {
        // 获取 Ticket
        let data = await this.getTicket()
        // 验证 Ticket
        if (!this.isValidToken(data, 'ticket')) {
            // 更新 Ticket
            data = await this._updateTicket(token)
        }
        // 保存 Ticket
        await this.saveTicket(data)

        return data
    }
    /**
     * 更新 js-ticket （js票据）
     * @param {String} token 
     */
    async _updateTicket (token) {
        const url = api.ticket.get + '&access_token=' + token + '&type=jsapi'

        let data = await this.request({ url: url })
        // 当前时间
        const now = (new Date().getTime())
        // 更新 accessToken 的时间 = 当前时间 + 过期时间 - 2s
        // 注： 2s 考虑到网络延迟 等一些情况（提前2s刷新）
        const expiresIn = now + (data.expires_in - 20) * 1000

        data.expires_in = expiresIn

        return data
    }

    /**
     * 验证 token ticket 是否过期
     * @param {Object} data 微信返回的 token 或 ticket 对象
     * @param {String} name 
     * @returns true 未过期，false 过期
     */
    isValidToken (data, name) {
        if (!data || !data[name] || !data.expires_in) return false

        const expiresIn = data.expires_in
        const now = (new Date().getTime())

        if (now <= expiresIn) return true
        else return false
    }

    async handle (operation, ...args) {
        const tokenData = await this.fetchAccessToken()
        console.info("wechat handle API---", operation)
        const options = this[operation](tokenData.access_token, ...args)
        const data = await this.request(options)

        return data
    }

    /************** 素材相关 *************/

    /**
     * 新增素材
     * @param {String} token 
     * @param {String} type 素材类型
     *      @description {
     *          图片（image）: 2M，支持bmp/png/jpeg/jpg/gif格式
                语音（voice）：2M，播放长度不超过60s，mp3/wma/wav/amr格式
                视频（video）：10MB，支持MP4格式
                缩略图（thumb）：64KB，支持JPG格式
                }
     * @param {Object} material  素材本身
     * @param {Boolean} permanent 永久素材或临时素材
     */
    uploadMaterial (token, type, material, permanent) {
        let form = {}
        let url = api.temporary.upload // 临时素材url（默认）

        if (permanent) {
            url = api.permanent.upload // 永久素材url 

            _.extend(form, permanent)
        }
        // 图片
        if (type === 'pic') {
            url = api.permanent.uploadNewsPic // 图片url
        }
        // 图文
        if (type === 'news') {
            url = api.permanent.uploadNews // 图文 url
            form = material
        } else {
            // 媒体素材（语音，视频等）
            form.media = fs.createReadStream(material)
        }

        let uploadUrl = url + 'access_token=' + token

        if (!permanent) {
            uploadUrl += '&type=' + type
        } else {
            if (type !== 'news') {
                form.access_token = token
            }
        }

        const options = {
            method: 'POST',
            url: uploadUrl,
            json: true
        }
        // 图文
        if (type === 'news') {
            options.body = form
            // 表单
        } else {
            options.formData = form
        }

        return options
    }
    /**
     * 获取素材
     * @param {String} token 凭证
     * @param {String} mediaId 素材id
     * @param {Sting} type 类型
     * @param {Boolean} permanent 永久素材或临时素材
     */
    fetchMaterial (token, mediaId, type, permanent) {
        let form = {}
        // 临时素材（默认）
        let fetchUrl = api.temporary.fetch

        // 永久素材
        if (permanent) {
            fetchUrl = api.permanent.fetch
        }

        let url = fetchUrl + 'access_token=' + token
        let options = { method: 'POST', url: url }

        // 永久素材 需要给微信上传的参数
        if (permanent) {
            form.media_id = mediaId
            form.access_token = token
            options.body = form
        } else {
            // 视频（video）素材 接口是 http协议
            if (type === 'video') {
                url = url.replace('https://', 'http://')
            }

            url += '&media_id=' + mediaId
        }

        return options
    }
    /**
     * 删除素材（只有永久素材需要删除，临时素材3天自动删除）
     * @param {Sting} token 凭证
     * @param {String} mediaId 素材id
     */
    deleteMaterial (token, mediaId) {
        const form = {
            media_id: mediaId
        }
        const url = api.permanent.del + 'access_token=' + token + '&media_id' + mediaId

        return { method: 'POST', url: url, body: form }
    }
    /**
     * 更新素材（永久素材）
     * @param {String} token 凭证
     * @param {String} mediaId 素材id
     * @param {Object} news 新的素材数据
     */
    updateMaterial (token, mediaId, news) {
        const form = {
            media_id: mediaId
        }

        _.extend(form, news)
        const url = api.permanent.update + 'access_token=' + token + '&media_id=' + mediaId

        return { method: 'POST', url: url, body: form }
    }
    /**
     * 获取素材的数量（永久素材）
     * @param {String} token 凭证
     */
    countMaterial (token) {
        const url = api.permanent.count + 'access_token=' + token

        return { method: 'POST', url: url }
    }
    /**
     * 获取素材列表(永久素材列表)
     * @description 
     *  1、获取永久素材的列表，也包含公众号在公众平台官网素材管理模块中新建的图文消息、语音、视频等素材 
     *  2、临时素材无法通过本接口获取 
     *  3、调用该接口需https协议
     *  ref https://developers.weixin.qq.com/doc/offiaccount/Asset_Management/Get_materials_list.html
     * 
     * @param {String} token 凭证
     * @param {Object} options {
     *  - type:	素材的类型，图片（image）、视频（video）、语音 （voice）、图文（news）,
     *  - offset:	从全部素材的该偏移位置开始返回，0表示从第一个素材 返回,
     *  - count:	返回素材的数量，取值在1到20之间,
     * }
     */
    batchMaterial (token, options = { type: 'image', offset: 0, count: 20 }) {

        const url = api.permanent.batch + 'access_token=' + token

        return { method: 'POST', url: url, body: options }
    }

    /************** 标签相关 *************/

    /**
     * 创建标签
     * @param {String} token 凭证
     * @param {String} name 标签名字
     */
    createTag (token, name) {
        const form = {
            tag: {
                name: name
            }
        }
        const url = api.tag.create + 'access_token=' + token

        return { method: 'POST', url: url, body: form }
    }
    /**
     * 获取标签列表
     * @param {String} token 凭证
     */
    fetchTags (token) {
        const url = api.tag.fetch + 'access_token=' + token

        // 不写 method 默认就是 get
        return { url: url }
    }
    /**
     * 更新标签
     * @param {String} token 
     * @param {String} tagId 要更新的标签id
     * @param {String} name 新标签名
     */
    updateTag (token, tagId, name) {
        const form = {
            tag: {
                id: tagId,
                name: name
            }
        }

        const url = api.tag.update + 'access_token=' + token

        return { method: 'POST', url: url, body: form }
    }
    /**
     * 删除标签
     * @param {String} token 
     * @param {String} tagId 要删除标签id
     */
    delTag (token, tagId) {
        const form = {
            tag: {
                id: tagId
            }
        }

        const url = api.tag.del + 'access_token=' + token

        return { method: 'POST', url: url, body: form }
    }
    /**
     * 获取标签下的用户列表
     * @param {String} token 
     * @param {String} tagId 标签id
     * @param {String} openId 第一个拉取的 OPENID，不填默认从头开始拉取
     */
    fetchTagUsers (token, tagId, openId) {
        const form = {
            tagid: tagId,
            next_openid: openId || ''
        }
        const url = api.tag.fetchUsers + 'access_token=' + token

        return { method: 'POST', url: url, body: form }
    }

    // unTag true|false
    /**
     * 批量为用户 打&&取消 标签
     * @param {String} token 
     * @param {Array} openIdList openId列表 
     * @param {String} tagId 标签id
     * @param {Boolean} unTag 打&&取消 标签
     */
    batchTag (token, openIdList, tagId, unTag) {
        const form = {
            openid_list: openIdList,
            tagid: tagId
        }
        // 打标签（默认）
        let url = api.tag.batchTag

        // 取消标签
        if (unTag) {
            url = api.tag.batchUnTag
        }

        url += 'access_token=' + token

        return { method: 'POST', url: url, body: form }
    }
    /**
     * 获取某个用户身上的标签列表
     * @param {String} token 
     * @param {String} openId 用户id
     */
    getTagList (token, openId) {
        const form = {
            openid: openId
        }
        const url = api.tag.getTagList + 'access_token=' + token

        return { method: 'POST', url: url, body: form }
    }

    /************** 用户相关 *************/

    /**
     * 修改用户的备注名（昵称）
     * @param {String} token 
     * @param {String} openId 用户id
     * @param {String} remark 备注名
     */
    remarkUser (token, openId, remark) {
        const form = {
            openid: openId,
            remark: remark
        }
        const url = api.user.remark + 'access_token=' + token

        return { method: 'POST', url: url, body: form }
    }
    /**
     * 获取用户的基本信息
     * @param {String} token 
     * @param {String} openId 用户id
     * @param {String} lang 语言（zh_CN 简体，zh_TW 繁体，en 英语）
     */
    getUserInfo (token, openId, lang) {
        const url = `${api.user.info}access_token=${token}&openid=${openId}&lang=${lang || 'zh_CN'}`

        return { url: url }
    }
    /**
     * 批量获取用户基本信息
     * @param {String} token 
     * @param {Array} userList 用户列表（openId，最多100个）
     */
    batchUsersInfo (token, userList) {
        const url = api.user.batchInfo + 'access_token=' + token
        const form = {
            user_list: userList
        }

        return { method: 'POST', url: url, body: form }
    }
    /**
     * 获取用户列表
     * @param {String} token 
     * @param {Array} openId 第一个拉取的OPENID，不填默认从头开始拉取
     */
    fetchUserList (token, openId) {
        const url = `${api.user.fetchUserList}access_token=${token}&next_openid=${openId || ''}`

        return { url: url }
    }
    /**
     * 获取公众号的黑名单列表
     * @param {String} token 
     * @param {String} openId 当 openid 为空时，默认从开头拉取。
     */
    getBlackList (token, openId) {
        const url = api.user.getBlackList + 'access_token=' + token,
            from = {
                begin_openid: openId || ''
            }

        return { method: 'POST', url: url, body: from }

    }
    /**
     * 拉黑用户(单个或多个)
     * @param {String} token 
     * @param {Array} openId 需要拉入黑名单的用户的openid，一次拉黑最多允许20个
     * @param {Boolean} unBlack ture 取消拉黑，false 拉黑
     */
    batchBlackUsers (token, openId, unBlack) {
        const from = {
            openid_list: openId
        }
        // 拉黑用户（默认）
        let url = api.user.batchBlackUsers
        // 取消拉黑
        if (unBlack) {
            url = api.user.batchUnBlackUsers
        }
        url += 'access_token=' + token


        return { method: 'POST', url: url, body: from }
    }

    /************** 菜单相关 *************/

    /**
     * 创建菜单
     * @param {String} token 
     * @param {Object} menu 
     */
    createMenu (token, menu) {
        const url = api.menu.create + 'access_token=' + token

        return { method: 'POST', url: url, body: menu }
    }
    /**
     * 获取菜单
     * @param {String} token 
     */
    getMenu (token) {
        const url = api.menu.get + 'access_token=' + token

        return { url: url }
    }
    /**
     * 删除菜单
     * @param {String} token 
     */
    delMenu (token) {
        const url = api.menu.del + 'access_token=' + token

        return { url: url }
    }
    /**
     * 获取菜单配置
     * @param {String} token 
     */
    getCurrentMenuInfo (token) {
        const url = api.menu.getInfo + 'access_token=' + token

        return { url: url }
    }
    /**
     * 新增个性化菜单
     * @param {String} token 
     * @param {Array} menu 菜单列表
     * @param {Object} rule 自定义菜单规则
     * @api https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1455782296
     */
    addConditionMenu (token, menu, rule) {
        const url = api.menu.addCondition + 'access_token=' + token
        const form = {
            button: menu,
            matchrule: rule
        }

        return { method: 'POST', url: url, body: form }
    }
    /**
     * 删除个性化菜单
     * @param {String} token 
     * @param {String} menuId 菜单id
     */
    delConditionMenu (token, menuId) {
        const url = api.menu.delCondition + 'access_token=' + token
        const form = {
            menuid: menuId
        }

        return { method: 'POST', url: url, body: form }
    }
    /**
     * 签名
     * @param {String} ticket 票据
     * @param {String} url 
     * @returns
     * {
            noncestr: 随机字符串,
            timestamp: 当前时间戳,
            signature: 加密值
        }
    */
    sign (ticket, url) {
        sign(ticket, url)
    }
}