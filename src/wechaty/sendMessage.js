// import { getChatGPTReply as getReply } from '../chatgpt/index.js'
import { getOpenAiReply as getReply } from '../openai/index.js'

/**
 * 默认消息发送
 * @param msg
 * @param bot
 * @returns {Promise<void>}
 */
export async function defaultMessage(msg, bot) {
  const content = msg.text() // 消息内容
  const room = msg.room() // 是否是群消息
  const isText = msg.type() === bot.Message.Type.Text // 消息类型是否为文本
  const isBotSelf = msg.self() // 是否是机器人自己

  if (isText && !isBotSelf) {
    console.log('『', content, '』消息延迟时间：', msg.age())
    if (msg.age() > 300) return
    try {
      if (room) {
        const needReply = content.startsWith('?') || content.startsWith('？')
        const trimed = content.substr(1)
        if (needReply && trimed) {
          await room.say('正在咨询gpt')
          await room.say(await getReply(trimed))
        }
      }
      else {
        const contact = msg.from() // 发消息人
        await contact.say('正在咨询gpt')
        await contact.say(await getReply(content))
      }
    } catch (e) {
      console.error(e)
    }
  }
}