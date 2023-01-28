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
const activityScene = curScene.GenActivityScene()
const inTotalScene = curScene.GenInTotalScene()
// Main scenes
const mainMenuScene = curScene.GenMainMenuScene()
const waterScene = curScene.GenWaterScene()
const sleepScene = curScene.GenSleepScene()
const mealsScene = curScene.GenMealsScene()
const sportScene = curScene.GenSportScene()
const stressScene = curScene.GenStressScene()
const exerciseScene = curScene.GenExerciseScene()
const exercise2Scene = curScene.GenExercise2Scene()
const completedScene = curScene.GenCompletedScene()
const deleteDataScene = curScene.GenDeleteDataScene()


bot.use(Telegraf.log())

const stage = new Stage([checker, helloScene, sexScene, ageScene, heightScene, weightScene, activityScene, inTotalScene, mainMenuScene, waterScene, sleepScene, mealsScene, sportScene, stressScene, exerciseScene, exercise2Scene, completedScene, deleteDataScene])

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
    ctx.reply(now)
    // ctx.reply()
})

bot.command('info', async (ctx) => {
    ctx.scene.enter('deleteData')
    // ctx.reply()
})

bot.command('stats', async (ctx) => {
    if (ctx.message.from.id == 767158800) {
        const fs = require("fs")
        let data = fs.readFileSync("db.txt", "utf-8")
        if (data) {
            ctx.reply(data)
        }
    }
})
bot.command('delete_users', async (ctx) => {
    if (ctx.message.from.id == 767158800) {
        ctx.replyWithHTML('Hey there! Напиши <code>я подтверждаю удаление всей бд</code>')
    }
    bot.on('message', (ctx) => {
        if (ctx.message.text == "я подтверждаю удаление всей бд" && ctx.message.from.id == 767158800) {
            const fs = require("fs")
            let data = fs.readFileSync("db.txt", "utf-8")
            if (data) {
                ctx.reply(data)
                fs.writeFileSync("db.txt", "")
                ctx.reply("Deleted.")
            } else {
                ctx.reply('Empty')
            }
        }
    })
    // ctx.reply(bot.message.from.id)
})
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))



try {
    bot.action('water', async ctx => {
        ctx.deleteMessage()

        // water_message_id = (await ctx.reply('Сегодня Вы выпили $ стаканов')).message_id
        await ctx.scene.enter('water')
    })
} catch (e) {
    ctx.reply('Ой, что-то пошло не так. Можно всё починить, нажав сюда: /start')
}
try {
    bot.action('sleep', async ctx => {
        ctx.deleteMessage()
        await ctx.scene.enter('sleep')
    })
} catch (e) {
    ctx.reply('Ой, что-то пошло не так. Можно всё починить, нажав сюда: /start')
}
try {
    bot.action('meals', async ctx => {
        ctx.deleteMessage()
        await ctx.scene.enter('meals')
    })
} catch (e) {
    ctx.reply('Ой, что-то пошло не так. Можно всё починить, нажав сюда: /start')
}
try {
    bot.action('sport', async ctx => {
        ctx.deleteMessage()
        await ctx.scene.enter('sport')
    })
} catch (e) {
    ctx.reply('Ой, что-то пошло не так. Можно всё починить, нажав сюда: /start')
}
try{
        bot.action('stress', async ctx => {
        ctx.deleteMessage()
        await ctx.scene.enter('stress')
    })
} catch (e) {
    ctx.reply('Ой, что-то пошло не так. Можно всё починить, нажав сюда: /start')
}
try {
    bot.action('back', async ctx => {
        ctx.deleteMessage()
        await ctx.scene.enter('mainMenu')
    })
} catch (e) {
    ctx.reply('Ой, что-то пошло не так. Можно всё починить, нажав сюда: /start')
}
try {
    bot.action('plus', async ctx => {
        ctx.reply('Ой, кажется эта кнопка была отправлена довольно давно. Рекомендуем Вам воспользоваться командой /start')
    })
} catch (e) {
    ctx.reply('Ой, что-то пошло не так. Можно всё починить, нажав сюда: /start')
}
try {
        bot.action('minus', async ctx => {
        ctx.reply('Рекомендуем Вам воспользоваться командой /start')
    })
} catch (e) {
    ctx.reply('Ой, что-то пошло не так. Можно всё починить, нажав сюда: /start')
}



bot.launch()



// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));