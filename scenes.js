const Scene = require('telegraf/scenes/base')
const fs = require("fs")

class Users {
    constructor(id, name, age, sex, height, weight, activity) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.height = height;
        this.weight = weight;
        this.activity = activity;
    }
}

class tempData {
    constructor(id, water, time) {
        this.id = id
        this.water = water
        this.time = time
    }
}

function checkUser(id) {
    let data

    data = fs.readFileSync("db.txt", "utf8")
    if (data.includes(`"id":${id}`)) {
        let str = data.slice(data.indexOf(`"id":${user_id_start}`) - 1, data.indexOf('\n', data.indexOf(`"id":${user_id_start}`)))
        let currUser = JSON.parse(str)
        return currUser
    }
    return 0
}

let user = new Users()
let usersTempData = new tempData()
let user_id_start
let water_message_id



class SceneGenerator {
    GenCheckerScene() {
        const checker = new Scene('checker')
        checker.enter(async (ctx) => {
            user_id_start = ctx.message.from.id
            let user = checkUser(ctx.message.from.id)
            if (user) {
                await ctx.reply(`Здравствуйте, ${user.name}. Рады возвращению!`)
                await ctx.scene.enter('mainMenu')
            } else {
                await ctx.scene.enter('hello')
            }
        })
        return checker
    }

    //======================================================\\ ПЕРВОНАЧАЛЬНОЕ ПРИВЕТСТВИЕ //======================================================\\

    GenHelloScene() {
        const hello = new Scene('hello')
        hello.enter(async (ctx) => {
            await ctx.reply('Здравствуйте. Давайте познакомимся. Напишите мне, как Вас зовут?')
        })
        hello.on('text', async (ctx) => {
            let user_name = ctx.message.text

            user.id = ctx.message.from.id
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
            user.sex = 'Мужчина'

            await ctx.scene.enter('age')
        })
        sex.action('female', async ctx => {
            ctx.deleteMessage()
            user.sex = 'Женщина'

            await ctx.scene.enter('age')
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

            if (user.id === user_id)
                user.age = String(user_age)
            if (user_age && user_age > 0) {
                await ctx.scene.enter('activity')
            } else {
                await ctx.reply('Меня не проведешь! Напиши пожалуйста возраст цифрами и больше нуля')
                await ctx.scene.reenter()
            }
        })
        age.on('message', (ctx) => ctx.reply('Давай лучше возраст'))
        return age
    }

