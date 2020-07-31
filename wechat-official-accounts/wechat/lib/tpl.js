const ejs = require('ejs')
/**
 * 模板(给用户返回用的)
 * @type {[xml]}
 * @description
 * 		toUserName 接收人
 * 		fromUserName 发送人
 * 		createTime 发送时间
 * 		content 内容
 *   	msgType 消息类型（ text文本，image图片，voice语音，video视频，music音乐，news新闻 图文）
 */
const tpl = `
  <xml>
    <ToUserName><![CDATA[<%= toUserName %>]]></ToUserName>
    <FromUserName><![CDATA[<%= fromUserName %>]]></FromUserName>
    <CreateTime><%= createTime %></CreateTime>
    <MsgType><![CDATA[<%= msgType %>]]></MsgType>
    <% if (msgType ==='text') { %>
      <Content><![CDATA[<%- content %>]]></Content>
    <% } else if (msgType === 'image') { %>
      <Image>
      <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
      </Image>
    <% } else if (msgType === 'voice') { %>
      <Voice>
        <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
      </Voice>
    <% } else if (msgType === 'video') { %>
      <Video>
        <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
        <Title><![CDATA[<%= content.title %>]]></Title>
        <Description><![CDATA[<%= content.description %>]]></Description>
      </Video>
    <% } else if (msgType === 'music') { %>
      <Music>
        <Title><![CDATA[<%= content.title %>]]></Title>
        <Description><![CDATA[<%= content.description %>]]></Description>
        <MusicUrl><![CDATA[<%= content.musicUrl %>]]></MusicUrl>
        <HQMusicUrl><![CDATA[<%= content.hqMusicUrl %>]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[<%= content.thumbMediaId %>]]></ThumbMediaId>
      </Music>
    <% } else if (msgType === 'news') { %>
      <ArticleCount><%= content.length %></ArticleCount>
      <Articles>
        <% content.forEach(function(item) { %>
          <item>
            <Title><![CDATA[<%= item.title %>]]></Title>
            <Description><![CDATA[<%= item.description %>]]></Description>
            <PicUrl><![CDATA[<%= item.picUrl %>]]></PicUrl>
            <Url><![CDATA[<%= item.url %>]]></Url>
          </item>
        <% }) %>
      </Articles>
    <% } %>
  </xml>
`

const compiled = ejs.compile(tpl)

module.exports =  compiled
