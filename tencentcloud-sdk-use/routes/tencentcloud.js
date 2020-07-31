const Router = require('koa-router'),
  path = require('path'),
  fs = require('fs'),
  TencentCloudPkg = require('../tencentcloud')

const router = new Router({
  prefix: '/tencentcloud',
});

// ocr API
router.post('/ocr', async (ctx) => {

  try {
    // console.log(ctx.request.files);

    const uploadsUrl = `https://${ctx.host}/uploads/`
    const params = JSON.parse(ctx.request.body.params)
    console.log("params:", params)
    const [fileUrl] = _handleFile(ctx.request.files.imgFiles, uploadsUrl)
    /**
     * 调用封装后腾讯云接口
     */
    const tcPkg = new TencentCloudPkg()

    const ocrResData = await tcPkg.getOcr(params.url||"GeneralBasicOCR", { ImageUrl: fileUrl })

    ctx.status = 200;
    ctx.body = {
      "code": 0,
      "message": "success",
      fileUrl,
      ocrResData
    };
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

router.get('/help', async (ctx) => {
  try {
    const result = {
      code: 0,
      name: "帮助文档接口"
    }
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

/**
 * 处理文件的方法（只在内部使用）
 * @param  {Object} files 文件对象
 * @return {Array}        文件路径数组
 */
function _handleFile (files, uploadsUrl) {
  let result = [];

  //单文件上传容错
  if (files && !Array.isArray(files)) {
    files = [files];
  }

  files && files.forEach(item => {
    const oldPath = item.path, // 文件路径
      fileName = item.name; // 原文件名称
    if (item.size > 0 && oldPath) {
      const oldFilePath = path.dirname(oldPath), // 存放文件的原始路径（/root/to/path）
        oldFileName = path.parse(oldPath).name, // 原始文件名（upload_556d23584b2705ce6f6cc5b49fa35b3d）没有后缀
        ext = path.extname(fileName), // 客户端上传来的文件的后缀
        srcFileName = path.basename(fileName, ext), // 客户端上传来的文件的文件名，不包括后缀
        newPath = path.join(oldFilePath, srcFileName + "_" + oldFileName + ext) // 生成新的文件路径
      // 重命名文件 （koa-body已经自动写入了文件）
      fs.renameSync(oldPath, newPath);


      result.push(uploadsUrl + path.join(srcFileName + "_" + oldFileName + ext));
    }
  });

  return result
}

module.exports = router;