    GenActivityScene () {
        const activity = new Scene('activity')
        activity.enter(async (ctx) => {
            await ctx.reply('И последнее: как часто Вы занимаетесь спортом', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: 'У меня сидячая работа и нет физических нагрузок', callback_data: '1.2'}
                        ],
                        [
                            {text: 'Я совершаю небольшие пробежки или делаю лёгкую гимнастику 1 – 3 раза в неделю', callback_data: '1.375'}
                        ],
                        [
                            {text: 'Я занимаюсь спортом со средними нагрузками 3 – 5 раз в неделю', callback_data: '1.55'}
                        ],
                        [
                            {text: 'Я полноценно тренируюсь 6 – 7 раз в неделю', callback_data: '1.725'}
                        ],
                        [
                            {text: 'Моя работа связана с физическим трудом. Я тренируюсь каждый день по 2 раза, включая силоввые упражнения', callback_data: '1.9'}
                        ]
                    ]
                }
            })
        })
        activity.action('1.2', async ctx => {
            ctx.deleteMessage()
            user.activity = '1.2'

            await ctx.scene.enter('height')
        })
        activity.action('1.375', async ctx => {
            ctx.deleteMessage()
            user.activity = '1.375'

            await ctx.scene.enter('height')
        })
        activity.action('1.55', async ctx => {
            ctx.deleteMessage()
            user.activity = '1.55'

            await ctx.scene.enter('height')
        })
        activity.action('1.725', async ctx => {
            ctx.deleteMessage()
            user.activity = '1.725'

            await ctx.scene.enter('height')
        })
        activity.action('1.9', async ctx => {
            ctx.deleteMessage()
            user.activity = '1.9'

            await ctx.scene.enter('height')
        })
        return activity
    }

    GenHeightScene () {
        const height = new Scene('height')
        height.enter(async (ctx) => {
            await ctx.reply('Спасибо. А какой у Вас рост?')
        })
        height.on('text', async (ctx) => {
            let user_height = Number(ctx.message.text)
            let user_id = ctx.message.from.id

            if (user.id === user_id)
                user.height = String(user_height)
            if (user_height && user_height > 0) {
                await ctx.scene.enter('weight')
            } else {
                await ctx.reply('Меня не проведешь! Напиши пожалуйста возраст цифрами и больше нуля')
                await ctx.scene.reenter()
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
            if (user.id === user_id)
                user.weight = String(user_weight)
            if (user_weight && user_weight > 0) {
                await ctx.scene.enter('inTotal')
            } else {
                await ctx.reply('Меня не проведешь! Напиши пожалуйста возраст цифрами и больше нуля')
                await ctx.scene.reenter()
            }
        })
        weight.on('message', (ctx) => ctx.reply('Давай лучше вес'))
        return weight
    }



    GenInTotalScene () {
        const inTotal = new Scene('inTotal')
        inTotal.enter(async (ctx) => {
            let user_id = ctx.message.from.id
            if (user.id === user_id && user_id === user_id_start){
                await ctx.reply(`Спасибо за Ваши ответы, ${user.name}! Итак, Вы ${user.sex} и Вам ${user.age} лет. Ваш рост ${user.height}, а весите Вы ${user.weight} кг. Всё верно?`, {
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

                // buttons_clarify
                inTotal.action('ok', async ctx => {
                    ctx.deleteMessage()
                    fs.appendFileSync("db.txt", JSON.stringify(user) + "\n ------- \n")
                    await ctx.reply(user)
                    console.log(user)
                    await ctx.scene.enter('mainMenu')
                })

                inTotal.action('needToEdit', async ctx => {
                    ctx.deleteMessage()
                    await ctx.scene.enter('hello')
                })
            } else {
                await ctx.reply('Что-то пошло не так. Мы уведомим Вас, когда можно будет попробовать снова.')
                //todo Реализовать уведомление!
            }
        })
        return inTotal
    }

    //======================================================\\ ЗНАКОМСТВО ЗАВЕРШЕНО //======================================================\\
    GenMainMenuScene () {
        const mainMenu = new Scene('mainMenu')
        mainMenu.enter(async (ctx) => {
            // await ctx.reply('Это главное меню.')
            await ctx.reply(`Основное меню:`, {
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

            // water_message_id = (await ctx.reply('Сегодня Вы выпили $ стаканов')).message_id
            await ctx.scene.enter('water')
        })
        mainMenu.action('sleep', async ctx => {
            ctx.deleteMessage()
            await ctx.scene.enter('sleep')
        })
        mainMenu.action('meals', async ctx => {
            ctx.deleteMessage()
            await ctx.scene.enter('meals')
        })
        mainMenu.action('sport', async ctx => {
            ctx.deleteMessage()
            await ctx.scene.enter('sport')
        })
        mainMenu.action('stress', async ctx => {
            ctx.deleteMessage()
            await ctx.scene.enter('stress')
        })
        return mainMenu
    }

    GenWaterScene () {
        const water = new Scene('water')
        water.enter(async (ctx) => {
            let data = fs.readFileSync("db_temp_values.txt", "utf8");
            if (data.includes(`"id":${ctx.callbackQuery.from.id}`)) {
                let str = data.slice(data.indexOf(`"id":${ctx.callbackQuery.from.id}`) - 1, data.indexOf('\n', data.indexOf(`"id":${ctx.callbackQuery.from.id}`)))
                usersTempData = JSON.parse(str)
            }

            await ctx.reply(`Сегодня Вы выпили ${data ? usersTempData.water : "0"}`, {
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
            usersTempData.id = ctx.callbackQuery.from.id
            await ctx.deleteMessage()
            let data = fs.readFileSync("db_temp_values.txt", "utf8");
            if (data.includes(`"id":${ctx.callbackQuery.from.id}`)) {
                let str = data.slice(data.indexOf(`"id":${ctx.callbackQuery.from.id}`) - 1, data.indexOf('\n', data.indexOf(`"id":${ctx.callbackQuery.from.id}`)))
                usersTempData = JSON.parse(str)
                let formerDate = usersTempData.time.slice(0, 2)
                let formerMonth = usersTempData.time.slice(3, 5)
                let formerYear = usersTempData.time.slice(6, 10)
                console.log(formerYear)
                usersTempData.water += 1
                let now = new Date();
                if (formerDate !== now.getDate().toString() || formerMonth !== now.getMonth().toString() || formerYear !== now.getFullYear().toString()) {
                    fs.writeFileSync("db_temp_values.txt", "")
                }
                let data2 = fs.readFileSync("db_temp_values.txt", "utf8")

                usersTempData.time = now.getDate() + "-" + now.getMonth() + "-" + now.getFullYear()
                data2 = data2.replace(`{"id":${ctx.callbackQuery.from.id},"water":${usersTempData.water - 1},"time":"${formerDate}-${formerMonth}-${formerYear}"}\n ------- \n`, '')
                fs.writeFileSync("db_temp_values.txt", JSON.stringify(usersTempData) + "\n ------- \n" + data2)
                await ctx.scene.enter('water')
            } else {
                usersTempData.water = 1
                let now = new Date();
                usersTempData.time = now.getDate() + "-" + now.getMonth() + "-" + now.getFullYear()
                let value = JSON.stringify(usersTempData) + "\n ------- \n"
                fs.appendFileSync("db_temp_values.txt", value)
                await ctx.scene.enter('water')
            }
        })

        water.action('minus', async ctx => {
            usersTempData.id = ctx.callbackQuery.from.id
            ctx.deleteMessage(water_message_id)
            let data = fs.readFileSync("db_temp_values.txt", "utf8");
            if (data.includes(`"id":${ctx.callbackQuery.from.id}`)) {
                let str = data.slice(data.indexOf(`"id":${ctx.callbackQuery.from.id}`) - 1, data.indexOf('\n', data.indexOf(`"id":${ctx.callbackQuery.from.id}`)))
                usersTempData = JSON.parse(str)
                let formerDate = usersTempData.time.slice(0, 2)
                let formerMonth = usersTempData.time.slice(3, 5)
                let formerYear = usersTempData.time.slice(6, 10)

                if (usersTempData.water >= 1) {
                    usersTempData.water -= 1
                    let now = new Date();
                    if (formerDate != now.getDate().toString() || formerMonth != now.getMonth().toString() || formerYear != now.getFullYear().toString()) {
                        fs.writeFileSync("db_temp_values.txt", "")
                    }

                    let data2 = fs.readFileSync("db_temp_values.txt", "utf8")
                    usersTempData.time = now.getDate() + "-" + now.getMonth() + "-" + now.getFullYear()
                    data2 = data2.replace(`{"id":${ctx.callbackQuery.from.id},"water":${usersTempData.water + 1},"time":"${formerDate}-${formerMonth}-${formerYear}"}\n ------- \n`, '')
                    fs.writeFileSync("db_temp_values.txt", JSON.stringify(usersTempData) + "\n ------- \n" + data2)
                    await ctx.scene.enter('water')
                }
            }
        })

        water.action('back', async ctx => {
            ctx.deleteMessage()
            await ctx.scene.enter('mainMenu')
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
            await ctx.scene.enter('mainMenu')
        })
        return sleep
    }

    GenMealsScene () {
        // TODO: написать, что всё это с 16 лет работает, снять с себя отвественность

        const meals = new Scene('meals')

        meals.enter(async (ctx) => {
            let user = checkUser(ctx.callbackQuery.from.id)
            if (user) {
                let calories, protein, fats, carbohydrates
                if (user.sex === 'Женщина') {
                    calories = ((10 * parseInt(user.weight)) + (6.25 * parseInt(user.height)) - (5 * parseInt(user.age)) - 161) * parseFloat(user.activity)
                } else {
                    calories = (10 * parseInt(user.weight) + 6.25 * parseInt(user.height) - 5 * parseInt(user.age) + 5) * parseFloat(user.activity)
                }

                if (user.activity === "1.2") {
                    protein = parseInt(user.weight)
                    fats = parseInt(user.weight) * 0.9
                    carbohydrates = parseInt(user.weight) * 4
                } else if (user.activity === "1.375" || user.activity === "1.55") {
                    protein = parseInt(user.weight) * 1.2
                    fats = parseInt(user.weight) * 1.2
                    console.error(user.weight)
                    carbohydrates = parseInt(user.weight) * 6
                } else {
                    protein = parseInt(user.weight) * 2
                    fats = parseInt(user.weight) * 1.5
                    carbohydrates = parseInt(user.weight) * 8.5
                }

                console.error(user.weight)
                await ctx.reply(`Калории для Вас: ${calories}, белки: ${protein}, жиры: ${fats}, углеводы: ${carbohydrates}`, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: 'Назад в меню', callback_data: 'back'}
                            ]
                        ]
                    }
                })
            }
        })
        meals.action('back', async ctx => {
            ctx.deleteMessage()
            await ctx.scene.enter('mainMenu')
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
            await ctx.scene.enter('mainMenu')
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
            await ctx.scene.enter('mainMenu')
        })
        return stress
    }
}

module.exports = SceneGenerator