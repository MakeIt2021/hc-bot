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
            let data

            data = fs.readFileSync("db.txt", "utf8");
            // console.log(data)
            if (data.includes(`"id":${user_id_start}`)) {
                let str = data.slice(data.indexOf(`"id":${user_id_start}`) - 1, data.indexOf('\n', data.indexOf(`"id":${user_id_start}`)))
                const user = JSON.parse(str)

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

            let user_id = ctx.message.from.id
            user_id_start = ctx.message.from.id

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
            user.sex = user_sex

            await ctx.scene.enter('age')
        })
        sex.action('female', async ctx => {
            ctx.deleteMessage()
            let user_sex = 'Женщина'
            user.sex = user_sex

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
            let user_activity = '1.2'
            user.activity = user_activity

            await ctx.scene.enter('height')
        })
        activity.action('1.375', async ctx => {
            ctx.deleteMessage()
            let user_activity = '1.375'
            user.activity = user_activity

            await ctx.scene.enter('height')
        })
        activity.action('1.55', async ctx => {
            ctx.deleteMessage()
            let user_activity = '1.55'
            user.activity = user_activity

            await ctx.scene.enter('height')
        })
        activity.action('1.725', async ctx => {
            ctx.deleteMessage()
            let user_activity = '1.725'
            user.activity = user_activity

            await ctx.scene.enter('height')
        })
        activity.action('1.9', async ctx => {
            ctx.deleteMessage()
            let user_activity = '1.9'
            user.activity = user_activity

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
            if (user.id === user_id && user_id === user_id_start) {
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
                await ctx.reply('Сейчас сервер испытывает некоторую нагрузку, поэтому начать пользоваться ботом прямо сейчас, к сожалению, не получится. Пожалуйста, попробуйте позже. Чтобы попробовать снова, воспользуйтесь командой /start')
                //todo Реализовать уведомление!
            }
        })
        return inTotal
    }

    //======================================================\\ ЗНАКОМСТВО ЗАВЕРШЕНО //======================================================\\
    GenMainMenuScene () {
        const mainMenu = new Scene('mainMenu')
        mainMenu.enter(async (ctx) => {//todo Посмотреть текст в основном меню
            await ctx.reply(`Мы проводим эти расчёты с использованием индекса массы тела — объективного коэффициента, описывающий связь между массой тела и ростом. Более подробно о расчётах Вы можете прочитать, отправив команду /about. Основное меню:`, {
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
            await ctx.scene.enter('stress')
        })
        return mainMenu
    }

    GenWaterScene () {
        const water = new Scene('water')
        water.enter(async (ctx) => {
            let user = checkUser(ctx.callbackQuery.from.id)
            let data = fs.readFileSync("db_temp_values.txt", "utf8");
            if (data.includes(`"id":${ctx.callbackQuery.from.id}`)) {
                let str = data.slice(data.indexOf(`"id":${ctx.callbackQuery.from.id}`) - 1, data.indexOf('\n', data.indexOf(`"id":${ctx.callbackQuery.from.id}`)))
                usersTempData = JSON.parse(str)
                let now = new Date()
                let formerDate = usersTempData.time.slice(0, 2)
                let formerMonth = usersTempData.time.slice(3, 5)
                let formerYear = usersTempData.time.slice(6, 10)

                let nowMonth = now.getMonth().toString()
                if (nowMonth.length === 1) {
                    nowMonth = '0' + nowMonth
                }
                if (formerDate !== now.getDate().toString() || formerMonth !== nowMonth || formerYear !== now.getFullYear().toString()) {
                    fs.writeFileSync("db_temp_values.txt", "")
                    data = fs.readFileSync("db_temp_values.txt", "utf8")
                }
            }
            let water_recommended = Math.round(30 * user.weight / 200)
            await ctx.reply(`Вам рекомендуется употреблять ${water_recommended} стаканов воды (в одном стакане около 200 мл) Сегодня Вы выпили ${data ? usersTempData.water : "0"}`, {
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

                if (now.getMonth().toString().length === 2) {
                    usersTempData.time = now.getDate() + "-" + now.getMonth() + "-" + now.getFullYear()
                } else {
                    usersTempData.time = now.getDate() + "-0" + now.getMonth() + "-" + now.getFullYear()
                }
                data2 = data2.replace(`{"id":${ctx.callbackQuery.from.id},"water":${usersTempData.water - 1},"time":"${formerDate}-${formerMonth}-${formerYear}"}\n ------- \n`, '')
                fs.writeFileSync("db_temp_values.txt", JSON.stringify(usersTempData) + "\n ------- \n" + data2)
                await ctx.scene.enter('water')
            } else {
                usersTempData.water = 1
                let now = new Date();
                console.log(now.getMonth().toString().length)
                if (now.getMonth().toString().length === 2) {
                    usersTempData.time = now.getDate() + "-" + now.getMonth() + "-" + now.getFullYear()
                } else {
                    usersTempData.time = now.getDate() + "-0" + now.getMonth() + "-" + now.getFullYear()
                }
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
                    if (now.getMonth().toString().length === 2) {
                        usersTempData.time = now.getDate() + "-" + now.getMonth() + "-" + now.getFullYear()
                    } else {
                        usersTempData.time = now.getDate() + "-0" + now.getMonth() + "-" + now.getFullYear()
                    }
                    data2 = data2.replace(`{"id":${ctx.callbackQuery.from.id},"water":${usersTempData.water + 1},"time":"${formerDate}-${formerMonth}-${formerYear}"}\n ------- \n`, '')
                    fs.writeFileSync("db_temp_values.txt", JSON.stringify(usersTempData) + "\n ------- \n" + data2)
                    await ctx.scene.enter('water')
                } else {
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
            await ctx.reply('Отход ко сну должен быть до 23:00, потому что выработка мелатонина (гормона сна) начинается уже в 00:00, а заканчивается в 04:00. Поесть надо последний раз за 3 часа до сна. Главное условие - абсолютная темнота (вытянутую руку не должно быть видно). Любой свет - враг мелатонина. человек должен спать 7-8 часов. Если сложно отходить ко сну. За 2 часа ', {
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
                let calories, protein, fats, carbohydrates, bmi, bmi_result
                bmi = user.weight / Math.pow(user.height / 100, 2)

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

                bmi = bmi.toFixed(2)
                calories = Math.round(calories)
                protein = Math.round(protein)
                fats = Math.round(fats)
                carbohydrates = Math.round(carbohydrates)

                let result = 'ошибка'

                if (bmi < 18.5) {
                    bmi_result = 'недостаточный вес'
                    result = 'Ваш ИМТ ~${bmi}, это может указывать на недостаток веса. Задайте себе вопрос, часто ли бывает, что Вы чувствуете себя уставшим? \n' +
                        '\n' +
                        'В случае утвердительного ответа, Вам действительно рекомендуется обратиться к врачу, ведь довольно часто, к сожалению, дефицит массы тела может говорить о тех или иных проблемах со здоровьем.\n' +
                        '\n' +
                        'Если Ваш ответ: "Нет, я нечасто без видимого повода чувствую себя уставшим, слабым", и Вы не жалуетесь на здоровье, обычно чувствуете себя бодрым, то возможно Вам не стоит беспокоиться, однако в идеале, стоит начать внимательнее прислушиваться к своему организму и в случае чего обратиться к врачу. Возможно будет также неплохо сделать биоимпедансометрию, сдать базовые анализы перед консультацией.\n' +
                        '\n' +
                        'Мы посчитали, что Вам рекомендуется употреблять ~${calories} калорий в сутки для поддержания веса.'
                } else if (18.5 <= bmi && bmi < 24.9) {
                    bmi_result = 'нормальный'
                    result = `Ваш ИМТ ~${bmi}. Это говорит о том, что у Вас нормальный вес, однако каждому человеку, даже если у него всё в порядке с весом важно соблюдать питьевой режим, заниматься спортом, а также контролировать время отхода ко сну и пробуждения. Также, всем необходимо уметь управлять уровнем стресса, ведь гормоны стресса могут приводить к снижению иммунитета и появлению других проблем со здоровьем.

Мы посчитали, что Вам рекомендуется употреблять ~${calories} калорий в сутки для поддержания Вашего веса.`
                } else if (25 <= bmi && bmi <= 29.9) {
                    bmi_result = 'чрезмерный вес'
                    result = `Ваш ИМТ ~${bmi}, это может указывать на наличие избыточной массы тела, предожирение. Это ещё не болезнь, но уже сигнал на то, что следует взять свой вес под контроль.\n` +
                        '\n' +
                        'Вам точно стоит начать внимательнее прислушиваться к своему организму и в случае чего обратиться к врачу. Возможно будет также неплохо сделать биоимпедансометрию, сдать базовые анализы перед консультацией.\n' +
                        '\n' +
                        'Чтобы улучшить качество жизни, мы бы посоветовали Вам чаще совершать прогулки на свежем воздухе, пользоваться лестницей вместо лифта, заняться танцами, плаванием, бегом, аэробикой, летом кататься на велосипеде, а зимой на лыжах. В разделе Спорт есть ещё подсказки.\n' +
                        '\n' +
                        `Мы посчитали, что Вам рекомендуется употреблять ~${calories} калорий в сутки. Это количество, необходимое для поддержания веса, а не его снижения. Построить план снижения веса может помочь квалифицированный специалист. `
                } else if (30 <= bmi && bmi <= 34.9) {
                    bmi_result = 'ожирение первой степени'
                    result = `Ваш ИМТ ~${bmi}, это похоже на ожирение I степени. Пожалуйста, обратите внимание на информацию о том, как мы считали, и к кому относится приведённая здесь информация, отправив команду /about. С увеличением степени ожирения увеличивается риск развития сопутствующих заболеваний – от высокого до чрезвычайно высокого.\n` +
                        '\n' +
                        `Мы бы рекомендовали Вам обратиться к врачу эндокринологу. Именно он может провести грамотное обследование и дать направления на возможные необходимые исследования. \n` +
                        '\n' +
                        `Лечение необходимо, т.к. часто из-за ожирения резко возрастают риски развития заболеваний сердечно-сосудистой, опорно-двигательной системы, некоторых онкологических заболеваний. Больше об этом можно узнать в статье всемирной организации здравоохранения.`
                } else if (35 <= bmi && bmi <= 39.9) {
                    bmi_result = 'ожирение второй степени'
                    result = `Ваш ИМТ ~${bmi}, это похоже на ожирение II степени. Пожалуйста, обратите внимание на информацию о том, как мы считали, и к кому относится приведённая здесь информация, отправив команду /about. С увеличением степени ожирения увеличивается риск развития сопутствующих заболеваний – от высокого до чрезвычайно высокого.

Мы бы очень рекомендовали Вам обратиться к врачу эндокринологу. Именно он может провести грамотное обследование и дать направления на возможные необходимые исследования. 

Лечение необходимо, т.к. часто из-за ожирения резко возрастают риски развития заболеваний сердечно-сосудистой, опорно-двигательной системы, некоторых онкологических заболеваний. Больше об этом можно узнать в статье всемирной организации здравоохранения.`
                } else if (bmi >= 40) {
                    bmi_result = 'ожирение третьей степени'
                    result = `Ваш ИМТ ~${bmi}, это похоже на ожирение III степени (максимальная степень ожирения). Пожалуйста, обратите внимание на информацию о том, как мы считали, и к кому относится приведённая здесь информация, отправив команду /about. С увеличением степени ожирения увеличивается риск развития сопутствующих заболеваний – от высокого до чрезвычайно высокого.

Мы бы очень рекомендовали Вам обратиться к врачу эндокринологу. Именно он может провести грамотное обследование и дать направления на возможные необходимые исследования. 

Лечение необходимо, т.к. часто из-за ожирения резко возрастают риски развития заболеваний сердечно-сосудистой, опорно-двигательной системы, некоторых онкологических заболеваний. Больше об этом можно узнать в статье всемирной организации здравоохранения.`
                }

                console.error(user.weight)
                await ctx.reply(`${result}`, {
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
            await ctx.reply('Спорт нужен каждому. Однако, каждому свой. Это зависит от ', {
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
                            {text: 'Простое дыхание', callback_data: 'exercise'},
                            {text: 'Усложнённое', callback_data: 'exercise2'},
                        ],
                        [
                            {text: 'Назад в меню', callback_data: 'back'}
                        ]
                    ]
                }
            })
        })

        stress.action('exercise', async ctx => {
            ctx.deleteMessage()
            await ctx.scene.enter('exercise')
        })

        stress.action('exercise2', async ctx => {
            ctx.deleteMessage()
            await ctx.scene.enter('exercise2')
        })

        stress.action('back', async ctx => {
            ctx.deleteMessage()
            await ctx.scene.enter('mainMenu')
        })
        return stress
    }

    //todo взять слова из приложения Breath

    GenExerciseScene() {
        const exercise = new Scene('exercise')
        exercise.enter(async (ctx) => {
            function inhale() {
                ctx.reply('Делаем глубокий вдох, вместе считая до четырёх.')
            }
            function s1() {
                ctx.reply('1...')
            }
            function s2() {
                ctx.reply('2...')
            }
            function s3() {
                ctx.reply('3...')
            }
            function s4() {
                ctx.reply('4...')
            }
            function s5() {
                ctx.reply('5...')
            }
            function s6() {
                ctx.reply('6...')
            }
            function s7() {
                ctx.reply('7...')
            }
            function s8() {
                ctx.reply('8')
            }
            function exhale() {
                ctx.reply('Теперь медленный выдох. Считаем до 6')
            }
            function stop() {
                ctx.scene.enter('completed')
            }
            await ctx.reply('Это простое упражнение на дыхание.')
            setTimeout(inhale, 3000)
            setTimeout(s1, 5000)
            setTimeout(s2, 6000)
            setTimeout(s3, 7000)
            setTimeout(s4, 8000)
            setTimeout(exhale, 10000)
            setTimeout(s1, 11000)
            setTimeout(s2, 12000)
            setTimeout(s3, 13000)
            setTimeout(s4, 14000)
            setTimeout(s5, 15000)
            setTimeout(s6, 16000)
            setTimeout(stop, 18000)
        })
        return exercise
    }

    GenExercise2Scene() {
        const exercise2 = new Scene('exercise2')
        exercise2.enter(async (ctx) => {
            function inhale() {
                ctx.reply('Делаем глубокий вдох, вместе считая до четырёх.')
            }
            function s1() {
                ctx.reply('1...')
            }
            function s2() {
                ctx.reply('2...')
            }
            function s3() {
                ctx.reply('3...')
            }
            function s4() {
                ctx.reply('4...')
            }
            function s5() {
                ctx.reply('5...')
            }
            function s6() {
                ctx.reply('6...')
            }
            function s7() {
                ctx.reply('7...')
            }
            function s8() {
                ctx.reply('8')
            }
            function hold() {
                ctx.reply('Задерживаем дыхание, вместе считая до 7')
            }
            function exhale() {
                ctx.reply('Теперь медленный выдох. Считаем до 8')
            }
            function stop() {
                ctx.scene.enter('completed')
            }
            await ctx.reply('Сядьте ровно, руки положите на колени. Приложите кончик своего языка к бугорку нёба возле верхних зубов.')
            setTimeout(inhale, 3000)
            setTimeout(s1, 5000)
            setTimeout(s2, 7000)
            setTimeout(s3, 9000)
            setTimeout(s4, 11000)
            setTimeout(hold, 12500)
            setTimeout(s1, 14000)
            setTimeout(s2, 15500)
            setTimeout(s3, 17000)
            setTimeout(s4, 18500)
            setTimeout(s5, 20000)
            setTimeout(s6, 21500)
            setTimeout(s7, 23000)
            setTimeout(exhale, 24000)
            setTimeout(s1, 25000)
            setTimeout(s2, 26500)
            setTimeout(s3, 28000)
            setTimeout(s4, 29500)
            setTimeout(s5, 31000)
            setTimeout(s6, 32500)
            setTimeout(s7, 34000)
            setTimeout(s8, 35500)
            setTimeout(stop, 37000)
        })
        return exercise2
    }

    GenCompletedScene() {
        const completed = new Scene('completed')
        completed.enter(async (ctx) => {
            await ctx.reply('Упражнение завершено. Если хотите повторить, просто нажмите кнопку ниже.', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: 'Повторить', callback_data: 'exercise'},
                            {text: 'Назад в меню', callback_data: 'back'}
                        ]
                    ]
                }
            })
        })
        completed.action('exercise', async ctx => {
            ctx.deleteMessage()
            await ctx.scene.enter('exercise')
        })

        completed.action('back', async ctx => {
            ctx.deleteMessage()
            await ctx.scene.enter('mainMenu')
        })
        return completed
    }

    GenDeleteDataScene() {
        const deleteData = new Scene('deleteData')
        deleteData.enter(async (ctx) => {
            await ctx.reply(`Мы храним минимальное количество информации о Вас, вся она необходима только для работы этого бота и никогда не используется для других целей. Это только:\n1. Ваш идентификатор в Telegram (нужен для работы любого бота, не является какой-то конфиденциальной информацией)\n2. Ваш рост, вес, возраст и уровень физической активности (нужны только для выполнения расчётов и дачи рекомендаций)\n3. Количество выпитых стаканов за сегодняшние сутки.\n\nЕсли Вы по каким-либо причинам хотите удалить информацию о себе с нашего сервера, Вы можете сделать это по кнопке ниже.`, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: 'Удалить все данные обо мне', callback_data: 'delete'},
                            {text: 'Назад в меню', callback_data: 'back'}
                        ]
                    ]
                }
            })
        })
        deleteData.action('delete', async ctx => {
            ctx.deleteMessage()
            await ctx.reply(`Вы уверены на 100%, что хотите удалить все данные о себе?`, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: 'Да, я на 100% уверен(а)', callback_data: 'imsure'},
                            {text: 'Назад в меню', callback_data: 'back'}
                        ]
                    ]
                }
            })
        })

        deleteData.action('imsure', async ctx => {
            ctx.deleteMessage()
            let data = fs.readFileSync("db.txt", "utf8")
            if (data.includes(`"id":${ctx.callbackQuery.from.id}`)) {
                let str = data.slice(data.indexOf(`"id":${ctx.callbackQuery.from.id}`) - 1, data.indexOf('\n', data.indexOf(`"id":${ctx.callbackQuery.from.id}` + ' -------')))
                ctx.reply(str)
                data = data.replace(str, '')

                fs.writeFileSync("db.txt", '')
                fs.appendFileSync("db.txt", data + '\n')
                await ctx.reply('Все данные о Вас удалены. Вы можете зарегистрироваться вновь, нажав на /start')
            }

        })

        deleteData.action('back', async ctx => {
            ctx.deleteMessage()
            await ctx.scene.enter('mainMenu')
        })
        return deleteData
    }
}

module.exports = SceneGenerator