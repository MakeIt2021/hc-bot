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
        let str = data.slice(data.indexOf(`"id":${id}`) - 1, data.indexOf('\n', data.indexOf(`"id":${id}`)))
        return JSON.parse(str)
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
        })
        return mainMenu
    }

    GenWaterScene () {
        const water = new Scene('water')
        water.enter(async (ctx) => {
            let user = checkUser(ctx.callbackQuery.from.id)
            let data = fs.readFileSync("db_temp_values.txt", "utf8");
            let str
            if (data.includes(`"id":${ctx.callbackQuery.from.id}`)) {
                str = data.slice(data.indexOf(`"id":${ctx.callbackQuery.from.id}`) - 1, data.indexOf('\n', data.indexOf(`"id":${ctx.callbackQuery.from.id}`)))
                usersTempData = JSON.parse(str)
                let now = new Date()
                let formerDate = usersTempData.time.slice(0, 2)
                let formerMonth = usersTempData.time.slice(3, 5)
                let formerYear = usersTempData.time.slice(6, 10)

                let nowDate = now.getDate().toString()
                if (nowDate.length === 1) {
                    nowDate = '0' + nowDate
                }
                let nowMonth = now.getMonth().toString()
                if (nowMonth.length === 1) {
                    nowMonth = '0' + nowMonth
                }

                if (formerDate !== nowDate || formerMonth !== nowMonth || formerYear !== now.getFullYear().toString()) {
                    fs.writeFileSync("db_temp_values.txt", "")
                    data = fs.readFileSync("db_temp_values.txt", "utf8")
                }
            }
            let water_recommended = Math.round(30 * user.weight / 200)
            await ctx.replyWithHTML(`Вам рекомендуется употреблять <b>${water_recommended}</b> стаканов<a href="https://telegra.ph/file/28b7d002956f227c7d937.png"> </a>воды (в одном стакане около 200 мл) Сегодня Вы выпили ${str ? usersTempData.water : "0"}`, {
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
                let nowDate = now.getDate().toString()
                if (nowDate.length === 1) {
                    nowDate = '0' + nowDate
                }
                let nowMonth = now.getMonth().toString()
                if (nowMonth.length === 1) {
                    nowMonth = '0' + nowMonth
                }
                if (formerDate !== nowDate || formerMonth !== nowMonth || formerYear !== now.getFullYear().toString()) {
                    fs.writeFileSync("db_temp_values.txt", "")
                }
                let data2 = fs.readFileSync("db_temp_values.txt", "utf8")

                usersTempData.time = nowDate + "-" + nowMonth + "-" + now.getFullYear()

                data2 = data2.replace(`{"id":${ctx.callbackQuery.from.id},"water":${usersTempData.water - 1},"time":"${formerDate}-${formerMonth}-${formerYear}"}\n ------- \n`, '')
                fs.writeFileSync("db_temp_values.txt", JSON.stringify(usersTempData) + "\n ------- \n" + data2)
                await ctx.scene.enter('water')
            } else {
                usersTempData.water = 1
                let now = new Date();
                let nowDate = now.getDate().toString()
                if (nowDate.length === 1) {
                    nowDate = '0' + nowDate
                }
                let nowMonth = now.getMonth().toString()
                if (nowMonth.length === 1) {
                    nowMonth = '0' + nowMonth
                }
                console.log(now.getMonth().toString().length)
                usersTempData.time = nowDate + "-" + nowMonth + "-" + now.getFullYear()
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
                    let nowDate = now.getDate().toString()
                    if (nowDate.length === 1) {
                        nowDate = '0' + nowDate
                    }
                    let nowMonth = now.getMonth().toString()
                    if (nowMonth.length === 1) {
                        nowMonth = '0' + nowMonth
                    }
                    if (formerDate != nowDate || formerMonth != nowMonth || formerYear != now.getFullYear().toString()) {
                        fs.writeFileSync("db_temp_values.txt", "")
                    }

                    let data2 = fs.readFileSync("db_temp_values.txt", "utf8")
                    usersTempData.time = nowDate + "-" + nowMonth + "-" + now.getFullYear()
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
            ctx.scene.enter('mainMenu')
        })

        water.action('lmWater', async ctx => {
            ctx.scene.enter('whyWater')
        })
        return water
    }

    GenWhyWaterScene() {
        const whyWater = new Scene('whyWater')
        whyWater.enter(async ctx => {
            ctx.deleteMessage()
            await ctx.reply('Все знают, что без воды жить нельзя. А для чего конкретно нужна вода?\n' +
                '\n' +
                'Вода участвует во всех процессах, происходящих в организме каждого человека. \n' +
                '\n' +
                'Вода помогает пищеварительной системе лучше усваивать пищу, участвует в терморегуляции, помогая поддерживать нормальную температуру тела, обеспечивает свободное кровообращение, снижает вязкость крови, помогает снабжать кислородом все органы и ткани организма. С помощью воды из организма выводятся ненужные соли и токсины, улучшается подвижность суставов.\n' +
                '\n' +
                'Именно благодаря соблюдению питьевого режима в организме будет достаточно воды для выполнения всех её функций.', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: 'Назад в меню', callback_data: 'back'}
                        ]
                    ]
                }
            })
        })

        whyWater.action('back', async ctx => {
            ctx.deleteMessage()
            await ctx.scene.enter('mainMenu')
        })

        return whyWater
    }



    GenSleepScene () {
        const sleep = new Scene('sleep')
        sleep.enter(async (ctx) => {
            await ctx.reply('Сон — это состояние, во время которого взаимодействие организма с внешним миром затормаживается, а осознаваемая психическая деятельность частично прекращается. Сон оказывает восстанавливающее действие почти на все органы и системы организма — от мозга, сердца и легких до иммунной и нервной системы.\n' +
                '\n' +
                'Для качественного сна, необходимо стараться соблюдать режим сна, то есть ложиться спать и просыпаться в одно и то же время. Это важно, потому что организму проще нормально функционировать, имя устоявшийся график. \n' +
                '\n' +
                'Мелатонин, известный как гормон сна, влияет на многие функции организма: участвует в работе желудочно-кишечного тракта, эндокринной и иммунной системы, отвечает за нормальное функционирование клеток мозга. Желательно отходить ко сну до 23:00, т.к. мелатонин начинает вырабатываться примерно с 00:00, а заканчивает до 04:00. \n' +
                '\n' +
                'Главное условие выработки мелатонина — полная темнота (плотные шторы Вам в помощь). Проверить это можно так: Вы не должны видеть своей вытянутой руки. \n' +
                '\n' +
                'Если Вы не можете уснуть, возьмите на заметку несколько советов:\n' +
                '\n' +
                'Проветривайте спальню перед сном\n' +
                'Ешьте минимум за 3 часа до сна\n' +
                'Убедитесь, что в Вашей комнате абсолютная темнота\n' +
                'Включайте фильтр синего на Ваших гаджетах ближе к вечеру\n' +
                'Для того чтобы переключить мысли с будничной суеты на волну расслабления, определите свой ритуал перед сном. Это может быть чтение книги, тёплая ванна, дыхательные упражнения (Вы можете найти пару в разделе Стресс-менеджмент), медитации.', {
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
            if (await user) {
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
                        'Мы посчитали, что Вам рекомендуется употреблять ~${calories} калорий в сутки для поддержания веса.' +
                        '\n' +
                        '\n' +
                        'Кстати, мы также подготовили статью о правильном питании, в которой рассказываем, зачем оно нужно и как его придерживаться: https://telegra.ph/nutrition-02-04'
                } else if (18.5 <= bmi && bmi < 24.9) {
                    bmi_result = 'нормальный'
                    result = `Ваш ИМТ ~${bmi}. Это говорит о том, что у Вас нормальный вес, однако каждому человеку, даже если у него всё в порядке с весом важно соблюдать питьевой режим, заниматься спортом, а также контролировать время отхода ко сну и пробуждения. Также, всем необходимо уметь управлять уровнем стресса, ведь гормоны стресса могут приводить к снижению иммунитета и появлению других проблем со здоровьем.
Мы посчитали, что Вам рекомендуется употреблять ~${calories} калорий в сутки для поддержания Вашего веса.` +
                        '\n' +
                        '\n' +
                        'Кстати, мы также подготовили статью о правильном питании, в которой рассказываем, зачем оно нужно и как его придерживаться: https://telegra.ph/nutrition-02-04'
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
                        `Лечение необходимо, т.к. часто из-за ожирения резко возрастают риски развития заболеваний сердечно-сосудистой, опорно-двигательной системы, некоторых онкологических заболеваний. Больше об этом можно узнать в статье всемирной организации здравоохранения.` +
                        '\n' +
                        '\n' +
                        'Кстати, мы также подготовили статью о правильном питании, в которой рассказываем, зачем оно нужно и как его придерживаться: https://telegra.ph/nutrition-02-04'
                } else if (35 <= bmi && bmi <= 39.9) {
                    bmi_result = 'ожирение второй степени'
                    result = `Ваш ИМТ ~${bmi}, это похоже на ожирение II степени. Пожалуйста, обратите внимание на информацию о том, как мы считали, и к кому относится приведённая здесь информация, отправив команду /about. С увеличением степени ожирения увеличивается риск развития сопутствующих заболеваний – от высокого до чрезвычайно высокого.
Мы бы очень рекомендовали Вам обратиться к врачу эндокринологу. Именно он может провести грамотное обследование и дать направления на возможные необходимые исследования. 
Лечение необходимо, т.к. часто из-за ожирения резко возрастают риски развития заболеваний сердечно-сосудистой, опорно-двигательной системы, некоторых онкологических заболеваний. Больше об этом можно узнать в статье всемирной организации здравоохранения.` +
                        '\n' +
                        '\n' +
                        'Кстати, мы также подготовили статью о правильном питании, в которой рассказываем, зачем оно нужно и как его придерживаться: https://telegra.ph/nutrition-02-04'
                } else if (bmi >= 40) {
                    bmi_result = 'ожирение третьей степени'
                    result = `Ваш ИМТ ~${bmi}, это похоже на ожирение III степени (максимальная степень ожирения). Пожалуйста, обратите внимание на информацию о том, как мы считали, и к кому относится приведённая здесь информация, отправив команду /about. С увеличением степени ожирения увеличивается риск развития сопутствующих заболеваний – от высокого до чрезвычайно высокого.
Мы бы очень рекомендовали Вам обратиться к врачу эндокринологу. Именно он может провести грамотное обследование и дать направления на возможные необходимые исследования. 
Лечение необходимо, т.к. часто из-за ожирения резко возрастают риски развития заболеваний сердечно-сосудистой, опорно-двигательной системы, некоторых онкологических заболеваний. Больше об этом можно узнать в статье всемирной организации здравоохранения.` +
                        '\n' +
                        '\n' +
                        'Кстати, мы также подготовили статью о правильном питании, в которой рассказываем, зачем оно нужно и как его придерживаться: https://telegra.ph/nutrition-02-04'
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
            await ctx.reply('"Жизнь требует движения", — говорил Аристотель. \n' +
                '\n' +
                'Зачем нам нужен спорт? Благодаря спорту уравновешивается баланс между поступающей с едой энергии и её затратами, который нужен для профилактики избыточной массы тела, ожирения, сердечно-сосудистых и других сопутствующих заболеваний. Занятие физической деятельностью способствует усилению кровотока, благодаря чему улучшается питание органов и тканей организма питательными веществами. Также спорт играет ключевую роль в лечение метаболического синдрома и регулирует уровень сахара при сахарном диабете, уменьшает артериальное давление при гипертонической болезни. К тому же спорт стабилизирует психическое здоровье.\n' +
                '\n' +
                'Если Вы любите плавать, то почему бы Вам не записаться в бассейн, если любите танцевать, то запишитесь в кружок танцев. Любая активность, приносящая удовольствие, принесёт пользу Вашему здоровью. Есть и множество других активностей на любой вкус и цвет. Посмотрите на эти, возможно каким-то из них Вы хотели когда-то заняться: бег, скандинавская ходьба, лыжи, велопрогулки, занятия в тренажёрном зале, аэробика, различные виды борьбы, футбол, баскетбол, волейбол, теннис, пилатес, йога и так далее. Самое простое и минимальное, что может делать каждый — ежедневная ходьба на свежем воздухе (минимально около 6000 шагов в день).', {
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
            await ctx.reply('На протяжении всей жизни каждый человек сталкивается со стрессовыми ситуациями. Стресс — состояние психического напряжения, возникающее у человека под влиянием сильных воздействий.\n' +
                '\n' +
                'Во время стресса у человека вырабатываются такие гормоны, как кортизол и адреналин. В случае хронического стресса, эти гормоны могут приводить к разрушению мышечной ткани, нарушению обмена веществ, накоплению жировой ткани, ослаблению иммунитета, быстрой утомляемости, раздражительности и т.д. \n' +
                '\n' +
                'Именно поэтому со стрессом важно справляться. Как только чувствуете эмоциональную нагрузку, поддержите себя, выполнив дыхательные упражнения с помощью кнопок ниже (кстати, они также эффективны перед сном).', {
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
            function start() {
                ctx.reply('Расслабьтесь и устраивайтесь поудобнее. Сосредоточьтесь на своём дыхании.')
            }
            function inhale() {
                ctx.reply('Вдох...')
            }
            function exhale() {
                ctx.reply('Выдох...')
            }
            function stop() {
                ctx.scene.enter('completed')
            }
            await ctx.reply('Это простое упражнение на дыхание.')
            setTimeout(start, 3000)
            setTimeout(inhale, 10000)
            setTimeout(exhale, 14000)
            setTimeout(inhale, 18000)
            setTimeout(exhale, 22000)
            setTimeout(inhale, 26000)
            setTimeout(exhale, 30000)
            setTimeout(inhale, 34000)
            setTimeout(exhale, 38000)
            setTimeout(inhale, 42000)
            setTimeout(exhale, 46000)
            setTimeout(inhale, 50000)
            setTimeout(exhale, 54000)
            setTimeout(inhale, 58000)
            setTimeout(exhale, 62000)
            setTimeout(stop, 67000)
        })
        return exercise
    }

    GenExercise2Scene() {
        const exercise2 = new Scene('exercise2')
        exercise2.enter(async (ctx) => {
            function start() {
                ctx.reply('Расслабьтесь и устраивайтесь поудобнее. Сосредоточьтесь на своём дыхании.')
            }
            function inhale() {
                ctx.reply('Вдох...')
            }
            function hold() {
                ctx.reply('Задержите дыхание...')
            }
            function exhale() {
                ctx.reply('Медленный выдох...')
            }
            function stop() {
                ctx.scene.enter('completed')
            }
            await ctx.reply('Это усложнённое упражнение на дыхание. Приложите кончик своего языка к бугорку нёба возле верхних зубов. \n \nПриостановите выполнение упражнения, если почувствуете головокружение')
            setTimeout(start, 3000)
            setTimeout(inhale, 10000)
            setTimeout(hold, 14000)
            setTimeout(exhale, 21000)
            setTimeout(inhale, 29000)
            setTimeout(hold, 33000)
            setTimeout(exhale, 40000)
            setTimeout(inhale, 48000)
            setTimeout(hold, 52000)
            setTimeout(exhale, 59000)
            setTimeout(inhale, 67000)
            setTimeout(hold, 71000)
            setTimeout(exhale, 78000)
            setTimeout(stop, 86000)
        })
        return exercise2
    }

    GenCompletedScene() {
        const completed = new Scene('completed')
        completed.enter(async (ctx) => {
            await ctx.reply('Хорошая работа. Если хотите повторить, просто нажмите кнопку ниже.', {
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

    GenDisclaimerScene() {
        const disclaimer = new Scene('disclaimer')
        disclaimer.enter(async (ctx) => {
            await ctx.reply('Материалы данного ресурса, включая текст, графические элементы, изображения, ссылки на сторонние ресурсы и другие материалы («Материалы»), носят исключительно информационный характер. Материалы данного Сетевого ресурса не заменяют собой рекомендаций медицинского характера, диагностики или лечения, предоставляемых специалистами. Всегда обращайтесь к своему врачу или другому квалифицированному медицинскому работнику по любым вопросам, которые могут возникнуть у вас в связи с состоянием здоровья. Если вы полагаете, что у вас возникла экстренная ситуация, немедленно обратитесь к своему врачу или позвоните по номеру экстренной службы 112. Health-coaching bot не рекомендует и не рекламирует никаких конкретных анализов, врачей, продуктов, процедур, а также не выступает в защиту каких-либо точек зрения или других сведений, упоминаемых в материалах данного ресурса. Ответственность за решения, принимаемые на основе каких-либо сведений, упоминаемых в материалах данного ресурса, — несете исключительно вы на ваш собственный риск.')
        })
        return disclaimer
    }
}

module.exports = SceneGenerator