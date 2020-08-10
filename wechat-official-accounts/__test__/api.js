const request = require('request-promise'),
    base = 'https://service-qvh1io0x-1256233278.bj.apigw.tencentcs.com/test/',
    api = {
        accessToken: base + 'token?grant_type=client_credential',
        // 临时素材相关接口
        temporary: {
            upload: base + 'media/upload?',
            fetch: base + 'media/get?',
            // 提交语音
            addVoice: base + 'media/voice/addvoicetorecofortext?',
            // 获取语音识别结果(请注意，提交语音之后10s内调用这个接口)
            queryVoice: base + 'media/voice/queryrecoresultfortext?',
            // 微信翻译
            translateVoice: base + 'media/voice/translatecontent?'
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

var expect = require('chai').expect;

describe('API TEST', () => {
    describe('#凭证', () => {

        it('-fetchAccessToken', () => {
            return request
                .get(base + 'fetchAccessToken')
                .then((res, err) => {
                    expect(res).to.be.an('object');
                });
        });
        it('-fetchTicket', () => {
            return request
                .get(base + 'fetchTicket')
                .then((res, err) => {
                    expect(res).to.be.an('object');
                });
        });

    });
    describe('#素材相关', () => {

        it('-新增素材', () => {
            const params = {
                type: 'image',
                material: 'http://www.dxbei.com/uploads/allimg/140610/3-140610093507-50.jpg',
                permanent: false // 永久素材或临时素材
            }
            return request
                .get(base + 'uploadMaterial', params)
                .then((res, err) => {
                    expect(res).to.be.an('object');

                });
        });

        it('-获取素材', () => {
            const params = {
                mediaId: '',
                type: 'image',
                permanent: false // 永久素材或临时素材
            }
            return request
                .get(base + 'fetchMaterial', params)
                .then((res, err) => {
                    expect(res).to.be.an('object');

                });
        });

        it('-获取素材的数量（永久素材）', () => {
            return request
                .get(base + 'countMaterial')
                .then((res, err) => {
                    console.log(res)
                    expect(res).to.be.an('object');

                });
        });

    });
});