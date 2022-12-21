const {Telegraf} = require('telegraf')
const {
    Extra,
    Markup,
    Stage,
    session
} = Telegraf

require('dotenv').config() //подключение модуля с токеном



// const config = require('config')
const bot = new Telegraf(process.env.BOT_TOKEN)
const SceneGenerator = require('./scenes')
const curScene = new SceneGenerator()
const checker = curScene.GenCheckerScene()
const helloScene = curScene.GenHelloScene()
const sexScene = curScene.GenSexScene()
const ageScene = curScene.GenAgeScene()
const heightScene = curScene.GenHeightScene()
const weightScene = curScene.GenWeightScene()
const inTotalScene = curScene.GenInTotalScene()
// Main scenes
const mainMenuScene = curScene.GenMainMenuScene()
const waterScene = curScene.GenWaterScene()
const sleepScene = curScene.GenSleepScene()
const mealsScene = curScene.GenMealsScene()
const sportScene = curScene.GenSportScene()
const stressScene = curScene.GenStressScene()


bot.use(Telegraf.log())

const stage = new Stage([checker, helloScene, sexScene, ageScene, heightScene, weightScene, inTotalScene, mainMenuScene, waterScene, sleepScene, mealsScene, sportScene, stressScene])

bot.use(session())
bot.use(stage.middleware())

bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.command('echo', (ctx) => ctx.reply('Echo'))
bot.command('start', async (ctx) => {
    ctx.scene.enter('checker')
})
bot.command('menu', async (ctx) => {
    ctx.scene.enter('mainMenu')
})
bot.command('time', async (ctx) => {
    let now = new Date();
    ctx.reply(now.getDate() + "-" + now.getMonth() + "-" + now.getFullYear())
    // ctx.reply()
})
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))




bot.launch()



// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));