const Scene = require('telegraf/scenes/base')
const fs = require("fs")
// let user_name, user_sex, user_age, user_height, user_weight, waterToday

let chats = {}

class Users {
    constructor(id, name, age, sex, height, weight) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.height = height;
        this.weight = weight;
    }
}

let user = new Users()

class SceneGenerator {
    //======================================================\\ ПЕРВОНАЧАЛЬНОЕ ПРИВЕТСТВИЕ //======================================================\\
    GenHelloScene() {

        const hello = new Scene('hello')
        hello.enter(async (ctx) => {
            await ctx.reply('Здравствуйте. Давайте познакомимся. Напишите мне, как Вас зовут?')
        })
        hello.on('text', async (ctx) => {
            let user_name = ctx.message.text
            // chats.id = ctx.message.from.id
            // chats.id.name = user_name
            let user_id = ctx.message.from.id
            user.id = user_id
            user.name = user_name
            if (user_name) {
                await ctx.reply(`Привет, ${user_name}`)
                await ctx.scene.enter('sex')
            } else {
                await ctx.reply('Я так и не понял, как тебя зовут')
                await ctx.scene.reenter()
            }
        })
        hello.on('message', (ctx) => ctx.reply('Это явно не твое имя'))
        return hello
    }

    GenSexScene () {
        const sex = new Scene('sex')
        sex.enter(async (ctx) => {
            await ctx.reply('Мне нужно задать Вам ещё несколько вопросов. Для начала, кто Вы?', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: 'Я мужчина', callback_data: 'male'}
                        ],
                        [
                            {text: 'Я женщина', callback_data: 'female'}
                        ]
                    ]
                }
            })
        })
        sex.action('male', async ctx => {
            ctx.deleteMessage()
            let user_sex = 'Мужчина'
            // chats[ctx.callback_query.from.id + 'sex'] = user_sex
            ctx.scene.enter('age')
        })
        sex.action('female', async ctx => {
            ctx.deleteMessage()
            let user_sex = 'Женщина'
            // chats[ctx.callback_query.from.id + 'sex'] = user_sex
            ctx.scene.enter('age')
        })
        return sex
    }

    GenAgeScene () {
        const age = new Scene('age')
        age.enter(async (ctx) => {
            await ctx.reply('Хорошо. Напишите пожалуйста, сколько Вам лет?')
        })
        age.on('text', async (ctx) => {
            let user_age = Number(ctx.message.text)
            let user_id = ctx.message.from.id

            if (user.id == user_id)
                user.age = user_age
            // else {
                // await ctx.reply('Что-то пошло не так. Мы уведомим Вас, когда можно будет попробовать снова')
                // ctx.scene.leave
            // }
            // chats.id = ctx.message.from.id
            // chats.age = user_age
            if (user_age && user_age > 0) {
                ctx.scene.enter('height')
            } else {
                await ctx.reply('Меня не проведешь! Напиши пожалуйста возраст цифрами и больше нуля')
                ctx.scene.reenter()
            }
        })
        age.on('message', (ctx) => ctx.reply('Давай лучше возраст'))
        return age
    }

    GenHeightScene () {
        const height = new Scene('height')
        height.enter(async (ctx) => {
            await ctx.reply('Спасибо. А какой у Вас рост?')
        })
        height.on('text', async (ctx) => {
            let user_height = Number(ctx.message.text)
            let user_id = ctx.message.from.id

            if (user.id == user_id)
                user.height = user_height
            // else {
            //     await ctx.reply('Что-то пошло не так. Мы уведомим Вас, когда можно будет попробовать снова')
            //     ctx.scene.leave()
            // }
            // chats.id = ctx.message.from.id
            // chats.height = user_height
            if (user_height && user_height > 0) {
                ctx.scene.enter('weight')
            } else {
                await ctx.reply('Меня не проведешь! Напиши пожалуйста возраст цифрами и больше нуля')
                ctx.scene.reenter()
            }
        })
        height.on('message', (ctx) => ctx.reply('Давай лучше рост'))
        return height
    }

    GenWeightScene () {
        const weight = new Scene('weight')
        weight.enter(async (ctx) => {
            await ctx.reply('Благодарю. Сколько Вы весите?')
        })
        weight.on('text', async (ctx) => {
            let user_weight = Number(ctx.message.text)

            let user_id = ctx.message.from.id
            if (user.id == user_id)
                user.weight = user_weight
            // else {
            //     await ctx.reply('Что-то пошло не так. Мы уведомим Вас, когда можно будет попробовать снова')
            //     ctx.scene.leave()
            // }
            // chats.id = ctx.message.from.id
            // chats.weight = user_weight
            if (user_weight && user_weight > 0) {
                ctx.scene.enter('inTotal')
            } else {
                await ctx.reply('Меня не проведешь! Напиши пожалуйста возраст цифрами и больше нуля')
                ctx.scene.reenter()
            }
        })
        weight.on('message', (ctx) => ctx.reply('Давай лучше вес'))
        return weight
    }

    GenInTotalScene () {
        const inTotal = new Scene('inTotal')
        inTotal.enter(async (ctx) => {
            await ctx.reply(`Спасибо за Ваши ответы, ${chats}! Итак, Вы ${chats} и Вам ${chats} лет. Ваш рост ${chats}, а весите Вы ${chats} кг. Всё верно?`, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: 'Всё верно 🚀', callback_data: 'ok'}
                        ],
                        [
                            {text: 'Нет, нужно исправить', callback_data: 'needToEdit'}
                        ]
                    ]
                }
            })
        })

        // buttons_clarify
        inTotal.action('ok', async ctx => {
            ctx.deleteMessage()
            fs.appendFileSync("db.txt", JSON.stringify(user) + "\n ------- \n")
            // fs.writeFileSync("db.txt", "-----------")
            await ctx.reply(user)
            console.log(user)
            ctx.scene.enter('mainMenu')
        })
        inTotal.action('needToEdit', async ctx => {
            ctx.deleteMessage()
            // TODO: Editing info
            ctx.scene.enter('editData')
        })
        return inTotal
    }

    //======================================================\\ ЗНАКОМСТВО ЗАВЕРШЕНО //======================================================\\
    GenMainMenuScene () {
        const mainMenu = new Scene('mainMenu')
        mainMenu.enter(async (ctx) => {
            // await ctx.reply('Это главное меню.')
            await ctx.reply(`Основное меню. Ниже текст, он будет скоро`, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: 'Вода', callback_data: 'water'},
                            {text: 'Сон', callback_data: 'sleep'}
                        ],
                        [
                            {text: 'Питание', callback_data: 'meals'}
                        ],
                        [
                            {text: 'Спорт', callback_data: 'sport'},
                            {text: 'Стресс-менеджмент', callback_data: 'stress'}
                        ]
                    ]
                }
            })
        })

        mainMenu.action('water', async ctx => {
            ctx.deleteMessage()
            ctx.scene.enter('water')
        })
        mainMenu.action('sleep', async ctx => {
            ctx.deleteMessage()
            ctx.scene.enter('sleep')
        })
        mainMenu.action('meals', async ctx => {
            ctx.deleteMessage()
            ctx.scene.enter('meals')
        })
        mainMenu.action('sport', async ctx => {
            ctx.deleteMessage()
            ctx.scene.enter('sport')
        })
        mainMenu.action('stress', async ctx => {
            ctx.deleteMessage()
            ctx.scene.enter('stress')
        })
        return mainMenu
    }

    GenWaterScene () {
        const water = new Scene('water')
        water.enter(async (ctx) => {
            await ctx.reply(`Сегодня Вы выпили $ стаканов`, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: '+', callback_data: 'plus'},
                            {text: '-', callback_data: 'minus'}
                        ],
                        [
                            {text: 'Узнать больше о пользе воды', callback_data: 'lmWater'}
                        ],
                        [
                            {text: 'Назад в меню', callback_data: 'back'}
                        ]
                    ]
                }
            })
        })

        water.action('plus', async ctx => {
            //todo waterToday += 1
            // ctx.editMessageText(chatId, messageId, `Сегодня Вы выпили ${waterToday} стаканов`)
        })

        water.action('back', async ctx => {
            ctx.deleteMessage()
            ctx.scene.enter('mainMenu')
        })
        return water
    }

    GenSleepScene () {
        const sleep = new Scene('sleep')
        sleep.enter(async (ctx) => {
            await ctx.reply('Сон', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: 'Назад в меню', callback_data: 'back'}
                        ]
                    ]
                }
            })
        })

        sleep.action('back', async ctx => {
            ctx.deleteMessage()
            ctx.scene.enter('mainMenu')
        })
        return sleep
    }

    GenMealsScene () {
        const meals = new Scene('meals')
        meals.enter(async (ctx) => {
            await ctx.reply('Питание', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: 'Назад в меню', callback_data: 'back'}
                        ]
                    ]
                }
            })
        })

        meals.action('back', async ctx => {
            ctx.deleteMessage()
            ctx.scene.enter('mainMenu')
        })
        return meals
    }

    GenSportScene () {
        const sport = new Scene('sport')
        sport.enter(async (ctx) => {
            await ctx.reply('Спорт', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: 'Назад в меню', callback_data: 'back'}
                        ]
                    ]
                }
            })
        })

        sport.action('back', async ctx => {
            ctx.deleteMessage()
            ctx.scene.enter('mainMenu')
        })
        return sport
    }

    GenStressScene () {
        const stress = new Scene('stress')
        stress.enter(async (ctx) => {
            await ctx.reply('Стресс', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: 'Назад в меню', callback_data: 'back'}
                        ]
                    ]
                }
            })
        })

        stress.action('back', async ctx => {
            ctx.deleteMessage()
            ctx.scene.enter('mainMenu')
        })
        return stress
    }

    GenEditDataScene () {
        const editData = new Scene('editData')
        editData.enter(async (ctx) => {
            await ctx.reply('Тут пока ничего нет!')
        })
        return editData
    }
}

module.exports = SceneGenerator
