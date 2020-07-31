const tencentcloud = require("tencentcloud-sdk-nodejs");

/**
 * 封装腾讯云 SDK
 */
module.exports = class TencentCloudPkg {
    /**
     * 
     * @param {String} secretId 秘钥id
     * @param {String} secretKey 秘钥key
     */
    constructor(secretId = process.env.secretId, secretKey =  process.env.secretKey) {
        const Credential = tencentcloud.common.Credential;
        // 实例化一个认证对象，入参需要传入腾讯云账户 secretId,secretKey
        this.cred = new Credential(secretId, secretKey);
    }

    /**
     * 创建 http 请求
     * @param {String} endpoint http 接口类型 ，例如 "ocr.tencentcloudapi.com"，详见： https://cloud.tencent.com/document/product/865/35464
     * @param {String} addr 请求地址 详见：https://cloud.tencent.com/document/product/865/35465#.E5.9C.B0.E5.9F.9F.E5.88.97.E8.A1.A8
     */
    createHttpRquest (endpoint, addr = "ap-beijing",) {
        const HttpProfile = tencentcloud.common.HttpProfile;
        const ClientProfile = tencentcloud.common.ClientProfile;

        // http资料
        // 实例化一个http选项，可选的，没有特殊需求可以跳过。
        let httpProfile = new HttpProfile();
        httpProfile.endpoint = endpoint + ".tencentcloudapi.com";

        // 客户资料
        // 实例化一个client选项，可选的，没有特殊需求可以跳过。
        this.clientProfile = new ClientProfile();
        this.clientProfile.httpProfile = httpProfile;

        this.addr = addr
    }
    /**
     * 图片处理相关接口
     * @test https://console.cloud.tencent.com/api/explorer?Product=ocr&Version=2018-11-19&Action=BankCardOCR
     * 
     * @param {String} api 接口名 
     * 
     * - BankCardOCR	银行卡识别
     * - BizLicenseOCR	营业执照识别
     * - BusinessCardOCR	名片识别
     * - ClassifyDetectOCR	智能卡证分类
     * - EnterpriseLicenseOCR	企业证照识别
     * - EstateCertOCR	不动产权证识别
     * - HKIDCardOCR	中国香港身份证识别
     * - HmtResidentPermitOCR	港澳台居住证识别
     * - IDCardOCR	身份证识别
     * - InstitutionOCR	事业单位法人证书识别
     * - MLIDCardOCR	马来西亚身份证识别
     * - MLIDPassportOCR	护照识别（港澳台地区及境外护照）
     * - MainlandPermitOCR	港澳台来往内地通行证识别
     * - OrgCodeCertOCR	组织机构代码证识别
     * - PassportOCR	护照识别（中国大陆地区护照）
     * - PermitOCR	港澳台通行证识别
     * - PropOwnerCertOCR	房产证识别
     * - ResidenceBookletOCR	户口本识别
     * - 等 ……  ，详见： https://cloud.tencent.com/document/product/866/33515
     * 
     * @param {Object} params json参数
     */
    getOcr (api,params) {
        return new Promise((resolve, reject) => {
            this.createHttpRquest('ocr')
            // 导入对应产品模块的 client models
            const models = tencentcloud.ocr.v20181119.Models;
            const OcrClient = tencentcloud.ocr.v20181119.Client;
            // 实例化一个请求对象 client
            const client = new OcrClient(this.cred, this.addr, this.clientProfile);

            // 实例化一个请求对象 models
            const req = new models[api + "Request"]();
            // 传入json参数
            req.from_json_string(JSON.stringify(params));

            // 通过 client 对象调用想要访问的接口，需要传入请求对象以及响应回调函数
            client[api](req, (err, res) => { resolve(res); reject(err) });
        })
    }


    /**
     * 图片处理相关接口
     * @test https://console.cloud.tencent.com/api/explorer?Product=tiia&Version=2019-05-29&Action=AssessQuality&SignVersion=
     * 
     * @param {String} api 接口名 
     * 
     * - CropImage 图片剪裁
     * - EnhanceImage 清晰度增强
     * - DetectDisgust 恶心检测
     * - DetectMisbehavior 不良行为识别
     * - DetectCelebrity 公众人物识别
     * - DetectLabel 图片标签
     * - DetectProduct 商品识别
     * - DetectProductBeta 商品识别 - 微信识物版
     * - RecognizeCar 车辆识别
     * - AssessQuality 图片质量评估
     * - 等 ……  ，详见： https://cloud.tencent.com/document/product/865/35462
     * 
     * @param {Object} params json参数
     */
    getTiia (api, params) {
        return new Promise((resolve, reject) => {
            this.createHttpRquest('tiia')

            // 导入对应产品模块的 client models
            const models = tencentcloud.tiia.v20190529.Models;
            const TiiaClient = tencentcloud.tiia.v20190529.Client;

            // 实例化一个请求对象 client
            const client = new TiiaClient(this.cred, this.addr, this.clientProfile);

            // 实例化一个请求对象 models
            let req = new models[api + "Request"]();
            // 传入json参数
            req.from_json_string(JSON.stringify(params));
            // 通过 client 对象调用想要访问的接口，需要传入请求对象以及响应回调函数
            client[api](req, (err, res) => { resolve(res); reject(err) });
        })
    }
}


/**
 * 调用封装后腾讯云接口
 */
// const tcPkg = new TencentCloudPkg()
// const params = { ImageUrl: 'http://p0.ifengimg.com/a/2018_50/50721ebd66c8b46_size177_w750_h1000.jpg' }

// // OCR

// tcPkg.getOcr("GeneralBasicOCR",params).then(res => {
//     console.log(res)
// }).catch(err => {
//     console.error(err)
// })

// tiia

// tcPkg.getTiia("DetectProduct", params).then(res => {
//     console.log(res.to_json_string())
// }).catch(err => {
//     console.error(err)
// })
